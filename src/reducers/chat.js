const chat = (state = {
  client: false,
  isRegistered: false,
  currentChannel: [],
  messages:[],
  videoParticipant: null
}, action) => {
  switch (action.type) {
    case 'REGISTER_CHAT':
      return Object.assign({}, state, {
        isRegistered: false
      });
    case 'CHAT_CLIENT_UPDATED':
      return Object.assign({}, state, {
        isRegistered: true,
        client: action.client
      });
    case 'CHAT_ADD_MESSAGE':
      return Object.assign({}, state, {
        messages: [
          ...state.messages,
          action.message
        ]
      })
    case 'CHAT_UPDATE_CHANNEL':
      return Object.assign({}, state, {
        currentChannel: action.channel
      });
    case 'VIDEO_PARTICIPANT_CONNECTED':
      console.log(action.participant, "reducer partc")
      return Object.assign({}, state, {
        videoParticipant: action.participant
      });
    default:
      return state;
  }
}

export default chat;
