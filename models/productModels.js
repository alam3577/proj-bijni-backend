const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, 'A name must be unique'],
    required: [true, 'A Product must have a Name'],
    maxlength: 20,
    minlength: 3,
  },
  price: {
    type: Number,
    unique: [true, 'A name must be unique'],
    required: [true, 'a product must have a price'],
  },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
