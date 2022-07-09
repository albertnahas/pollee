import React, { useEffect } from "react"
import { AppBar, BottomNavigation, BottomNavigationAction } from "@mui/material"
import { Link, useLocation } from "react-router-dom"

import PersonIcon from "@mui/icons-material/Person"
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp"
import { useSelector } from "react-redux"
import { State } from "../../types/state"
import { HideOnScroll } from "./HideOnScroll"
import { Home, Poll } from "@mui/icons-material"

export var AppTabs = function () {
  const [value, setValue] = React.useState(1)
  const user = useSelector((state: State) => state.user.value)

  const location = useLocation()

  useEffect(() => {
    if (location.pathname.indexOf("profile") > -1) {
      setValue(3)
      return
    }
    if (location.pathname.indexOf("polls") > -1) {
      setValue(2)
      return
    }
    if (location.pathname.indexOf("post") > -1) {
      setValue(1)
      return
    }
    if (location.pathname.indexOf("home") > -1) {
      setValue(0)
      return
    }
    setValue(0)
  }, [location])

  return user !== null ? (
    <HideOnScroll>
      <AppBar
        position="fixed"
        elevation={0}
        component="footer"
        sx={{ bottom: 0, top: "auto", height: 60, background: "bg.paper" }}
        color="default"
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue)
          }}
          sx={{
            "& > a": {
              minWidth: 60,
            },
          }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<Home />}
            component={Link}
            to="/"
          />
          <BottomNavigationAction
            label="Poll"
            icon={<AddCircleSharpIcon />}
            component={Link}
            to="/post"
          />
          <BottomNavigationAction
            label="My Polls"
            icon={<Poll />}
            component={Link}
            to="/polls"
          />
          <BottomNavigationAction
            label="Profile"
            icon={<PersonIcon />}
            component={Link}
            to="/profile"
          />
        </BottomNavigation>
      </AppBar>
    </HideOnScroll>
  ) : (
    <></>
  )
}
