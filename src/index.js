import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import 'normalize.css';
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


