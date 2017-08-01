import NumberEntry from './NumberEntry';
import KeyPad from './KeyPad';
import CallControl from './CallControl';

import React, { PropTypes } from 'react';

const Phone = ({status, onMuteClick, onKeyPadNumberClick, onNumberEntryChange, onHangupClick, onCallClick, onHoldClick, muted, callSid}) => (
  <div id="dialer">
    <NumberEntry entry={onNumberEntryChange} />
    <KeyPad buttonPress={onKeyPadNumberClick} />
    <CallControl call={onCallClick} status={status} muted={ muted } hangup={onHangupClick} mute={ onMuteClick } hold={ onHoldClick } callSid={callSid}/>
  </div>
)

Phone.propTypes = {

}

export default Phone;
