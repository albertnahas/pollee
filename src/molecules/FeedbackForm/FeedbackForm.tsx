import React, { FC, useEffect, useState } from "react"
import { Container, Typography, TextField, Button, Stack } from "@mui/material"
import { Box, useTheme } from "@mui/system"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useSelector } from "react-redux"
import firebase from "../../config"
import { State } from "../../types/state"
import { useUser } from "../../hooks/useUser"
import anime from "animejs"
import Rating from "@mui/material/Rating"
import { DoneOutline } from "../../icons/DoneOutline"

export var FeedbackForm: FC<Props> = function (props) {
  const user = useSelector((state: State) => state.user.value)
  const { updateUser } = useUser()
  const theme = useTheme()

  const [sent, setSent] = useState(false)

  const formik = useFormik({
    initialValues: {
      message: "",
      rate: undefined,
    },
    validationSchema: Yup.object({
      rate: Yup.number().required().max(10).min(0),
      message: Yup.string().max(255).min(3),
    }),
    onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {
      if (!values.rate) {
        return Promise.reject()
      }
      firebase
        .firestore()
        .collection("feedback")
        .add({
          message: values.message,
          rate: values.rate,
          uid: user?.uid || null,
        })
        .then(() => {
          setSent(true)
          updateUser({ ...user, feedback: true })
          setTimeout(() => {
            props.setOpen?.(false)
          }, 2500)
        })
        .catch((e: any) => {
          console.log(e)
        })
    },
  })

  useEffect(() => {
    if (sent) {
      animation()
    }
    return () => {}
  }, [sent])

  const onRatingChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: number | null
  ) => {
    if (newValue) {
      formik.setFieldValue("rate", newValue)
    }
  }

  const animation = () => {
    anime({
      targets: "[class*=doneOutline-]",
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: "easeInOutSine",
      duration: 500,
      delay: function (el, i) {
        return i * 500
      },
    })
  }

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
        {!sent && (
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography color="textPrimary" sx={{ mb: 1 }} variant="h5">
                We appreciate your feedback
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Please, rate your experience with Pollee
              </Typography>
            </Box>
            <Box sx={{ my: 3 }}>
              <Rating
                name="rate"
                value={formik.values.rate || 0}
                onChange={onRatingChange}
              />
              {formik.touched.rate && formik.errors.rate && (
                <Typography color="error" component="div" variant="caption">
                  Please give us a rate
                </Typography>
              )}
            </Box>
            <TextField
              error={Boolean(formik.touched.message && formik.errors.message)}
              helperText={formik.touched.message && formik.errors.message}
              fullWidth
              label="feedback"
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
                variant="outlined"
              >
                Submit
              </Button>
            </Box>
          </form>
        )}
        {!!sent && (
          <Stack sx={{ alignItems: "center", my: 2 }} spacing={1}>
            <DoneOutline
              style={{ fontSize: "4em", color: theme.palette.primary.light }}
            />
            <Typography color="primary" variant="h4">
              Thank you!
            </Typography>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Your feedback has been received
            </Typography>
          </Stack>
        )}
      </Container>
    </Box>
  )
}

interface Props {
  setOpen?: (open: boolean) => any
}
