import { combineReducers } from 'redux'
import taskrouter from './taskrouter'
import phone from './phone'
import chat from './chat'

const taskRouterApp = combineReducers({
  taskrouter,
  phone,
  chat
});

export default taskRouterApp
