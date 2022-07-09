import React from "react"
import { useNavigate } from "react-router-dom"
import { PollWizardForm } from "../Profile/PollForm/PollWizard"

export const Post = () => {
  const navigate = useNavigate()

  const onDone = () => {
    setTimeout(() => {
      navigate("/")
    }, 1000)
  }
  return (
    <>
      <PollWizardForm onSubmitSuccess={onDone} />
    </>
  )
}
