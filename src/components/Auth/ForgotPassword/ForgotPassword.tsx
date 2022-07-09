import { FC } from "react"
import * as Yup from "yup"
import { useFormik } from "formik"

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { State } from "../../../types/state"
import { Navigate } from "react-router"
import { setSnackbar } from "../../../store/snackbarSlice"
import { Link } from "react-router-dom"

export var ForgotPassword: FC<Props> = function (props) {
  const user = useSelector((state: State) => state.user.value)
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
    }),
    onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {
      props
        .onSubmit?.(values.email)
        .then((res: any) => {
          dispatch(
            setSnackbar({
              message: "Password reset link has been sent to your email",
              open: true,
              duration: 2000,
            })
          )
          props.afterSubmit?.()
        })
        .catch((e: any) => {
          console.log(e)
          if (e.message) {
            setErrors({
              email: e.message,
            })
            setSubmitting(false)
          }
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
              Forgot password
            </Typography>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Enter your Email address to recieve password reset link
            </Typography>
            {props.error && (
              <Typography color="error.main" gutterBottom variant="body2">
                {props.error}
              </Typography>
            )}
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
                Send
              </Button>
            ) : (
              <CircularProgress />
            )}
          </Box>
          <Divider />

          <Typography color="textSecondary" variant="body2">
            Don&apos;t have an account?{" "}
            <Link
              role="button"
              style={{ textDecoration: "none" }}
              to="/register"
              aria-label="sign up"
            >
              <Button>Sign up</Button>
            </Link>
          </Typography>
        </form>
      </Container>
    </Box>
  ) : (
    <Navigate replace to="/" />
  )
}

interface Props {
  onSubmit?: (email: string) => Promise<any>
  afterSubmit?: () => void
  error?: string
  loading?: boolean
  modal?: boolean
}
