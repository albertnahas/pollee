import { useState } from "react"
import { useSelector } from "react-redux"
import { State } from "../types/state"
import firebase from "../config"
import { Photo } from "../types/photo"

const usePhotos = () => {
  const functions = firebase.functions()

  const user = useSelector((state: State) => state.user.value)
  const [photosLoaded, setPhotosLoaded] = useState(false)

  const getPhotos = () => {
    const getPhotosCallable = functions.httpsCallable("getPhotos")
    return getPhotosCallable({ userId: user?.uid }).then(
      (res: { data: Photo[] }) => {
        setPhotosLoaded(true)
        return new Promise<{ data: Photo[] }>((resolve, reject) => {
          resolve(res)
        })
      }
    )
  }

  return {
    getPhotos,
    photosLoaded,
  }
}

export default usePhotos
