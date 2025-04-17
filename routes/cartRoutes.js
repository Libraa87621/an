const express = require("express");
const Cart = require("../Models/cartModels");
const Product = require("../Models/productModels"); // Import Product model
const router = express.Router();

// Lấy giỏ hàng của người dùng
// Lấy giỏ hàng của người dùng
router.get("/:userId", async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId }).populate("items.productId");
      if (!cart) {
        return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
      }
      res.json(cart.items);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy giỏ hàng", error });
    }
  });
// Thêm sản phẩm vào giỏ hàng
router.post("/add", async (req, res) => {
    const { userId, productId, quantity } = req.body;
  
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }
  
      const total = product.price * quantity;
  
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
  
      const existingItem = cart.items.find((item) => item.productId.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.total = existingItem.quantity * product.price;
      } else {
        cart.items.push({
          productId,
          name: product.name,
          price: product.price,
          img: product.image, // Lưu hình ảnh tại đây
          quantity,
          total,
        });
      }
  
      await cart.save();
  
      // Sử dụng populate để trả về dữ liệu đầy đủ
      const populatedCart = await Cart.findOne({ userId }).populate("items.productId");
      res.json(populatedCart.items);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi thêm vào giỏ hàng", error });
    }
  });

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm khỏi giỏ hàng", error });
  }
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put("/:userId/:productId", async (req, res) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
  
    try {
      // Kiểm tra số lượng hợp lệ
      if (quantity < 1) {
        return res.status(400).json({ message: "Số lượng phải lớn hơn hoặc bằng 1" });
      }
  
      // Tìm giỏ hàng của người dùng
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
      }
  
      // Tìm sản phẩm trong giỏ hàng
      const item = cart.items.find((item) => item.productId.toString() === productId);
      if (!item) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
      }
  
      // Cập nhật số lượng và tổng giá
      item.quantity = quantity;
      item.total = item.price * quantity;
  
      // Lưu giỏ hàng
      await cart.save();
  
      // Trả về danh sách sản phẩm trong giỏ hàng
      res.json(cart.items);
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
      res.status(500).json({ message: "Lỗi khi cập nhật giỏ hàng", error });
    }
  });

// Thanh toán giỏ hàng
router.post("/checkout", async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    // Xử lý thanh toán (giả định)
    cart.items = [];
    await cart.save();

    res.json({ message: "Thanh toán thành công", items: [] });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thanh toán", error });
  }
});

module.exports = router;