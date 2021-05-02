import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assets/css/index.scss';
import App from './components/App/App';
import store from './api/storage';
import { Provider as StoreProvider } from 'react-redux';

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

/**
 * @tutorial
 * @param "homepage": "/public", in @module package.json for bould on aws s3 hosting
  */


