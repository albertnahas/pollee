/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { FeedbackState, State } from "../types/state"

const initialState: FeedbackState = { open: false }

export const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    setFeedback: (state: FeedbackState, action: PayloadAction<boolean>) => {
      state.open = action.payload
    },
  },
})
export const feedbackSelector = (state: State) => state.feedback.open

// Action creators are generated for each case reducer function
export const { setFeedback } = feedbackSlice.actions

export default feedbackSlice.reducer
