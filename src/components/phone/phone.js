import NumberEntry from './NumberEntry';
import KeyPad from './KeyPad';
import CallControl from './CallControl';

import React, { PropTypes } from 'react';

const Phone = ({status, onMuteClick, onKeyPadNumberClick, onNumberEntryChange, onHangupClick, onCallClick, onHoldClick, onRecordClick, isMuted, isHeld, isRecording, recordingCallSid, task}) => (
  <div id="dialer">
    <NumberEntry entry={onNumberEntryChange} />
    <KeyPad buttonPress={onKeyPadNumberClick} />
    <CallControl call={onCallClick} status={status} isMuted={ isMuted } isHeld={isHeld} recordingCallSid={ recordingCallSid } isRecording={ isRecording } hangup={onHangupClick} mute={ onMuteClick } hold={ onHoldClick } record={ onRecordClick } task={task}/>
  </div>
)

Phone.propTypes = {

}

export default Phone;
