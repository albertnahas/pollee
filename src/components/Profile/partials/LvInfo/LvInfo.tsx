import { Grid, Chip, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { useSelector } from "react-redux"
import { ProgressLine } from "../../../../atoms/ProgressLine/ProgressLine"
import { userSelector } from "../../../../store/userSlice"
import { getLv } from "../../../../utils/helpers"

export const LvInfo = () => {
  const user = useSelector(userSelector)
  const lvInfo = useMemo(() => {
    return getLv(user?.xp)
  }, [user])
  return (
    <Grid sx={{ alignItems: "center" }} container>
      <Grid xs={8} item>
        <Chip
          color="secondary"
          sx={{ fontWeight: "bold", color: "white", mr: 1 }}
          size="small"
          label={`LV${lvInfo?.lv}`}
        />
        <Typography color="text.secondary" variant="caption" component="span">
          XP {user?.xp}/{lvInfo?.next}
        </Typography>
        <ProgressLine
          variant="determinate"
          value={lvInfo?.progress}
          color="secondary"
          sx={{ my: 1 }}
        />
        <Typography color="text.secondary" component="div" variant="caption">
          {lvInfo?.next - (user?.xp || 0)} to LV{lvInfo?.lv + 1}
        </Typography>
      </Grid>
      <Grid xs={1} item></Grid>
      <Grid xs={3} item>
        <Typography color="secondary" variant="h6">
          {lvInfo?.progress}%
        </Typography>
      </Grid>
    </Grid>
  )
}
