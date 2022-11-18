import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {Temporal} from "@js-temporal/polyfill";
import {setEnd, setRange, setStart} from "../../redux/dateSlice";
import {TemporalDatePicker} from "../../TemporalDatePicker";
import React, {useEffect} from "react";
import {updateUrlWithSearchParams} from "../../lib/updateUrlWithSearchParams";
import {useSearchParams} from "react-router-dom";

export const DateFilter = () => {
    const dispatch = useAppDispatch()
    const {start, end} = useAppSelector(({date}) => date)
    const [queryParams] = useSearchParams()
    const startParam = queryParams.get('start')
    const endParam = queryParams.get('end')
    useEffect(()=>{
        if(startParam) {
            dispatch(setStart(Temporal.PlainDate.from(startParam)))
        }
        if(endParam) {
            dispatch(setEnd(Temporal.PlainDate.from(endParam)))
        }
    },[startParam, endParam, dispatch])
    const handleClick = (state: { start: Temporal.PlainDate, end: Temporal.PlainDate }) => {
        dispatch(setRange(state))
        updateUrlWithSearchParams(searchParams => {
            searchParams.set('start', state.start.toJSON())
            searchParams.set('end', state.end.toJSON())
            return searchParams
        })
    }

    return <TemporalDatePicker defaultStartDate={start} defaultEndDate={end} handleSelect={handleClick}/>
}
