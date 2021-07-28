import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import LayoutProvider from '../layout/LayoutProvider';
import MainRouts from './MainRoutes';
import { layoutType } from '../layout/LayoutProvider.jsx';

const App = () => {
  const [themeVal, setThemeVal] = useState(layoutType.showLayout);

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
