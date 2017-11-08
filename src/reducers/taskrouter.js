
const taskrouter = (state = {
  isRegistering: false,
  worker: {},
  activities: [],
  channels: [],
  reservations: [],
  conference: {sid: "", participants: {customer: ""}},
}, action) => {
  console.log(action.type)
  switch (action.type) {
    case 'REGISTER_WORKER':
      return Object.assign({}, state, {
        isRegistering: true
      });
    case 'WORKER_UPDATED':
      return Object.assign({}, state, {
        isRegistering: false,
        worker: action.worker
      });
    case 'ACTIVITIES_UPDATED':
      return Object.assign({}, state, {
        activities: action.activities
      });
    case 'CHANNELS_UPDATED':
      return Object.assign({}, state, {
        channels: action.channels
      });
    case 'RESERVATIONS_UPDATED':
      return Object.assign({}, state, {
        reservations: action.reservations
      });
    case 'RESERVATION_CREATED':
      return Object.assign({}, state, {
        reservations: [
          ...state.reservations,
          action.reservation
        ],
        conference: action.reservation.task.attributes.conference
      })
    default:
      return state;
  }
}

export default taskrouter;
