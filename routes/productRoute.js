const express = require('express');
const { protect } = require('../controllers/authController');
const router = express.Router();

const {
  getAllProducts,
  createProducts,
  getProduct,
} = require('../controllers/productController');

router.route('/:id').get(getProduct);
router.route('/').get(protect, getAllProducts).post(createProducts);

module.exports = router;
