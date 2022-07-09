import * as React from "react"
import clsx from "clsx"
import { styled } from "@mui/system"
import { useSwitch } from "@mui/base/SwitchUnstyled"
import { CSSProperties } from "@mui/styled-engine"

const SwitchRoot = styled("span")`
  display: inline-block;
  position: relative;
  width: 34px;
  height: 16px;
`

const SwitchInput = styled("input")`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 1;
  margin: 0;
  cursor: pointer;
`

const SwitchThumb = styled("span")(
  ({ theme }) => `
  position: absolute;
  display: block;
  background-color: ${theme.palette.mode === "dark" ? "#003892" : "#001e3c"};
  width: 12px;
  height: 12px;
  border-radius: 16px;
  top: 4px;
  left: 5px;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);

  &:before {
    display: block;
    content: "";
    width: 100%;
    height: 100%;
    background-color:#666;
    border-radius:50%;
  }

  &.focusVisible {
    background-color: #79B;
  }

  &.checked {
    transform: translateX(16px);
    
    &:before { background-color:${theme.palette.primary.main}; }
  }
`
)

const SwitchTrack = styled("span")(
  ({ theme }) => `
  background-color: ${theme.palette.background.default};
  border-color: ${theme.palette.action.disabled};
  border-style: solid;
  border-width:2px;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  display: block;

  .checked & {
    border-color:${theme.palette.primary.main};
  }
`
)

const MUISwitch = function ({ style, ...props }: any) {
  const { getInputProps, checked, disabled, focusVisible } = useSwitch(props)

  const stateClasses = {
    checked,
    disabled,
    focusVisible,
  }

  return (
    <SwitchRoot
      style={style}
      className={clsx(stateClasses)}
      aria-label="switch root"
    >
      <SwitchTrack>
        <SwitchThumb className={clsx(stateClasses)} />
      </SwitchTrack>
      <SwitchInput {...getInputProps()} aria-label="switch" />
    </SwitchRoot>
  )
}

export default function SwitchToggle(props: SwitchProps) {
  const handleChange = (e: any) => {
    props.handleToggleChange?.(e.target.checked)
  }
  return (
    <MUISwitch
      style={props.style}
      checked={props.active}
      onChange={handleChange}
    />
  )
}

interface SwitchProps {
  handleToggleChange?: (checked: boolean) => void
  active: boolean
  style?: CSSProperties
}
