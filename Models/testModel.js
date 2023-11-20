const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: [true, 'Provide a question number'],
  },
  testCases: [
    {
      testInput: [
        {
          type: mongoose.Schema.Types.Mixed,
          required: [true, 'Provide test inputs'],
        },
      ],
      testOutput: [
        {
          type: mongoose.Schema.Types.Mixed,
          required: [true, 'Provide test outputs'],
        },
      ],
    },
  ],
});

const TestCases = mongoose.model('TestCases', testSchema);

module.exports = TestCases;
