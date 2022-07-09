/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AlertState, State } from "../types/state"

const initialState = { value: undefined, open: false }

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setAlert: (
      state: AlertState,
      action: PayloadAction<{
        title?: string
        message?: string
        open?: boolean
      }>
    ) => {
      state.message = action.payload.message
      state.title = action.payload.title
      state.open = action.payload.open
    },
    setAlertOpen: (state: AlertState, action: PayloadAction<boolean>) => {
      state.open = action.payload
    },
  },
})

export const alertSelector = (state: State) => state.alert
export const alertOpenSelector = (state: State) => state.alert.open

// Action creators are generated for each case reducer function
export const { setAlert, setAlertOpen } = alertSlice.actions

export default alertSlice.reducer
