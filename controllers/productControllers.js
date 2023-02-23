const Product = require('../models/productModels');

exports.getAllProducts = (req, res) => {
  res.json({ message: 'all products' });
};

exports.createProducts = async (req, res) => {
  const product = {
    p_name: req.body.name,
    p_price: req.body.price,
    p_desc: req.body.desc,
  };
  console.log({ product });
  try {
    const newProduct = await Product.create(product);
    console.log({ newProduct });
    res.status(201).json({
      status: 'success',
      data: { product: newProduct },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Error In adding Product',
    });
  }
};
