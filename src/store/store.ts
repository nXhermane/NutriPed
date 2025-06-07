import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist"

import AsyncStorage from "@react-native-async-storage/async-storage";
import { reducer } from "./patientInteractions";
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 1
}
export const rootReducer = combineReducers({
 reducer
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const STORE = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const PERSISTOR = persistStore(STORE)

export type RootState = ReturnType<typeof STORE.getState>
export type AppDispatch = typeof STORE.dispatch 