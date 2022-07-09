import { FC, useMemo } from "react"
import {
  Button,
  Box,
  Grid,
  Paper,
  TextField,
  ButtonGroup,
  Typography,
  IconButton,
  Stack,
} from "@mui/material"
import { FormikProps } from "formik"
import { Choice, Poll } from "../../../types/poll"
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp"
import { Close } from "@mui/icons-material"
import { setAlert } from "../../../store/alertSlice"
import { useDispatch } from "react-redux"
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded"

export const PollBasicForm: FC<Props & FormikProps<Poll>> = function ({
  uploading,
  handleImageAsFile,
  ...props
}) {
  const helpMessage = useMemo(
    () =>
      props.values.type === "poll"
        ? "You will be prompted to add choices in the next steps"
        : "Users will be able to rate your post from 0 to 10",
    [props.values.type]
  )

  const dispatch = useDispatch()

  const handleChoiceImageAsFile = (e: any, index: number) => {
    const image = e.target.files[0]
    if (!props.values.choices) {
      return
    }
    const choice = props.values.choices[index]
    choice.imageFile = image
    choice.imageUrl = URL.createObjectURL(image)
    if (!choice.text) {
      choice.text = "Image " + (index + 1)
    }
    const choicesUpdated = props.values.choices.map((item, i) =>
      i === index ? choice : item
    )
    props.setFieldValue("choices", choicesUpdated)
  }

  const removeChoice = (choice: Choice, index: number) => {
    if (props.values.choices && props.values.choices?.length <= 2) {
      dispatch(
        setAlert({
          title: "Choice cannot be removed",
          message: "You should have at least two choices for your poll",
          open: true,
        })
      )
      return
    }
    const choicesSpliced = [...(props.values.choices || [])]
    choicesSpliced.splice(index, 1)
    props.setFieldValue("choices", choicesSpliced)
  }

  return (
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
        <Box
          sx={{
            display: props.values.imageUrl ? "none" : "block",
            mb: 1,
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageAsFile}
            style={{ display: "none" }}
            id="contained-button-file"
          />
          <label htmlFor="contained-button-file">
            <Button
              startIcon={<AddPhotoAlternateRoundedIcon />}
              variant="contained"
              color="primary"
              component="span"
            >
              Add Image
            </Button>
          </label>
        </Box>
        <Box sx={{ mb: 1 }}>
          <Typography color="primary" component="p" variant="body2">
            Post type
          </Typography>
          <ButtonGroup sx={{ my: 1 }} aria-label="outlined button group">
            <Button
              aria-label="rate"
              variant={props.values.type === "rate" ? "contained" : "outlined"}
              onClick={() => props.setFieldValue("type", "rate")}
            >
              Rate
            </Button>
            <Button
              aria-label="poll"
              variant={props.values.type === "poll" ? "contained" : "outlined"}
              onClick={() => props.setFieldValue("type", "poll")}
            >
              Poll
            </Button>
          </ButtonGroup>
          <Typography color="primary" component="p" variant="caption">
            {helpMessage}
          </Typography>
        </Box>
        <Box>
          <TextField
            error={Boolean(props.touched.headline && props.errors.headline)}
            helperText={props.touched.headline && props.errors.headline}
            fullWidth
            label="Headline"
            margin="dense"
            name="headline"
            aria-label="headline"
            onBlur={props.handleBlur}
            onChange={props.handleChange}
            value={props.values.headline}
            variant="outlined"
          />
        </Box>
        <Box>
          <TextField
            error={Boolean(
              props.touched.description && props.errors.description
            )}
            helperText={props.touched.description && props.errors.description}
            fullWidth
            label="Description"
            margin="dense"
            size="small"
            name="description"
            aria-label="description"
            onBlur={props.handleBlur}
            onChange={props.handleChange}
            value={props.values.description}
            multiline
            rows={2}
            variant="outlined"
          />
        </Box>
        {props.values.type === "poll" && (
          <Box>
            <Typography
              color="primary"
              component="p"
              sx={{ my: 0.5 }}
              variant="body2"
            >
              Choices
            </Typography>
            {props.values.choices?.map((choice, index) => (
              <Stack spacing={1} direction="row">
                <TextField
                  key={index}
                  error={Boolean(
                    // 👇️ ts-ignore formik bug
                    props.touched.choices &&
                      // @ts-ignore
                      props.touched.choices[index] &&
                      props.errors.choices &&
                      // // @ts-ignore
                      props.errors.choices[index]
                  )}
                  helperText={
                    // 👇️ ts-ignore formik bug
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    props.touched.choices &&
                    // @ts-ignore
                    props.touched.choices[index] &&
                    props.errors.choices &&
                    // @ts-ignore
                    props.errors.choices[index] &&
                    // @ts-ignore
                    props.errors.choices[index].text
                  }
                  fullWidth
                  label={`Choice ${index + 1}`}
                  margin="dense"
                  name={`choices[${index}].text`}
                  aria-label={`choice${index}`}
                  onChange={props.handleChange}
                  value={
                    (props.values.choices &&
                      props.values.choices[index]?.text) ||
                    ""
                  }
                  size={"small"}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <Stack direction="row">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e: any) =>
                            handleChoiceImageAsFile(e, index)
                          }
                          style={{ display: "none" }}
                          id={`choice-image${index}`}
                        />
                        <label htmlFor={`choice-image${index}`}>
                          <IconButton component="span">
                            <AddPhotoAlternateRoundedIcon fontSize="medium" />
                          </IconButton>
                        </label>
                        <IconButton
                          onClick={() => {
                            removeChoice(choice, index)
                          }}
                        >
                          <Close fontSize="medium" />
                        </IconButton>
                      </Stack>
                    ),
                  }}
                />

                {choice.imageFile && (
                  <Paper
                    sx={{
                      borderRadius: 1,
                      overflow: "hidden",
                      maxWidth: 75,
                      maxHeight: 75,
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                    }}
                    elevation={0}
                  >
                    <img
                      style={{
                        width: "100%",
                        margin: "auto",
                        marginBottom: -4,
                      }}
                      src={choice.imageUrl}
                      alt="choice"
                    />
                  </Paper>
                )}
              </Stack>
            ))}
            <Button
              color="warning"
              fullWidth
              size="small"
              type="button"
              variant="text"
              onClick={() => {
                props.setFieldValue("choices", [
                  ...(props.values.choices || []),
                  { text: "" },
                ])
              }}
              disabled={props.values.choices?.length === 5}
              endIcon={<AddCircleSharpIcon />}
            >
              Add Choice
            </Button>
          </Box>
        )}
      </Grid>
    </Grid>
  )
}

interface Props {
  uploading: boolean
  handleImageAsFile: (e: any) => void
}
