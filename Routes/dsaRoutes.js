const express = require('express');
const dsaController = require('../Controller/dsaController');
const authController = require('../Controller/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, dsaController.getCodeSnippits)
  .post(dsaController.createCodeSnippits);

router
  .route('/:contestNumber/:type/:language/:question')
  .patch(dsaController.updateCodeSnippits);

router.route('/CreateTestCase').post(dsaController.createTestCases);

router
  .route('/questions')
  .get(authController.protect, dsaController.getDSAQuestions)
  .post(dsaController.createDSAQuestions);

router
  .route('/questions/:contestNumber')
  .delete(dsaController.deleteDSAQuestions);

router
  .route('/previousQuestions')
  .get(authController.protect, dsaController.getPreviousDSA);

router
  .route('/getStarter')
  .get(authController.protect, dsaController.getStarter)
  .post(dsaController.createStarter);

module.exports = router;
