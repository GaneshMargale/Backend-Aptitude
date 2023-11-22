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
  .get(authController.protect, aptitudeController.getAllAnswers)
  .post(aptitudeController.createAnswers);

router
  .route('/questions/:contestNumber/:questionNumber')
  .get(authController.protect, aptitudeController.getQuestion)
  .patch(aptitudeController.updateQuestion);

router.route('/CreateQnA').get(QnAController.getQnA);
router.route('/GetQnA').get(authController.protect, QnAController.getAllQnA);

router.route('/aptitude/contests').get(aptitudeController.getContests);
module.exports = router;
