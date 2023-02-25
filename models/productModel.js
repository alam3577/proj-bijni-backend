const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Product must have a Name'],
    unique: [true, 'A Product must be unique'],
    minlength: [3, 'A name must be length of 3'],
  },
  price: {
    type: Number,
    required: [true, 'a product must have a price'],
    unique: [true, 'A price must be unique'],
  },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
