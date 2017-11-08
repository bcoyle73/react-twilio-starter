import NumberEntry from './NumberEntry';
import KeyPad from './KeyPad';
import CallControl from './CallControl';

import React, { PropTypes } from 'react';

const Phone = ({status, onMuteClick, onKeyPadNumberClick, onNumberEntryChange, onHangupClick, onCallClick, onHoldClick, onRecordClick, isMuted, isRecording, recordingCallSid, callSid, confSid, reservation}) => (
  <div id="dialer">
    <NumberEntry entry={onNumberEntryChange} />
    <KeyPad buttonPress={onKeyPadNumberClick} />
    <CallControl call={onCallClick} status={status} isMuted={ isMuted } recordingCallSid={ recordingCallSid } isRecording={ isRecording } hangup={onHangupClick} mute={ onMuteClick } hold={ onHoldClick } record={ onRecordClick } callSid={callSid} confSid={confSid} reservation={reservation}/>
  </div>
)

Phone.propTypes = {

}

export default Phone;
