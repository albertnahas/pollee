import { FC, useEffect, useState } from "react"
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material"
import { Box } from "@mui/system"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useDispatch, useSelector } from "react-redux"
import { State } from "../../../types/state"
import { Navigate } from "react-router"
import { Link, useSearchParams } from "react-router-dom"
import { setSnackbar } from "../../../store/snackbarSlice"

export var ResetPassword: FC<Props> = function (props) {
  const user = useSelector((state: State) => state.user.value)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [valid, setValid] = useState(true)
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const code = searchParams.get("oobCode")

  useEffect(() => {
    props
      .verifyPasswordResetCode?.(code || "")
      .then((res) => {})
      .catch((e) => {
        setValid(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {
      if (values.password !== values.confirmPassword) {
        setErrors({
          confirmPassword: "Passwords don't match",
        })
        setSubmitting(false)
      }

      props
        .confirmPasswordReset?.(code || "", values.password)
        .then((res: any) => {
          dispatch(
            setSnackbar({
              message: "Your password has been reset successfully!",
              open: true,
              duration: 2000,
            })
          )
          props.afterSubmit?.()
        })
        .catch((e: any) => {
          console.log(e)
          if (e && e.message) {
            setErrors({
              password: e.message,
            })
            setSubmitting(false)
          }
        })
    },
  })

  return user === null ? (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexGrow: 1,
        minHeight: "100%",
        textAlign: "center",
        pb: 2,
      }}
    >
      <Container maxWidth="sm">
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ my: 3 }}>
            <Typography
              color="textPrimary"
              aria-label="create account"
              variant="h1"
              sx={{ fontSize: "2.1rem", fontWeight: 400 }}
            >
              Reset your password
            </Typography>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Enter your new password
            </Typography>
          </Box>
          <TextField
            error={Boolean(formik.touched.password && formik.errors.password)}
            fullWidth
            helperText={formik.touched.password && formik.errors.password}
            label="Password"
            margin="dense"
            name="password"
            aria-label="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="password"
            value={formik.values.password}
            variant="outlined"
          />
          <TextField
            error={Boolean(
              formik.touched.confirmPassword && formik.errors.confirmPassword
            )}
            fullWidth
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
            label="Confirm Password"
            margin="dense"
            name="confirmPassword"
            aria-label="confirmPassword"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="password"
            value={formik.values.confirmPassword}
            variant="outlined"
          />

          <Box sx={{ py: 2 }}>
            {!props.loading ? (
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                aria-label="sign up"
              >
                Reset Password
              </Button>
            ) : (
              <CircularProgress />
            )}
          </Box>
          <Typography color="textSecondary" variant="body2">
            Have an account?{" "}
            <Link
              role="button"
              style={{ textDecoration: "none" }}
              to="/login"
              aria-label="login"
            >
              <Button>Login</Button>
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
  confirmPasswordReset?: (code: string, password: string) => Promise<any>
  verifyPasswordResetCode?: (code: string) => Promise<any>
  loading?: boolean
  afterSubmit?: () => void
}
