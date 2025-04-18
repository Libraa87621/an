var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const mongoose = require("mongoose"); // Thêm dòng này

var productRoutes = require("./routes/productRoutes");
var userRoutes = require("./routes/userRoutes");
var cartRoutes = require("./routes/cartRoutes");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
    .connect("mongodb+srv://Libraaa:gLfxhJL8qDeBPCFt@cluster0.olub1.mongodb.net/React2",)
    .then(() => console.log("Kết nối MongoDB thành công!"))
    .catch(err => console.error("Lỗi kết nối MongoDB:", err));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
