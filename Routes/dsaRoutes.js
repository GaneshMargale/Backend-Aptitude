const express = require('express');
const dsaController = require('../Controller/dsaController');

const router = express.Router();

router
  .route('/')
  .get(dsaController.getCodeSnippits)
  .post(dsaController.createCodeSnippits);

router
  .route('/:contestNumber/:type/:language/:question')
  .patch(dsaController.updateCodeSnippits);

router.route('/CreateTestCase').post(dsaController.createTestCases);

router
  .route('/questions')
  .get(dsaController.getDSAQuestions)
  .post(dsaController.createDSAQuestions);

router
  .route('/questions/:contestNumber')
  .delete(dsaController.deleteDSAQuestions);

router.route('/previousQuestions').get(dsaController.getPreviousDSA);

router
  .route('/getStarter')
  .get(dsaController.getStarter)
  .post(dsaController.createStarter);

module.exports = router;
