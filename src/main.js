import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './configureStore'
import taskRouterApp from './reducers'
import AgentWorkSpaceContainer from './components/workspace/AgentWorkSpaceContainer'

require('./styles/Reset.css');
require('./styles/App.css');

let store = configureStore()

render(
  <Provider store={store}>
    <AgentWorkSpaceContainer />
  </Provider>,
  document.getElementById('app')
)
