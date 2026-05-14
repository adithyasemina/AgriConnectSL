const crypto = require("crypto");

const Article = require("../models/Article");
const supabase = require("../config/supabase");

const BUCKET = process.env.SUPABASE_BUCKET || "article-images";

function getFileExtension(filename) {
  return filename.split(".").pop();
}

function createFilePath(originalname) {
  const extension = getFileExtension(originalname);
  const uniqueName = crypto.randomBytes(16).toString("hex");

  return `articles/${uniqueName}.${extension}`;
}

// CREATE ARTICLE
const createArticle = async (req, res) => {
  try {
    const { title, category, content } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, category and content are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Article image is required",
      });
    }

    const filePath = createFilePath(req.file.originalname);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({
        success: false,
        message: uploadError.message,
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    const article = await Article.create({
      title,
      category,
      content,
      imageUrl: publicUrlData.publicUrl,
      imagePath: filePath,
      createdBy: req.user?._id,
    });

    return res.status(201).json({
      success: true,
      message: "Article created successfully",
      article,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL ARTICLES
const getArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE ARTICLE
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    return res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE ARTICLE
const updateArticle = async (req, res) => {
  try {
    const { title, category, content } = req.body;

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    if (title) article.title = title;
    if (category) article.category = category;
    if (content) article.content = content;

    if (req.file) {
      if (article.imagePath) {
        await supabase.storage.from(BUCKET).remove([article.imagePath]);
      }

      const filePath = createFilePath(req.file.originalname);

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        return res.status(500).json({
          success: false,
          message: uploadError.message,
        });
      }

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

      article.imageUrl = publicUrlData.publicUrl;
      article.imagePath = filePath;
    }

    await article.save();

    return res.status(200).json({
      success: true,
      message: "Article updated successfully",
      article,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE ARTICLE
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    if (article.imagePath) {
      await supabase.storage.from(BUCKET).remove([article.imagePath]);
    }

    await Article.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};