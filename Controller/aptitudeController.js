const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Aptitude = require('../Models/aptitudeModel');
const Profile = require('../Models/userProfileModel');
const Answer = require('../Models/answerModel');

exports.getAllQuestions = catchAsync(async (req, res, next) => {
  // const features = new APIFeatures(Aptitude.find(), req.query)
  //   .filter()
  //   .sort()
  //   .fields()
  //   .paginate();
  const questions = await Aptitude.findOne({
    contestNumber: req.params.contestNumber,
    contestName: req.params.contestName,
  });

  // const questions = await features.query;
  res.status(200).json({
    status: 'success',
    results: questions.length,
    data: {
      Questions: questions,
    },
  });
});

exports.createQuestions = catchAsync(async (req, res, next) => {
  const newQuestions = await Aptitude.create(req.body);

  res.status(200).json({
    status: 'success',
    Questions: newQuestions,
  });
});

exports.getQuestion = catchAsync(async (req, res, next) => {
  const question = await Aptitude.findOne(
    {
      contestNumber: req.params.contestNumber,
      questions: { $elemMatch: { questionNumber: req.params.questionNumber } },
    },
    {
      'questions.$': 1,
    }
  );

  if (!question) {
    return next(new AppError('Question not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      Question: question.questions[0],
    },
  });
});

exports.updateQuestion = catchAsync(async (req, res, next) => {
  const question = await Aptitude.findOneAndUpdate(
    {
      contestNumber: req.params.contestNumber,
      questions: { $elemMatch: { questionNumber: req.params.questionNumber } },
    },
    {
      $set: {
        'questions.$.questionDescription': req.body.questionDescription,
        'questions.$.options': req.body.options,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  console.log(question);
  if (!question) {
    return next(new AppError('Question not found', 404));
  }

  res.status(200).json({
    status: 'success',
    question: question,
  });
});

exports.getAllAnswers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Answer.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const answer = await features.query;
  res.status(200).json({
    status: 'success',
    results: answer.length,
    data: {
      Answer: answer,
    },
  });
});

exports.createAnswers = catchAsync(async (req, res, next) => {
  const newAnswer = await Answer.create(req.body);

  res.status(200).json({
    status: 'success',
    Answers: newAnswer,
  });
});

exports.getAllAptitudeContests = catchAsync(async (req, res, next) => {
  const contests = await Aptitude.find();
  let contest = [];

  const currentTime = Date.parse(new Date());

  contests.forEach((document) => {
    let questionTime = document.time;

    let visible = currentTime >= questionTime;

    contest.push({
      contestNumber: document.contestNumber,
      contestName: document.contestName,
      time: document.time,
      visibility: visible,
    });
  });

  contest.sort((a, b) => a.contestNumber - b.contestNumber);

  res.status(200).json({
    status: 'success',
    contests: contest.length,
    data: {
      Contests: contest,
    },
  });
});

exports.getAptitudeContests = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ usn: req.params.usn });

  if (!profile) {
    return res.status(404).json({
      status: 'fail',
      message: 'Profile not found',
    });
  }

  const contests = profile.AptitudeEachPoints;

  res.status(200).json({
    status: 'success',
    contests: contests.length,
    data: {
      Contest: contests,
    },
  });
});

exports.getDSAContests = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ usn: req.params.usn });

  if (!profile) {
    return res.status(404).json({
      status: 'fail',
      message: 'Profile not found',
    });
  }

  const contests = profile.DSAEachPoints;

  res.status(200).json({
    status: 'success',
    contests: contests.length,
    data: {
      Contest: contests,
    },
  });
});

exports.updateQuestionVisibility = catchAsync(async (req, res, next) => {
  const question = await Aptitude.findOne({
    contestNumber: req.params.contestNumber,
    contestName: req.params.contestName,
  });

  if (!question) {
    return next(new AppError('Question not found', 404));
  }

  const currentTime = Date.parse(new Date());
  const questionTime = question.time;

  if (currentTime >= questionTime) {
    await Aptitude.findOneAndUpdate(
      {
        contestNumber: req.params.contestNumber,
        contestName: req.params.contestName,
      },
      {
        $set: {
          visibility: true,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  next();
});
