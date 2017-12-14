const phone = (state = {
  currentCall: false,
  device: {},
  isMuted: false,
  isRecording: false,
  isHeld: false,
  recordingLegSid: "",
  warning: "",
  isRegistered: false,
  dialPadNumber: "",
}, action) => {
  console.log(action.type)
  switch (action.type) {
    case 'REGISTER_PHONE':
      return Object.assign({}, state, {
        isRegistered: false
      });
    case 'PHONE_DEVICE_UPDATED':
      return Object.assign({}, state, {
        isRegistered: true,
        device: action.device
      });
    case 'DIAL_PAD_UPDATED':
      return Object.assign({}, state, {
        dialPadNumber: action.number
      });
    case 'PHONE_CONN_UPDATED':
      return Object.assign({}, state, {
        currentCall: action.connection || false
      });
    case 'PHONE_MUTED':
      return Object.assign({}, state, {
        isMuted: action.boolean
      });
    case 'PHONE_HELD':
      return Object.assign({}, state, {
        isHeld: action.boolean
      });
    case 'PHONE_RECORD_ON':
      return Object.assign({}, state, {
        isRecording: true,
        recordingLegSid: action.callSid
      });
    case 'PHONE_RECORD_OFF':
      return Object.assign({}, state, {
        isRecording: false
      });
      case 'PHONE_WARNING':
        return Object.assign({}, state, {
          warning: action.warning
        });
    default:
      return state;
  }
}

export default phone;
