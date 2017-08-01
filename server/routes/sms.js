var express = require('express');
var router = express.Router();

var twilioLibrary = require('twilio');

//var IpMessagingClient = require('twilio').IpMessagingClient;

var config = require('../../twilio.config');

router.post('/', function(req, res) {
  var client = new twilioLibrary.Twilio(config.accountSid, config.authToken);
  //var client = new IpMessagingClient(config.accountSid, config.authToken);
  var service = client.chat.services(config.chatServiceSid)

  var cookie = req.cookies.convo;

  if (cookie) {
      // Part of existing conversation add this to room
      console.log("cookie found");
      service.channels(cookie).messages.create({
          body: req.body.body,
          from: req.body.from
      }).then(function(response) {
          console.log(response);
      }).catch(function(error) {
          console.log(error);
      });
    } else {
      service.channels.create({
          friendlyName: req.body.sid
      }).then(function(response) {
          console.log(response);
          //res.cookie('convo', response.sid, { maxAge: 300000, httpOnly: true })
      }).catch(function(error) {
          console.log(error);
      });
    }
    resp = new twilioLibrary.twiml.MessagingResponse();
    console.log(resp.toString());
    //var resp = client.MessagingResponse.toString();
    // expire in 5 mins

    res.send(resp.toString());
});



module.exports = router;
