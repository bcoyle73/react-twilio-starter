import fetch from 'isomorphic-fetch'
import urls from '../configureUrls'

// Actions to register the worker
function registerWorker() {
  return {
    type: 'REGISTER_WORKER',
  }
}

function errorTaskRouter(message) {
  return {
    type: 'ERROR_TASKROUTER',
    message: message
  }
}

function workerConnectionUpdate(status) {
  return {
    type: 'CONNECTION_UPDATED',
    status: status
  }
}

export function workerUpdated(worker) {
  return {
    type: 'WORKER_UPDATED',
    worker: worker
  }
}

export function workerClientUpdated(worker) {
  return {
    type: 'WORKER_CLIENT_UPDATED',
    worker: worker
  }
}

export function reservationsFetch(worker) {
  return ( dispatch, getState ) => {
    worker.fetchReservations((error, reservations) => {
      dispatch(reservationsUpdated(reservations.data))
    })
  }
}

function taskUpdated(task) {
  return {
    type: 'TASK_UPDATED',
    task: task
  }
}

function taskCompleted(task) {
  return {
    type: 'TASK_COMPLETED',
    task: task
  }
}

function reservationsUpdated(data) {
  return {
    type: 'RESERVATIONS_UPDATED',
    reservations: data
  }
}

export function requestTaskComplete(task) {
  return (dispatch) => {
    console.log("COMPLETE TASK")
    task.complete((error, task) => {
      if (error) {
        console.log(error);
      }
      dispatch(taskCompleted(task))
    })
  }
}

export function requestAcceptReservation() {
  return (dispatch, getState) => {

  }
}

// We have a generic action to refresh reservations as we
// will need that after calls drop
export function requestRefreshReservations() {
  return (dispatch, getState) => {
    const { taskrouter } = getState()
    const { worker } = taskrouter
    console.log(worker)
    taskrouter.workerClient.fetchReservations((error, reservations) => {
      if (error) {
        dispatch(errorTaskRouter("Fetching Reservations: " + error.message + " check your TaskRouter token policies"))
      } else {
        console.log(reservations.data, "RESERVATIONS")
        if (reservations.data.length > 0) {
          console.log("Your worker has reservations currently assigned to them")
          for (let reservation of reservations.data) {
            // dont display tasks arleady completed
            if (reservation.task.assignmentStatus != "completed") {
              dispatch(taskUpdated(reservation.task))
            }
          }
        }
      }
    })
  }
}

export function requestStateChange(newStateName) {
  return (dispatch, getState) => {
    const { taskrouter } = getState()
    let requestedActivitySid = getActivitySid(taskrouter.activities, newStateName)
    taskrouter.worker.update("ActivitySid", requestedActivitySid, (error, worker) => {
      if (error) {
        console.log(error);
        dispatch(errorTaskRouter("Updating Worker Activity Sid: " + error.message))
      } else {
        console.log("STATE CHANGE", worker)
        dispatch(workerUpdated(worker))
      }
    })
  }
}

export function requestSyncClient(clientName) {
  return (dispatch, getState) => {
    return fetch(urls.syncToken, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "clientName="+clientName
    })
    .then(response => response.json())
    .then(json => {
        let syncClient = new Twilio.Sync.Client(json.token);

        syncClient.map('current_workers').then(function (map) {
          map.on('itemAdded', function(worker) {
            debugger;
            console.log('key', item.key);
            console.log('JSON data', item.value);
          });

          //Note that there are two separate events for map item adds and map item updates:
          map.on('itemUpdated', function(item) {
            const sid = item.item.descriptor.key
            const activity = item.item.descriptor.data.activity
            const workerUpdate = { sid: sid, activity: activity }
            activity == 'Idle' ? dispatch(workerAdded(workerUpdate)) : dispatch(workerRemoved(workerUpdate))
          });
        });
    })
  }
}

