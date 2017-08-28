var express = require('express');
var router = express.Router();

var twilio = require('twilio');
var config = require('../../twilio.config');

router.post('/assignment', function(req, res) {

  var taskAttributes = JSON.parse(req.body.TaskAttributes);
  var workerAttributes = JSON.parse(req.body.WorkerAttributes);
  var instructions = {}


  //console.log("Assignment called. Ignore this for now.  Accept client side");
  console.log(req.body)
  if (taskAttributes.direction == "outbound") {
    console.log("Use REST API to create a new call and add to conf")
    const client = require('twilio')(config.accountSid, config.authToken);
    client
      .conferences(req.body.TaskSid)
      .participants.create({to: "7034749718", from: "2146438999", early_media: "true", status_callback: "http://thinkvoice.ngrok.io/api/taskrouter/event"})
      .then((participant) => {
        //console.log(participant)
      })
    instructions = {"instruction": "accept"}
  }
  // If the worker doesn't have a client as contact uri then you will have to accept the task here.
  if (!workerAttributes.contact_uri.match(/client:/)) {
    instructions = {"instruction": "conference"}
  }

  res.send(instructions)

  /*
  // If you were to accept server side return this JSON
  // it's recommended to do client side
  console.log(taskAttributes)
  if (taskAttributes.direction == "outbound") {
    console.log("respond with call")
    res.send({
      "instruction": "call",
      "callTo": "client:bcoyle",
      "callFrom": "2146438999",
      "callAccept": "true",
      "callUrl": "http://thinkvoice.ngrok.io/api/calls/outbund/agent",
      "timeout": "3",
      "status_callback_url": "http://thinkvoice.ngrok.io/api/taskrouter/event"
    });
  }
 */

});

router.post('/event', function(req, res) {
  console.log('*********************************************************')
  console.log('*********************************************************')
  console.log('*********************************************************')
  console.log(`${req.body.EventType} --- ${req.body.EventDescription}`)

  res.send({})
})



module.exports = router;
