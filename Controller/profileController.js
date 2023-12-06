const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Profile = require('../Models/userProfileModel');
const User = require('../Models/userModel');

exports.getUserProfile = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({
    usn: req.params.usn,
  });

  if (!profile) {
    return next(new AppError('Question not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      profile: profile,
    },
  });
});

exports.getUserProfileDetails = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ usn: req.params.usn });

  const user = await User.findOne({ usn: req.params.usn });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (!profile) {
    return next(new AppError('User not found', 404));
  }

  const currentUser = {
    name: profile.name,
    usn: profile.usn,
    branch: profile.branch,
    contact: user.contact,
    email: user.email,
    DSAPoints: profile.DSAPoints,
    AptitudePoints: profile.AptitudePoints,
    DSAEachPoints: profile.DSAEachPoints,
    AptitudeEachPoints: profile.AptitudeEachPoints,
  };

  res.status(200).json({
    status: 'success',
    Profiles: currentUser,
  });
});

exports.createProfile = catchAsync(async (req, res, next) => {
  const newProfile = await Profile.create({
    usn: req.body.usn,
    name: req.body.name,
    branch: req.body.branch,
    DSAPoints: 0,
    AptitudePoints: 0,
    DSAEachPoints: [],
    AptitudeEachPoints: [],
  });

  console.log('Created successfully');

  // res.status(200).json({
  //   status: 'success',
  //   Profile: newProfile,
  // });
});

exports.updateAptitudeProfile = catchAsync(async (req, res, next) => {
  const AptitudeProfile = await Profile.findOne({
    usn: req.params.usn,
  });

  if (!AptitudeProfile) {
    return next(new AppError('Profile not found', 404));
  }

  if (
    AptitudeProfile.AptitudeEachPoints.some(
      (document) => Number(req.params.contestNumber) === document.contestNumber
    )
  ) {
    return next();
  }

  const profile = await Profile.findOneAndUpdate(
    {
      usn: req.params.usn,
    },
    {
      $inc: {
        AptitudePoints: req.body.points,
      },
      $push: {
        AptitudeEachPoints: {
          contestNumber: req.params.contestNumber,
          contestName: req.body.contestName,
          points: req.body.points,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!profile) {
    return next(new AppError('Profile not found', 404));
  }

  res.status(200).json({
    status: 'success',
    profile: profile,
  });

  next();
});

exports.updateDSAProfile = catchAsync(async (req, res, next) => {
  const DSAProfile = await Profile.findOne({
    usn: req.params.usn,
  });

  if (!DSAProfile) {
    return next(new AppError('Profile not found', 404));
  }

  if (
    DSAProfile.DSAEachPoints.some(
      (document) => Number(req.params.contestNumber) === document.contestNumber
    )
  ) {
    return next();
  }

  const profile = await Profile.findOneAndUpdate(
    {
      usn: req.params.usn,
    },
    {
      $inc: {
        DSAPoints: req.body.points,
      },
      $push: {
        DSAEachPoints: {
          contestNumber: req.params.contestNumber,
          contestName: req.body.contestName,
          points: req.body.points,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!profile) {
    return next(new AppError('Profile not found', 404));
  }

  res.status(200).json({
    status: 'success',
    profile: profile,
  });

  next();
});
