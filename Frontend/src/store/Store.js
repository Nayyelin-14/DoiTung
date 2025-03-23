import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import UserReducer from "./Slices/UserSlice";
import TestReducer from "./Slices/testSlice"; // Import test slice

const persistConfig = {
  key: "root",
  version: 1,
  storage: storage,
  whitelist: ["user", "test"], // Persist both user and test states
};

const rootReducer = combineReducers({
  user: UserReducer,
  test: TestReducer, // Add test reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const Store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: false,
});

export const persistor = persistStore(Store);

export default Store;

