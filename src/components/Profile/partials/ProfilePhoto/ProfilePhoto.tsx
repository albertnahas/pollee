import { Avatar, styled, Badge } from "@mui/material"
import React, { FC, useEffect, useState } from "react"
import EditIcon from "@mui/icons-material/Edit"
import firebase from "../../../../config"
import { userSelector } from "../../../../store/userSlice"
import { useDispatch, useSelector } from "react-redux"
import { setSnackbar } from "../../../../store/snackbarSlice"

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  height: 90,
  width: 90,
  m: "auto",
  my: 0,
  border: `4px solid ${theme.palette.action.disabledBackground}`,
}))

const IconAvatar = styled(Avatar)(({ theme }) => ({
  width: 28,
  height: 28,
  border: `2px solid ${theme.palette.background.paper}`,
}))

const storage = firebase.storage()

export const ProfilePhoto: FC<Props> = ({
  imageAsUrl,
  setImageAsUrl,
  onUpload,
}) => {
  const user = useSelector(userSelector)
  const dispatch = useDispatch()
  const [imageAsFile, setImageAsFile] = useState<any>()
  const [uploading, setUploading] = useState<any>(false)

  useEffect(() => {
    if (imageAsFile) {
      handlePhotoSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageAsFile])

  const handleImageAsFile = (e: any) => {
    const image = e.target.files[0]
    setImageAsFile((imageFile: any) => image)
    setImageAsUrl?.(URL.createObjectURL(image))
  }

  const handlePhotoSubmit = () => {
    // async magic goes here...
    if (!imageAsFile || imageAsFile === "") {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`)
    } else {
      const uploadTask = storage
        .ref(`/images/${user?.uid}/${imageAsFile?.name}`)
        .put(imageAsFile)
      uploadTask.on(
        "state_changed",
        (snapShot: any) => {
          // takes a snap shot of the process as it is happening
          setUploading(true)
        },
        (err: any) => {
          // catches the errors
          console.log(err)
        },
        () => {
          // gets the functions from storage refences the image storage in firebase by the children
          // gets the download url then sets the image from firebase as the value for the imgUrl key:
          storage
            .ref(`images/${user?.uid}`)
            .child(imageAsFile?.name)
            .getDownloadURL()
            .then((fireBaseUrl: string) => {
              setImageAsUrl?.(fireBaseUrl)
              onUpload?.(fireBaseUrl).then(() => {
                setUploading(false)
                dispatch(
                  setSnackbar({
                    open: true,
                    message: `Profile photo has been updated!`,
                    type: "success",
                  })
                )
              })
            })
        }
      )
    }
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageAsFile}
        style={{ display: "none" }}
        id="contained-button-file"
      />
      <label htmlFor="contained-button-file">
        <Badge
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          badgeContent={
            <IconAvatar alt="edit photo">
              <Avatar color="">
                <EditIcon fontSize="small" />
              </Avatar>
            </IconAvatar>
          }
        >
          <ProfileAvatar
            alt={user?.displayName}
            src={uploading ? `/assets/imgs/spinner.webp` : imageAsUrl}
          />
        </Badge>
      </label>
    </>
  )
}

interface Props {
  imageAsUrl?: string
  setImageAsUrl?: (url: string) => void
  onUpload?: (url: string) => Promise<any>
}
