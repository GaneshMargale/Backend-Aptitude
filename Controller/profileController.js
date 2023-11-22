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
  const profiles = await Profile.find();

  const userProfile = [];

  for (const document of profiles) {
    const user = await User.findOne({ usn: document.usn });

    if (!user) {
      continue;
    }

    const currentUser = {
      name: document.name,
      usn: document.usn,
      branch: document.branch,
      contact: user.contact,
      email: user.email,
      DSAPoints: document.DSAPoints,
      AptitudePoints: document.AptitudePoints,
      DSAEachPoints: document.DSAEachPoints,
      AptitudeEachPoints: document.AptitudeEachPoints,
    };

    userProfile.push(currentUser);
  }

  res.status(200).json({
    status: 'success',
    Profiles: userProfile,
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

  const contest = AptitudeProfile.AptitudeEachPoints.some(
    (profile) => profile.contestNumber === req.params.contestNumber
  );

  if (contest) {
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
  console.log(profile);
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

  const contest = DSAProfile.DSAEachPoints.some(
    (profile) => profile.contestNumber === req.params.contestNumber
  );

  if (contest) {
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
  console.log(profile);
  if (!profile) {
    return next(new AppError('Profile not found', 404));
  }

  res.status(200).json({
    status: 'success',
    profile: profile,
  });

  next();
});