export function initializeSyncMap() {
  console.log('INITIALIZING SYNC MAP')
  return (dispatch, getState) => {
    return fetch(urls.syncMap, {
      method: "GET",
    })
    .then(response => response.json())
    .then(json => {
        console.log('json =>', json)
    })
  }
}

export function initializeWorkers(workerSid) {
  return (dispatch, getState) => {
    return fetch(urls.taskRouterToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "workerSid="+workerSid
      })
      .then(response => response.json())
      .then(json => {
        console.log(json)

        let workspace = new Twilio.TaskRouter.Workspace(json.token);
        workspace.workers.fetch(
          function(error, workerList) {
            if(error) {
              console.log(error.code);
              console.log(error.message);
              return;
            }
            dispatch(workersInitialized(workerList.data));
          }
        );
      })
  }
}

export function requestWorker(workerSid) {
  return (dispatch, getState) => {
    dispatch(registerWorker())
    return fetch(urls.taskRouterToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "workerSid="+workerSid
      })
      .then(response => response.json())
      .then(json => {
        console.log(json)
        // Register your TaskRouter Worker
        // --params token, debug, connectActivitySid, disconnectActivitySid, closeExistingSession
        // --see https://www.twilio.com/docs/api/taskrouter/worker-js#parameters
        let worker = new Twilio.TaskRouter.Worker(json.token, true, null, null, true )

        dispatch(workerClientUpdated(worker))
        worker.activities.fetch((error, activityList) => {
          if (error) {
            console.log(error, "Activity Fetch Error")
            dispatch(errorTaskRouter("Fetching Activites: " + error.message))
          } else {
            console.log(activityList)
            dispatch(activitiesUpdated(activityList.data))
          }
        })
        worker.fetchChannels((error, channels) => {
          if (error) {
            console.log(error, "Channels Fetch Error")
          } else {
            console.log(channels)
            dispatch(channelsUpdated(channels.data))
         }

        })

        dispatch(requestRefreshReservations())

        worker.on("ready", (worker) => {
          const clientName = typeof(worker.attributes.contact_uri) !== 'undefined' ? worker.attributes.contact_uri.split(":").pop() : worker.friendlyName
          dispatch(workerConnectionUpdate("ready"))
          dispatch(workerUpdated(worker))
          dispatch(requestPhone(clientName))
          dispatch(requestSyncClient(clientName))
          //dispatch(requestChat(worker.friendlyName))
          console.log("worker obj", worker)
        })
        worker.on('activity.update', (worker) => {
          dispatch(workerUpdated(worker))
        })
        worker.on('token.expired', () => {
          console.log('EXPIRED')
          dispatch(requestWorker(workerSid))
        })
        worker.on('error', (error) => {
          // You would want to provide the agent a notication of the error
          console.log("Websocket had an error: "+ error.response + " with message: "+error.message)
          console.log(error)
          dispatch(errorTaskRouter("Error: " + error.message))
        })
        worker.on("disconnected", function() {
          // You would want to provide the agent a notication of the error
          dispatch(workerConnectionUpdate("disconnected"))
          dispatch(errorTaskRouter("Web socket disconnection: " + error.message))
          console.log("Websocket has disconnected");
        })
        worker.on('reservation.timeout', (reservation) => {
          console.log("Reservation Timed Out")
        })
        // Another worker has accepted the task
        worker.on('reservation.rescinded', (reservation) => {
          console.log("Reservation Rescinded")
        })
        worker.on('reservation.rejected', (reservation) => {
          console.log("Reservation Rejected")
        })
        worker.on('reservation.cancelled', (reservation) => {
          console.log("Reservation Cancelled")
        })
        worker.on('reservation.accepted', (reservation) => {
          console.log("Reservation Accepted")
          console.log(reservation, "RESERVATION ACCEPTED RESV")
          dispatch(taskUpdated(reservation.task))
          // Phone record is a demo of stop/start recording with ghost legs
          //dispatch(phoneRecord(reservation.task.attributes.conference.sid))
        })
        worker.on("attributes.update", function(channel) {

          console.log("Worker attributes updated", channel);
        })
        worker.on("channel.availability.update", function(channel) {

          console.log("Channel availability updated", channel);
        })

        worker.on("channel.capacity.update", function(channel) {

          console.log("Channel capacity updated", channel);
        })

        worker.on('reservation.created', (reservation) => {
          console.log("Incoming reservation")
          console.log(reservation)

          switch (reservation.task.taskChannelUniqueName) {
            case 'voice':
              if (reservation.task.attributes.type == 'transfer') {
                reservation.call('15304412022',
                                  urls.internalTransferCallback + '?conferenceSid=' + reservation.task.attributes.confName,
                                  null,
                                  'true')
              } else {
                const customerLeg = reservation.task.attributes.call_sid
                console.log(customerLeg, "customer call sid")
                console.log("Create a conference for agent and customer")
                var options = {
                    "ConferenceStatusCallback": urls.conferenceEvents + "?customer_sid=" + customerLeg,
                    "ConferenceStatusCallbackEvent": "start,leave,join,end",
                    "EndConferenceOnExit": "false",
                    "Beep": "false"
                }
                reservation.conference(null, null, null, null, null, options)
              }
              break
            case 'sms':
              reservation.accept()
              dispatch(chatNewRequest(reservation.task))
              break
            case 'video':
              reservation.accept()
              dispatch(videoRequest(reservation.task))
              break
            case 'custom1':
              const taskSid = reservation.task.sid
              const to = reservation.task.attributes.to
              const from = reservation.task.attributes.from
              console.log(reservation, "OUTBOUTND")
              reservation.call(
                from,
                urls.callOutboundCallback + "?ToPhone="+to+"&FromPhone="+from+"&Sid="+taskSid,
                null,
                "true",
                "",
                "",
                function(error, reservation) {
                  if (error) {
                    console.log(error)
                    console.log(error.message)
                  }
                  console.log(reservation)
                }
              )

              break
            default:
              reservation.reject()
          }

        })
      })
      .then(() => console.log("ih"))

  }
}

