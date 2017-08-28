const express = require('express');
const router = express.Router();
const _ = require('lodash');

const ClientCapability = require('twilio').jwt.ClientCapability;
const AccessToken = require('twilio').jwt.AccessToken;
const TaskRouterCapability = require('twilio').jwt.taskrouter.TaskRouterCapability;
const Policy = TaskRouterCapability.Policy;
const util = require('twilio').jwt.taskrouter.util;

const TASKROUTER_BASE_URL = 'https://taskrouter.twilio.com';
const version = 'v1';

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

  // Event Bridge Policies
  var eventBridgePolicies = util.defaultEventBridgePolicies(config.accountSid, worker);

  var workspacePolicies = [
    // Workspace fetch Policy
    buildWorkspacePolicy(),
    // Workspace Activities Update Policy
    buildWorkspacePolicy({ resources: ['Activities'], method: 'POST' }),
    buildWorkspacePolicy({ resources: ['Activities'], method: 'GET' }),
    //
    buildWorkspacePolicy({ resources: ['Tasks', '**'], method: 'POST' }),
    buildWorkspacePolicy({ resources: ['Tasks', '**'], method: 'GET' }),
    // Workspace Activities Worker Reserations Policy
    buildWorkspacePolicy({ resources: ['Workers', worker, 'Reservations', '**'], method: 'POST' }),
    buildWorkspacePolicy({ resources: ['Workers', worker, 'Reservations', '**'], method: 'GET' }),
    //

    // Workspace Activities Worker  Policy
    buildWorkspacePolicy({ resources: ['Workers', worker], method: 'GET' }),
    buildWorkspacePolicy({ resources: ['Workers', worker], method: 'POST' }),
  ];

  eventBridgePolicies.concat(workspacePolicies).forEach(function (policy) {
    capability.addPolicy(policy);
  });

  res.send(capability.toJwt());
});

// Helper function to create Policy for TaskRouter token
function buildWorkspacePolicy(options) {
  options = options || {};
  var resources = options.resources || [];
  var urlComponents = [TASKROUTER_BASE_URL, version, 'Workspaces', config.workspaceSid]

  return new Policy({
    url: urlComponents.concat(resources).join('/'),
    method: options.method || 'GET',
    allow: true
  });
}

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
