const express = require('express');
const aptitudeController = require('../Controller/aptitudeController');
const QnAController = require('../Controller/QnAController');
const authController = require('../Controller/authController');

const router = express.Router();

//get all contest available
router
  .route('/aptitude/contests')
  .get(authController.protect, aptitudeController.getAllAptitudeContests);

//get questions for particular contest
router
  .route('/questions/:contestNumber/:contestName')
  .get(
    authController.protect,
    aptitudeController.updateQuestionVisibility,
    aptitudeController.getAllQuestions
  );

//create question
router.route('/questions').post(aptitudeController.createQuestions);

//get or create answers
router
  .route('/answers')
  .get(authController.protect, aptitudeController.getAllAnswers)
  .post(aptitudeController.createAnswers);

//get or update a particular question
router
  .route('/questions/:contestNumber/:questionNumber')
  .get(authController.protect, aptitudeController.getQuestion)
  .patch(aptitudeController.updateQuestion);

router.route('/CreateQnA').get(QnAController.getQnA);
router.route('/GetQnA').get(authController.protect, QnAController.getAllQnA);

//get the user aptitude contest
router
  .route('/aptitude/contests/:usn')
  .get(aptitudeController.getAptitudeContests);

//get the user dsa contest
router.route('/dsa/contests/:usn').get(aptitudeController.getDSAContests);
module.exports = router;
