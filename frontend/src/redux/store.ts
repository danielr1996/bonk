import { configureStore } from '@reduxjs/toolkit'
import {setupListeners} from "@reduxjs/toolkit/query";
import {backend} from "./api";
import {recurringSlice} from "./recurringSlice";
import {dateSlice} from "./dateSlice";
import {categorySlice} from "./categorySlice";
import {groupBySlice} from "./groupBySlice";

export const store = configureStore({
    reducer: {
        [backend.reducerPath]: backend.reducer,
        recurring: recurringSlice.reducer,
        date: dateSlice.reducer,
        category: categorySlice.reducer,
        groupBy: groupBySlice.reducer
    },
    middleware: (getDefaultMiddleware)=>{
        return getDefaultMiddleware({
            serializableCheck: false}).concat(backend.middleware);
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
setupListeners(store.dispatch)
