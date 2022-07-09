import firebase from "../config"

export const useAnalytics = () => {
  const logEvent = (eventName: string, data?: any) => {
    firebase.analytics().logEvent(eventName, data)
  }

  return { logEvent }
}
