import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import logo from './logo.svg';
import { appActions } from './api/storage/app';
import './App.css';




const App = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(appActions.setTest(777))
  }, [dispatch])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
