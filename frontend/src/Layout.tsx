import {Button, Flex, Card} from "@tremor/react"
import {useNavigate, useNavigation, useSearchParams} from "react-router-dom";
import React, {createContext, FunctionComponent, PropsWithChildren, useEffect, useState} from "react";
import {Temporal} from "@js-temporal/polyfill";
import {TemporalDatePicker} from "./TemporalDatePicker";
import {SyncButton} from "./SyncButton";
import {ClassifyButton} from "./ClassifyButton";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./redux/store";
import {setRecurringFilter} from "./redux/recurringSlice";
import {useAppDispatch, useAppSelector} from "./redux/hooks";

type DateContextType = {start: Temporal.PlainDate, end: Temporal.PlainDate}
export const DateContext = createContext<DateContextType>({start: Temporal.Now.plainDateISO(),end: Temporal.Now.plainDateISO()})

const DatePicker = ({setDate}:{setDate: (range: DateContextType)=>void})=>{
    const navigate = useNavigate()
    const [queryParams] = useSearchParams()
    const startString = queryParams.get('start')
    const endString = queryParams.get('end')
    const start = startString ? Temporal.PlainDate.from(startString) : Temporal.Now.plainDateISO()
    const end = endString ? Temporal.PlainDate.from(endString) : Temporal.Now.plainDateISO()
    const onChange = (range: DateContextType)=>{
        const url = new URL(window.location.href)
        const searchParams = url.searchParams
        searchParams.set('start',range.start.toJSON())
        searchParams.set('end',range.end.toJSON())
        url.search = searchParams.toString()
        navigate(`${url.pathname}${url.search}`)
        setDate(range)
    }
    return <>
        <TemporalDatePicker defaultStartDate={start} defaultEndDate={end} handleSelect={onChange}/>
    </>
}

const RecurringFilter = ()=>{
    const dispatch = useAppDispatch()
    const [queryParams] = useSearchParams()
    const filterParam = queryParams.get('recurring')
    dispatch(setRecurringFilter(filterParam as 'true' | 'false' || 'neither'))

    const Inner = ()=>{
        const filter = useAppSelector(({recurring: {value}})=>value)
        const navigate = useNavigate()
        const handleClick=(state: any)=>{
            // TODO: Update in Middlware
            // TODO: Write generic Middlware to update search params
            // TODO: fix eslint error
            const url = new URL(window.location.href)
            const searchParams = url.searchParams
            if(state !== 'neither'){
                searchParams.set('recurring',state)
            }else{
                searchParams.delete('recurring')
            }
            url.search = searchParams.toString()
            history.replaceState({},'',url.href)
            dispatch(setRecurringFilter(state))
        }
        return <>
            <button style={{color: filter === 'true' ? 'blue':''}} onClick={()=>handleClick('true')}>Only</button>
            <button style={{color: filter === 'false' ? 'blue':''}} onClick={()=>handleClick('false')}>Not</button>
            <button style={{color: filter === 'neither' ? 'blue':''}} onClick={()=>handleClick('neither')}>All</button>
        </>
    }
    return <Inner/>
}

export const Layout: FunctionComponent<PropsWithChildren> = ({children}) => {
    const navigate = useNavigate()
    const [date, setDate] = useState<DateContextType>({start: Temporal.Now.plainDateISO(),end: Temporal.Now.plainDateISO()})
    return (
        <>
            <Card>
                <Flex>
                    <Button text="Dashboard" handleClick={() => navigate('/')}/>
                    <Button text="Statements" handleClick={() => navigate('/statements')}/>
                    <Button text="Categories" handleClick={() => navigate('/categories')}/>
                    <Button text="Settings" handleClick={() => navigate('/settings')}/>
                    <DatePicker setDate={setDate}/>
                    <RecurringFilter/>
                    <SyncButton/>
                    <ClassifyButton/>
                </Flex>
            </Card>
            <DateContext.Provider value={date}>
                {children}
            </DateContext.Provider>
        </>
    );
}

