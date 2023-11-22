const mongoose = require('mongoose');

const DSASchema = new mongoose.Schema({
  contestNumber: {
    type: Number,
    required: [true, 'Provide a contest number'],
    unique: true,
  },
  contestName: {
    type: String,
    required: [true, 'Provide a contest name'],
  },
  questions: [
    {
      questionNumber: {
        type: Number,
        required: [true, 'Provide a question number'],
      },
      questionDescription: {
        type: String,
        required: [true, 'Provide the question description'],
      },
      Input1: {
        type: String,
        required: [true, 'Provide the test case 1'],
      },
      Output1: {
        type: String,
        required: [true, 'Provide the test case 1'],
      },
      Input2: {
        type: String,
        required: [true, 'Provide the test case 2'],
      },
      Output2: {
        type: String,
        required: [true, 'Provide the test case 2'],
      },
      Input3: {
        type: String,
        required: [true, 'Provide the test case 3'],
      },
      Output3: {
        type: String,
        required: [true, 'Provide the test case 3'],
      },
    },
  ],
});

const DSA = mongoose.model('DSA', DSASchema);

module.exports = DSA;
