const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a Name'],
      maxlength: [30, 'A product length must be less then or equal to 40'],
      minlength: [5, 'A product length must be greater then or equal to 10'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, 'A Rating should not be more then 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
