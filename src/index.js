import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux'; 
import reducers from './OrderTracking/reducer';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import { composeWithDevTools } from 'redux-devtools-extension';

let store = createStore(reducers,  composeWithDevTools());

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