function activitiesUpdated(activities) {
  return {
    type: 'ACTIVITIES_UPDATED',
    activities: activities
  }
}

function workersInitialized(workers) {
  return {
    type: 'WORKERS_INITIALIZED',
    workers: workers
  }
}

function workerAdded(workerUpdate) {
  return {
    type: 'WORKER_ADDED',
    workerUpdate: workerUpdate
  }
}

function workerRemoved(workerUpdate) {
  return {
    type: 'WORKER_REMOVED',
    workerUpdate: workerUpdate
  }
}

function channelsUpdated(channels) {
  return {
    type: 'CHANNELS_UPDATED',
    channels: channels
  }
}

export function dialPadUpdated(number) {
  return {
    type: 'DIAL_PAD_UPDATED',
    number: number
  }
}

function registerPhoneDevice() {
  return {
    type: 'REGISTER_PHONE'
  }
}

function phoneMuted(boolean) {
  return {
    type: 'PHONE_MUTED',
    boolean: boolean
  }
}

function phoneHeld(boolean) {
  return {
    type: 'PHONE_HELD',
    boolean: boolean
  }
}

function phoneWarning(warning) {
  return {
    type: 'PHONE_WARNING',
    warning: warning
  }
}

export function phoneDeviceUpdated(device) {
  return {
    type: 'PHONE_DEVICE_UPDATED',
    device: device
  }
}

export function phoneConnectionUpdated(conn) {
  return {
    type: "PHONE_CONN_UPDATED",
    connection: conn
  }
}

