import fetch from 'isomorphic-fetch'
import urls from '../configureUrls'

// Actions to register the worker
function registerWorker() {
  return {
    type: 'REGISTER_WORKER',
  }
}

export function workerUpdated(worker) {
  return {
    type: 'WORKER_UPDATED',
    worker: worker
  }
}

export function currentActivityFetch(worker) {
  return ( dispatch, getState ) => {
    worker.fetchReservations((error, reservations) => {
      dispatch(reservationsUpdated(reservations.data))
    })
  }
}

export function reservationsFetch(worker) {
  return ( dispatch, getState ) => {
    worker.fetchReservations((error, reservations) => {
      dispatch(reservationsUpdated(reservations.data))
    })
  }
}

function reservationCreated(reservation) {
  return {
    type: 'RESERVATION_CREATED',
    reservation: reservation
  }
}

function reservationsUpdated(data) {
  return {
    type: 'RESERVATIONS_UPDATED',
    reservations: data
  }
}

export function requestTaskComplete(reservation) {
  return (dispatch) => {
    console.log("I AM GOING TO COMPLETE " + reservation.taskSid)
    console.log("ITS CURRENT ASSIGNMENT STATIS is " + reservation.reservationStatus)
    reservation.task.complete((error, task) => {
      if (error) {
        console.log(error);
      }
      console.log(task)
    })
  }
}

export function requestAcceptReservation() {
  return (dispatch, getState) => {

  }
}

export function requestStateChange(newStateName) {
  return (dispatch, getState) => {
    const { taskrouter } = getState()
    let requestedActivitySid = getActivitySid(taskrouter.activities, newStateName)
    taskrouter.worker.update("ActivitySid", requestedActivitySid, (error, worker) => {
      if (error) {
        console.log(error);
      } else {
        console.log("STATE CHANGE", worker)
        dispatch(workerUpdated(worker))
      }
    })
  }
}

export function requestWorker(workerSid) {
  return (dispatch, getState) => {
    console.log(workerSid)
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

        worker.activities.fetch((error, activityList) => {
           dispatch(activitiesUpdated(activityList.data))
        })
        worker.fetchChannels((error, channels) => {
           dispatch(channelsUpdated(channels.data))

        })
        worker.fetchReservations((error, reservations) => {
           console.log(reservations.data, "RESERVATIONS")
           if (reservations.data.length > 0) {
             console.log("call into conf")
           }

        })
        dispatch(workerUpdated(worker))
        worker.on("ready", (worker) => {
          dispatch(workerUpdated(worker))
          dispatch(requestPhone(worker.friendlyName))
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
        })
        worker.on("disconnected", function() {
          // You would want to provide the agent a notication of the error
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
          dispatch(reservationCreated(reservation))
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
              const customerLeg = reservation.task.attributes.call_sid
              console.log(customerLeg, "customer call sid")
              console.log("Create a conference for agent and customer")
              var options = {
                  "ConferenceStatusCallback": urls.baseUrl + "/api/calls/conference/events/" + customerLeg,
                  "ConferenceStatusCallbackEvent": "start,leave,join,end",
                  "EndConferenceOnExit": "false",
                  "Beep": "false"
              }
              reservation.conference(null, null, null, null, null, options)
              break
            case 'chat':
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
              try {
              reservation.call(
                from,
                urls.baseUrl + "/api/calls/outbound/dial/" + to + "/from/" + from + "/conf/" + taskSid,
                urls.baseUrl + "/api/taskrouter/event/",
                "true",
                "",
                "",
                urls.baseUrl + "/api/taskrouter/event"
              )
            } catch(error) {
              console.log("ERROR CALL", error)
            }

              break
            default:
              reservation.reject()
          }

        })
      })

  }
}

function activitiesUpdated(activities) {
  return {
    type: 'ACTIVITIES_UPDATED',
    activities: activities
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
    }
}

export function phoneHold(confSid, callSid) {
  return(dispatch, getState) => {
    return fetch(`/api/calls/conference/${confSid}/hold/${callSid}/true`,{method: "POST"})
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
        console.log(json)
        dispatch(requestTaskComplete(taskrouter.reservations[0]))
      })
  }
}

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

    return fetch(`/api/taskrouter/outbound`,
      {
        method: "POST",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
        body:
          JSON.stringify({
          To: phone.dialPadNumber,
          From: taskrouter.worker.attributes.phone_number,
          Agent: taskrouter.worker.friendlyName
        })

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
  return activities.find((activity) =>
    activity.friendlyName == activityName).sid;
}
