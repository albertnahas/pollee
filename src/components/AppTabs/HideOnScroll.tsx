import * as React from "react"
import useScrollTrigger from "@mui/material/useScrollTrigger"
import Slide from "@mui/material/Slide"

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  children: React.ReactElement
  down?: boolean
}

function ElevationScroll(props: Props) {
  const { children } = props
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: document.body ? document.body : undefined,
  })

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  })
}

export function HideOnScroll(props: Props) {
  const { children } = props
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: document.body ? document.body : undefined,
  })

  return (
    <ElevationScroll>
      <Slide
        appear={false}
        direction={props.down ? "down" : "up"}
        in={!trigger}
      >
        {children}
      </Slide>
    </ElevationScroll>
  )
}
