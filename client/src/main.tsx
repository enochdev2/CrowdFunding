import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { StateContextProvider } from "./context";
import App from "./App";
import "./index.css";
import { ErrorBoundary } from "./ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <Router>
        <StateContextProvider>
    <ErrorBoundary>
          <App />
    </ErrorBoundary>
        </StateContextProvider>
      </Router>
  </React.StrictMode>
);


