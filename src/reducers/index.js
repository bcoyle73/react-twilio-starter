import { combineReducers } from 'redux'
import taskrouter from './taskrouter'
import phone from './phone'
import chat from './chat'
import sync from './sync'

const taskRouterApp = combineReducers({
  taskrouter,
  phone,
  chat,
  sync
});

export default taskRouterApp
