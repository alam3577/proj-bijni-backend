const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync((req, res, next) => {
  const { name, email, phone, password, confirmPassword } = req.body;
  const user = {
    name,
    email,
    phone,
    password,
    confirmPassword,
  };
  const newUser = User.create(user);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
