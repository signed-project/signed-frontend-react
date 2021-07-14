import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import LayoutProvider from '../layout/LayoutProvider';
import MainRouts from './MainRoutes';
import { layoutType } from '../layout/LayoutProvider.jsx';

const App = () => {
  const [themeVal, setThemeVal] = useState(layoutType.showLayout);
  const [basename, setBasename] = useState('/');
  // const isAuth = useSelector(state => state.user.isAuth);

  const state = {
    theme: themeVal,
    toggleTheme: (val) => setThemeVal(val)
  };

  return (
    <BrowserRouter basename={'/'} >
      <LayoutProvider.Provider value={state}>
        <MainRouts />
      </LayoutProvider.Provider>
    </BrowserRouter >
  );
};

export default App;
