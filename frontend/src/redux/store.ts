import { configureStore } from '@reduxjs/toolkit'
import {setupListeners} from "@reduxjs/toolkit/query";
import {backend} from "./api";

export const store = configureStore({
    reducer: {
        [backend.reducerPath]: backend.reducer
    },
    middleware: (getDefaultMiddleware)=>{
        return getDefaultMiddleware({
            serializableCheck: false}).concat(backend.middleware);
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
setupListeners(store.dispatch)
