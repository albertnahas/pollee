// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js")

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyA8fheYw9NogNjfy2XESWC4VMyTr42fnFI",
  authDomain: "pollee.firebaseapp.com",
  databaseURL: "https://pollee-default-rtdb.firebaseio.com",
  projectId: "pollee",
  storageBucket: "pollee.appspot.com",
  messagingSenderId: "641037426872",
  appId: "1:641037426872:web:f1516d37889cfbfcad144d",
  measurementId: "G-FV2GE52841",
}

firebase.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
