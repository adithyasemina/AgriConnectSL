from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from docx import Document
from dotenv import load_dotenv
from io import BytesIO

import os
import json
import numpy as np
import tensorflow as tf

from tensorflow.keras.preprocessing import image


# ============================================
# LOAD ENV
# ============================================

load_dotenv()

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# ============================================
# OPENAI CONFIG
# ============================================

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found. Please add it to .env file.")

client = OpenAI(api_key=OPENAI_API_KEY)


# ============================================
# CHATBOT KNOWLEDGE BASE
# ============================================

def load_knowledge_base():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    doc_path = os.path.join(base_dir, "models", "chatbot", "knowledge.docx")

    if not os.path.exists(doc_path):
        raise FileNotFoundError(f"knowledge.docx not found at: {doc_path}")

    doc = Document(doc_path)

    knowledge_text = "\n".join(
        [p.text for p in doc.paragraphs if p.text.strip()]
    )

    return knowledge_text


knowledge_text = load_knowledge_base()

SYSTEM_PROMPT = f"""
ඔයා ශ්‍රී ලංකාවේ වී වගාවේ රෝග හා පළිබෝධ හානි ගැන උදව් කරන Sinhala chatbot කෙනෙක්.

නීති:
1. පහත KNOWLEDGE BASE එකට අනුව පමණක් පිළිතුරු දෙන්න.
2. පිළිතුරු සරල සිංහලෙන් දෙන්න.
3. හැකි නම් bullet points භාවිතා කරන්න.
4. KNOWLEDGE BASE එකේ තොරතුරු නැත්නම්:
   'මෙම ලේඛනයේ ඒ ගැන තොරතුරු නැහැ' කියන්න.

KNOWLEDGE BASE:
{knowledge_text}
"""


# ============================================
# LOAD LEAF DISEASE MODEL WEIGHTS
# ============================================

LEAF_WEIGHTS_PATH = os.path.join(
    BASE_DIR,
    "models",
    "predict-leaf",
    "final_leaf_model.weights.h5"
)

LEAF_CLASS_PATH = os.path.join(
    BASE_DIR,
    "models",
    "predict-leaf",
    "leaf_class_names.json"
)

if not os.path.exists(LEAF_WEIGHTS_PATH):
    raise FileNotFoundError(
        f"Leaf model weights not found at: {LEAF_WEIGHTS_PATH}"
    )

if not os.path.exists(LEAF_CLASS_PATH):
    raise FileNotFoundError(
        f"Leaf class names not found at: {LEAF_CLASS_PATH}"
    )

with open(LEAF_CLASS_PATH, "r", encoding="utf-8") as f:
    leaf_class_names = json.load(f)


base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights=None
)

leaf_model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(224, 224, 3)),
    base_model,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(len(leaf_class_names), activation="softmax")
])

leaf_model.load_weights(LEAF_WEIGHTS_PATH)

print("Leaf disease model weights loaded successfully!")


# ============================================
# SINHALA / ENGLISH LABELS
# ============================================

translations = {
    "Bacterial_blight": {
        "en": "Bacterial Blight",
        "si": "බැක්ටීරියා කොළ කරවීම"
    },
    "Brown_spot": {
        "en": "Brown Spot",
        "si": "දුඹුරු ලප රෝගය"
    },
    "Healthy_leaf": {
        "en": "Healthy Leaf",
        "si": "නිරෝගී වී කොළය"
    },
    "Leaf_blast": {
        "en": "Leaf Blast",
        "si": "බ්ලාස්ට් රෝගය"
    },
    "Leaf_scald": {
        "en": "Leaf Scald",
        "si": "කොළ කරවීමේ රෝගය"
    },
    "Tungro": {
        "en": "Tungro",
        "si": "ටුන්ග්‍රෝ වෛරස් රෝගය"
    }
}


# ============================================
# HOME ROUTE
# ============================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "ML Service is running",
        "chatbot": "Ready",
        "leaf_model": "Ready",
        "leaf_classes": leaf_class_names
    })


# ============================================
# CHATBOT API
# ============================================

@app.route("/chatbot", methods=["POST"])
def chatbot():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Request body is required"
            }), 400

        question = data.get("question")

        if not question:
            return jsonify({
                "error": "Question is required"
            }), 400

        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": question
                }
            ],
            temperature=0.2
        )

        answer = response.choices[0].message.content

        return jsonify({
            "question": question,
            "answer": answer
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# ============================================
# LEAF DISEASE PREDICTION API
# ============================================

@app.route("/predict-leaf", methods=["POST"])
def predict_leaf():
    try:
        if "image" not in request.files:
            return jsonify({
                "error": "Image file is required"
            }), 400

        file = request.files["image"]

        language = request.form.get("language", "en")

        if language not in ["en", "si"]:
            language = "en"

        img_bytes = BytesIO(file.read())
        img = image.load_img(
            img_bytes,
            target_size=(224, 224)
        )

        img_array = image.img_to_array(img)

        img_array = np.expand_dims(img_array, axis=0)

        img_array = tf.keras.applications.mobilenet_v2.preprocess_input(
            img_array
        )

        predictions = leaf_model.predict(img_array)

        predicted_index = int(np.argmax(predictions[0]))

        confidence = float(predictions[0][predicted_index] * 100)

        predicted_class = leaf_class_names[predicted_index]

        disease_name = translations.get(predicted_class, {}).get(
            language,
            predicted_class
        )

        return jsonify({
            "success": True,
            "predicted_class": predicted_class,
            "disease_name": disease_name,
            "confidence": round(confidence, 2),
            "language": language
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# ============================================
# RUN FLASK SERVER
# ============================================

if __name__ == "__main__":
    app.run(debug=True, port=5000)