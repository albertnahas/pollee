import { FC } from "react"
import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Paper,
} from "@mui/material"
import { FormikProps } from "formik"
import { Poll } from "../../../types/poll"
import { TagsInput } from "../../../atoms/TagsInput/TagsInput"

export const PollDetailsForm: FC<Props & FormikProps<Poll>> = function ({
  uploading,
  handleImageAsFile,
  ...props
}) {
  const handleAgeRangeChange = (
    event: any,
    newValue: any,
    activeThumb: any
  ) => {
    const minDistance = 10
    if (!Array.isArray(newValue)) {
      return
    }
    if (activeThumb === 0) {
      const max = props.values.ageRange ? props.values.ageRange[1] : 90
      props.setFieldValue("ageRange", [
        Math.min(newValue[0], (max || 0) - minDistance),
        max,
      ])
    } else {
      const min = props.values.ageRange ? props.values.ageRange[0] : 16
      props.setFieldValue("ageRange", [
        min,
        Math.max(newValue[1], min + minDistance),
      ])
    }
  }

  const handleShowToGenderChange = (event: any) => {
    props.setFieldValue("showTo", event.target.value)
  }

  return (
    <>
      <Grid
        sx={{
          textAlign: "left",
        }}
        spacing={4}
        container
      >
        {props.values.imageUrl && (
          <Grid xs={12} md={4} item>
            <Paper sx={{ borderRadius: 1, overflow: "hidden" }} elevation={3}>
              <img
                width="100"
                style={{
                  width: "100%",
                  margin: "auto",
                  marginBottom: -4,
                }}
                src={props.values.imageUrl}
                alt="new"
              />
            </Paper>
          </Grid>
        )}
        <Grid xs={12} md={8} item>
          <Box sx={{ mb: 2 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Show this poll to</FormLabel>
              <RadioGroup
                row
                aria-label="gender"
                name="row-radio-buttons-group"
                value={props.values.showTo}
                onBlur={handleShowToGenderChange}
                onChange={handleShowToGenderChange}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio size="small" />}
                  label="Females"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio size="small" />}
                  label="Males"
                />
                <FormControlLabel
                  value="both"
                  control={<Radio size="small" />}
                  label="Both"
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box sx={{ mb: 2 }}>
            <FormControl
              sx={{
                width: {
                  md: "80%",
                  xs: "100%",
                },
              }}
              component="fieldset"
            >
              <FormLabel component="legend">Age within</FormLabel>
              <Slider
                size="small"
                getAriaLabel={() => "Minimum distance"}
                value={props.values.ageRange}
                onChange={handleAgeRangeChange}
                valueLabelDisplay="on"
                disableSwap
                sx={{ mt: 5 }}
              />
            </FormControl>
          </Box>
          <Box>
            <TagsInput
              id="hashtags"
              label="Hashtags"
              value={props.values.hashtags || []}
              setValue={(value: string[]) => {
                props.setFieldValue("hashtags", value)
              }}
              options={[
                "Entertainment",
                "Dating",
                "Family and relationships",
                "Fitness and wellness",
                "Food and drink",
                "Hobbies and activities",
                "Shopping and fashion",
                "Sports and outdoors",
                "Art and design",
                "Technology",
              ]}
              error={Boolean(props.errors.hashtags)}
              helperText={
                props.errors.hashtags || "Add a maximum of 6 hashtags"
              }
            />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

interface Props {
  uploading: boolean
  handleImageAsFile: (e: any) => void
}
