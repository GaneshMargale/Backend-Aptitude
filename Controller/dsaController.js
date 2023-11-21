const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const CodeSnippits = require('../Models/codeSnippetsModel');
const DSAPrevious = require('../Models/dsaPrevModel');
const DSAQuestions = require('../Models/dsaModel');
const TestCases = require('../Models/testModel');
const Starter = require('../Models/starterModel');

exports.getCodeSnippits = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(CodeSnippits.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const results = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      results,
    },
  });
});

exports.createCodeSnippits = catchAsync(async (req, res, next) => {
  const newCodeSnippits = await CodeSnippits.create(req.body);

  res.status(200).json({
    status: 'success',
    codeSnippits: newCodeSnippits,
  });
});

exports.updateCodeSnippits = catchAsync(async (req, res, next) => {
  console.log(req.params.type, req.params.language, req.params.question);
  const type = req.params.type;
  const language = req.params.language;
  const question = req.params.question;
  const codeSnippits = await CodeSnippits.findOneAndUpdate(
    {
      contestNumber: req.params.contestNumber,
    },
    {
      $set: {
        [`${type}.${language}.${question}`]: req.body.code,
      },
    }
  );

  if (!codeSnippits) {
    return next(new AppError('Question not found', 404));
  }

  res.status(200).json({
    status: 'success',
    codeSnippits,
  });
});

exports.createTestCases = catchAsync(async (req, res, next) => {
  const newTestCases = await TestCases.create(req.body);

  res.status(200).json({
    status: 'success',
    codeSnippits: newTestCases,
  });
});

exports.getPreviousDSA = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(DSAPrevious.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const results = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      results,
    },
  });
});

exports.getDSAQuestions = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(DSAQuestions.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const results = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      results,
    },
  });
});

exports.createDSAQuestions = catchAsync(async (req, res, next) => {
  const newDSAQuestions = await DSAQuestions.create(req.body);
  await DSAPrevious.create(req.body);

  res.status(200).json({
    status: 'success',
    codeSnippits: newDSAQuestions,
  });
});

exports.deleteDSAQuestions = catchAsync(async (req, res, next) => {
  const dsaQuestion = await DSAQuestions.findOneAndDelete({
    contestNumber: req.params.contestNumber,
  });

  if (!dsaQuestion) {
    return next(new AppError('DSA not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getStarter = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Starter.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const results = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      results,
    },
  });
});

exports.createStarter = catchAsync(async (req, res, next) => {
  const newStarter = await Starter.create(req.body);

  res.status(200).json({
    status: 'success',
    starter: newStarter,
  });
});
