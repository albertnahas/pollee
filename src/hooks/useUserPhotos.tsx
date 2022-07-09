import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { State } from "../types/state"
import firebase from "../config"
import { Photo } from "../types/photo"
import { useConfirm } from "material-ui-confirm"

export type sort = "uploadedAt" | "rate" | "votesCount"

const useUserPhotos = () => {
  const user = useSelector((state: State) => state.user.value)
  const [photosLoaded, setPhotosLoaded] = useState(false)
  const [photos, setPhotos] = useState<PhotoState[]>([])
  const [sortBy, setSortBy] = useState<sort>("uploadedAt")

  const confirm = useConfirm()

  useEffect(() => {
    if (!user) {
      return
    }
    const photosUnsubscribe = firebase
      .firestore()
      .collection(`users/${user.uid}/photos`)
      .orderBy(sortBy, "desc")
      .onSnapshot((querySnapshot: any) => {
        const userPhotos: PhotoState[] = []
        querySnapshot.forEach((doc: PhotoState) => {
          userPhotos.push(doc)
        })
        setPhotos(userPhotos)
        setPhotosLoaded(true)
        firebase.firestore().collection("users").doc(user.uid).update({
          newVotes: 0,
        })
      })
    return () => {
      photosUnsubscribe()
    }
  }, [user, sortBy])

  const changePhotoStatus = (checked: boolean, id: string) => {
    return firebase
      .firestore()
      .collection(`users/${user?.uid}/photos`)
      .doc(id)
      .update({
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        active: checked,
      })
  }

  const deletePhoto = (id?: string) => {
    confirm({ description: "This action is permanent!" })
      .then(() => {
        firebase
          .firestore()
          .collection(`users/${user?.uid}/photos`)
          .doc(id)
          .delete()
      })
      .catch((e: any) => {
        console.log(e)
      })
  }

  return {
    photos,
    photosLoaded,
    photoUtils: {
      changePhotoStatus,
      deletePhoto,
    },
    sortBy,
    setSortBy,
  }
}

export interface PhotoState {
  id?: string
  data: () => Photo
}

export default useUserPhotos
