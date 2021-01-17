const router = require('express').Router();
const {addMeeting,getMeeting,filterMeetings} = require('../controllers/meetingController');
router.post('/',addMeeting);
router.get('/:id', getMeeting);
router.get('/', filterMeetings);


module.exports = router;
