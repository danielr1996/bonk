import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {useSearchParams} from "react-router-dom";
import {setRecurringFilter} from "../../redux/recurringSlice";
import {updateUrlWithSearchParams} from "../../lib/updateUrlWithSearchParams";
import {SelectBox, SelectBoxItem, Toggle, ToggleItem} from "@tremor/react";
import React, {useEffect} from "react";

export const RecurringFilter = () => {
    const dispatch = useAppDispatch()
    const filter = useAppSelector(({recurring: {value}}) => value)
    const [queryParams] = useSearchParams()
    const filterParam = queryParams.get('recurring')
    useEffect(() => {
        dispatch(setRecurringFilter(filterParam as 'true' | 'false' || 'neither'))
    }, [filterParam, dispatch])

    const handleClick = (state: any) => {
        dispatch(setRecurringFilter(state))
        updateUrlWithSearchParams(searchParams => {
            if (state !== 'neither') {
                searchParams.set('recurring', state)
            } else {
                searchParams.delete('recurring')
            }
            return searchParams
        })
    }
    return <SelectBox
        defaultValue={filter}
        handleSelect={handleClick}
        placeholder="Select Recurring"
        maxWidth="max-w-none"
        marginTop="mt-0"
    >
        <SelectBoxItem
            text={'Alle'}
            value={'neither'}/>
        <SelectBoxItem
            text={'Wiederkehrend'}
            value={'true'}/>
        <SelectBoxItem
            text={'Einmalig'}
            value={'false'}/>
    </SelectBox>
}
