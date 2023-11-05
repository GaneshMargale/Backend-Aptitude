const mongoose = require('mongoose');

const qnaSchema = new mongoose.Schema({
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
      options: {
        A: { type: String, required: [true, 'Provide option A'] },
        B: { type: String, required: [true, 'Provide option B'] },
        C: { type: String, required: [true, 'Provide option C'] },
        D: { type: String, required: [true, 'Provide option D'] },
      },
      answer: {
        type: String,
        required: [true, 'Provide  answer'],
      },
    },
  ],
});

const QnA = mongoose.model('QnA', qnaSchema);

module.exports = QnA;
