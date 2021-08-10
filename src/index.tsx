import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { auth } from "./firebaseSetup";

auth.onAuthStateChanged(() => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
});
