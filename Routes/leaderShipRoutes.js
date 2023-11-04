const express = require('express');
const leaderShipController = require('../Controller/leadershipController');

const router = express.Router();

router.route('/').get(leaderShipController.getLeaderShip);

module.exports = router;
