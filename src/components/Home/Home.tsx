import { FC, useState } from "react"
import { useSelector } from "react-redux"
import { Landing } from "../Landing/Landing"
import { useNavigate } from "react-router-dom"
import { userSelector } from "../../store/userSlice"
import { useUser } from "../../hooks/useUser"
import ModalDialog from "../../molecules/ModalDialog/ModalDialog"
import { OnBoarding } from "../OnBoarding/OnBoarding"
import { Feeds } from "../Feeds/Feeds"
import { RegisterStep2 } from "../Auth/Register/RegisterStep2"

export const Home: FC<Props> = function () {
  const [onBoarding, setOnBoarding] = useState(true)

  const user = useSelector(userSelector)
  const { updateUser } = useUser()
  const navigate = useNavigate()

  const finishOnBoarding = () => {
    updateUser({ uid: user?.uid, onBoarding: true }).then((res) => {
      setOnBoarding(false)
    })
  }

  const showOnBoarding = () => (
    <ModalDialog maxWidth="xs" open={onBoarding} setOpen={setOnBoarding}>
      <OnBoarding done={finishOnBoarding} />
    </ModalDialog>
  )

  return user !== null ? (
    user?.complete ? (
      <>
        <Feeds />
        {!user?.onBoarding && showOnBoarding()}
      </>
    ) : (
      <RegisterStep2 uid={user?.uid} />
    )
  ) : (
    <Landing login={() => navigate("/login")} />
  )
}

interface Props {}
