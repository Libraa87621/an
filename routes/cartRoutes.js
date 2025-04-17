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

  router.delete("/:productId", async (req, res) => {
    const { productId } = req.params;
  
    try {
      // Tìm giỏ hàng chứa sản phẩm
      const cart = await Cart.findOne({ "items.productId": productId });
      if (!cart) {
        return res.status(404).json({ message: "Giỏ hàng không tồn tại hoặc không chứa sản phẩm này" });
      }
  
      // Lọc bỏ sản phẩm khỏi giỏ hàng
      cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
  
      // Lưu giỏ hàng sau khi xóa sản phẩm
      await cart.save();
  
      // Trả về giỏ hàng đã cập nhật
      res.json({ message: "Xóa sản phẩm thành công", cart });
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
      res.status(500).json({ message: "Lỗi khi xóa sản phẩm khỏi giỏ hàng", error });
    }
  });

router.put("/:userId/:productId", async (req, res) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
  
    try {
      // Kiểm tra số lượng hợp lệ
      if (quantity < 1) {
        console.error("Số lượng không hợp lệ:", quantity);
        return res.status(400).json({ message: "Số lượng phải lớn hơn hoặc bằng 1" });
      }
  
      // Tìm giỏ hàng của người dùng
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        console.error("Giỏ hàng không tồn tại cho userId:", userId);
        return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
      }
  
      console.log("Danh sách sản phẩm trong giỏ hàng:", cart.items);
      console.log("Tìm kiếm sản phẩm với productId:", productId);
  
      // Tìm sản phẩm trong giỏ hàng
      const item = cart.items.find((item) => item.productId.toString() === productId);
      if (!item) {
        console.error("Sản phẩm không tồn tại trong giỏ hàng. Danh sách sản phẩm hiện tại:", cart.items);
        return res.status(404).json({
          message: "Sản phẩm không tồn tại trong giỏ hàng",
          productId: productId,
          cartItems: cart.items,
        });
      }
  
      // Log thông tin trước khi cập nhật
      console.log("Cập nhật sản phẩm:", {
        productId: item.productId,
        currentQuantity: item.quantity,
        newQuantity: quantity,
        currentTotal: item.total,
        pricePerUnit: item.price,
      });
  
      // Cập nhật số lượng và tổng giá
      item.quantity = quantity;
      item.total = item.price * quantity;
  
      // Lưu giỏ hàng
      await cart.save();
  
      // Log thông tin sau khi cập nhật
      console.log("Giỏ hàng sau khi cập nhật:", cart);
  
      // Trả về giỏ hàng đã cập nhật
      res.json({ message: "Cập nhật thành công", cart });
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
      res.status(500).json({ message: "Lỗi khi cập nhật giỏ hàng", error: error.message });
    }
  });
// Log thông tin trước khi cập nhật
console.log("Cập nhật sản phẩm:", {
  productId: item.productId,
  currentQuantity: item.quantity,
  newQuantity: quantity,
  currentTotal: item.total,
  pricePerUnit: item.price,
});

// Cập nhật số lượng và tổng giá
item.quantity = quantity;
item.total = item.price * quantity;

// Lưu giỏ hàng
await cart.save();

// Log thông tin sau khi cập nhật
console.log("Giỏ hàng sau khi cập nhật:", cart);

// Trả về giỏ hàng đã cập nhật
res.json({ message: "Cập nhật thành công", cart });

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