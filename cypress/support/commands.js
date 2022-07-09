/* eslint-disable no-undef */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/firestore"
import { attachCustomCommands } from "cypress-firebase"

const fbConfig = {
  apiKey: "AIzaSyA8fheYw9NogNjfy2XESWC4VMyTr42fnFI",
  authDomain: "pollee.firebaseapp.com",
  databaseURL: "https://pollee-default-rtdb.firebaseio.com",
  projectId: "pollee",
  storageBucket: "pollee.appspot.com",
  messagingSenderId: "641037426872",
  appId: "1:641037426872:web:f1516d37889cfbfcad144d",
  measurementId: "G-FV2GE52841",
}

// Emulate RTDB if Env variable is passed
const rtdbEmulatorHost = Cypress.env("FIREBASE_DATABASE_EMULATOR_HOST")
if (rtdbEmulatorHost) {
  fbConfig.databaseURL = `http://${rtdbEmulatorHost}?ns=${fbConfig.projectId}`
}

firebase.initializeApp(fbConfig)

// Emulate Firestore if Env variable is passed
const firestoreEmulatorHost = Cypress.env("FIRESTORE_EMULATOR_HOST")
if (firestoreEmulatorHost) {
  firebase.firestore().settings({
    host: firestoreEmulatorHost,
    ssl: false,
  })
}

const authEmulatorHost = Cypress.env("FIREBASE_AUTH_EMULATOR_HOST")
if (authEmulatorHost) {
  firebase.auth().useEmulator(`http://${authEmulatorHost}/`)
  console.debug(`Using Auth emulator: http://${authEmulatorHost}/`)
}

attachCustomCommands({ Cypress, cy, firebase })

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
