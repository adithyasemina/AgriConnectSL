from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from docx import Document
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found. Please add it to .env file.")

client = OpenAI(api_key=OPENAI_API_KEY)


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


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "ML Service is running",
        "chatbot": "Ready"
    })


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


if __name__ == "__main__":
    app.run(debug=True, port=5000)