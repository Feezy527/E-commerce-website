const express = require("express");
const {createProduct, getProducts, getProductById} = require("../controllers/productController");
const {protect, admin} = require("../middleware/authMiddleware");

const router = express.Router();

//Protected (Admin only)
router.post("/", protect, admin, createProduct);

//Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

module.exports = router;