import { Button } from "@mui/material"
import React, { FC } from "react"
import RepeatIcon from "@mui/icons-material/Repeat"
import { keyframes } from "@emotion/react"

const pulse = keyframes`
	0% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
	}

	70% {
		transform: scale(1);
		box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
	}

	100% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 255, 0);
	}
  `

export const RematchButton: FC<Props> = ({
  onClick,
  disabled,
  pulsing,
  variant,
  color,
}) => {
  return (
    <Button
      variant={variant || "outlined"}
      color={color || "info"}
      aria-label="rematch button"
      onClick={onClick}
      endIcon={<RepeatIcon />}
      disabled={disabled}
      sx={{
        animation: pulsing ? `${pulse} 1000ms infinite ease;` : "",
        animationDirection: "alternate",
      }}
    >
      {pulsing ? "Accept rematch" : "Rematch"}
    </Button>
  )
}

interface Props {
  onClick: () => void
  disabled?: boolean
  pulsing?: boolean
  variant?: "outlined" | "text"
  color?:
    | "inherit"
    | "error"
    | "success"
    | "info"
    | "warning"
    | "primary"
    | "secondary"
    | undefined
}
