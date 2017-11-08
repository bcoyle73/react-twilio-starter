import MessageBox from './MessageBox';
import MessageEntry from './MessageEntry';
import MessageControl from './MessageControl'

import React, { PropTypes } from 'react';

const Messenger = ({messages}) => (
  <div className="messages">
    <MessageBox messages={messages} />
    <MessageEntry />
    <MessageControl />
  </div>
)

Messenger.propTypes = {

}

export default Messenger;
