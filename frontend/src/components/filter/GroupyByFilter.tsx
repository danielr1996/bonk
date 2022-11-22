import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {useSearchParams} from "react-router-dom";
import {setRecurringFilter} from "../../redux/recurringSlice";
import {updateUrlWithSearchParams} from "../../lib/updateUrlWithSearchParams";
import {Block} from "@tremor/react";
import React, {useEffect} from "react";
import {addGroupKey, removeGroupKey, setGroupKeys} from "../../redux/groupBySlice";

export const GroupyByFilter = () => {
    const dispatch = useAppDispatch()
    const filter = useAppSelector(({groupBy: {value}}) => value)
    const [queryParams] = useSearchParams()

    // Update state with params from url
    useEffect(() => {
        const keyParams: ('year'|'month'|'day')[] = [...queryParams].filter(([key]) => key === 'groupby').map(([, groupby]) => groupby) as ('year'|'month'|'day')[]
        dispatch(setGroupKeys(keyParams))
    }, [dispatch])


    // Update url with params from state
    useEffect(() => {
        updateUrlWithSearchParams(searchParams => {
            searchParams.delete('groupby')
            filter.map(key => {
                searchParams.append('groupby', key)
            })
            return searchParams
        })
    }, [filter])

    const handleChange =(e: any)=>{
        if(e.target.checked){
            dispatch(addGroupKey(e.target.value))
        }else{
            dispatch(removeGroupKey(e.target.value))

        }
    }

    return <Block>
        <label><input type="checkbox" name="groupby" value="year" onChange={handleChange} checked={filter.includes('year')}/>Year</label>
        <label><input type="checkbox" name="groupby" value="month" onChange={handleChange}  checked={filter.includes('month')}/>Month</label>
        <label><input type="checkbox" name="groupby" value="day" onChange={handleChange}  checked={filter.includes('day')}/>Day</label>
    </Block>
}
