import * as React from "react"
import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress"
import { Theme, useTheme } from "@mui/system"

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    // backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}))

export const getRatingColor = (theme: Theme, val?: number) => {
  if (!val) return theme.palette.primary.light

  if (val <= 25) return theme.palette.error.light
  if (val <= 50) return theme.palette.warning.light
  if (val <= 85) return theme.palette.primary.light
  return theme.palette.success.light
}

const RateProgressBar: React.FC<Props> = (props) => {
  const translateX = (props.value || 0) - 100
  const theme = useTheme()
  return (
    <Box sx={{ flexGrow: 1 }}>
      <BorderLinearProgress
        sx={{
          [`& .${linearProgressClasses.bar}`]: {
            background: getRatingColor(theme, props.value || 0),
            backgroundPositionX: translateX * -1,
          },
        }}
        variant="determinate"
        value={props.value || 0}
      />
    </Box>
  )
}

export default RateProgressBar
interface Props {
  value?: number
}
