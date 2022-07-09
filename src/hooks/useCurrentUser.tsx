import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import firebase from "../config"
import { removeUser, setUser } from "../store/userSlice"
import { State } from "../types/state"
import { defaultUserSettings } from "../utils/constants"
import { getAvatarURL } from "../utils/helpers"

export const useCurrentUser = () => {
  const dispatch = useDispatch()

  const serverUser = useSelector((state: State) => state.user.serverValue)
  const oldRealTimeDb = firebase.database()
  const onlineRef = oldRealTimeDb.ref(".info/connected") // Get a reference to the list of connections

  useEffect(() => {
    if (!serverUser) {
      return
    }

    const user = serverUser
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .get()
      .then((doc: any) => {
        if (!doc.exists) {
          const displayName =
            user.displayName ||
            `guest_${Math.random().toString(36).substring(2, 7)}`
          const providers =
            user.providerData?.map((p: any) => p.providerId) || []
          firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .set({
              displayName,
              email: user.email || "",
              emailVerified: user.emailVerified || false,
              photoURL: user.photoURL || getAvatarURL(),
              uid: user.uid,
              messagingToken: user.messagingToken || null,
              isAnonymous: user.isAnonymous || false,
              providers,
            })
        } else {
          onlineRef.on("value", (snapshot) => {
            oldRealTimeDb
              .ref(`/status/${user.uid}`)
              .onDisconnect() // Set up the disconnect hook
              .set("offline") // The value to be set for this key when the client disconnects
              .then(() => {
                // Set the Firestore User's online status to true
                firebase.firestore().collection("users").doc(user.uid).set(
                  {
                    status: "online",
                  },
                  { merge: true }
                )

                // Let's also create a key in our real-time database
                // The value is set to 'online'
                oldRealTimeDb.ref(`/status/${user.uid}`).set("online")
              })
          })
          if (!doc.data().messagingToken && user.messagingToken) {
            doc.ref.set(
              { messagingToken: user.messagingToken },
              { merge: true }
            )
          }
        }
      })
      .catch((error: any) => {
        console.log("Error getting document:", error)
      })

    const subscribe = firebase
      .firestore()
      .collection("users")
      .doc(serverUser?.uid)
      .onSnapshot((querySnapshot: any) => {
        const updatedUser = querySnapshot.data()
        const settings = { ...defaultUserSettings, ...updatedUser?.settings }
        dispatch(setUser({ ...updatedUser, settings }))
      })

    return () => {
      subscribe?.()
      onlineRef.off()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverUser])

  const forgotPassword = (email: string) =>
    firebase.auth().sendPasswordResetEmail(email)

  const verifyPasswordResetCode = (code: string) =>
    firebase.auth().verifyPasswordResetCode(code)

  const confirmPasswordReset = (code: string, newPassword: string) =>
    firebase.auth().confirmPasswordReset(code, newPassword)

  const signOutUser = () => {
    dispatch(removeUser())
  }

  return {
    signOutUser,
    forgotPassword,
    verifyPasswordResetCode,
    confirmPasswordReset,
  }
}
