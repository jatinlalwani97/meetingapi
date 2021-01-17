const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  return re.test(email)
};

const meetingSchema = new mongoose.Schema({
  'title': {type: String,required: true},
  'start_time': {type: Number,required: true},
  'end_time': {type: Number,required: true},
  'participants': [{name:{type: String,required: true},'email': {
    type: String,
    required: true,
    validate: [validateEmail, 'Please fill a valid email address'],
  },rsvp:{type: String,required: true,enum: ['Yes', 'No','MayBe','Not Answered']}}]
});
const meeting = mongoose.model('meeting', meetingSchema);
meetingSchema.plugin(timestamps, {createdAt: 'created_at',updatedAt: 'updated_at'});
exports.meeting = meeting;
