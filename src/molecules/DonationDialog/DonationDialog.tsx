import React, { useEffect, useState } from "react"
import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import {
  Container,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Stack,
  Button,
} from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { PayPalButtons } from "@paypal/react-paypal-js"
import { DoneOutline } from "../../icons/DoneOutline"
import { useTheme } from "@mui/system"
import anime from "animejs"
import { useSelector } from "react-redux"
import { useAnalytics } from "../../hooks/useAnalytics"
import { userSelector } from "../../store/userSlice"
import { Coffee } from "@mui/icons-material"

export interface DonationDialogProps {
  open: boolean
  onClose: () => void
}
export interface CoffeeItem {
  id: string
  title: string
  price: string
  currency: string
  description?: string
}

// const defaultCoffee = {
//   id: "test",
//   title: "Coffee",
//   price: "3.00",
//   currency: "USD",
//   description: "Coffee",
// }

export function DonationDialog(props: DonationDialogProps) {
  const theme = useTheme()
  const { onClose, open } = props
  const [donated, setDonated] = useState(false)
  const [error, setError] = useState()
  const [coffeeItem, setCoffeeItem] = useState<CoffeeItem>()
  const user = useSelector(userSelector)
  const { logEvent } = useAnalytics()

  const formik = useFormik({
    initialValues: {
      amount: 1,
    },
    validationSchema: Yup.object({
      amount: Yup.number().max(9999).min(0.5).required("amount is required"),
    }),
    onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {},
  })

  const createOrder = (data: any, actions: any) =>
    actions.order.create({
      purchase_units: [
        {
          amount: {
            value: formik.values.amount,
          },
        },
      ],
    })

  const onApprove = (data: any, actions: any) => {
    // data.orderID
    const capture = actions.order.capture()
    setDonated(true)
    return capture
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => setDonated(false), 500)
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

  useEffect(() => {
    if (donated) {
      setTimeout(() => {
        animation()
      }, 500)
    }
    return () => {}
  }, [donated])

  useEffect(() => {
    open && logEvent("donation_open", { userId: user?.uid })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    async function initBilling(): Promise<void> {
      if (window.getDigitalGoodsService === undefined) {
        // Digital Goods API is not supported in this context.
        return
      }
      try {
        const digitalGoodsService = await window.getDigitalGoodsService(
          "https://play.google.com/billing"
        )
        const details = await digitalGoodsService.getDetails(["coffees"])
        for (const item of details) {
          // const priceStr = new Intl.NumberFormat(intl.locale || "en", {
          //   style: "currency",
          //   currency: item.price.currency,
          // }).format(item.price.value)
          setCoffeeItem({
            id: item.itemId,
            title: item.title,
            price: item.price.value,
            currency: item.price.currency,
            description: item.description,
          })
        }
        // Use the service here.
      } catch (error) {
        // Our preferred service provider is not available.
        // Use a normal web-based payment flow.
        return
      }
    }
    initBilling()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const payWithGoogle = () => {
    if (!coffeeItem) {
      return
    }
    const supportedInstruments: PaymentMethodData[] = [
      {
        supportedMethods: "https://play.google.com/billing",
        data: {
          sku: coffeeItem.id,
        },
      },
    ]

    const amount = coffeeItem.price

    const details: PaymentDetailsInit = {
      id: coffeeItem.id,
      total: {
        label: coffeeItem.title,
        amount: {
          currency: coffeeItem.currency,
          value: amount,
        },
      },
      displayItems: [
        {
          label: coffeeItem.title,
          amount: { currency: coffeeItem.currency, value: amount },
        },
      ],
    }

    try {
      const request = new PaymentRequest(supportedInstruments, details)
      // Add event listeners here.
      // Call show() to trigger the browser's payment flow.
      request
        .show()
        .then(function (instrumentResponse) {
          // Do something with the response from the UI.
          setDonated(true)
        })
        .catch(function (err) {
          // Do something with the error from request.show().
          setError(err.message)
          console.log(err)
        })
    } catch (e) {
      // Catch any other errors.
    }
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-label={"donation"}
      open={open}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Buy us a coffee!</DialogTitle>
      <Container maxWidth="xs">
        {!donated && (
          <>
            <Typography variant="subtitle1">
              If you enjoy playing Pollee, please consider supporting us by
              buying us a coffee! This will help Pollee to reach its full
              potential &#128522;
            </Typography>
            {!!error && (
              <Typography color="error" sx={{ my: 1 }} variant="body2">
                {error}
              </Typography>
            )}
            {!coffeeItem && (
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  error={Boolean(formik.touched.amount && formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                  fullWidth
                  label="Amount"
                  margin="normal"
                  name="amount"
                  aria-label="amount"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.amount}
                  variant="outlined"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <Grid container sx={{ my: 2 }}>
                  <PayPalButtons
                    createOrder={(data: any, actions: any) =>
                      createOrder(data, actions)
                    }
                    onApprove={(data: any, actions: any) =>
                      onApprove(data, actions)
                    }
                    style={{ layout: "horizontal" }}
                  />
                </Grid>
              </form>
            )}
            {coffeeItem && (
              <Button
                onClick={payWithGoogle}
                aria-label="google pay"
                startIcon={<Coffee />}
                variant="contained"
                sx={{ my: 2 }}
              >
                Pay now
              </Button>
            )}
          </>
        )}
        {!!donated && (
          <Stack sx={{ alignItems: "center", mb: 3 }} spacing={1}>
            <DoneOutline
              style={{ fontSize: "4em", color: theme.palette.secondary.light }}
            />
            <Typography color="secondary" sx={{ mb: 2 }} variant="h4">
              Thank you!
            </Typography>
            <Typography
              sx={{ display: "flex", justifyContent: "center" }}
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              Your contribution is highly valuable for us{"  "}
              <Typography color="red" variant="inherit" sx={{ ml: 0.5 }}>
                &#x2764;
              </Typography>
            </Typography>
          </Stack>
        )}
      </Container>
    </Dialog>
  )
}
