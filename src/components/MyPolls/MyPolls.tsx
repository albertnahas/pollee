import { useEffect, useState } from "react"
import { Container, Box, Grid, CircularProgress, Alert } from "@mui/material"
import ModalDialog from "../../molecules/ModalDialog/ModalDialog"
import { PhotoDetails } from "./PhotoDetails"
import useUserPhotos, { PhotoState, sort } from "../../hooks/useUserPhotos"
import { PhotoCard } from "./PhotoCard"
import { SortByControl } from "../../atoms/SortByControl/SortByControl"
import { PhotoActions } from "./PhotoActions"
import { useNavigate } from "react-router-dom"

export var MyPolls = function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [view, setView] = useState("classic")

  const [selectedPhoto, setSelectedPhoto] = useState<PhotoState | null>()
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false)

  const navigate = useNavigate()
  const { photos, photosLoaded, sortBy, setSortBy } = useUserPhotos()

  const displayPhotos = () =>
    photos.map((p: any) => {
      const photo = p.data()
      return (
        <Grid key={p.id} item xs={view !== "two-col" ? 12 : 6} md={3}>
          <PhotoCard
            view={view}
            photo={photo}
            photoId={p.id}
            onClickPhoto={() =>
              photo ? setSelectedPhoto(p) : navigate("/post")
            }
          />
        </Grid>
      )
    })

  useEffect(() => {
    // syc selectedPhoto
    if (selectedPhoto) {
      const updatedPhoto = photos.find((p) => selectedPhoto?.id === p.id)
      setSelectedPhoto(updatedPhoto || null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos])

  useEffect(() => {
    if (selectedPhoto) {
      setOpenPhotoDialog(true)
    } else {
      setOpenPhotoDialog(false)
    }
  }, [selectedPhoto])

  useEffect(() => {
    if (!openPhotoDialog) {
      setSelectedPhoto(null)
    }
  }, [openPhotoDialog])

  const containerStyle = {
    mb: 2,
  }

  const controlsContainerStyle = {
    mb: 2,
    mt: 2,
    display: "flex",
  }

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        pt: 4,
        pb: 6,
        pl: { xs: 2, md: 0 },
        pr: { xs: 2, md: 0 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={containerStyle}>
          {photosLoaded &&
            photos.filter((p) => p.data().active).length === 0 && (
              <Alert severity="info">
                {photos.length === 0
                  ? "Start posting your polls here"
                  : "Activate your post using the switch button to start receiving votes"}
              </Alert>
            )}
        </Box>
        {photosLoaded && (
          <Box sx={controlsContainerStyle}>
            <SortByControl
              value={sortBy}
              onChange={(value: sort) => {
                setSortBy(value)
              }}
            />
          </Box>
        )}
        <Grid sx={containerStyle} spacing={2} container>
          {displayPhotos()}
          <Grid item xs={12} md={3}>
            <PhotoCard onClickShowForm={() => navigate("/post")} view={view} />
          </Grid>
        </Grid>
      </Container>
      {!photosLoaded && <CircularProgress />}
      <ModalDialog
        closeButton={true}
        open={openPhotoDialog}
        setOpen={setOpenPhotoDialog}
        actions={
          <PhotoActions
            photoId={selectedPhoto?.id}
            active={selectedPhoto?.data().active}
            condensed={true}
          />
        }
      >
        <PhotoDetails photoId={selectedPhoto?.id} />
      </ModalDialog>
    </Box>
  )
}
