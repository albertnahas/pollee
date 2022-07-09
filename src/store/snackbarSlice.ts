/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { SnackbarState, State } from "../types/state"

const initialState: SnackbarState = {
  open: false,
  message: "",
  type: "success",
  duration: 1000,
}

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    setSnackbar: (
      state: SnackbarState,
      action: PayloadAction<SnackbarState>
    ) => {
      state.message = action.payload.message
      state.type = action.payload.type || initialState.type
      state.open = action.payload.open
      state.duration = action.payload.duration || initialState.duration
      state.cta = action.payload.cta
    },
  },
})
export const snackbarSelector = (state: State) => state.snackbar

// Action creators are generated for each case reducer function
export const { setSnackbar } = snackbarSlice.actions

export default snackbarSlice.reducer
