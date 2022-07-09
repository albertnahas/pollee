import {
  alpha,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Grid,
  Typography,
  Divider,
  CardActions,
  Tooltip,
  IconButton,
  Fade,
  Button,
} from "@mui/material"
import { Box, useTheme } from "@mui/system"
import { FC } from "react"
import RateProgressBar, {
  getRatingColor,
} from "../../atoms/RateProgressBar/RateProgressBar"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import { PhotoActions } from "./PhotoActions"
import { Poll } from "../../types/poll"
import _ from "lodash"

export const PhotoCard: FC<Props> = ({
  photo,
  photoId,
  onClickPhoto,
  view,
  onClickShowForm,
}) => {
  const theme = useTheme()
  const photoRatePercentage = photo?.rate ? photo?.rate * 20 : undefined
  //choice with maximum votesCount
  const maxVotesChoice =
    photo?.type === "poll" ? _.maxBy(photo?.choices, "votesCount") : undefined

  return (
    <Fade in={true}>
      <Card variant="outlined" sx={{ maxWidth: 345 }}>
        <CardActionArea onClick={onClickPhoto}>
          <CardMedia
            component="img"
            height={view !== "two-col" ? 300 : 200}
            image={
              photo?.imageUrl ? photo.imageUrl : "./assets/imgs/placeholder.svg"
            }
            alt={photo ? photo.imageName : "add"}
          />
          {photo && (
            <CardContent>
              <Typography
                variant="body2"
                component="p"
                sx={{ fontStyle: "bold" }}
                color="primary"
              >
                {photo.headline}
              </Typography>
              <Grid
                sx={{ alignItems: "center", height: 30, my: 0.5 }}
                container
              >
                {photo.type === "rate" && (
                  <>
                    <Grid xs={view !== "two-col" ? 9 : 8} item>
                      <RateProgressBar value={(photo?.rate || 0) * 20} />
                    </Grid>
                    <Grid xs={view !== "two-col" ? 3 : 4} item>
                      <Box
                        sx={{
                          background: getRatingColor(
                            theme,
                            photoRatePercentage
                          ),
                          fontSize: 11,
                          borderRadius: 1,
                          color: "white",
                          width: 35,
                          ml: view !== "two-col" ? 2 : 0.5,
                          p: 0.2,
                        }}
                      >
                        {photo.rate ? `${photo.rate * 2}/10` : "?"}
                      </Box>
                    </Grid>
                  </>
                )}
                {photo.type === "poll" && maxVotesChoice && (
                  <Grid xs={12} item>
                    <Button
                      variant="outlined"
                      fullWidth
                      color="primary"
                      sx={{
                        background: `linear-gradient(90deg, ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}, ${alpha(theme.palette.primary.light, 0.25)} ${
                          ((maxVotesChoice.votesCount || 0) * 100) /
                          (photo.votesCount || 1)
                        }%, transparent 0)`,
                      }}
                      size="small"
                    >
                      {maxVotesChoice.text}
                    </Button>
                  </Grid>
                )}
              </Grid>
              <Typography variant="caption" color="text.secondary">
                {photo.votesCount
                  ? `based on ${photo.votesCount} ${
                      photo.votesCount === 1 ? "vote" : "votes"
                    }`
                  : "no votes yet on this poll"}
              </Typography>
            </CardContent>
          )}
          {photo && <Divider variant="middle" />}
        </CardActionArea>
        <CardActions
          style={{ justifyContent: `${photo ? "unset" : "center"}` }}
        >
          {photo && <PhotoActions active={photo.active} photoId={photoId} />}
          {!photo && (
            <Tooltip title="Add photo">
              <IconButton
                aria-label="delete"
                size="large"
                onClick={onClickShowForm}
              >
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      </Card>
    </Fade>
  )
}

interface Props {
  photo?: Poll
  photoId?: string
  onClickPhoto?: () => void
  view?: string
  onClickShowForm?: () => void
}
