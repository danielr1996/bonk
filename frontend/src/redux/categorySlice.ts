import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Temporal} from "@js-temporal/polyfill";

export type CategoryState = {
    value: (string|null)[]
}

const initialState: CategoryState = {value: []}

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<(string|null)[]>) => {
            state.value = [...action.payload]
        },
    },
})

export const {setCategories} = categorySlice.actions

export default categorySlice.reducer
