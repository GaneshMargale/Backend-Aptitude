const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  contestNumber: {
    type: Number,
    required: [true, 'Provide a contest number'],
  },
  contestName: {
    type: String,
    required: [true, 'Provide a contest name'],
  },

  answers: [
    {
      questionNumber: {
        type: Number,
        required: [true, 'Provide Question Number'],
      },
      answerOption: {
        type: String,
        required: [true, 'Provide Answer Option'],
      },
    },
  ],
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
