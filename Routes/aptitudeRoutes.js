const express = require('express');
const aptitudeController = require('../Controller/aptitudeController');
const QnAController = require('../Controller/QnAController');
const authController = require('../Controller/authController');

const router = express.Router();

router
  .route('/questions')
  .get(authController.protect, aptitudeController.getAllQuestions)
  .post(aptitudeController.createQuestions);

router
  .route('/answers')
  .get(aptitudeController.getAllAnswers)
  .post(aptitudeController.createAnswers);

router
  .route('/questions/:contestNumber/:questionNumber')
  .get(aptitudeController.getQuestion)
  .patch(aptitudeController.updateQuestion);

router.route('/QnA').get(QnAController.getQnA);

router.route('/aptitude/contests').get(aptitudeController.getContests);
module.exports = router;
