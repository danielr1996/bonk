import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {useSearchParams} from "react-router-dom";
import {setRecurringFilter} from "../../redux/recurringSlice";
import {updateUrlWithSearchParams} from "../../lib/updateUrlWithSearchParams";
import {Block} from "@tremor/react";
import React, {useEffect} from "react";

export const RecurringFilter = () => {
    const dispatch = useAppDispatch()
    const filter = useAppSelector(({recurring: {value}}) => value)
    const [queryParams] = useSearchParams()
    const filterParam = queryParams.get('recurring')

    // Update state with params from url
    useEffect(() => {
        dispatch(setRecurringFilter(filterParam as 'true' | 'false' || 'neither'))
    }, [filterParam, dispatch])


    // Update url with params from state
    useEffect(()=>{
        updateUrlWithSearchParams(searchParams => {
            if (filter !== 'neither') {
                searchParams.set('recurring', filter)
            } else {
                searchParams.delete('recurring')
            }
            return searchParams
        })
    },[filter])

    const handleChange =(state: any)=>{
        dispatch(setRecurringFilter(state))
    }

    return <Block>
        <label><input type="radio" name="recurring" value="neither" onChange={(e)=>handleChange(e.target.value)} checked={filter === 'neither'}/>Alle</label>
        <label><input type="radio" name="recurring" value="true" onChange={(e)=>handleChange(e.target.value)}  checked={filter === 'true'}/>Wiederkehrend</label>
        <label><input type="radio" name="recurring" value="false" onChange={(e)=>handleChange(e.target.value)}  checked={filter === 'false'}/>Einmalig</label>
    </Block>
}
