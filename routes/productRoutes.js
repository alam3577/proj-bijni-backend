const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  createProducts,
  getProduct,
} = require('../controllers/productController');

router.route('/:id').get(getProduct);
router.route('/').get(getAllProducts).post(createProducts);

module.exports = router;
