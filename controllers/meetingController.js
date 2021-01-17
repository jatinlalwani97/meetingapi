const createError = require('http-errors');
const {meeting} = require('../models/meeting');
const {HttpCodes, CustomErrors}=require('../response');
async function addMeeting(req, res, next) {
  try {
    var emails = []
    req.body.participants.forEach(object => {emails.push(object.email)});
    var meetingObject = await meeting.findOne({'participants':{ $elemMatch:{rsvp:'Yes','email':{$in:emails}}},'start_time':{$gte:req.body.start_time,$lte:req.body.end_time}});
    if(meetingObject){
      if(req.body.start_time >= req.body.end_time){
        return res.status(HttpCodes.BAD_REQUEST).send({
          'response': {
            'message': 'start time cannot be greater then end time',
            'result': null
          },
        })
      }
        return res.status(HttpCodes.BAD_REQUEST).send({
            'response': {
              'message': 'slot already booked choose another time',
              'result': null
            },
        }); 
    }
    var meetingObject = new meeting(req.body)
    meetingObject = await meetingObject.save();
    return res.status(HttpCodes.OK).send({
      'response': {
        'message': 'meeting created successfully',
        'result': meetingObject,
      },
    });
  } catch (ex) {
    next(ex);
  }
}
async function filterMeetings(req, res, next) {
  try {
    const page = Number(req.query.limit)*((req.query.page)-1) || 0;
    const limit = Number(req.query.limit) || 10;
    var query={};
    if(req.query.email){
        query['participants.email'] = req.query.email
    }
    if(req.query.start && req.query.end){
      query['$or']=[{'start_time':{$lte:req.query.end,$gte:req.query.start}},{'end_time':{$lte:req.query.end,$gte:req.query.start}}]
    }
    console.log(query)
    const meetings = await meeting
        .find(query, {_id: 0})
        .skip(page)
        .limit(limit);
    const count = await meeting.count();
    return res.status(HttpCodes.OK).send({
      'response': {
        'message': 'meetings fetched successfully',
        'result': {'meetings': meetings, 'count': count},
      },
    });
  } catch (ex) {
    next(ex);
  }
}

async function getMeeting(req, res, next) {
    try {
      const meetingObject = await meeting.findOne({_id:req.params.id}, {_id: 0})
      if(meetingObject){
        return res.status(HttpCodes.OK).send({
            'response': {
              'message': 'meeting fetched successfully',
              'result': meetingObject,
            },
          });
      }
      return res.status(HttpCodes.NOT_FOUND).send({
        'response': {
          'message': 'no meeting found with this id',
          'result': null,
        },
      });

    } catch (ex) {
      next(ex);
    }
}

module.exports = {
    addMeeting,getMeeting,filterMeetings

};
