import { configureStore } from '@reduxjs/toolkit'
import countReducer from "./CartSlice";
import likeReducer from "./CartSlice";
export const Store = configureStore({
    reducer: {
        addtoCart:countReducer,
        addtoLike:likeReducer
    },
})