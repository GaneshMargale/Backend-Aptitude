const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Aptitude = require('../Models/aptitudeModel');
const Answer = require('../Models/answerModel');
const QnA = require('../Models/qnaModel');

exports.createQnA = catchAsync(async (req, res, next) => {
  const Ques = await Aptitude.find();
  const Ans = await Answer.find();

  if (!Ans || !Ques) {
    return next(new AppError('QnA not found', 404));
  }

  QuesnAns = [];

  Ques.questions.forEach((question, i) => {
    let qna = {
      questionNumber: question.questionNumber,
      questionDescription: question.questionDescription,
      options: question.options,
      answer: Ans.answers[i].answerOption,
    };

    QuesnAns.push(qna);
  });

  const newQnA = await QnA.create({
    contestNumber: 1,
    questions: QuesnAns,
  });

  res.status(200).json({
    status: 'success',
    Questions: newQnA,
  });
});
