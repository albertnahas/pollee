import { CircularProgress, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React, { FC } from "react"

export var ProgressRing: FC<Props> = function ({ color, thickness, ...props }) {
  const style = {
    position: "relative",
    display: "inline-flex",
    "& circle": {
      strokeWidth: thickness || 1.1,
      transition: "stroke-dashoffset 1000ms linear",
      strokeLinecap: "round",
      color: color || "primary.light",
    },
  } as const

  return (
    <Box sx={style}>
      <CircularProgress
        variant="determinate"
        size={props.size || 120}
        {...props}
        aria-label="accuracy progressbar"
      />
      <CircularProgress
        variant="determinate"
        size={props.size || 120}
        value={100}
        sx={{
          position: "absolute",
          "& circle": { strokeWidth: "0.2 !important" },
        }}
        aria-label="accuracy progressbar"
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {props.label && (
          <Typography
            aria-label="ring value"
            variant="h6"
            component="div"
            color="text.secondary"
          >
            {`${Math.floor((props.value || 0) / 10)}/10`}
          </Typography>
        )}
        {props.children}
      </Box>
    </Box>
  )
}

interface Props {
  value?: number
  label?: boolean
  children?: JSX.Element
  size?: number
  thickness?: number
  color?: string
}
