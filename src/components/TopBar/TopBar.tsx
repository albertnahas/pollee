import { FC, useContext, useEffect } from "react"
import styled from "@emotion/styled"
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material"
import { alpha, useTheme } from "@mui/system"
import { useDispatch, useSelector } from "react-redux"
import { Logo } from "../../icons/logo"
import { UserCircle as UserCircleIcon } from "../../icons/user-circle"
import { State } from "../../types/state"
import { useNavigate, Link } from "react-router-dom"
import DownloadIcon from "@mui/icons-material/Download"
import { useUser } from "../../hooks/useUser"
import { setDrawer } from "../../store/drawerSlice"
import MenuIcon from "@mui/icons-material/Menu"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import { ColorModeContext } from "../Providers/Providers"
// import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism"

export const StyledMenu = styled((props: any) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}))

const DashboardNavbarRoot = styled(AppBar)(({ theme }: any) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[0],
}))

export const MiniProfileAvatar = styled(Avatar)(({ theme }: any) => ({
  height: 32,
  width: 32,
  ml: 1,
  border: `2px solid ${theme.palette.action.disabledBackground}`,
}))

export const SmallProfileAvatar = styled(Avatar)(({ theme }: any) => ({
  height: 40,
  width: 40,
  ml: 1,
  border: `2px solid ${theme.palette.action.disabledBackground}`,
}))

export var TopBar: FC<Props> = function (props) {
  const theme = useTheme()
  const dispatch = useDispatch()

  const colorMode = useContext(ColorModeContext)

  const user = useSelector((state: State) => state.user.value)
  const { updateUser } = useUser()
  const navigate = useNavigate()

  const openDrawer = () => {
    dispatch(setDrawer(true))
  }

  useEffect(() => {
    if (user && user?.colorMode !== theme.palette.mode) {
      updateUser({ ...user, colorMode: theme.palette.mode })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.palette.mode, user])

  return (
    <DashboardNavbarRoot sx={{}} theme={theme} position="sticky">
      <Toolbar
        sx={{
          minHeight: 64,
          left: 0,
          px: 2,
        }}
      >
        {user ? (
          <>
            <IconButton
              aria-label={"open drawer"}
              onClick={openDrawer}
              sx={{ ml: 1 }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
            {/* <Tooltip title="Logout">
              <IconButton onClick={props.signOut} sx={{ ml: 1 }}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip> */}
            <Box sx={{ flexGrow: 1 }} />
            {/* <Button
              variant="outlined"
              color="secondary"
              startIcon={<VolunteerActivismIcon />}
              onClick={props.donate}
              sx={{ ml: 1 }}
            >
              Donate
            </Button> */}
            {props.deferredPrompt && (
              <Tooltip title="Install the app">
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={props.handleInstallClick}
                  sx={{ ml: 1 }}
                >
                  Install
                </Button>
              </Tooltip>
            )}
            <Tooltip title={`${theme.palette.mode} mode`}>
              <IconButton
                sx={{ ml: 1 }}
                onClick={colorMode.toggleColorMode}
                color="default"
              >
                {theme.palette.mode === "dark" ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </IconButton>
            </Tooltip>
            <SmallProfileAvatar
              src={user.photoURL}
              alt="profile"
              aria-label="profile"
              onClick={() => navigate("/profile")}
            >
              <UserCircleIcon fontSize="small" />
            </SmallProfileAvatar>
          </>
        ) : (
          <>
            <Tooltip title="Login">
              <IconButton onClick={() => navigate("/login")} sx={{ ml: 1 }}>
                <UserCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Box sx={{ flexGrow: 1 }} />
            <Typography color="primary" sx={{ mr: 1 }}>
              Pollee
            </Typography>
            <Link to="/">
              <Logo color="primary" sx={{ width: 32, height: 32 }} />
            </Link>
          </>
        )}
      </Toolbar>
    </DashboardNavbarRoot>
  )
}

interface Props {
  signOut: () => void
  handleInstallClick: () => void
  donate: () => void
  deferredPrompt: any
  notification: { title: string; body: string }
  setNotification: any
}
