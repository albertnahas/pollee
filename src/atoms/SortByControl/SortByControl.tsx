import { ButtonGroup, IconButton, Tooltip, useTheme } from "@mui/material"
import React, { FC } from "react"
import EventIcon from "@mui/icons-material/Event"
import GradeIcon from "@mui/icons-material/Grade"
import GroupAddIcon from "@mui/icons-material/GroupAdd"
import { sort } from "../../hooks/useUserPhotos"
import { themeShadows } from "../../utils/utils"

export var SortByControl: FC<Props> = function (props) {
  const theme = useTheme()
  return (
    <>
      <ButtonGroup
        sx={{ boxShadow: themeShadows[6] }}
        color="secondary"
        variant="outlined"
      >
        <Tooltip title="Sort by date">
          <IconButton
            aria-label="add"
            size="large"
            sx={{
              color:
                props.value === "uploadedAt"
                  ? theme.palette.primary.light
                  : theme.palette.text.disabled,
            }}
            onClick={() => {
              props.onChange("uploadedAt")
            }}
          >
            <EventIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Sort by rate">
          <IconButton
            aria-label="add"
            size="large"
            sx={{
              color:
                props.value === "rate"
                  ? theme.palette.primary.light
                  : theme.palette.text.disabled,
            }}
            onClick={() => {
              props.onChange("rate")
            }}
          >
            <GradeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Sort by votes count">
          <IconButton
            aria-label="add"
            size="large"
            sx={{
              color:
                props.value === "votesCount"
                  ? theme.palette.primary.light
                  : theme.palette.text.disabled,
            }}
            onClick={() => {
              props.onChange("votesCount")
            }}
          >
            <GroupAddIcon />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
    </>
  )
}

interface Props {
  value?: sort
  onChange: (value: sort) => void
}
