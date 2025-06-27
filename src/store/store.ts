import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { patientInteractionReducer } from "./patientInteractions";
import { uiReducer } from "./uiState";
import { chartToolStoreReducer } from "./chartToolStore";
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  version: 1,
};
export const rootReducer = combineReducers({
  patientInteractionReducer,
  uiReducer,
  chartToolStoreReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const STORE = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const PERSISTOR = persistStore(STORE);

export type RootState = ReturnType<typeof STORE.getState>;
export type AppDispatch = typeof STORE.dispatch;
