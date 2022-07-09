import { Avatar, Box, Card, CardContent, Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import HowToRegIcon from "@mui/icons-material/HowToReg"
import firebase from "../../../../config"
import { State } from "../../../../types/state"

export var ProfileInfo = function () {
  const [votes, setVotes] = useState<any[]>([])

  const user = useSelector((state: State) => state.user.value)

  useEffect(() => {
    const photosUnsubscribe = firebase
      .firestore()
      .collection(`users/${user?.uid}/votes`)
      .onSnapshot((querySnapshot: any) => {
        const userVotes: any[] = []
        querySnapshot.forEach((doc: any) => {
          userVotes.push(doc)
        })
        setVotes(userVotes)
      })
    return () => {
      photosUnsubscribe()
    }
  }, [user])
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Card elevation={6} sx={{ height: "100%" }}>
          <CardContent>
            <Grid
              container
              spacing={3}
              sx={{ justifyContent: "space-between" }}
            >
              <Grid item>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="overline"
                >
                  TOKENS
                </Typography>
                <Typography color="textPrimary" variant="h4">
                  {Math.floor((user?.points || 0) / 10)}
                </Typography>
              </Grid>
              <Grid item>
                <Avatar
                  sx={{
                    backgroundColor: "error.main",
                    height: 56,
                    width: 56,
                  }}
                >
                  <FavoriteBorderIcon />
                </Avatar>
              </Grid>
            </Grid>
            <Box
              sx={{
                pt: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography color="textSecondary" variant="caption">
                How many votes you can still recieve
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card elevation={6} sx={{ height: "100%" }}>
          <CardContent>
            <Grid
              container
              spacing={3}
              sx={{ justifyContent: "space-between" }}
            >
              <Grid item>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="overline"
                >
                  Voted
                </Typography>
                <Typography color="textPrimary" variant="h4">
                  {votes.length}
                </Typography>
              </Grid>
              <Grid item>
                <Avatar
                  sx={{
                    backgroundColor: "success.main",
                    height: 56,
                    width: 56,
                  }}
                >
                  <HowToRegIcon />
                </Avatar>
              </Grid>
            </Grid>
            <Box
              sx={{
                pt: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography color="textSecondary" variant="caption">
                Votes you have given
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
