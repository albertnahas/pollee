import { FC, useEffect, useState } from "react"
import { Container, Box, Grid, Button, Typography, Stack } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import ModalDialog from "../../molecules/ModalDialog/ModalDialog"
import { DeleteAccountForm } from "./DeleteAccountForm"
import { userSelector } from "../../store/userSlice"
import { useUser } from "../../hooks/useUser"
import { ProfilePhoto } from "./partials/ProfilePhoto/ProfilePhoto"
import { EditableDisplay } from "./partials/EditableDisplay/EditableDisplay"
import LogoutIcon from "@mui/icons-material/Logout"

import { ProgressRing } from "../../atoms/ProgressRing/ProgressRing"
import { facebookProvider, googleProvider } from "../../App"
import { Google } from "../../icons/google"
import { Facebook } from "@mui/icons-material"
import { setSnackbar } from "../../store/snackbarSlice"
import firebase from "../../config"
import { useAnalytics } from "../../hooks/useAnalytics"
import { ProfileInfo } from "./partials/ProfileInfo/ProfileInfo"
import { PayPalButtons } from "@paypal/react-paypal-js"

export const Profile: FC<Props> = ({ signOut }) => {
  const user = useSelector(userSelector)
  const dispatch = useDispatch()
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false)

  const { updateUser, linkAccount } = useUser()
  const { logEvent } = useAnalytics()
  const [imageAsUrl, setImageAsUrl] = useState<any>(user?.photoURL)

  const onClickSubmitDisplayName = (name?: string) => {
    return updateUser({ ...user, displayName: name || "" })
  }

  const onUploadPhoto = (photoURL: string) => {
    return updateUser({ ...user, photoURL })
  }

  // const lastVoted = useMemo(() => {
  //   var currentTimestamp = moment(new Date()).format("HH:mm:ss")
  //   return user?.lastVotedAt
  //     ? moment
  //         .duration(
  //           moment(currentTimestamp, "HH:mm:ss").diff(
  //             moment(user?.lastVotedAt?.toDate(), "HH:mm:ss")
  //           )
  //         )
  //         .humanize() + " ago"
  //     : "No votes yet"
  // }, [user])

  const linkSocialAccount = (provider: firebase.auth.AuthProvider) =>
    linkAccount(provider, user)
      ?.then(() => {
        dispatch(
          setSnackbar({
            open: true,
            message: `Account has been linked!`,
            type: "success",
          })
        )
      })
      .catch((e: any) => {
        dispatch(
          setSnackbar({
            open: true,
            message: `${e.message}`,
            duration: 2000,
            type: "error",
          })
        )
      })

  const linkWithFacebook = () => linkSocialAccount(facebookProvider)
  const linkWithGoogle = () => linkSocialAccount(googleProvider)

  const createOrder = (data: any, actions: any) =>
    actions.order.create({
      purchase_units: [
        {
          amount: {
            value: "1.99",
          },
        },
      ],
    })

  const onApprove = (data: any, actions: any) => {
    // data.orderID
    const capture = actions.order.capture()
    console.log(capture)
    updateUser({
      points: (user?.points || 0) + 100,
    })
    return capture
  }

  useEffect(() => {
    logEvent("profile_view", { userId: user?.uid })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container aria-label="profile container" maxWidth="sm">
      <Grid spacing={2} container>
        <Grid xs={12} item>
          <Box
            sx={{
              position: "relative",
              margin: "auto",
              boxSizing: "border-box",
            }}
          >
            <Box sx={{ mt: 4, mb: 2 }}>
              <Box sx={{ position: "absolute", left: 0, right: 0, top: 11 }}>
                <ProfilePhoto
                  imageAsUrl={imageAsUrl}
                  setImageAsUrl={setImageAsUrl}
                  onUpload={onUploadPhoto}
                />
              </Box>
              <ProgressRing value={user?.points} />
            </Box>
            <Box sx={{ mb: 2 }}>
              <EditableDisplay
                name="displayName"
                label={"The username others will see"}
                onSubmit={onClickSubmitDisplayName}
                text={user?.displayName}
              />
            </Box>
          </Box>
          {/* <Divider sx={{ mt: 2, mb: 2 }} variant="middle" /> */}
        </Grid>
        <Grid xs={12} item>
          <ProfileInfo />
        </Grid>

        <Grid xs={12} item>
          <Stack direction="row" sx={{ justifyContent: "center" }} spacing={1}>
            {!user?.providers?.includes("google.com") && (
              <Button
                onClick={linkWithGoogle}
                color="error"
                size="medium"
                variant="text"
                endIcon={<Google />}
              >
                Connect
              </Button>
            )}
            {!user?.providers?.includes("facebook.com") && (
              <Button
                onClick={linkWithFacebook}
                color="info"
                size="medium"
                variant="text"
                endIcon={<Facebook />}
              >
                Connect
              </Button>
            )}
          </Stack>
        </Grid>
        <Grid md={12} item>
          <Typography
            variant="body2"
            component="p"
            color="text.secondary"
            sx={{ textAlign: "center", fontWeight: "bold", mb: 1 }}
          >
            Get 10 tokens for $1.99
          </Typography>
          <Box
            sx={{
              margin: "auto",
              width: 200,
            }}
          >
            <PayPalButtons
              createOrder={(data: any, actions: any) =>
                createOrder(data, actions)
              }
              onApprove={(data: any, actions: any) => onApprove(data, actions)}
              style={{ layout: "horizontal" }}
            />
          </Box>
        </Grid>
        <Grid xs={12} sx={{ mt: 1 }} item>
          <Button
            onClick={signOut}
            color="secondary"
            size="small"
            variant="contained"
            endIcon={<LogoutIcon />}
          >
            Sign out
          </Button>
        </Grid>

        <Grid xs={12} item>
          <Button
            onClick={() => setOpenDeleteAccount(true)}
            color="error"
            size="small"
            variant="text"
            sx={{ my: 1 }}
          >
            Delete Account
          </Button>
        </Grid>
      </Grid>
      <ModalDialog
        maxWidth="sm"
        open={openDeleteAccount}
        setOpen={setOpenDeleteAccount}
      >
        <DeleteAccountForm />
      </ModalDialog>
    </Container>
  )
}

interface Props {
  signOut?: () => void
}
