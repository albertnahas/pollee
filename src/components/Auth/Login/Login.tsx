import React, { FC } from "react"
import * as Yup from "yup"
import { useFormik } from "formik"

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import { Facebook as FacebookIcon } from "../../../icons/facebook"
import { Google as GoogleIcon } from "../../../icons/google"
import { useSelector } from "react-redux"
import { State } from "../../../types/state"
import { Link, Navigate } from "react-router-dom"

export var Login: FC<Props> = function (props) {
  const user = useSelector((state: State) => state.user.value)
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {
      props
        .onSubmit?.(values.email, values.password)
        .then((res: any) => {
          if (res.message) {
            setErrors({
              email: res.message,
            })
            setSubmitting(false)
          } else {
            props.afterSubmit?.()
          }
        })
        .catch((e: any) => {
          console.log(e)
        })
    },
  })

  const guestFormik = useFormik({
    initialValues: {},
    onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {
      props
        .signInAnonymously?.()
        .then((res: any) => {
          if (res.message) {
            setSubmitting(false)
          }
          props.afterSubmit?.()
        })
        .catch((e: any) => {
          console.log(e)
        })
    },
  })

  return user === null || props.modal ? (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexGrow: 1,
        minHeight: "100%",
        textAlign: "center",
        pb: 2,
      }}
      aria-label="login container"
    >
      <Container maxWidth="sm">
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ my: 3 }}>
            <Typography
              color="textPrimary"
              variant="h1"
              sx={{ fontSize: "2.1rem", fontWeight: 400 }}
            >
              Sign in
            </Typography>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Sign in and get started
            </Typography>
            {props.error && (
              <Typography color="error.main" gutterBottom variant="body2">
                {props.error}
              </Typography>
            )}
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Button
                color="info"
                fullWidth
                startIcon={<FacebookIcon />}
                onClick={props.signInWithFacebook}
                size="large"
                variant="contained"
              >
                Login with Facebook
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                fullWidth
                color="error"
                startIcon={<GoogleIcon />}
                onClick={props.signInWithGoogle}
                size="large"
                variant="contained"
              >
                Continue with Google
              </Button>
            </Grid>
          </Grid>
          <Box
            sx={{
              pb: 1,
              pt: 3,
            }}
          >
            <Typography align="center" color="textSecondary" variant="body1">
              or login with email address
            </Typography>
          </Box>
          <TextField
            error={Boolean(formik.touched.email && formik.errors.email)}
            fullWidth
            helperText={formik.touched.email && formik.errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="email"
            value={formik.values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(formik.touched.password && formik.errors.password)}
            fullWidth
            helperText={formik.touched.password && formik.errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="password"
            value={formik.values.password}
            variant="outlined"
          />
          <Box sx={{ py: 2 }}>
            {!props.loading ? (
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                aria-label="sign in"
                size="large"
                type="submit"
                variant="contained"
              >
                Sign In
              </Button>
            ) : (
              <CircularProgress />
            )}
          </Box>
          <Grid container>
            <Grid sx={{ textAlign: "left" }} item xs>
              <Link
                role="button"
                style={{ textDecoration: "none" }}
                to="/forgotPassword"
                aria-label="forgot password"
              >
                <Button>Forgot Password</Button>
              </Link>
            </Grid>
            <Grid item>
              <Typography color="textSecondary" variant="body2">
                Don't have an account?{" "}
                <Link
                  role="button"
                  style={{ textDecoration: "none" }}
                  to="/register"
                  aria-label="sign up"
                >
                  <Button>Sign up</Button>
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
        <Divider />
        <form onSubmit={guestFormik.handleSubmit}>
          <Box sx={{ py: 1 }}>
            <Typography align="center" color="textSecondary" variant="body1">
              or
            </Typography>
          </Box>
          <Box sx={{ py: 2 }}>
            <Button
              color="primary"
              disabled={guestFormik.isSubmitting || props.loading}
              fullWidth
              aria-label="guest"
              size="large"
              variant="outlined"
              type="submit"
            >
              Continue as guest
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  ) : (
    <Navigate replace to="/" />
  )
}

interface Props {
  onSubmit?: (email: string, password: string) => Promise<any>
  afterSubmit?: () => void
  signInWithGoogle?: () => void
  signInWithFacebook?: () => void
  signInAnonymously?: () => Promise<any>
  error?: string
  loading?: boolean
  modal?: boolean
}
