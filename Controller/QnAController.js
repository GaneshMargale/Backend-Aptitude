const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Aptitude = require('../Models/aptitudeModel');
const Answer = require('../Models/answerModel');
const QnA = require('../Models/qnaModel');

exports.getAllQnA = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(QnA.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const qna = await features.query;
  res.status(200).json({
    status: 'success',
    results: qna.length,
    data: {
      QnA: qna,
    },
  });
});

exports.getQnA = catchAsync(async (req, res, next) => {
  const Ques = await Aptitude.find();
  const Ans = await Answer.find();

  if (!Ans || !Ques) {
    return next(new AppError('QnA not found', 404));
  }

  const QuesnAns = [];
  for (let j = 0; j < Ques[0].questions.length; j++) {
    let qna = {
      questionNumber: Ques[0].questions[j].questionNumber,
      questionDescription: Ques[0].questions[j].questionDescription,
      options: Ques[0].questions[j].options,
      answer: Ans[0].answers[j].answerOption,
    };
    QuesnAns.push(qna);
  }

  const newQnA = await QnA.create({
    contestNumber: Ques[0].contestNumber,
    contestName: Ques[0].contestName,
    questions: QuesnAns,
  });

  res.status(200).json({
    status: 'success',
    Questions: newQnA,
  });
});
