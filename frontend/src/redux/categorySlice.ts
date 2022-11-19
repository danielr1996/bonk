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
        addCategory: (state, action: PayloadAction<string|null>)=> void state.value.push(action.payload),
        removeCategory: (state, action: PayloadAction<string|null>)=> {
            state.value = state.value.filter(value=>value!==action.payload)
        },
    },
})

export const {setCategories, addCategory, removeCategory} = categorySlice.actions

export default categorySlice.reducer
