const express = require('express');
const router = express.Router();
const _ = require('lodash');

const twilio = require('twilio');
const ClientCapability = require('twilio').jwt.ClientCapability;
const AccessToken = twilio.jwt.AccessToken;
const TaskRouterCapability = require('twilio').jwt.taskrouter.TaskRouterCapability;
const util = require('twilio').jwt.taskrouter.util;
const version = 'v1'

//const SyncGrant = AccessToken.SyncGrant;


const config = require('../../twilio.config');

router.get('/worker/:id', function(req, res) {
  const worker = req.params.id;

  const capability = new TaskRouterCapability({
    accountSid: config.accountSid,
    authToken: config.authToken,
    workspaceSid: config.workspaceSid,
    channelId: worker,
    ttl: 28800});  // 60 * 60 * 8

  const workerPolicies = util.defaultWorkerPolicies('v1', config.workspaceSid, worker);
  workerPolicies.forEach(function(policy) {
    //console.log(policy);
    capability.addPolicy(policy);
  });

  const tasksPostPolicy = new twilio.jwt.taskrouter.TaskRouterCapability.Policy({
       url: 'https://taskrouter.twilio.com/' + version + '/Workspaces/' + config.workspaceSid + '/Tasks/**',
       method: 'POST',
       allow: true
   });

   capability.addPolicy(tasksPostPolicy);

   const workerPostPolicy = new twilio.jwt.taskrouter.TaskRouterCapability.Policy({
        url: 'https://taskrouter.twilio.com/' + version + '/Workspaces/' + config.workspaceSid + '/Workers/' + worker,
        method: 'POST',
        allow: true
    });

    capability.addPolicy(workerPostPolicy);


  const eventBridgePolicies = util.defaultEventBridgePolicies(config.accountSid, worker);
  eventBridgePolicies.forEach(function(policy) {
    //console.log(policy);
    capability.addPolicy(policy);
  });

  res.send(capability.toJwt());


});

router.get('/phone/:name', function(req, res) {
  const clientName = req.params.name;
  console.log("register phone", clientName);
  const capability = new ClientCapability({
      accountSid: config.accountSid,
      authToken: config.authToken,
  });
  capability.addScope(new ClientCapability.IncomingClientScope(clientName));
  capability.addScope(
    new ClientCapability.OutgoingClientScope({applicationSid: config.twimlApp})
  );
  res.send(capability.toJwt());
});



router.get('/chat/:name/:endpoint', function(req, res) {
  const clientName = req.params.name;
  const endpoint = req.params.endpoint;
  console.log("Service SID", config.chatServiceSid);
  const chatGrant = new AccessToken.IpMessagingGrant({
		serviceSid: config.chatServiceSid,
		endpointId: clientName + endpoint
	})

  const videoGrant = new AccessToken.VideoGrant()

  // Create an access token which we will sign and return to the client
  const accessToken = new AccessToken(
					config.accountSid,
					config.keySid,
					config.keySecret,
					'');

  //accessToken.identity = clientName;
  accessToken.identity = clientName;



	accessToken.addGrant(chatGrant);
  accessToken.addGrant(videoGrant);

  //return token.toJwt();

  // Serialize the token to a JWT string and include it in a JSON response
  res.send({
      identity: clientName,
      token: accessToken.toJwt()
  });
})
module.exports = router;