export function requestPhone(clientName) {
  return (dispatch, getState) => {
    dispatch(registerPhoneDevice())
    const { taskrouter } = getState()
    return fetch(urls.clientToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "clientName="+clientName+"&token="+taskrouter.worker.token,
      })
      .then(response => response.json())
      .then(json => {
        Twilio.Device.setup(json.token)
        Twilio.Device.ready((device) => {
          console.log("phone is ready");
          dispatch(phoneDeviceUpdated(device))
        })
        Twilio.Device.incoming(function(connection) {
          // Accept the phone call automatically
          connection.accept();
        })
        Twilio.Device.connect((conn) => {
          console.log("incoming call")
          console.log(conn._direction)
          // Call is connected. Register callback for events to make sure UI is updated
          conn.mute((boolean, connection) => {
            dispatch(phoneMuted(boolean))
          })
          conn.disconnect((conn) => {
            // Phone disconnected. Refresh Reservations to capture wrapping
            //dispatch(requestRefreshReservations())
          })
          // Twilio Client Insights feature.  Warning are received here
          conn.on('warning', (warning) => {
            dispatch(phoneWarning(warning))
          })
          // Twilio Client Insights feature.  Warning are cleared here
          conn.on('warning-cleared', (warning) => {
            dispatch(phoneWarning(" "))
          })
	        dispatch(phoneConnectionUpdated(conn))
		    })
		    Twilio.Device.disconnect((conn) => {
	        dispatch(phoneConnectionUpdated(null))
        })
      })
      .then(console.log("error"))
    }
}

export function phoneHold(confSid, callSid) {
  return(dispatch, getState) => {
    const { taskrouter, phone } = getState()
    const newHoldState = !phone.isHeld
    return fetch(urls.callHold, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "conference_sid="+confSid+"&call_sid="+callSid+"&toggle="+newHoldState+"&token="+taskrouter.worker.token,
      })
      .then(response => response.json())
      .then(json => {
        console.log(json)
        dispatch(phoneHeld(json.result))
      })

  }
}

export function phoneTransfer(confName) {
   return (dispatch, getState) => {
     const { taskrouter } = getState()
     return fetch(urls.internalTransfer,
       {
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
         },
         method: "POST",
         body: "agent_id=bcoyle&conferenceSid=" + confName + "&token="+taskrouter.worker.token,
       })
       .then(response => response.json())
       .then( json => {
         console.log(json)
       })
   }
}


export function phoneRecord(confSid, currentState) {
  return(dispatch, getState) => {
    return fetch(`/api/calls/record/${confSid}`,{method: "POST"})
      .then(response => response.json())
      .then( json => {
        console.log(json)
        dispatch(phoneRecordOn(json.callSid))
      })
  }
}

export function phoneRecordOn(callSid) {
  return {
    type: 'PHONE_RECORD_ON',
    callSid: callSid
  }
}

export function phoneRecordOff() {
  return {
    type: 'PHONE_RECORD_OFF'
  }
}

// This action is tied to the hangup phone phone button
// - this action will call down to server which complete's the conference
// - which then terminates all participant's calls
// - after getting a response from the server this will update the task as complete
export function requestConfTerminate(confSid) {
  return(dispatch, getState) => {
    const { taskrouter } = getState()
    return fetch(urls.conferenceTerminate, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "conferenceSid="+confSid+"&token="+taskrouter.worker.token,
      })
      .then(response => response.json())
      .then( json => {
        console.log(json, "Terminate conf response")
      })
  }
}

// Phone Mute will use the Twilio Device to Mute the call
// -- After the phone is muted a callback will fired to update
// -- the redux store.
export function phoneMute() {
  return (dispatch, getState) => {
    const { phone } = getState()
    console.log("mute clicked")
    console.log("Current call is muted? " + phone.currentCall.isMuted())
    phone.currentCall.mute(!phone.currentCall.isMuted())
  }
}

export function phoneButtonPushed(digit) {
  return (dispatch, getState) => {
    const { phone } = getState()
    console.log("dial pad clicked ", digit)

    phone.currentCall.sendDigits(digit)
  }
}

