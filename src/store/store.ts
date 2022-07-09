import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import alertReducer from "./alertSlice"
import drawerReducer from "./drawerSlice"
import loginModalReducer from "./loginModalSlice"
import snackbarReducer from "./snackbarSlice"
import feedbackReducer from "./feedbackSlice"

export default configureStore({
  reducer: {
    user: userReducer,
    alert: alertReducer,
    drawer: drawerReducer,
    loginModal: loginModalReducer,
    snackbar: snackbarReducer,
    feedback: feedbackReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
