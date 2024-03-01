const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');
const ProfileModel = require('../Models/userProfileModel');
const UserModel = require('../Models/userModel');
const AnswerModel = require('../Models/answerModel');
const TestModel = require('../Models/testModel');
const StarterModel = require('../Models/starterModel');
const ResultModel = require('../Models/resultModel');
const QnAModel = require('../Models/qnaModel');
const DsaModel = require('../Models/dsaModel');
const DsaPrevModel = require('../Models/dsaPrevModel');
const AptitudeModel = require('../Models/aptitudeModel');

const connectToMongoDB = (batchName) => {
  return mongoose.createConnection(
    `mongodb+srv://ganesh:ZEQiBmwcCNvA8izX@cluster0.s575u7x.mongodb.net/${batchName}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};

exports.createBatch = catchAsync(async (req, res, next) => {
  const batchName = req.params.batchName;

  const connection = connectToMongoDB(batchName);

  try {
    const Profile = connection.model('Profile', ProfileModel.schema);
    const User = connection.model('User', UserModel.schema);
    const Answer = connection.model('Answer', AnswerModel.schema);
    const Test = connection.model('Test', TestModel.schema);
    const Starter = connection.model('Starter', StarterModel.schema);
    const Result = connection.model('Results', ResultModel.schema);
    const QnA = connection.model('QnA', QnAModel.schema);
    const Dsa = connection.model('Dsa', DsaModel.schema);
    const DsaPrev = connection.model('DsaPrev', DsaPrevModel.schema);
    const Aptitude = connection.model('Aptitude', AptitudeModel.schema);

    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    console.error('Batch creation error:', error);
    // To prevent resource leaks
    connection.close();
    res.status(500).json({
      status: 'error',
      message: 'Failed to create batch',
    });
  }
});

exports.connectToMongoDB = (req, res, next) => {
  const batchName = req.params.batchName;
  req.dbConnection = mongoose.createConnection(
    `mongodb+srv://ganesh:ZEQiBmwcCNvA8izX@cluster0.s575u7x.mongodb.net/${batchName}a?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  next();
};
