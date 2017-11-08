import React from 'react';

import Messenger from './Messenger';

import { connect } from 'react-redux'
import {requestChat} from '../../actions'


const mapStateToProps = (state) => {
  const { chat } = state

  return {
    messages: chat.messages,
  }
}

const MessageBoxContainer = connect(mapStateToProps)(Messenger)

export default MessageBoxContainer
