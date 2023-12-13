const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: '5s',
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const usn = req.body.usn;
  const contact = req.body.contact;
  const password = req.body.password;
  const branch = req.body.branch;

  if (!name || !password || !email || !contact || !usn || !branch) {
    return next(new AppError('Please provide details', 400));
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    usn: req.body.usn,
    contact: req.body.contact,
    password: req.body.password,
    branch: req.body.branch,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
  next();
});

exports.login = catchAsync(async (req, res, next) => {
  const { usn, password } = req.body;

  if (!usn || !password) {
    return next(new AppError('Please provide usn and password'), 400);
  }

  const user = await User.findOne({ usn: usn }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password'), 401);
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  req.user = currentUser;
  next();
});
