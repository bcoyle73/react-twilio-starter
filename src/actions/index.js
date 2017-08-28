import fetch from 'isomorphic-fetch'

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


export function requestAcceptReservation() {
  return (dispatch, getState) => {
    const { taskrouter } = getState()
    let requestedActivitySid = getActivitySid(taskrouter.activities, newStateName)
    taskrouter.worker.update("ActivitySid", requestedActivitySid, (error, worker) => {
      if (error) {
        console.log(error);
      } else {
        dispatch(workerUpdated(worker))
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
      } else {
        dispatch(workerUpdated(worker))
      }
    })
  }
}

export function requestWorker(workerSid) {
  return (dispatch, getState) => {
    console.log(workerSid)
    dispatch(registerWorker())
    return fetch(`/api/tokens/worker/${workerSid}`)
      .then(response => response.text())
      .then(token => {
        console.log(token)
        let worker = new Twilio.TaskRouter.Worker(token)
        //worker.fetchChannels((error, channels) => {
        //   dispatch(channelsUpdated(channels.data))
        //})
        worker.activities.fetch((error, activityList) => {
           dispatch(activitiesUpdated(activityList.data))
        })
        dispatch(workerUpdated(worker))
        worker.on("ready", (worker) => {
          dispatch(workerUpdated(worker))
          dispatch(requestChat('bcoyle'))
          dispatch(requestPhone('bcoyle'))
          console.log(worker)
        })
        worker.on('activity.update', (worker) => {
          dispatch(workerUpdated(worker))
        })
        worker.on('token.expired', () => {
          console.log('EXPIRED')
          dispatch(requestWorker(workerSid))
        })
        worker.on('error', (error) => {
          console.log("Websocket had an error: "+ error.response + " with message: "+error.message)
        })
        worker.on("disconnected", function() {
          console.log("Websocket has disconnected");
        })
        worker.on('reservation.timeout', (reservation) => {
          console.log("Reservation Timed Out")
        })
        worker.on('reservation.created', (reservation) => {
          console.log("Incoming reservation")
          console.log(reservation)
          dispatch(reservationCreated(reservation))
          switch (reservation.task.taskChannelUniqueName) {
            case 'voice':
              reservation.conference()
              break
            case 'chat':
              //reservation.accept()
              dispatch(chatNewRequest(reservation.task))
              break
            case 'video':
              reservation.accept()
              dispatch(videoRequest(reservation.task))
              break
            case 'custom1':
              // do nothing. server will accept
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
    return fetch(`/api/tokens/phone/${clientName}`)
      .then(response => response.text())
      .then(text => {
        Twilio.Device.setup(text)
        Twilio.Device.ready((device) => {
          console.log("phone is ready");
          dispatch(phoneDeviceUpdated(device))
        })
        Twilio.Device.incoming(function(connection) {
          connection.accept();
        })
        Twilio.Device.connect((conn) => {
          console.log("incoming call")
          console.log(conn._direction)
          // Call is connected. Register callback for events to make sure UI is updated
          conn.mute((boolean, connection) => {
            dispatch(phoneMuted(boolean))
          })
          conn.on('warning', (warning) => {
            dispatch(phoneWarning(warning))
          })
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

export function requestHold(callSid) {
  return(dispatch, getState) => {
    return fetch(`/api/calls/hold/${callSid}`)
      .then(response => response.json())
      .then( json => {
        console.log(json)
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

    phone.currentCall.sendDigits()
  }
}

export function phoneCall() {
  return (dispatch, getState) => {
    const { phone } = getState()
    console.log("call clicked to " + phone.dialPadNumber)
    const agent_call = phone.device.connect({To: phone.dialPadNumber})
    /*
    return fetch(`/api/calls/outbound/dial`,
      {
        method: "POST",
        body: { "to": phone.dialPadNumber}
      })
      .then(response => response.json())
      .then( json => {
        console.log(json)
      })
    */
  }
}

export function phoneDialCustomer(number) {
  return(dispatch, getState) => {
    //return fetch(`/api/calls/confin/${number}`)
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
    // TODO: Dispatch action that is registering
    return fetch(`/api/tokens/chat/${identity}/browser`)
      .then(response => response.json())
      .then(json => {
        try {
          let chatClient = new Twilio.Chat.Client(json.token, {logLevel: 'debug'})
          dispatch(chatClientUpdated(chatClient))
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

function videoParticipantConnected(participant) {
  return {
    type: 'VIDEO_PARTICIPANT_CONNECTED',
    participant: participant
  }
}

export function chatNewRequest(task) {
  return (dispatch, getState) => {
    const currState = getState()
    console.log(currState)
    currState.chat.client.getChannelBySid('CH33ec0f0f793c4893a5131deff1080bdf')
      .then(channel => dispatch(chatUpdateChannel(channel)))

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

const getActivitySid = (activities, activityName) => {
  return activities.find((activity) =>
    activity.friendlyName == activityName).sid;
}
