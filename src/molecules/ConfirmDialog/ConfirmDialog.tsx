import * as React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

export const ConfirmDialog: React.FC<Props> = ({
  title,
  message,
  onConfirm,
  open,
  setOpen,
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
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title" color="primary">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="confirm-dialog-description"
          color="text.secondary"
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button aria-label="confirm-dialog-confirm-btn" onClick={handleConfirm}>
          Confirm
        </Button>
        <Button
          aria-label="confirm-dialog-cancel-btn"
          onClick={handleClose}
          autoFocus
          color="error"
        >
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
