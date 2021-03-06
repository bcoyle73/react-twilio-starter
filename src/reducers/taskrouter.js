
const taskrouter = (state = {
  isRegistering: false,
  connectionStatus: "disconnected",
  workerClient: {},
  worker: {},
  activities: [],
  channels: [],
  tasks: [],
  error: false,
  errorMessage: ""
}, action) => {
  switch (action.type) {
    case 'CONNECTION_UPDATED':
      return Object.assign({}, state, {
        connectionStatus: action.status
      });
    case 'ERROR_TASKROUTER':
      return Object.assign({}, state, {
        error: true,
        errorMessage: action.message
      });
    case 'REGISTER_WORKER':
      return Object.assign({}, state, {
        isRegistering: true
      });
    case 'WORKER_UPDATED':
      return Object.assign({}, state, {
        isRegistering: false,
        worker: action.worker
      });
    case 'WORKER_CLIENT_UPDATED':
      return Object.assign({}, state, {
        workerClient: action.worker
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
    case 'TASK_UPDATED':
      return Object.assign({}, state, {
        tasks: [
          ...state.tasks,
          action.task
        ],
      });
    case 'TASK_COMPLETED':
    return Object.assign({}, state, {
      tasks: state.tasks.filter(task => task.sid !== action.task.sid)
    });
    default:
      return state;
  }
}

export default taskrouter;
