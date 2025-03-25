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

// Lấy chi tiết sản phẩm theo ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ params URL

        // Kiểm tra ID có phải ObjectId hợp lệ của MongoDB không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
        }

        const product = await Product.findById(id); // Tìm sản phẩm theo ID trong DB

        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        res.status(200).json(product); // Trả về thông tin sản phẩm nếu tìm thấy
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
});


module.exports = router;
