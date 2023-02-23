const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  createProducts,
} = require('../controllers/productControllers');

router.route('/').get(getAllProducts).post(createProducts);

module.exports = router;
