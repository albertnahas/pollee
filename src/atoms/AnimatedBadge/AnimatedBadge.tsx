import { Box } from "@mui/material"
import React, { FC } from "react"
import "./AnimatedBadge.css"

export const AnimatedBadge: FC<Props> = ({
  children,
  noStars,
  size,
  ...props
}) => {
  return (
    <Box
      sx={{
        width: size || 156,
        height: size || 156,
      }}
      className="animated_badge"
      {...props}
    >
      <div className="animated_stars_wrapper">
        {!noStars && (
          <div className="animated_stars">
            <div className="animated_star plus"></div>
            <div className="animated_star donut yellow"></div>
            <div className="animated_star plus"></div>
            <div className="animated_star donut"></div>
            <div className="animated_star plus yellow"></div>
          </div>
        )}
        {children}
      </div>
    </Box>
  )
}

interface Props {
  size?: number
  noStars?: boolean
  children: JSX.Element
  style?: React.CSSProperties
}
