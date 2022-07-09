import {
  Autocomplete,
  AutocompleteRenderInputParams,
  TextField,
} from "@mui/material"
import React, { FC } from "react"

export const TagsInput: FC<Props> = ({
  id,
  label,
  options,
  value,
  setValue,
  error,
  helperText,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    switch (event.key) {
      case ",":
      case " ": {
        event.preventDefault()
        event.stopPropagation()
        if (target?.value.length > 0) {
          setValue?.([...(value || []), target?.value])
        }
        break
      }
      default:
    }
  }
  return (
    <Autocomplete
      multiple
      freeSolo
      clearOnBlur
      id={id}
      options={options || []}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option
        }
        return ""
      }}
      value={value || []}
      onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
        if (event.target.value.length > 0) {
          setValue?.([...(value || []), event.target?.value])
        }
      }}
      onChange={(event, newValue) => setValue?.(newValue)}
      filterSelectedOptions
      renderInput={(params: AutocompleteRenderInputParams) => {
        params.inputProps.onKeyDown = handleKeyDown
        return (
          <TextField
            {...params}
            error={error}
            helperText={helperText}
            variant="outlined"
            name={id}
            label={label}
            placeholder={label}
            margin="normal"
            multiline
          />
        )
      }}
    />
  )
}

interface Props {
  id?: string
  label?: string
  options?: string[]
  value?: string[]
  setValue?: (value: string[]) => void
  error?: boolean
  helperText?: string | false
}