export function phoneCall() {
  return (dispatch, getState) => {
    // Call the number that is currently in the number box
    // pass the from and to number for the phone call as well as agent name
    const { phone, taskrouter } = getState()
    console.log("call clicked to " + phone.dialPadNumber)

    return fetch(urls.callOutbound,
      {
        method: "POST",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
        body:
          "To=" + phone.dialPadNumber + "&" +
          "From=" + taskrouter.worker.attributes.phone_number + "&" +
          "Agent=" + taskrouter.worker.friendlyName + "&" +
          "Token=" + taskrouter.worker.token
      })
      .then(response => response.json())
      .then( json => {
        console.log(json)
      })

  }
}

export function phoneDialCustomer(number) {
  return(dispatch, getState) => {
    return fetch(`/api/calls/confin`)
      .then(response => response.json())
      .then( json => {
        console.log(json)
      })
  }

}

export function phoneHangup() {
  return (dispatch, getState) => {
    const { phone } = getState()
    phone.currentCall.disconnect()
  }
}

export function chatClientUpdated(client) {
  return {
    type: 'CHAT_CLIENT_UPDATED',
    client: client
  }
}

export function requestChat(identity) {
  return (dispatch, getState) => {
    return fetch(`/api/tokens/chat/${identity}/browser`)
      .then(response => response.json())
      .then(json => {
        try {
          let chatClient = new Twilio.Chat.Client(json.token, {logLevel: 'debug'})
          dispatch(chatClientUpdated(chatClient))
          chatClient.on('channelJoined', (channel) => {
            console.log("joined chat channel")
            channel.on('messageAdded', (message) => {
              console.log("message added")
            })
          })
        }
        catch (e) {
          console.log(e)
        }
      })
    }
}

function chatUpdateChannel(channel) {
  return {
    type: 'CHAT_UPDATE_CHANNEL',
    channel: channel
  }
}

function chatAddMessage(message) {
  return {
    type: 'CHAT_ADD_MESSAGE',
    message: message
  }
}

export function chatNewRequest(task) {
  return (dispatch, getState) => {
    const currState = getState()
    console.log(currState)
    currState.chat.client.getChannelBySid(task.attributes.chat_channel)
      .then(channel => {
        console.log(channel)
        channel.on('memberJoined', (member) => {
          console.log("JOINED")
        })
        channel.on('messageAdded', (message) => {
          console.log(message)
          dispatch(chatAddMessage({channel: message.channel.sid, author: message.author, body: message.body}))
        })
        channel.add(currState.taskrouter.worker.friendlyName)
          .then(error => {
            console.log(error)
            channel.sendMessage("Brian is in the house")
          })
          .catch(error => {
            console.log(error)
          })
        dispatch(chatUpdateChannel(channel))

    })

  }
}

export function videoRequest(task) {
  return (dispatch, getState) => {
    let worker = task.workerName
    return fetch(`/api/tokens/chat/${worker}/browser`)
      .then(response => response.json())
      .then(json => {
        try {
          let videoClient = new Twilio.Video.connect(json.token, {name:'brian-test'})
            .then(room => {
              console.log(room, "VIDEO CREATED")
              let participant = room.participants.values().next().value
              dispatch(videoParticipantConnected(participant))
              room.on('participantConnected', (participant) => {
                console.log('A remote Participant connected: ', participant)
                //dispatch(videoParticipantConnected(participant))
              })
            })

        }
        catch (e) {
          console.log(e)
        }
      })

  }
}

function videoParticipantConnected(participant) {
  return {
    type: 'VIDEO_PARTICIPANT_CONNECTED',
    participant: participant
  }
}

const getActivitySid = (activities, activityName) => {
  let activity = activities.find((activity) =>
    activity.friendlyName == activityName)
  if (activity) {
    return activity.sid
  } else {
    return "no-activity-found"
  }
}
