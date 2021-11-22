import React, { useState, useEffect } from "react";

import { BrowserRouter } from "react-router-dom";
import LayoutProvider from "../layout/LayoutProvider";
import MainRouts from "./MainRoutes";
import { layoutType } from "../layout/LayoutProvider.jsx";

const App = () => {
  const [themeVal, setThemeVal] = useState(layoutType.showLayout);
  const [prompt, setPrompt] = useState(null);

  const promptToInstall = () => {
    if (prompt) {
      return prompt.prompt();
    }
    return Promise.reject(
      new Error(
        'Tried installing before browser sent "beforeinstallprompt" event'
      )
    );
  };

  const state = {
    theme: themeVal,
    toggleTheme: (val) => setThemeVal(val),
    promptToInstall,
  };

  useEffect(() => {
    const ready = (e) => {
      e.preventDefault();
      setPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", ready);

    return () => {
      window.removeEventListener("beforeinstallprompt", ready);
    };
  }, []);

  return (
    <BrowserRouter basename={"/"}>
      <LayoutProvider.Provider value={state}>
        <MainRouts />
      </LayoutProvider.Provider>
    </BrowserRouter>
  );
};

export default App;
