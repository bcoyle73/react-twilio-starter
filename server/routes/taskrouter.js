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

  if (taskAttributes.type == "outbound_transfer") {
    instructions = {
      "instruction": "call",
      "accept": "true",
      "from": workerAttributes.phone_number,
      "url": config.baseUrl + "/api/calls/outbound/dial",
      "status_callback_url": config.baseUrl + "/api/taskrouter/event"
      }
  }


});

router.post('/event', function(req, res) {
  console.log('*********************************************************')
  console.log('*********************************************************')
  console.log('*************** TASKROUTER EVENT ************************')
  console.log(`${req.body.EventType} --- ${req.body.EventDescription}`)
  console.log(req.body)

  if (req.body.ResourceType == 'worker') {
    const client = require('twilio')(config.accountSid, config.authToken);
    const service = client.sync.services(config.syncServiceSid);
    const worker = req.body

    service.syncMaps('current_workers')
      .syncMapItems(worker.WorkerSid).update({
        data: {
          name: worker.Workername,
          activity: worker.WorkerActivityName,
          timestamp: worker.Timestamp
        }
      }).then(function(response) {
        console.log("worker updated");
      }).catch(function(error) {
        console.log(error);
      });
  }
  res.send({})
})


router.post('/outbound', function(req, res) {
  //const resp = new VoiceResponse();
  console.log(req.body)
  const from = req.body.From
  const to = req.body.To
  const agent = req.body.Agent
  const client = require('twilio')(config.accountSid, config.authToken);
  // Create a Task on a custom channel
  // with the Task sid that was returned place this agent leg of the call into
  // a conference named by the task sid

  client.taskrouter.v1
    .workspaces(config.workspaceSid)
    .tasks
    .create({
      workflowSid: config.workflowSid,
      taskChannel: 'custom1',
      attributes: JSON.stringify({direction:"outbound", agent_name: 'bcoyle', from: from, to: to}),
    }).then((task) => {
      console.log(task)
    })
    res.send({});
});

router.get('/initialize', function(req, res) {
  const client = require('twilio')(config.accountSid, config.authToken);
  const service = client.sync.services(config.syncServiceSid);
  service.syncMaps
    .create({
      uniqueName: 'current_workers',
    })
    .then(response => {
      console.log(response);
      client.taskrouter.v1
        .workspaces(config.workspaceSid)
        .workers
        .list()
        .then((workers) => {
          workers.forEach((worker) => {
            service.syncMaps('current_workers')
              .syncMapItems.create({
                key: worker.sid,
                data: {
                  name: worker.FriendlyName,
                  activity: worker.Activity,
                }
              }).then(function(response) {
                console.log(response);
              }).catch(function(error) {
                console.log(error);
              });
          });
        });
    })
    .catch(error => {
      console.log(error);
    });
  res.send({status: "ok"})
})



module.exports = router;
