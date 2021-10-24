import * as React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { StyledEngineProvider } from "@mui/material/styles";

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <App />
  </StyledEngineProvider>,
  document.querySelector("#root")
);
