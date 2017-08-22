var express = require('express');
var router = express.Router();

var twilio = require('twilio');
var config = require('../../twilio.config');
var client = require('twilio');

router.post('/assignment', function(req, res) {

  var taskAttributes = JSON.parse(req.body.TaskAttributes);
  var workerAttributes = JSON.parse(req.body.WorkerAttributes);

  console.log("Assignment called. Ignore this for now.  Accept client side");
  // If you were to accept server side return this JSON
  // it's recommended to do client side
  //res.send({
  //  "instruction": "dequeue",
  //  "timeout": "3",
  //  "status_callback_url": "http://thinkvoice.ngrok.io/api/taskrouter/event"
  //});


});

router.post('/event', function(req, res) {
  console.log('*********************************************************')
  console.log('*********************************************************')
  console.log('*********************************************************')
  console.log(`${req.body.EventType} --- ${req.body.EventDescription}`)

  res.send({})
})



module.exports = router;
