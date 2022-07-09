import * as React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

export const AlertDialog: React.FC<Props> = ({
  open,
  setOpen,
  title,
  message,
  onConfirm,
}) => {
  const handleClose = () => {
    setOpen(false)
  }
  const handleConfirm = () => {
    setOpen(false)
    onConfirm?.()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm}>Ok</Button>
        <Button onClick={handleClose} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

interface Props {
  message?: string
  title?: string
  onConfirm?: () => void
  open: boolean
  setOpen: (open: boolean) => void
}
