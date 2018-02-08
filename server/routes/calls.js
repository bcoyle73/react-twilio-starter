var express = require('express');
var router = express.Router();

var VoiceResponse = require('twilio').twiml.VoiceResponse;
var config = require('../../twilio.config');

router.post('/', function(req, res) {
  const resp = new VoiceResponse();
  const type = {direction: 'inbound', skill: 'customer_care'};
  const json = JSON.stringify(type);

  resp.enqueue({
    workflowSid: config.workflowSid,
  }).task({priority: '1'}, json)

  res.send(resp.toString());

});

router.post('/events', function(req, res) {
  console.log('*********************************************************')
  console.log('*********************************************************')
  console.log('********************* CALL EVENT ************************')
  console.log(req.body)

  res.send({})

});

router.post('/conference/events/:call_sid', function(req, res) {
  console.log('*********************************************************')
  console.log('*********************************************************')
  console.log('*************** CONFERENCE EVENT ************************')
  console.log(req.body)
  const client = require('twilio')(config.accountSid, config.authToken);
  const callerSid = req.params.call_sid

  // This method of putting call sid in the URI does not allow you to reconnect a calls
  //  to customer if customer drops
  if (callerSid === req.body.CallSid && req.body.StatusCallbackEvent == 'participant-leave') {
    console.log("CALLER HUNG UP.  KILL CONFERENCE")
    client.api.accounts(config.accountSid)
      .conferences(req.body.ConferenceSid)
      .fetch()
      .then((conference) => {
        console.log(conference)
        if (conference) {
          conference.update({status: "completed"})
          .then((conference) => console.log("closed conf"))
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  res.send({})

});

router.post('/conference/:conference_sid/hold/:call_sid/:toggle', function(req, res) {
  const client = require('twilio')(config.accountSid, config.authToken);
  const confSid = req.params.conference_sid
  const callSid = req.params.call_sid
  const toggle = req.params.toggle
  client.api.accounts(config.accountSid)
    .conferences(confSid)
    .participants(callSid)
    .update({hold: toggle})
    .then((participant) => console.log(participant.hold))
    .done();
});

router.post('/conference/:conference_sid/terminate', function(req, res) {
  const client = require('twilio')(config.accountSid, config.authToken);
  const confSid = req.params.conference_sid

  console.log(confSid)

  client.api.accounts(config.accountSid)
    .conferences(confSid)
    .fetch()
    .then((conference) => {
      console.log(conference)
      if (conference) {
        conference.update({status: "completed"})
        .then((conference) => console.log("closed conf"))
      }
    })
    .catch((error) => {
      console.log(error)
      res.send({});
    })
});

// This endpoint dials out to a number and places that call into a conference
//  it also responds with Twiml to place the call accessing this endpoint into the same conference
//  This is called primarly when workers accept a reservation with call method
router.post('/outbound/dial/:to/from/:from/conf/:conference_name', function(req, res) {
  console.log(req.body)
  const to = req.params.to
  const from = req.params.from
  const conferenceName = req.params.conference_name
  const client = require('twilio')(config.accountSid, config.authToken);

  client
    .conferences(conferenceName)
    .participants.create({to: to, from: from, earlyMedia: "true", statusCallback: "http://bcoyle.ngrok.io" + "/api/taskrouter/event"})
    .then((participant) => {
      const resp = new VoiceResponse();
      const dial = resp.dial();
      dial.conference({
        beep: false,
        waitUrl: '',
        startConferenceOnEnter: true,
        endConferenceOnExit: false
      }, conferenceName);
      console.log(resp.toString())
      res.send(resp.toString());

      // Now update the task with a conference attribute with Agent Call Sid
      client.taskrouter.v1
        .workspaces(config.workspaceSid)
        .tasks(conferenceName)
        .update({
          attributes: JSON.stringify({conference: {sid: participant.conferenceSid, participants: {worker: req.body.CallSid, customer: participant.callSid}}}),
        }).then((task) => {
          console.log(task)
        })
        res.send({});
    })
    .catch((error) => {
      console.log(error)
    })
});

router.post('/record/:conference_id/', function(req, res) {
  // This endpoint is set when accepting the task with the call method
  const conferenceSid = req.params.conference_id
  const client = require('twilio')(config.accountSid, config.authToken);

  client
    .conferences(conferenceSid)
    .participants.create({to: "+12162083661", from: "2146438999", earlyMedia: "true", record: "true"})
    .then((participant) => {
      console.log(participant.callSid)
      res.send({callSid: participant.callSid});
    })
    .catch((error) => {
      console.log(error)
    })
});

router.post('/outbound/agent', function(req, res) {
  // The endpoint is configure in Twiml App that Twilio client referenced when token was created
  const from = req.body.From
  const to = req.body.To
  const agent = req.body.Agent
  const client = require('twilio')(config.accountSid, config.authToken);

  const dial = resp.dial();
  dial.conference({
    beep: false,
    waitUrl: '',
    startConferenceOnEnter: true,
    endConferenceOnExit: false
  }, task.sid);
  console.log(resp.toString())
  res.send(resp.toString());
});


module.exports = router;
