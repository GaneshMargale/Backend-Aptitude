const mongoose = require('mongoose');

const starterSchema = new mongoose.Schema({
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

const StarterCode = mongoose.model('StarterCode', starterSchema);

module.exports = StarterCode;
