var express = require('express');
var router = express.Router();

var twilio = require('twilio');
var VoiceResponse = twilio.twiml.VoiceResponse;
var config = require('../../twilio.config');

router.post('/', function(req, res) {
  var resp = new twilio.TwimlResponse();
  var type = {task_type: 'call'};
  var json = JSON.stringify(type);
  resp.say("Thank you for calling.")
    .enqueue({
      workflowSid: config.workflowSid
    }, function(node) {
      node.task(json);
    });
  res.send(resp.toString());
});



module.exports = router;
