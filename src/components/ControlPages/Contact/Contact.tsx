import React from "react"
import { Container, Typography, TextField, Button } from "@mui/material"
import { Box } from "@mui/system"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import firebase from "../../../config"
import { State } from "../../../types/state"

export var Contact = function () {
  const user = useSelector((state: State) => state.user.value)
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    validationSchema: Yup.object({
      message: Yup.string().max(255).min(16).required("message is required"),
    }),
    onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {
      firebase
        .firestore()
        .collection("contact")
        .add({
          message: values.message,
          uid: user?.uid || null,
        })
        .then((res) => {
          navigate("/")
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
      }}
    >
      <Container maxWidth="sm">
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ my: 3 }}>
            <Typography
              color="primary"
              variant="h1"
              sx={{ fontSize: "2.5rem", fontWeight: 400 }}
            >
              Get in touch
            </Typography>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="body2"
              mt={1}
            >
              We are here for you. Use the form below to drop us a message.
            </Typography>
          </Box>
          <TextField
            error={Boolean(formik.touched.message && formik.errors.message)}
            helperText={formik.touched.message && formik.errors.message}
            fullWidth
            label="Message"
            margin="normal"
            name="message"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.message}
            variant="outlined"
            multiline
          />

          <Box sx={{ py: 2 }}>
            <Button
              color="primary"
              disabled={formik.isSubmitting}
              fullWidth
              size="large"
              type="submit"
              aria-label="submit"
              variant="contained"
            >
              Submit
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  )
}
