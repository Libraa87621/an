const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const router = express.Router();

// Đăng ký (LƯU mật khẩu dạng plain text, không mã hóa)
router.post("/register", async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email đã được sử dụng" });

        const newUser = new User({ fullName, email, phoneNumber, password });
        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
});

// Đăng nhập (So sánh mật khẩu trực tiếp, không mã hóa)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Tài khoản không tồn tại" });

        if (password !== user.password) return res.status(400).json({ message: "Mật khẩu không đúng" });

        const token = jwt.sign({ userId: user._id }, "secretKey", { expiresIn: "1h" });

        res.json({ message: "Đăng nhập thành công", token });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
});

module.exports = router;
