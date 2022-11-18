import {createSlice, PayloadAction} from '@reduxjs/toolkit'

type Trivalent = 'true' | 'false' | 'neither'
export interface RecurringState {
    value: Trivalent
}

const initialState: RecurringState = {
    value: 'neither'
}

export const recurringSlice = createSlice({
    name: 'recurring',
    initialState,
    reducers: {
        setRecurringFilter: (state, action: PayloadAction<Trivalent>) => {
            state.value = action.payload
        },
    },
})

export const { setRecurringFilter} = recurringSlice.actions

export default recurringSlice.reducer
