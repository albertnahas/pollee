const path = require("path")
const { startDevServer } = require("@cypress/vite-dev-server")
const admin = require("firebase-admin")
const cypressFirebasePlugin = require("cypress-firebase").plugin

module.exports = (on, config) => {
  on("dev-server:start", (options) => {
    return startDevServer({
      options,
      viteConfig: {
        configFile: path.resolve(__dirname, "..", "..", "vite.config.ts"),
      },
    })
  })
  const extendedConfig = cypressFirebasePlugin(on, config, admin)
  require("@cypress/code-coverage/task")(on, extendedConfig)

  return extendedConfig
}
