const mongoose = require('mongoose');

const codeSnippitsSchema = new mongoose.Schema({
  contestNumber: {
    type: Number,
    required: [true, 'Provide the contest number'],
  },

  contestName: {
    type: String,
    required: [true, 'Provide contest name'],
  },

  starterCode: [
    {
      java: {
        type: String,
        required: [true, 'Provide java starter code'],
      },
      cpp: {
        type: String,
        required: [true, 'Provide cpp starter code'],
      },
      python: {
        type: String,
        required: [true, 'Provide python starter code'],
      },
    },
  ],
});

const CodeSnippits = mongoose.model('codeSnippits', codeSnippitsSchema);

module.exports = CodeSnippits;
