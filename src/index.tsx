import React from "react";
import ReactDOM from "react-dom";
import App from "./views/Popup/App";
import "bootstrap/scss/bootstrap.scss";
import "./custom.scss";
import "./index.scss";
import { ThemeProvider } from "./providers/ThemeProvider";
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
