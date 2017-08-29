var express = require('express');
var router = express.Router();

var VoiceResponse = require('twilio').twiml.VoiceResponse;
var config = require('../../twilio.config');

router.post('/', function(req, res) {
  const resp = new VoiceResponse();
  const type = {dir: 'call', skill: 'skill_1'};
  const json = JSON.stringify(type);

  resp.enqueueTask({
    workflowSid: config.workflowSid,
  }).task({priority: '1'}, json)

  res.send(resp.toString());

});

router.post('/events', function(req, res) {
  console.log('*********************************************************')
  console.log('*********************************************************')
  console.log('********************* CALL EVENT *****************************')
  console.log(`${req.body}`)

  res.send({})

});

router.post('/outbound/dial', function(req, res) {

  const client = require('twilio')(config.accountSid, config.authToken);
  client.taskrouter.v1
    .workspaces(config.workspaceSid)
    .tasks
    .create({
      workflowSid: config.workflowSid,
      taskChannel: 'custom1',
      attributes: '{"direction":"outbound", "agent_name":"bcoyle"}',
    }).then((task) => {
      const resp = new VoiceResponse();
      const dial = resp.dial();
      dial.conference({
        beep: false,
        waitUrl: '',
        startConferenceOnEnter: true,
        endConferenceOnExit: true
      }, task.sid);
      console.log(resp.toString())
      res.send(resp.toString());
    })
});


module.exports = router;
