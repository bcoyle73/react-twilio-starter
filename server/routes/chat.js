var express = require('express');
var router = express.Router();

var twilio = require('twilio');
var config = require('../../twilio.config');


router.post('/event', function(req, res) {
  console.log(req.body)
})

router.post('/pre-event', function(req, res) {
  console.log(req.body)
  
})
