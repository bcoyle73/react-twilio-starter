import React, { PropTypes } from 'react';

const MessageBox = ({messages}) => {
  const thread = messages.map((message) =>
    <div className="messagecardthread-inbound">
      <span className="message-text">message.body</span>
    </div>
  )
  return (
    <div className="message-container">
      { thread }
    </div>
  )
}

MessageBox.propTypes = {

}

MessageBox.defaultProps = { messages: [] };

export default MessageBox;
