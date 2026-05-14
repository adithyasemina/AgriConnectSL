const express = require("express");
const multer = require("multer");

const {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");

const { protect, officerOnly } = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG and WEBP images are allowed"));
    }

    cb(null, true);
  },
});

router.get("/", getArticles);

router.get("/:id", getArticleById);

router.post(
  "/",
  protect,
  officerOnly,
  upload.single("image"),
  createArticle
);

router.put(
  "/:id",
  protect,
  officerOnly,
  upload.single("image"),
  updateArticle
);

router.delete(
  "/:id",
  protect,
  officerOnly,
  deleteArticle
);

module.exports = router;