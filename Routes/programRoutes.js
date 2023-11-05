const express = require('express');
const programController = require('../Controller/programController');

const router = express.Router();

router
  .route('/:contestNumber/:language/:qNumber')
  .patch(programController.runProgram);

module.exports = router;
