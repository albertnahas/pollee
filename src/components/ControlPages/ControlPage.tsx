import React, { FC } from "react"
import { Container, Typography } from "@mui/material"
import { styled } from "@mui/system"
import { Link } from "react-router-dom"

export var ControlLink = styled(Link)(
  ({ theme }) => `
  text-decoration: none;
  color: ${theme.palette.primary.main};
  cursor: pointer;
`
)

export var ControlHeading1 = styled(Typography)`
  font-size: 3.75rem;
`

export var ControlHeading2 = styled(Typography)`
  font-size: 1.5rem;
  font-weight: 500;
`

export var ControlHeading3 = styled(Typography)`
  padding-top: 0.25em;
  font-size: 1.25rem;
  font-weight: 400;
`

export var ControlPage: FC<Props> = function ({ children }) {
  return (
    <Container
      sx={{ py: 6, px: 4, flexGrow: 1, "& p": { color: "text.secondary" } }}
    >
      {children}
    </Container>
  )
}
interface Props {
  children?: JSX.Element
}
