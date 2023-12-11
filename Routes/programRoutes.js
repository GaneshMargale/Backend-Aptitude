const express = require('express');
const programController = require('../Controller/programController');

const router = express.Router();

router
  .route('/java/:contestNumber/:language/:qNumber')
  .post(programController.runProgram);

router
  .route('/cpp/:contestNumber/:language/:qNumber')
  .post(programController.runProgramCpp);

router
  .route('/py/:contestNumber/:language/:qNumber')
  .post(programController.runProgramPython);

module.exports = router;
