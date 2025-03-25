const express = require("express");
const Product = require("../Models/productModels");

const router = express.Router();

// Lấy tất cả sản phẩm
router.get("/all", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
});
// Lọc sản phẩm theo category (dựa trên tags)
router.get("/category", async (req, res) => {
    try {
        const { category } = req.query; // Nhận danh mục từ query
        if (!category) {
            return res.status(400).json({ message: "Vui lòng cung cấp danh mục" });
        }

        const products = await Product.find({ category: category });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
});


// Tìm kiếm sản phẩm theo tên
router.get("/search", async (req, res) => {
    try {
        const { name } = req.query;
        const products = await Product.find({ name: new RegExp(name, "i") });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
});


/ API lấy chi tiết sản phẩm theo ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id; // Lấy productId từ URL
    const product = await Product.findById(productId); // Tìm sản phẩm trong DB theo ID

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(product); // Trả về thông tin chi tiết sản phẩm
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
