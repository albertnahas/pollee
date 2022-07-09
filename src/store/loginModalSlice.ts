/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LoginModalState, State } from "../types/state"

const initialState: LoginModalState = {}

export const loginModalSlice = createSlice({
  name: "loginModal",
  initialState,
  reducers: {
    setLoginModal: (state: LoginModalState, action: PayloadAction<boolean>) => {
      state.open = action.payload
    },
  },
})
export const loginModalSelector = (state: State) => state.loginModal.open

// Action creators are generated for each case reducer function
export const { setLoginModal } = loginModalSlice.actions

export default loginModalSlice.reducer
