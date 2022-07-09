import React, { FC } from "react"
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material"

export var SelectGender: FC<Props> = function (props) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{props.label}</FormLabel>
      <RadioGroup
        row
        aria-label={props.name}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
      >
        <FormControlLabel
          value="female"
          control={<Radio size="small" />}
          label="Females"
        />
        <FormControlLabel
          value="male"
          control={<Radio size="small" />}
          label="Males"
        />
        <FormControlLabel
          value="both"
          control={<Radio size="small" />}
          label="Both"
        />
      </RadioGroup>
    </FormControl>
  )
}

interface Props {
  label: string
  value?: string
  name: string
  onChange: (event: any, value: string) => void
}
