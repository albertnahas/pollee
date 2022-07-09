import { Typography, CircularProgress, useTheme } from "@mui/material"
import { Box } from "@mui/system"
import React from "react"
import { Logo } from "../../icons/logo"

export const SplashScreen = () => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        textAlign: "center",
        background: theme.palette.primary.main,
        pt: 6,
      }}
    >
      <Logo
        sx={{
          width: 120,
          height: 120,
          m: 8,
          ml: "auto",
          mr: "auto",
          color: "white",
        }}
      />
      <Typography variant="h3" color="white">
        Pollee
      </Typography>
      <CircularProgress
        sx={{ color: "white", display: "block", m: "auto", mt: 6 }}
      />
    </Box>
  )
}
