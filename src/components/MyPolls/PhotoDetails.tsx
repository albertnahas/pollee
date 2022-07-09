/* eslint-disable jsx-a11y/img-redundant-alt */
import {
  Button,
  ButtonGroup,
  alpha,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material"
import { Box, useTheme } from "@mui/system"
import React, { FC, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import RateProgressBar from "../../atoms/RateProgressBar/RateProgressBar"
import firebase from "../../config"
import { State } from "../../types/state"
import { Comment, Poll } from "../../types/poll"
import { ModeCommentOutlined } from "@mui/icons-material"
import { MiniProfileAvatar } from "../TopBar/TopBar"

export var PhotoDetails: FC<Props> = function (props) {
  const [votes, setVotes] = useState<any[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [likes, setLikes] = useState<number>()
  const [photo, setPhoto] = useState<Poll>()

  const user = useSelector((state: State) => state.user.value)
  const theme = useTheme()

  // const overview: any[] = [];
  const overview = useMemo(() => {
    return votes.reduce((acc, val) => {
      const segment = Math.round(val.rate)
      acc[segment] = acc[segment] ? acc[segment] + 1 : 1
      return acc
    }, {})
  }, [votes])

  useEffect(() => {
    if (!user || !props.photoId) {
      return
    }
    const votesUnsubscribe = firebase
      .firestore()
      .collection(`users/${user.uid}/photos/${props.photoId}/votes`)
      .onSnapshot((querySnapshot: any) => {
        const usersVotes: any[] = []
        querySnapshot.forEach((doc: any) => {
          usersVotes.push(doc.data())
        })
        setVotes(usersVotes)
      })
    const likesUnsubscribe = firebase
      .firestore()
      .collection(`users/${user.uid}/photos/${props.photoId}/likes`)
      .onSnapshot((querySnapshot: any) => {
        setLikes(querySnapshot.size)
      })
    const commentsUnsubscribe = firebase
      .firestore()
      .collection(`users/${user.uid}/photos/${props.photoId}/comments`)
      .onSnapshot((querySnapshot: any) => {
        const usersComments: any[] = []
        querySnapshot.forEach((doc: any) => {
          usersComments.push(doc.data())
        })
        setComments(usersComments)
      })
    return () => {
      votesUnsubscribe()
      commentsUnsubscribe()
      likesUnsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, props.photoId])

  useEffect(() => {
    if (!user || !props.photoId) {
      return
    }
    const photoUnsubscribe = firebase
      .firestore()
      .collection(`users/${user.uid}/photos/`)
      .doc(props.photoId)
      .onSnapshot((querySnapshot: any) => {
        setPhoto({ ...querySnapshot.data() })
      })
    return () => {
      photoUnsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const displayOverview = () => (
    <List dense>
      {Object.entries(overview).map((c: any[]) => (
        <React.Fragment key={c[0]}>
          <Tooltip
            title={`${c[1]} ${c[1] === 1 ? "user" : "users"} out of ${
              votes.length
            } rated this photo as ${c[0] * 2 - 1} or ${c[0] * 2}`}
          >
            <ListItem>
              <ListItemIcon sx={{ mr: 1 }}>
                {`${c[0] * 2 - 1}-${c[0] * 2} (${c[1]})`}
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <RateProgressBar
                      value={(c[1] * 100) / (votes?.length || 0)}
                    />
                  </>
                }
                color={theme.palette.text.secondary}
              />
            </ListItem>
          </Tooltip>
        </React.Fragment>
      ))}
    </List>
  )

  const displayComments = () => (
    <List dense>
      {comments.map((c) => (
        <React.Fragment key={c.text}>
          <ListItem>
            <ListItemIcon>
              <MiniProfileAvatar
                sx={{ width: 20, height: 20 }}
                src={c.photoURL}
                alt="profile"
              >
                <ModeCommentOutlined fontSize="small" />
              </MiniProfileAvatar>
            </ListItemIcon>
            <ListItemText
              primary={c.text}
              secondary={
                <Typography
                  sx={{
                    fontSize: 11,
                  }}
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  {c && c.createdAt && c.createdAt?.toDate().toLocaleString()}
                </Typography>
              }
              color={theme.palette.text.secondary}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  )

  return (
    <Grid sx={{ pt: 2 }} container>
      <Grid md={4} sx={{ pl: { xs: 0, md: 1 } }} item>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            mb: 2,
            minHeight: "200px",
          }}
        >
          <img
            style={{ width: "100%", minHeight: 200, marginBottom: -4 }}
            src={photo?.imageUrl || "./assets/imgs/placeholder.svg"}
            alt={photo?.imageName}
          />
        </Paper>
        {photo && photo.type === "rate" && (
          <Grid sx={{ mb: 1 }} xs={12} item>
            <RateProgressBar value={(photo?.rate || 0) * 20} />
          </Grid>
        )}
      </Grid>
      <Grid md={8} sx={{ pl: { xs: 0, md: 2 } }} item>
        <Typography
          sx={{ mb: 1 }}
          variant="h5"
          color={theme.palette.primary.main}
        >
          {photo?.headline}
        </Typography>
        {photo?.type === "rate" &&
          (photo?.rate ? (
            <Typography
              sx={{ mb: 1, mt: { xs: 1, md: 0 } }}
              variant="h6"
              color={theme.palette.primary.main}
            >
              {`Rate: ${(photo?.rate || 0) * 2}/10`}{" "}
            </Typography>
          ) : (
            <Typography
              sx={{ mb: 1, fontWeight: 400 }}
              variant="h6"
              color={theme.palette.text.secondary}
            >
              No votes yet{" "}
            </Typography>
          ))}

        {photo && photo.type === "poll" && photo.choices && (
          <ImageList>
            {photo.choices.map(
              (choice, index) =>
                choice.imageUrl && (
                  <ImageListItem key={index}>
                    <img
                      src={`${choice.imageUrl}`}
                      alt={choice.text}
                      loading="lazy"
                    />
                    <ImageListItemBar title={choice.text} position="below" />
                  </ImageListItem>
                )
            ) || <></>}
          </ImageList>
        )}

        {photo && photo.type === "poll" && (
          <ButtonGroup
            disabled={!!votes.find((v) => v.id === photo.id)}
            orientation="vertical"
            fullWidth
          >
            {photo.choices?.map((choice, index) => (
              <Button
                key={index}
                variant="outlined"
                fullWidth
                color="primary"
                sx={{
                  background: `linear-gradient(90deg, ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}, ${alpha(theme.palette.primary.light, 0.25)} ${
                    ((choice.votesCount || 0) * 100) / (photo.votesCount || 1)
                  }%, transparent 0)`,
                }}
              >
                {choice.text}{" "}
                {choice.votesCount &&
                  `${(choice.votesCount * 100) / (photo.votesCount || 0)}%`}
              </Button>
            ))}
          </ButtonGroup>
        )}

        {photo?.type === "poll" && (
          <Typography
            sx={{ mt: 1 }}
            variant="body2"
            color={theme.palette.text.secondary}
          >
            {photo?.votesCount
              ? `Based on ${photo?.votesCount} vote${
                  photo.votesCount === 1 ? "" : "s"
                } `
              : "No votes yet"}
          </Typography>
        )}

        <Grid sx={{ mt: 2 }} container>
          {comments.length > 0 && (
            <Grid md={8} xs={12} item>
              <Box>
                <Typography variant="body2" color={theme.palette.primary.main}>
                  Comments{" "}
                </Typography>
                {displayComments()}
              </Box>
            </Grid>
          )}

          {votes.length > 1 && Object.entries(overview).length > 1 && (
            <Grid md={5} xs={12} item>
              <Box>
                <Typography variant="body2" color={theme.palette.primary.main}>
                  Overview ({votes.length}{" "}
                  {votes.length === 1 ? "vote" : "votes"})
                </Typography>

                {displayOverview()}
              </Box>
            </Grid>
          )}
        </Grid>

        <Typography
          sx={{ mt: 2, fontSize: 12 }}
          variant="body2"
          color={theme.palette.text.secondary}
        >
          {likes ? `${likes} like${likes === 1 ? "" : "s"}` : "No likes yet"}
        </Typography>
        {photo?.ageRange && photo?.ageRange.length === 2 && (
          <Typography
            sx={{ mt: 2, fontSize: 12 }}
            variant="body2"
            color={theme.palette.text.secondary}
          >
            Voters age range: {photo?.ageRange[0]} - {photo?.ageRange[1]}{" "}
          </Typography>
        )}
        {photo?.updatedAt && (
          <Typography
            sx={{ mt: 1, fontSize: 12 }}
            variant="body2"
            color={theme.palette.text.secondary}
          >
            Last update: {photo?.updatedAt.toDate().toLocaleString()}{" "}
          </Typography>
        )}
      </Grid>
    </Grid>
  )
}

interface Props {
  photoId?: string | null
}
