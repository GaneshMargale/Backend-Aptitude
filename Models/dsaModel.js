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
      TestCase1: {
        type: String,
        required: [true, 'Provide the test case 1'],
      },
      TestCase2: {
        type: String,
        required: [true, 'Provide the test case 2'],
      },
      TestCase3: {
        type: String,
        required: [true, 'Provide the test case 3'],
      },
    },
  ],
});

const DSA = mongoose.model('DSA', DSASchema);

module.exports = DSA;
