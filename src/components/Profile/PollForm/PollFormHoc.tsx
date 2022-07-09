import { FormikProps, useFormik } from "formik"
import * as Yup from "yup"

import React, { useEffect, useState } from "react"
import { Choice, Poll } from "../../../types/poll"
import { useSelector } from "react-redux"
import { userSelector } from "../../../store/userSlice"
import firebase from "../../../config"
import { getResizedName } from "../../../utils/utils"

const storage = firebase.storage()
const initialChoices: Choice[] = [{ text: "" }, { text: "" }]

export function PollFormHoc({ poll, onSubmitSuccess }: Props) {
  const user = useSelector(userSelector)
  const [imageAsFile, setImageAsFile] = useState<any>()
  const [uploading, setUploading] = useState<boolean>(false)

  const formik = useFormik<Poll>({
    initialValues: {
      headline: "",
      description: "",
      ageRange: [16, 60],
      showTo: "both",
      type: "poll",
      choices: initialChoices,
      hashtags: [],
      ...poll,
    },
    validationSchema: Yup.object({
      headline: Yup.string().max(255).required("Headline is required"),
      choices: Yup.array().of(
        Yup.object().shape({
          text: Yup.string().max(255).required("Choice is required"),
        })
      ),
      hashtags: Yup.array().max(6).of(Yup.string().min(2)),
    }),
    onSubmit: (values, { resetForm, setErrors, setSubmitting, setStatus }) => {
      onFormSubmit()
        .then((res: any) => {
          onSubmitSuccess?.()
          setStatus("success")
        })
        .catch((error: any) => {
          setErrors({
            headline: error.message || error,
          })
          setSubmitting(false)
          setStatus("error")
          console.error(error)
        })
    },
  })

  const handleImageAsFile = (e: any) => {
    const image = e.target.files[0]
    setImageAsFile((imageFile: any) => image)
    formik.setFieldValue("imageUrl", URL.createObjectURL(image))
  }

  const handlePhotoSubmit = (imageFile?: any) => {
    return new Promise<ImageProps | undefined>((resolve, reject) => {
      // async magic goes here...
      if (!imageFile || imageFile === "") {
        // const error = `not an image, the image file is a ${typeof imageFile}`
        // reject(error)
        resolve(undefined)
      } else {
        console.log("uploading", imageFile?.name)

        const uploadTask = storage
          .ref(`/images/${user?.uid}/${imageFile?.name}`)
          .put(imageFile)
        uploadTask.on(
          "state_changed",
          (snapShot: any) => {
            // takes a snap shot of the process as it is happening
            setUploading(true)
          },
          (err: any) => {
            // catches the errors
            console.error(err)
            reject(err)
          },
          () => {
            // gets the functions from storage refences the image storage in firebase by the children
            // gets the download url then sets the image from firebase as the value for the imgUrl key:
            const resizedImageName = getResizedName(imageFile?.name)
            return storage
              .ref(`images/${user?.uid}`)
              .child(imageFile?.name)
              .getDownloadURL()
              .then((fireBaseUrl: string) => {
                console.log("uploaded", imageFile?.name)
                resolve({
                  imageUrl: fireBaseUrl,
                  resizedImageName: resizedImageName,
                  imageName: imageFile?.name,
                })
                setUploading(false)
              })
              .catch((err) => {
                reject(err)
              })
          }
        )
      }
    })
  }

  const onFormSubmit = () => {
    if (imageAsFile) {
      return handlePhotoSubmit(imageAsFile).then((res) => {
        return savePoll(res)
      })
    } else {
      return savePoll()
    }
  }

  const savePoll = (imageProps?: ImageProps) => {
    console.log("saving", imageProps)

    return new Promise((resolve, reject) => {
      if (
        formik.values.type === "poll" &&
        formik.values.choices &&
        !!formik.values.choices?.length
      ) {
        const promises = formik.values.choices.map((choice: Choice) =>
          handlePhotoSubmit(choice.imageFile)
        )
        Promise.all(promises).then((res) => {
          console.log("promises", res)

          const choices = formik.values.choices?.map(
            (choice: Choice, index: number) => {
              delete choice.imageFile
              return {
                ...choice,
                ...res[index],
              }
            }
          )
          resolve(choices)
        })
      } else {
        resolve(undefined)
      }
    }).then((res) => {
      return new Promise((resolve, reject) => {
        const offsetRef = firebase.database().ref(".info/serverTimeOffset")
        return offsetRef.on(
          "value",
          (snap) => {
            const offset = snap.val()
            const estimatedServerTimeMs = new Date().getTime() + offset
            const maxDiff =
              new Date(8640000000000000).getTime() - estimatedServerTimeMs
            const uid = maxDiff.toString(16) + Math.round(performance.now())
            firebase
              .firestore()
              .collection(`users/${user?.uid}/photos`)
              .doc(uid)
              .set({
                id: uid,
                userId: user?.uid,
                displayName: user?.displayName,
                photoURL: user?.photoURL,
                ...formik.values,
                ...imageProps,
                choices: res || formik.values.choices || null,
                active: true,
                uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .then(() => {
                resolve(true)
              })
              .catch((err) => {
                reject(err)
              })
          },
          (err) => {
            reject(err)
          }
        )
      })
    })
  }

  useEffect(() => {
    if (formik.values.type === "rate") {
      formik.setFieldValue("choices", [])
    } else if (formik.values.type === "poll") {
      formik.setFieldValue("choices", initialChoices)
    }
    formik.validateForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.type])

  const ComponentWithPollForm = (
    WrappedComponent: React.ComponentType<
      FormikProps<Poll> & WrappedComponentProps
    >
  ) => {
    return (
      <WrappedComponent
        {...formik}
        handleImageAsFile={handleImageAsFile}
        uploading={uploading}
      />
    )
  }
  return ComponentWithPollForm
}

export interface WrappedComponentProps {
  uploading: boolean
  handleImageAsFile: (e: any) => void
}

interface Props {
  poll?: Poll | null
  onSubmitSuccess?: () => void
}

interface ImageProps {
  imageName?: string
  imageUrl?: string
  resizedImageName?: string
}
