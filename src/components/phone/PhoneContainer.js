'use strict';

import React from 'react';
import Phone from './phone';
import {phoneMute, phoneHangup, phoneButtonPushed, phoneHold, phoneCall, dialPadUpdated} from '../../actions'
import { connect } from 'react-redux'


const mapStateToProps = (state) => {
  const { phone } = state
  console.log(phone.currentCall)
  return {
    status: phone.currentCall._status,
    muted: phone.muted,
    callSid: "123",
    warning: phone.warning
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onMuteClick: () => {
      dispatch(phoneMute())
    },
    onHangupClick: () => {
      dispatch(phoneHangup())
    },
    onHoldClick: () => {
      dispatch(phoneHold())
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
