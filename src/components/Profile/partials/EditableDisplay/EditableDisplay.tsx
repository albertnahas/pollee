import React, { FC, useState } from "react"
import EditIcon from "@mui/icons-material/Edit"
import CheckIcon from "@mui/icons-material/Check"
import {
  Chip,
  Typography,
  FormControl,
  OutlinedInput,
  IconButton,
  FormHelperText,
} from "@mui/material"
import { useDispatch } from "react-redux"
import { setSnackbar } from "../../../../store/snackbarSlice"

export const EditableDisplay: FC<Props> = ({ name, label, text, onSubmit }) => {
  const [editMode, setEditMode] = useState(false)
  const [value, setValue] = useState(text)

  const dispatch = useDispatch()

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  const onClickSubmit = () => {
    onSubmit?.(value).then(() => {
      setEditMode(false)
      dispatch(
        setSnackbar({
          open: true,
          message: `${label} has been updated!`,
          type: "success",
        })
      )
    })
  }

  return (
    <>
      {!editMode && (
        <Chip
          label={<Typography variant="body1">{value}</Typography>}
          // onClick={() => setEditMode(true)}
          onDelete={() => setEditMode(true)}
          deleteIcon={<EditIcon fontSize="small" />}
        />
      )}
      {!!editMode && (
        <FormControl variant="outlined">
          <OutlinedInput
            id={`${name}-input`}
            value={value}
            onChange={handleValueChange}
            size="small"
            endAdornment={
              <IconButton
                aria-label={`submit ${name}`}
                onClick={onClickSubmit}
                onMouseDown={onClickSubmit}
                edge="end"
              >
                <CheckIcon />
              </IconButton>
            }
            aria-describedby={`${name}-helper-text`}
            inputProps={{
              "aria-label": `${name}`,
            }}
          />
          <FormHelperText id={`${name}-helper-text`}>
            {!!label && label}
          </FormHelperText>
        </FormControl>
      )}
    </>
  )
}

interface Props {
  name: string
  label?: string
  text?: string
  onSubmit?: (val?: string) => Promise<any>
}
