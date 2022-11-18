import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {useSearchParams} from "react-router-dom";
import {setRecurringFilter} from "../../redux/recurringSlice";
import {updateUrlWithSearchParams} from "../../lib/updateUrlWithSearchParams";
import {Toggle, ToggleItem} from "@tremor/react";
import {useEffect} from "react";

export const RecurringFilter = ()=>{
    const dispatch = useAppDispatch()
    const filter = useAppSelector(({recurring: {value}})=>value)
    const [queryParams] = useSearchParams()
    const filterParam = queryParams.get('recurring')
    useEffect(()=>{
        dispatch(setRecurringFilter(filterParam as 'true' | 'false' || 'neither'))
    },[filterParam, dispatch])

    const handleClick=(state: any)=>{
        dispatch(setRecurringFilter(state))
        updateUrlWithSearchParams(searchParams => {
            if(state !== 'neither'){
                searchParams.set('recurring',state)
            }else{
                searchParams.delete('recurring')
            }
            return searchParams
        })
    }
    return <Toggle defaultValue={filter} handleSelect={handleClick}>
        <ToggleItem value={'true'} text={'Wiederkehrend'} />
        <ToggleItem value={'false'} text={'Einmalig'} />
        <ToggleItem value={'neither'} text={'Alle'} />
    </Toggle>
}
