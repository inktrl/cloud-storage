import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { store } from './reducers'
import { Provider } from 'react-redux'

import '../src/assets/css/font-awesome.min.css'
import './index.scss'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)