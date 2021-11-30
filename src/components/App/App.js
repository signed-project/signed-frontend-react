import React, { useState, useEffect } from "react";

import { BrowserRouter } from "react-router-dom";
import RouterProvider from "../layout/RouterProvider";
import MainRouts from "./MainRoutes";
import { layoutType, LayoutContext } from "../layout/LayoutProvider.jsx";

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

  const state = {
    theme: themeVal,
    toggleTheme: (val) => setThemeVal(val),
    promptToInstall,
  };

  return (
    <BrowserRouter basename={"/"}>
      <RouterProvider>
        <LayoutContext.Provider value={state}>
          <MainRouts />
        </LayoutContext.Provider>
      </RouterProvider>
    </BrowserRouter>
  );
};

export default App;
