import * as React from "react"
import Box from "@mui/material/Box"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import StepContent from "@mui/material/StepContent"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { CircularProgress, Container, Fade, Stack } from "@mui/material"
import { FormikProps } from "formik"
import anime from "animejs"
import { DoneOutline } from "../../../icons/DoneOutline"
import { PollFormHoc, WrappedComponentProps } from "./PollFormHoc"
import { PollBasicForm } from "./PollBasicForm"
import { Poll } from "../../../types/poll"
import { PollDetailsForm } from "./PollDetailsForm"
import _ from "lodash"

const steps = [
  {
    label: "Details",
    content: PollBasicForm,
  },
  {
    label: "Reach",
    content: PollDetailsForm,
  },
]

const PollWizard = (props: FormikProps<Poll> & WrappedComponentProps) => {
  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleFinish = () => {
    props.handleSubmit()
  }

  const animation = () => {
    anime({
      targets: "[class*=doneOutline-]",
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: "easeInOutSine",
      duration: 500,
      delay: function (el, i) {
        return i * 500
      },
    })
  }
  React.useEffect(() => {
    if (activeStep === 3) {
      animation()
    }
    return () => {}
  }, [activeStep])

  React.useEffect(() => {
    if (props.status === "success") {
      handleNext()
      animation()
    }
    return () => {}
  }, [props.status])

  return (
    <Container sx={{ pt: 3, pb: 3 }} maxWidth="sm">
      <Typography
        component="h4"
        variant="h4"
        align="center"
        color="text.secondary"
        gutterBottom
      >
        Setup your poll
      </Typography>
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ mx: 1 }}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
            // optional={
            //   index === 2 ? (
            //     <Typography variant="caption">Last step</Typography>
            //   ) : null
            // }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Fade
                in={true}
                timeout={1000}
                style={{
                  transitionDelay: `100ms`,
                }}
                unmountOnExit
              >
                <Box>{step.content({ ...props })}</Box>
              </Fade>
              <Box sx={{ mb: 2 }}>
                {!props.isSubmitting ? (
                  <div>
                    <Button
                      variant="outlined"
                      onClick={
                        index === steps.length - 1 ? handleFinish : handleNext
                      }
                      sx={{ mt: 1, mr: 1 }}
                      disabled={!props.dirty || !_.isEmpty(props.errors)}
                    >
                      {index === steps.length - 1 ? "Post" : "Next"}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                ) : (
                  <CircularProgress />
                )}
              </Box>
            </StepContent>
          </Step>
        ))}
        <Step key={"done"}>
          <StepLabel>Done</StepLabel>
          <StepContent>
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>Posted successfully!</Typography>
              <Stack
                sx={{
                  alignItems: "cetner",
                }}
              >
                <Box sx={{ my: 2 }}>
                  <DoneOutline style={{ fontSize: "4em" }} color="primary" />
                </Box>
              </Stack>
            </Paper>
          </StepContent>
        </Step>
      </Stepper>
    </Container>
  )
}

export const PollWizardForm = ({
  onSubmitSuccess,
}: {
  onSubmitSuccess?: () => void
}) => {
  return PollFormHoc({ onSubmitSuccess })(PollWizard)
}
