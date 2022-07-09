/* eslint-disable no-debugger */
import { useEffect, useState } from "react"
import "./App.css"
import withFirebaseAuth from "react-with-firebase-auth"
import { useDispatch, useSelector } from "react-redux"
import firebase, { getToken, onMessageListener } from "./config"
import { TopBar } from "./components/TopBar/TopBar"
import { User } from "./types/user"
import { State } from "./types/state"
import { SplashScreen } from "./molecules/SplashScreen/SplashScreen"
import { useCurrentUser } from "./hooks/useCurrentUser"
import { setServerUser } from "./store/userSlice"
import Nav from "./components/Nav/Nav"
import { usePwa } from "./hooks/usePwa"
import { Alert, Box, Snackbar } from "@mui/material"
import { AlertDialog } from "./molecules/AlertDialog/AlertDialog"
import { setSnackbar, snackbarSelector } from "./store/snackbarSlice"
import { alertSelector, setAlertOpen } from "./store/alertSlice"
import { SideDrawer } from "./components/SideDrawer/SideDrawer"
import ModalDialog from "./molecules/ModalDialog/ModalDialog"
import { loginModalSelector, setLoginModal } from "./store/loginModalSlice"
import { Login } from "./components/Auth/Login/Login"
import { DonationDialog } from "./molecules/DonationDialog/DonationDialog"
import { FeedbackForm } from "./molecules/FeedbackForm/FeedbackForm"
import { feedbackSelector, setFeedback } from "./store/feedbackSlice"
import { AppTabs } from "./components/AppTabs/AppTabs"

const firebaseAppAuth = firebase.auth()

export const googleProvider = new firebase.auth.GoogleAuthProvider()
googleProvider.addScope("https://www.googleapis.com/auth/user.birthday.read")
export const facebookProvider = new firebase.auth.FacebookAuthProvider()

export const providers = {
  googleProvider,
  facebookProvider,
}

const createComponentWithAuth = withFirebaseAuth({
  providers,
  firebaseAppAuth,
})

const App = function ({
  /** These props are provided by withFirebaseAuth HOC */
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  // signInWithGithub,
  // signInWithTwitter,
  signInAnonymously,
  signOut,
  // setError,
  user,
  error,
  loading,
}: Props) {
  const currentUser = useSelector((state: State) => state.user.value)
  const snackbar = useSelector(snackbarSelector)
  const openFeedbackModal = useSelector(feedbackSelector)

  const {
    signOutUser,
    forgotPassword,
    verifyPasswordResetCode,
    confirmPasswordReset,
  } = useCurrentUser()
  const { handleInstallClick, deferredPrompt } = usePwa()
  const dispatch = useDispatch()

  const [notification, setNotification] = useState({ title: "", body: "" })
  const [openDonation, setOpenDonation] = useState(false)

  const alertWidget = useSelector(alertSelector)
  const loginModal = useSelector(loginModalSelector)

  const signInWithGoogle = () => {
    firebase.auth().signInWithRedirect(googleProvider)
  }

  const signInWithFacebook = () => {
    firebase.auth().signInWithRedirect(facebookProvider)
  }

  const initNotificationListener = () => {
    onMessageListener()
      .then((payload: any) => {
        setNotification({
          title: payload.notification.title,
          body: payload.notification.body,
        })
      })
      .catch((err) => console.log("failed: ", err))
  }

  useEffect(() => {
    async function initUser() {
      try {
        if (user && user.uid) {
          const messagingToken = await getToken()
          if (messagingToken) {
            user.messagingToken = messagingToken
          }

          dispatch(setServerUser(user))
          initNotificationListener()
        } else if (user === null) {
          signOutUser()
        }
      } catch (error) {
        alert(error)
      }
    }
    initUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const signOutFromApp = () => {
    signOut?.()
    signOutUser()
  }

  const handleSnackbarClose = (event: any, reason: string) => {
    if (reason === "clickaway") {
      return
    }
    setTimeout(() => {
      dispatch(setSnackbar({ open: false, message: "" }))
    }, 1000)
  }

  return currentUser === undefined ? (
    <SplashScreen />
  ) : (
    <Box sx={{ bgcolor: "background.paper" }}>
      <TopBar
        handleInstallClick={handleInstallClick}
        signOut={signOutFromApp}
        deferredPrompt={deferredPrompt}
        notification={notification}
        setNotification={setNotification}
        donate={() => setOpenDonation(true)}
      />
      <Nav
        createUserWithEmailAndPassword={createUserWithEmailAndPassword}
        error={error}
        loading={loading}
        signInWithEmailAndPassword={signInWithEmailAndPassword}
        signInAnonymously={signInAnonymously}
        signInWithGoogle={signInWithGoogle}
        signInWithFacebook={signInWithFacebook}
        forgotPassword={forgotPassword}
        verifyPasswordResetCode={verifyPasswordResetCode}
        confirmPasswordReset={confirmPasswordReset}
        signOut={signOutFromApp}
      />
      <AppTabs />
      <SideDrawer
        signOut={signOutFromApp}
        donate={() => setOpenDonation(true)}
      />
      <AlertDialog
        title={alertWidget.title}
        message={alertWidget.message}
        open={alertWidget.open || false}
        setOpen={(open: boolean) => dispatch(setAlertOpen(open))}
      />
      <ModalDialog
        open={loginModal || false}
        setOpen={(open: boolean) => dispatch(setLoginModal(open))}
        maxWidth="md"
      >
        <Login
          signInWithGoogle={signInWithGoogle}
          signInWithFacebook={signInWithFacebook}
          signInAnonymously={signInAnonymously}
          error={error}
          onSubmit={signInWithEmailAndPassword}
          afterSubmit={() => dispatch(setLoginModal(false))}
          loading={loading}
          modal={true}
        />
      </ModalDialog>
      <ModalDialog
        closeButton={true}
        open={openFeedbackModal || false}
        setOpen={(open) => {
          dispatch(setFeedback(open))
        }}
        title={"Feedback"}
        maxWidth="xs"
      >
        <FeedbackForm />
      </ModalDialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.duration}
        onClose={handleSnackbarClose}
      >
        <Alert severity={snackbar.type} sx={{ bottom: "72px" }}>
          {snackbar.message} {snackbar.cta}
        </Alert>
      </Snackbar>
      <DonationDialog
        open={openDonation}
        onClose={() => setOpenDonation(false)}
      />
    </Box>
  )
}

interface Props {
  signInWithEmailAndPassword?: (email: string, password: string) => Promise<any>
  createUserWithEmailAndPassword?: (
    email: string,
    password: string
  ) => Promise<any>
  signInWithGoogle?: () => Promise<any>
  signInWithFacebook?: () => Promise<any>
  // signInWithGithub: PropTypes.object,
  // signInWithTwitter: PropTypes.object,
  signInAnonymously?: () => Promise<any>
  signOut?: () => Promise<any>
  // setError: PropTypes.object,
  user?: User
  error?: string
  loading?: boolean
}

export default createComponentWithAuth(App)
