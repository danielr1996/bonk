import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Temporal} from "@js-temporal/polyfill";

export interface DateState {
    start: Temporal.PlainDate,
    end: Temporal.PlainDate,
}

const initialState: DateState = (()=>{
    const now = Temporal.Now.plainDateISO()
    return {
        start: Temporal.PlainDate.from({year: now.getISOFields().isoYear,month: now.getISOFields().isoMonth,day: 1}),
        end: Temporal.Now.plainDateISO()
    }
})()

export const dateSlice = createSlice({
    name: 'date',
    initialState,
    reducers: {
        setRange: (state, action: PayloadAction<DateState>) => {
            state.start = action.payload.start
            state.end = action.payload.end
        },
        setStart: (state, action: PayloadAction<Temporal.PlainDate>) => {
            state.start = action.payload
        },
        setEnd: (state, action: PayloadAction<Temporal.PlainDate>) => {
            state.end = action.payload
        },
    },
})

export const { setRange, setStart, setEnd} = dateSlice.actions

export default dateSlice.reducer
