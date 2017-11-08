import Button from '../common/Button.js'
import React, { PropTypes } from 'react';

const MessageControl = () => (
  <div id="action-button-container">
    <div id="action-buttons">
      <Button classes={["call"]} buttonText="Send" />
    </div>
  </div>
)

MessageControl.propTypes = {

}

export default MessageControl;
