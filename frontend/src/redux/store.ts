import { configureStore } from '@reduxjs/toolkit'
import {setupListeners} from "@reduxjs/toolkit/query";
import {backend} from "./api";
import {recurringSlice} from "./recurringSlice";

const historyMiddlware = (storeAPI: any) => (next: any) => (action: any) => {
    // Do something in here, when each action is dispatched

    return next(action)
}

export const store = configureStore({
    reducer: {
        [backend.reducerPath]: backend.reducer,
        recurring: recurringSlice.reducer
    },
    middleware: (getDefaultMiddleware)=>{
        return getDefaultMiddleware({
            serializableCheck: false}).concat(backend.middleware);
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
setupListeners(store.dispatch)
