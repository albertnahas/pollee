/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react"
import firebase from "../config"

export const useAuthRedirect = () => {
  const [authError, setAuthError] = useState()

  firebase
    .auth()
    .getRedirectResult()
    .then((result: any) => {
      if (result.credential) {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken
        // ...
      }
      // The signed-in user info.
      var user = result.user
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
      setAuthError(error)
      // The email of the user's account used.
      var email = error.email
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential
      // ...
    })

  return { authError }
}
