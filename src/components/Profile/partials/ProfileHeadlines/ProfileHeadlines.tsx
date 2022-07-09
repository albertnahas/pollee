import { Grid, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { useSelector } from "react-redux"
import { userSelector } from "../../../../store/userSlice"

export const ProfileHeadlines = () => {
  const user = useSelector(userSelector)
  const headlines = useMemo(() => {
    return [
      {
        label: "Streak",
        value: user?.streak || 0,
        info: "Number of days played in row",
      },
      {
        label: "Games",
        value: user?.gamesPlayed || 0,
        info: "Number of total games played",
      },
      {
        label: "Languages",
        value: user?.languages?.length || 0,
        info: "Number of languages guessed correctly in all games",
      },
    ]
  }, [user])

  const renderHeadlines = () =>
    headlines.map((h) => (
      <Grid key={h.label} xs={4} item>
        <Typography color="text.secondary" variant="body1">
          {h.label}
        </Typography>
        <Typography color="info.main" variant="h4">
          {h.value}
        </Typography>
      </Grid>
    ))

  return (
    <Grid sx={{ textALign: "center" }} container>
      {renderHeadlines()}
    </Grid>
  )
}
