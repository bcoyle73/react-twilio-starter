var express = require('express');
var router = express.Router();

var twilio = require('twilio');
var VoiceResponse = twilio.twiml.VoiceResponse;
var config = require('../../twilio.config');

router.post('/', function(req, res) {
  const resp = new VoiceResponse();
  const type = {task_type: 'call', skill: 'skill_1'};
  const json = JSON.stringify(type);
  resp.enqueueTask({workflowSid: config.workflowSid,}).task({priority: '5'}, json)
  res.send(resp.toString());
});



module.exports = router;
