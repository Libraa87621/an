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
        const { tag } = req.query; // Nhận category từ query
        if (!tag) {
            return res.status(400).json({ message: "Vui lòng cung cấp category" });
        }

        const products = await Product.find({ tags: { $in: [tag] } });
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

module.exports = router;
