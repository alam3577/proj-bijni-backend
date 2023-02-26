const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { promisify } = require('util');

const signInToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const { name, phone, email, password, confirmPassword, passwordChangedAt } =
    req.body;
  const user = {
    name,
    phone,
    email,
    password,
    confirmPassword,
    passwordChangedAt,
  };
  const newUser = await User.create(user);
  const token = signInToken(newUser._id);
  console.log({ token });
  res.status(201).json({
    status: 'success',
    data: {
      token,
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { emailOrPhone, password } = req.body;
  // 1.check email or phone  and password
  if (!emailOrPhone || !password) {
    return next(
      new AppError('Please Provide Email or phone and Password', 400)
    );
  }
  // 2.Check if user exist and password is correct
  // Find user by email or phone
  const user = await User.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  });

  if (!user || !(await user.correctPassword(password, user.password))) {
    next(new AppError(`Incorrect email/phone or password`, 401));
  }

  //if everything is ok send jsonWebToken
  const token = signInToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // get token and check
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(`You are not logged In, Please Login to get access`, 401)
    );
  }
  // 2. Verification of tokens with payload(_id)
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log({ decode });

  // 3. Check if User Still exists
  const currentUser = await User.findById(decode.id);
  console.log({ currentUser });

  // 4. Check if user changed password after JWT was issued
  console.log({ checker: currentUser.changedPasswordAfter(decode.iat) });
  if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError(`user changed password recently, please login again`, 401)
    );
  }

  // Grant access to the protected routes
  req.user = currentUser;
  next();
});
