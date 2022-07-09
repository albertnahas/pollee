import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { Providers } from "./components/Providers/Providers"
import { registerSW } from "virtual:pwa-register"

const intervalMS = 15 * 60 * 1000

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
  onRegistered(r: any) {
    r &&
      setInterval(() => {
        r.update()
      }, intervalMS)
  },
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
)
