import {
  alpha,
  Button,
  ButtonBase,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Container,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import useFeeds from "../../hooks/useFeeds"
import { Comment, Poll } from "../../types/poll"
import FavoriteIcon from "@mui/icons-material/Favorite"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { MiniProfileAvatar, SmallProfileAvatar } from "../TopBar/TopBar"
import { UserCircle as UserCircleIcon } from "../../icons/user-circle"
import { useSelector } from "react-redux"
import { userSelector } from "../../store/userSlice"
import moment from "moment"
import PhotoRating from "../../atoms/PhotoRating/PhotoRating"
import firebase from "../../config"
import { useState } from "react"
import ModalDialog from "../../molecules/ModalDialog/ModalDialog"
import {
  ChevronLeftOutlined,
  ChevronRightOutlined,
  FavoriteBorder,
  ModeCommentOutlined,
  SendRounded,
} from "@mui/icons-material"
import PullToRefresh from "react-simple-pull-to-refresh"
import { Box } from "@mui/system"
// import InfiniteScroll from "react-infinite-scroller"
import InfiniteScroll from "react-infinite-scroll-component"

export const Feeds = () => {
  const user = useSelector(userSelector)
  const [voting, setVoting] = useState<boolean | string>(false)
  const [commenting, setCommenting] = useState<{
    id: string
    comment: string
    submitting: boolean
  }>()
  const [comments, setComments] = useState<Comment[]>([])
  const [likes, setLikes] = useState<string[]>([])

  const [lightbox, setLightbox] = useState<
    | {
        images: { text: string; imageUrl: string }[]
        selectedIndex: number
        open: boolean
      }
    | undefined
  >()

  const { polls, pollsLoaded, hasMore, votes, loadFeeds } = useFeeds()
  const theme = useTheme()

  const onVote = (poll: Poll, vote?: string | number) => {
    if (!vote || voting) return
    setVoting(poll.id || true)
    const voteObj = {
      userId: user?.uid,
      votedAt: firebase.firestore.FieldValue.serverTimestamp(),
      vote,
    }
    return firebase
      .firestore()
      .collection(`users/${poll?.userId}/photos/${poll?.id}/votes`)
      .add(voteObj)
      .then((res) => {
        setVoting(false)
      })
      .catch((err) => {
        console.log(err)
        setVoting(false)
      })
  }
  const onLike = (poll: Poll) => {
    if (!poll.id || likes.includes(poll.id)) return
    setLikes((prevLikes) => [...prevLikes, poll.id || ""])

    return firebase
      .firestore()
      .collection(`users/${poll?.userId}/photos/${poll?.id}/likes`)
      .add({
        userId: user?.uid,
        likedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
  }

  const onComment = (poll: Poll, comment?: string) => {
    if (!comment || !poll.id || likes.includes(poll.id)) return
    const commentObj = {
      userId: user?.uid,
      text: comment,
      displayName: user?.displayName,
      photoURL: user?.photoURL,
    }

    setCommenting({ id: poll.id || "", comment, submitting: true })

    return firebase
      .firestore()
      .collection(`users/${poll?.userId}/photos/${poll?.id}/comments`)
      .add({
        ...commentObj,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((res) => {
        setCommenting(undefined)
        setComments((prevComments) => [
          ...prevComments,
          { id: poll.id, ...commentObj },
        ])
      })
  }

  const displayPolls = () =>
    polls.map((poll: Poll) => {
      const totalVotes =
        poll.choices?.reduce((acc, val) => acc + (val.votesCount || 0), 0) || 1
      const voted = !!votes.find((v) => v.id === poll.id) || voting === poll.id
      var currentTimestamp = moment(new Date()).format("HH:mm:ss")
      const timelapse = poll.uploadedAt
        ? moment
            .duration(
              moment(currentTimestamp, "HH:mm:ss").diff(
                moment(poll.uploadedAt?.toDate(), "HH:mm:ss")
              )
            )
            .humanize() + " ago"
        : "No games yet"
      return (
        <Card key={poll.id} sx={{ my: 1 }} variant="outlined">
          <CardHeader
            avatar={
              <SmallProfileAvatar src={poll.photoURL} alt="profile">
                <UserCircleIcon fontSize="small" />
              </SmallProfileAvatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={poll.displayName}
            subheader={timelapse}
            sx={{ textAlign: "left" }}
          />
          {poll.imageUrl && (
            <CardMedia
              component="img"
              image={poll.imageUrl}
              alt={poll.imageName}
            />
          )}
          <CardContent>
            <Typography
              sx={{ textAlign: "left" }}
              variant="body1"
              color="text.primary"
            >
              {poll.headline}
            </Typography>
            <Typography
              sx={{ textAlign: "left", mb: 1 }}
              variant="body2"
              color="text.secondary"
            >
              {poll.description}
            </Typography>
            {poll.type === "rate" && (
              <PhotoRating
                value={voted ? poll.rate || 0 : 0}
                onRatingChange={(event, newValue) => {
                  newValue && onVote(poll, newValue)
                }}
                disabled={voted}
              />
            )}
            {poll.type === "poll" && poll.choices && (
              <ImageList>
                {poll.choices.map(
                  (choice, index) =>
                    choice.imageUrl && (
                      <ButtonBase
                        onClick={() => {
                          setLightbox({
                            open: true,
                            images:
                              poll.choices?.map((c, i) => {
                                return {
                                  text: c.text || i.toString(),
                                  imageUrl: c.imageUrl || "",
                                }
                              }) || [],
                            selectedIndex: index,
                          })
                        }}
                      >
                        <ImageListItem key={index}>
                          <img
                            src={`${choice.imageUrl}`}
                            alt={choice.text}
                            loading="lazy"
                          />
                          <ImageListItemBar
                            title={choice.text}
                            position="below"
                          />
                        </ImageListItem>
                      </ButtonBase>
                    )
                ) || <></>}
              </ImageList>
            )}
            {poll.type === "poll" && (
              <ButtonGroup disabled={voted} orientation="vertical" fullWidth>
                {poll.choices?.map((choice, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    fullWidth
                    color="primary"
                    sx={{
                      background: !voted
                        ? "transparent"
                        : `linear-gradient(90deg, ${alpha(
                            theme.palette.primary.main,
                            0.2
                          )}, ${alpha(theme.palette.primary.light, 0.25)} ${
                            ((choice.votesCount || 0) * 100) / totalVotes
                          }%, transparent 0)`,
                    }}
                    onClick={() => onVote(poll, choice.text)}
                  >
                    {choice.text}
                  </Button>
                ))}
              </ButtonGroup>
            )}
            {commenting?.id === poll.id && (
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  label="Comment"
                  margin="none"
                  size="small"
                  name="comment"
                  aria-label="comment"
                  onChange={(e) =>
                    setCommenting({
                      id: poll.id || "",
                      comment: e.target.value,
                      submitting: false,
                    })
                  }
                  value={commenting?.comment || ""}
                  variant="outlined"
                  InputProps={{
                    endAdornment: commenting?.submitting ? (
                      <CircularProgress size={20} />
                    ) : (
                      <IconButton
                        onClick={() => {
                          onComment(poll, commenting?.comment)
                        }}
                      >
                        <SendRounded fontSize="medium" />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
            )}
            {comments
              .filter((c) => c.id === poll.id)
              ?.map((comment) => (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <MiniProfileAvatar
                      sx={{ width: 20, height: 20 }}
                      src={comment.photoURL}
                      alt="profile"
                    >
                      <UserCircleIcon fontSize="small" />
                    </MiniProfileAvatar>
                    <Box sx={{ textAlign: "left", ml: 2 }}>
                      <Typography
                        sx={{
                          color: "text.secondary",
                        }}
                        variant="subtitle2"
                      >
                        {comment.displayName}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "small",
                          color: "text.secondary",
                        }}
                        variant="body2"
                      >
                        {comment.text}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )) || <></>}
          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              onClick={() => onLike(poll)}
              aria-label="add to favorites"
            >
              {poll.id && likes.includes(poll.id) ? (
                <FavoriteIcon
                  sx={{
                    color: theme.palette.error.light,
                  }}
                />
              ) : (
                <FavoriteBorder
                  sx={{
                    color: theme.palette.action.active,
                  }}
                />
              )}
            </IconButton>
            <IconButton
              onClick={() => {
                setCommenting({
                  id: poll.id || "",
                  comment: "",
                  submitting: false,
                })
              }}
              aria-label="share"
            >
              <ModeCommentOutlined />
            </IconButton>
          </CardActions>
        </Card>
      )
    })
  return (
    <Container maxWidth="sm">
      {pollsLoaded && (
        <PullToRefresh onRefresh={loadFeeds.bind(null, true)}>
          <Box>
            <InfiniteScroll
              dataLength={polls.length}
              next={loadFeeds}
              hasMore={hasMore}
              scrollableTarget="body"
              loader={<CircularProgress />}
              endMessage={
                <Typography
                  sx={{ textAlign: "center", mt: 4, fontWeight: 400 }}
                  color="text.secondary"
                  variant="h6"
                >
                  You're all caught up!
                </Typography>
              }
            >
              {displayPolls()}
            </InfiniteScroll>
          </Box>
        </PullToRefresh>
      )}
      {/* {!pollsLoaded && <CircularProgress />} */}
      <ModalDialog
        open={!!lightbox?.open}
        onClose={() => setLightbox(undefined)}
        maxWidth="md"
      >
        {(!!lightbox && (
          <>
            <img
              style={{ width: "100%" }}
              src={lightbox?.images[lightbox.selectedIndex].imageUrl}
              alt="modal"
            />
            <Typography
              sx={{ textAlign: "center" }}
              color="text.secondary"
              variant="body2"
            >
              <IconButton
                onClick={() =>
                  setLightbox({
                    ...lightbox,
                    selectedIndex:
                      (lightbox.selectedIndex - 1 + lightbox.images.length) %
                      lightbox.images.length,
                  })
                }
              >
                <ChevronLeftOutlined fontSize="medium" />
              </IconButton>
              {lightbox?.images[lightbox.selectedIndex].text}
              <IconButton
                onClick={() =>
                  setLightbox({
                    ...lightbox,
                    selectedIndex:
                      (lightbox.selectedIndex + 1) % lightbox.images.length,
                  })
                }
              >
                <ChevronRightOutlined fontSize="medium" />
              </IconButton>
            </Typography>
          </>
        )) || <></>}
      </ModalDialog>
    </Container>
  )
}
