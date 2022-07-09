import React, { FC, useEffect, useState } from "react"
import {
  Button,
  Typography,
  Stack,
  useTheme,
  SvgIconTypeMap,
  Zoom,
} from "@mui/material"
import { Step1Icon } from "../../icons/onBoarding/Step1Icon"
import { Step4Icon } from "../../icons/onBoarding/Step4Icon"
import { Step3Icon } from "../../icons/onBoarding/Step3Icon"
import { Step2Icon } from "../../icons/onBoarding/Step2Icon"
import { OverridableComponent } from "@mui/material/OverridableComponent"

interface OnBoardingStep {
  title: string
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>
  body: string
}

const onBoardingSteps: OnBoardingStep[] = [
  {
    title: "Post your polls",
    icon: Step1Icon,
    body: `Start posting polls to the app, in order to
        get the users feedback and votes, don&apos;t hesitate
        to experiment with photos too`,
  },
  {
    title: "Activate your poll",
    icon: Step2Icon,
    body: `Make sure your poll is active, using the switch at the bottom left of each
        poll under My Polls tab, people can&apos;t see your
        polls when they are disabled`,
  },
  {
    title: "Check your feeds and vote",
    icon: Step3Icon,
    body: `Explore home tab where you can see other people
        polls, You will get one token for every five votes you
        give, every token allows you to recieve one vote, you
        start with two free tokens`,
  },
  {
    title: "Watch your insights",
    icon: Step4Icon,
    body: `Watch the votes given by people instantly, click each
        poll to get detailed overview, including people
        comments and impressions`,
  },
]

export var OnBoarding: FC<Props> = function (props) {
  const [step, setStep] = useState(0)
  const [next, setNext] = useState(true)
  const iconStyle: any = { height: 60, width: 60 }
  const theme = useTheme()

  useEffect(() => {
    setNext(false)
    setTimeout(() => {
      setNext(true)
    }, 100)

    if (step === 4 && props.done) {
      props.done()
    }
    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const StepIcon = onBoardingSteps[step]?.icon || null

  return (
    <Stack spacing={4} sx={{ p: 2, textAlign: "center", alignItems: "center" }}>
      {step < 4 && (
        <>
          <Zoom in={next}>
            <StepIcon sx={iconStyle} />
          </Zoom>
          <Typography variant="h5" color={theme.palette.primary.main}>
            {onBoardingSteps[step].title}
          </Typography>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            {onBoardingSteps[step].body}
          </Typography>
        </>
      )}
      <Button
        color="primary"
        size="large"
        variant="text"
        onClick={() => setStep((s) => s + 1)}
      >
        {step < 3 ? "Next" : "Done"}
      </Button>
    </Stack>
  )
}

interface Props {
  done: () => void
}
