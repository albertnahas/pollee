import * as React from "react"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import GroupsIcon from "@mui/icons-material/Groups"
import { drawerSelector, setDrawer } from "../../store/drawerSlice"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import HomeIcon from "@mui/icons-material/Home"
import LogoutIcon from "@mui/icons-material/Logout"
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined"
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined"
import PrivacyTipOutlinedIcon from "@mui/icons-material/PrivacyTipOutlined"
import { userSelector } from "../../store/userSlice"
// import SettingsIcon from "@mui/icons-material/Settings"

const sideDrawerLinks = [
  {
    ariaLabel: "Home",
    path: "/",
    primary: "Home",
    icon: <HomeIcon />,
  },
  {
    ariaLabel: "about",
    path: "/about",
    primary: "About Pollee",
    icon: <GroupsIcon />,
  },
  {
    ariaLabel: "contact",
    path: "/contact",
    primary: "Contact us",
    icon: <ForumOutlinedIcon />,
  },
  {
    ariaLabel: "privacy",
    path: "/privacy",
    primary: "Privacy policy",
    icon: <PrivacyTipOutlinedIcon />,
  },
  {
    ariaLabel: "terms",
    path: "/terms",
    primary: "Terms & Conditions",
    icon: <GradingOutlinedIcon />,
  },
]

export const SideDrawer: React.FC<Props> = (props) => {
  const dispatch = useDispatch()
  const drawerOpen = useSelector(drawerSelector)
  const user = useSelector(userSelector)

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return
      }

      dispatch(setDrawer(open))
    }

  const list = () => (
    <Box
      sx={{ width: 275 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {sideDrawerLinks.map((link) => {
          return (
            <ListItem
              key={link.ariaLabel}
              aria-label={link.ariaLabel}
              button
              component={Link}
              to={link.path}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText
                primary={link.primary}
                color="text.secondary"
              ></ListItemText>
            </ListItem>
          )
        })}
        {/* <ListItem
          aria-label={"settings"}
          button
          component={Link}
          to="/settings"
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" color="text.secondary" />
        </ListItem> */}
      </List>
      <Divider />
      {user && (
        <List>
          <ListItem aria-label={"signout"} button onClick={props.signOut}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sign out" color="text.secondary" />
          </ListItem>
        </List>
      )}
    </Box>
  )

  return (
    <div>
      <React.Fragment>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  )
}

interface Props {
  signOut: () => void
  donate?: () => void
}
