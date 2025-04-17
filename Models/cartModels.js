const mongoose = require("mongoose");

// Schema cho từng sản phẩm trong giỏ hàng
const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Tham chiếu đến Product
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  total: { type: Number, required: true }, // Tổng giá trị của sản phẩm trong giỏ hàng
});

// Schema cho giỏ hàng
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Tham chiếu đến User
  items: [cartItemSchema], // Danh sách sản phẩm trong giỏ hàng
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;