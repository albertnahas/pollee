import { FC } from "react"
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom"
import { About } from "../ControlPages/About/About"
import { Terms } from "../ControlPages/Terms/Terms"
import { ControlPage } from "../ControlPages/ControlPage"
import { Privacy } from "../ControlPages/Privacy/Privacy"
import { Contact } from "../ControlPages/Contact/Contact"
import { styled } from "@mui/system"
import { Login } from "../Auth/Login/Login"
import { Register } from "../Auth/Register/Register"
import { useNavigate } from "react-router-dom"
import { Box } from "@mui/material"
import { useSelector } from "react-redux"
import { userSelector } from "../../store/userSlice"
import { Home } from "../Home/Home"
import { Profile } from "../Profile/Profile"
import PageNotFound from "../ControlPages/PageNotFound/PageNotFound"
import { ForgotPassword } from "../Auth/ForgotPassword/ForgotPassword"
import { ResetPassword } from "../Auth/ResetPassword/ResetPassword"
import { Post } from "../Post/Post"
import { MyPolls } from "../MyPolls/MyPolls"

const Wrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "hasMarginBottom",
})<{ hasMarginBottom?: boolean }>(({ theme, hasMarginBottom }) => ({
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  flexGrow: 1,
  ...(hasMarginBottom && {
    marginBottom: 60,
  }),
}))

const Nav: FC<Props> = function ({
  signInWithGoogle,
  signInWithFacebook,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  forgotPassword,
  verifyPasswordResetCode,
  confirmPasswordReset,
  signOut,
  loading,
  error,
}) {
  const navigate = useNavigate()
  const user = useSelector(userSelector)
  return (
    <Wrapper hasMarginBottom={!!user}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <Login
              signInWithGoogle={signInWithGoogle}
              signInWithFacebook={signInWithFacebook}
              signInAnonymously={signInAnonymously}
              error={error}
              onSubmit={signInWithEmailAndPassword}
              loading={loading}
            />
          }
        />
        <Route
          path="/register"
          element={<Register onSubmit={createUserWithEmailAndPassword} />}
        />
        <Route
          path="/forgotPassword"
          element={
            <ForgotPassword
              error={error}
              onSubmit={forgotPassword}
              loading={loading}
              afterSubmit={() => navigate("/")}
            />
          }
        />
        <Route
          path="/resetPassword"
          element={
            <ResetPassword
              verifyPasswordResetCode={verifyPasswordResetCode}
              confirmPasswordReset={confirmPasswordReset}
              loading={loading}
              afterSubmit={() => navigate("/login")}
            />
          }
        />
        <Route
          path="/about"
          element={
            <ControlPage>
              <About />
            </ControlPage>
          }
        />
        <Route
          path="/terms"
          element={
            <ControlPage>
              <Terms />
            </ControlPage>
          }
        />
        <Route
          path="/privacy"
          element={
            <ControlPage>
              <Privacy />
            </ControlPage>
          }
        />
        <Route
          path="/contact"
          element={
            <ControlPage>
              <Contact />
            </ControlPage>
          }
        />
        <Route
          path="/admin"
          element={
            <ControlPage>
              <Contact />
            </ControlPage>
          }
        />
        <Route element={<RequireAuth />}>
          {/* <Route path="/settings" element={<Settings />} /> */}
          <Route path="/profile" element={<Profile signOut={signOut} />} />
          <Route path="/post" element={<Post />} />
          <Route path="/polls" element={<MyPolls />} />
        </Route>
        <Route path="/__cypress/*" element={<Navigate to="/" />} />
        <Route path="/404" element={<PageNotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </Wrapper>
  )
}

export default Nav

interface Props {
  signInWithEmailAndPassword?: (email: string, password: string) => Promise<any>
  createUserWithEmailAndPassword?: (
    email: string,
    password: string
  ) => Promise<any>
  forgotPassword?: (email: string) => Promise<any>
  confirmPasswordReset?: (code: string, password: string) => Promise<any>
  verifyPasswordResetCode?: (code: string) => Promise<any>
  signInWithGoogle?: () => void
  signInWithFacebook?: () => void
  signInAnonymously?: () => Promise<any>
  signOut?: () => void
  error?: string
  loading?: boolean
}

function RequireAuth() {
  const user = useSelector(userSelector)

  let location = useLocation()

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} />
  }

  return <Outlet />
}
