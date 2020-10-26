import React from "react"
import ReactDOM from "react-dom"

import { App } from "./App"
import { BoggleProvider } from "./context"

import "./index.css"

ReactDOM.render(
  <BoggleProvider>
    <App />
  </BoggleProvider>,

  document.getElementById("root")
)