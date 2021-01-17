/* eslint-disable linebreak-style */
const router = require('express').Router();
const meetingRoute = require('./routes/meetingRoute');
router.use('/v1/meetings', meetingRoute);

module.exports = router;
