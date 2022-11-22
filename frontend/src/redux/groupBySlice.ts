import {createSlice, PayloadAction} from '@reduxjs/toolkit'

type GroupKey = 'year' | 'month' | 'day'
export interface GroupByState {
    value: GroupKey[]
}

const initialState: GroupByState = {
    value: []
}

export const groupBySlice = createSlice({
    name: 'groupBy',
    initialState,
    reducers: {
        setGroupKeys: (state, action: PayloadAction<GroupKey[]>)=> {
            state.value = action.payload
        },
        addGroupKey: (state, action: PayloadAction<GroupKey>)=> void state.value.push(action.payload),
        removeGroupKey: (state, action: PayloadAction<GroupKey>)=> {
            state.value = state.value.filter(value=>value!==action.payload)
        },
    },
})

export const { setGroupKeys, addGroupKey, removeGroupKey} = groupBySlice.actions

export default groupBySlice.reducer
