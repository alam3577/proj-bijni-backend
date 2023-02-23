const Product = require('../models/productModels');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const allProducts = await Product.find({});
  res.status(200).json({
    status: 'success',
    data: {
      product: allProducts,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return next(new AppError(`Product not found with id ${id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.createProducts = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const newProduct = await Product.create({ name, price });
  res.status(201).json({ status: 'success', data: { product: newProduct } });
});
