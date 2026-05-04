import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./CartSlice";
import likeReducer from "./LikeSlice";
import recentViewReducer from "./RecentViewSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage"; // localStorage

// Persist Config

const persistConfig = {
  key: "cart",
  version: 1,
  storage,
}; 

// Persisted Reducer

const persistedReducer = persistReducer(persistConfig, cartReducer);
const likePersistedReducer = persistReducer(persistConfig, likeReducer);
const recentViewPersistedReducer = persistReducer(persistConfig, recentViewReducer);

// Store

export const store = configureStore({
  reducer: {
    addtoCart: persistedReducer,
    addtoLike: likePersistedReducer,
    addtoView: recentViewPersistedReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor

export const persistor = persistStore(store);

// Types (Recommended)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;