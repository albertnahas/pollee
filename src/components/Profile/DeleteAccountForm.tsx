import React, { FC } from "react"
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
import { useSelector } from "react-redux"
import firebase from "../../config"
import { State } from "../../types/state"
import { useUser } from "../../hooks/useUser"

export var DeleteAccountForm: FC<Props> = function (props) {
  const user = useSelector((state: State) => state.user.value)
  const { deleteAccount } = useUser()

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    validationSchema: Yup.object({
      message: Yup.string().max(255).min(12).required("reason is required"),
    }),
    onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {
      firebase
        .firestore()
        .collection("removals")
        .add({
          message: values.message,
          uid: user?.uid || null,
        })
        .then(() => {
          deleteAccount()
          props.setOpen?.(false)
        })
        .catch((e: any) => {
          console.log(e)
        })
    },
  })

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexGrow: 1,
        minHeight: "100%",
        textAlign: "center",
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ my: 3 }}>
            <Typography color="textPrimary" variant="h4">
              We are sorry to see you go &#128532;
            </Typography>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Please, tell us why you'd like to delete your account
            </Typography>
          </Box>
          <TextField
            error={Boolean(formik.touched.message && formik.errors.message)}
            helperText={formik.touched.message && formik.errors.message}
            fullWidth
            label="Reason"
            margin="normal"
            name="message"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.message}
            variant="outlined"
            multiline
          />

          <Box sx={{ py: 2 }}>
            {formik.isSubmitting && <CircularProgress />}
            <Button
              color="primary"
              disabled={formik.isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Delete account
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  )
}

interface Props {
  setOpen?: (open: boolean) => any
}
