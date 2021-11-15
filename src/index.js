import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./assets/css/index.scss";
import App from "./components/App/App";
import store from "./api/storage";
import { Provider as StoreProvider } from "react-redux";

import AddToHomescreen from "react-add-to-homescreen";

const handleAddToHomescreenClick = () => {
  alert(`
    1. Open Share menu
    2. Tap on "Add to Home Screen" button
  `);
};

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <AddToHomescreen onAddToHomescreenClick={handleAddToHomescreenClick} />
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
