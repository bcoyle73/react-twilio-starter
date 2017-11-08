'use strict';

import React from 'react';
import Phone from './phone';
import {phoneMute, phoneHangup, phoneButtonPushed, phoneHold, phoneCall, dialPadUpdated, requestTaskComplete, requestConfTerminate} from '../../actions'
import { connect } from 'react-redux'


const mapStateToProps = (state) => {
  const { phone, taskrouter } = state
  let conf = ""
  let caller = ""
  if (taskrouter.conference) {
    conf = taskrouter.conference.sid
    caller = taskrouter.conference.participants.customer
  }
  const reservation = taskrouter.reservations[0]

  console.log(phone.currentCall)
  return {
    status: phone.currentCall._status,
    isMuted: phone.isMuted,
    isRecording: phone.isRecording,
    recordingCallSid: phone.recordingLegSid,
    callSid: caller,
    confSid: conf,
    reservation: reservation,
    warning: phone.warning
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onMuteClick: () => {
      dispatch(phoneMute())
    },
    onHangupClick: (reservation, confSid) => {
      console.log(reservation)
      dispatch(phoneHangup())
      //dispatch(requestTaskComplete(reservation))
      dispatch(requestConfTerminate(confSid))
    },
    onHoldClick: (confSid, callSid) => {
      dispatch(phoneHold(confSid, callSid))
    },
    onRecordClick: (confSid, callSid) => {
      dispatch(phoneHold(confSid, callSid))
    },
    onCallClick: () => {
      dispatch(phoneCall())
    },
    onNumberEntryChange: (number) => {
      dispatch(dialPadUpdated(number))
    },
    onKeyPadNumberClick: (key) => {
      dispatch(phoneButtonPushed(key))
    }
  }
}


const PhoneContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Phone)

export default PhoneContainer
