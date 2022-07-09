import firebase from "../config"
import { User } from "../types/user"

export const useUser = () => {
  const updateUser = (user: User) => {
    return new Promise((resolve, reject) => {
      const usersRef = firebase.firestore().collection("users").doc(user.uid)
      return usersRef
        .get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            usersRef.update({ ...user })
            resolve(true)
          } else {
            reject(false)
          }
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  const linkAccount = (
    provider: firebase.auth.AuthProvider,
    user?: User | null
  ) => {
    return firebase
      .auth()
      .currentUser?.linkWithPopup(provider)
      .then((res: any) => {
        const providers =
          res.user.providerData?.map((p: any) => p.providerId) || []
        return updateUser({
          ...user,
          email: res.user?.email || user?.email || "",
          emailVerified:
            res.user?.emailVerified || user?.emailVerified || false,
          isAnonymous: res.user?.isAnonymous,
          providers,
        })
      })
  }

  const deleteAccount = () => {
    const user = firebase.auth().currentUser
    return user?.delete()
  }

  return { updateUser, linkAccount, deleteAccount }
}
