import * as React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Breakpoint,
  IconButton,
  Box,
  Typography,
  DialogActions,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import Zoom from "@mui/material/Zoom"
import { TransitionProps } from "@mui/material/transitions"

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Zoom in={true} ref={ref} {...props} />
})

export default function ModalDialog(props: Props) {
  // const locaiton = useLocation();

  const handleClose = () => {
    props.setOpen?.(false)
    props.onClose?.()
    if (window.location.hash !== "") {
      window.history.back()
    }
  }

  React.useEffect(() => {
    const onHashChange = () => {
      if (
        props.open &&
        !window.location.hash
          .split("#")
          .includes(encodeURIComponent(props.title || "") || "modal")
      ) {
        props.setOpen?.(false)
      }
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.title, props.open])

  React.useEffect(() => {
    if (props.open) {
      window.location.hash += `#${
        encodeURIComponent(props.title || "") || "modal"
      }`
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open])

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        fullWidth={true}
        TransitionComponent={props.zoom ? Transition : undefined}
        maxWidth={props.maxWidth || "md"}
        scroll={"body"}
        aria-label={props.title}
      >
        {props.closeButton && (
          <DialogTitle>
            <Box sx={{ minHeight: 25 }} display="flex" alignItems="center">
              {props.title && (
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    flexGrow: 1,
                    textTransform: "capitalize",
                    px: 2,
                  }}
                  color="primary"
                >
                  {props.title}
                </Typography>
              )}
              <Box></Box>
              <Box sx={{ position: "absolute", right: 15 }}>
                <IconButton aria-label="dialog close" onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
        )}

        <DialogContent id="sss" aria-label={props.title} dividers={true}>
          {React.cloneElement(props.children, {
            setOpen: props.setOpen,
          })}
        </DialogContent>
        {props.actions && <DialogActions>{props.actions}</DialogActions>}
      </Dialog>
    </div>
  )
}

interface Props {
  setOpen?: (open: boolean) => any
  onClose?: () => any
  open: boolean
  maxWidth?: Breakpoint
  closeButton?: boolean
  children: JSX.Element
  actions?: JSX.Element
  zoom?: boolean
  title?: string
}
