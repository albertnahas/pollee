import React, { FC } from "react"
import { styled } from "@mui/material/styles"
import "./GameBadge.css"

const marginAuto = { top: 0, left: 0, right: 0, bottom: 0, margin: "auto" }

const Badge = styled("div")(({ theme }) => ({
  position: "relative",
  margin: "1.5em 3em",
  width: "4em",
  height: "6.2em",
  borderRadius: "10px",
  display: "inline-block",
  top: "0",
  transition: "all 0.2s ease",
  "&:before, &:after": {
    position: "absolute",
    width: "inherit",
    height: "inherit",
    borderRadius: "inherit",
    background: "inherit",
    content: '""',
    ...marginAuto,
  },
  "&:before": {
    transform: "rotate(60deg)",
  },
  "&:after": {
    transform: "rotate(-60deg)",
  },
  "&:hover": {
    top: "-4px",
  },
  "& svg": {
    display: "inline-block",
    marginTop: theme.spacing(1),
    fontSize: "2em",
  },
}))

const Circle = styled("div")(({ theme }) => ({
  width: "60px",
  height: "60px",
  position: "absolute",
  background: "#fff",
  zIndex: "10",
  borderRadius: "50%",
  ...marginAuto,
}))

const Ribbon = styled("div")(({ theme }) => ({
  position: "absolute",
  borderRadius: "4px",
  padding: theme.spacing(0.2),
  paddingBottom: theme.spacing(1),
  width: "100px",
  zIndex: "11",
  color: "#fff",
  bottom: "12px",
  left: "50%",
  marginLeft: "-52px",
  height: "15px",
  fontSize: theme.typography.body1.fontSize,
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.27)",
  textShadow: "0 2px 2px rgba(0, 0, 0, 0.1)",
  textTransform: "uppercase",
  background: "linear-gradient(to bottom right, #555 0%, #333 100%)",
  cursor: "default",
}))

export const GameBadge: FC<Props> = ({ label, icon, color }) => {
  return (
    <Badge className={`badge-${color || "gold"}`}>
      <Circle>{icon}</Circle>
      <Ribbon>{label}</Ribbon>
    </Badge>
  )
}

interface Props {
  label?: string
  icon: JSX.Element
  color?:
    | "yellow"
    | "orange"
    | "pink"
    | "red"
    | "purple"
    | "teal"
    | "blue"
    | "blue-dark"
    | "green"
    | "green-dark"
    | "silver"
    | "gold"
}
