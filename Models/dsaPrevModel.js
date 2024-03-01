const mongoose = require('mongoose');

const DSAPrevSchema = new mongoose.Schema({
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
      testCases: [
        {
          testCase: {
            type: Number,
            required: [true, 'Provide a test case'],
          },
          input: {
            type: String,
            required: [true, 'Provide a test input'],
          },
          output: {
            type: String,
            required: [true, 'Provide a test output'],
          },
        },
      ],
    },
  ],
});

const DSAPrevious = mongoose.model('DSAPrevious', DSAPrevSchema);

module.exports = DSAPrevious;
