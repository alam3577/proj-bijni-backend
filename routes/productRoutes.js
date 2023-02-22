const express = require('express');
const router = express.Router();

const { getAllProducts } = require('../controllers/productControllers');

router.route('/').get(getAllProducts);

module.exports = router;
