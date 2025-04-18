const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    size: { type: String, required: true }, // Thêm size
    origin: { type: String, required: true }, // Thêm origin
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;