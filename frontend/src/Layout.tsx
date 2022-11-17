import {Button, Datepicker, Divider, Flex, Card} from "@tremor/react"
import {Outlet, useNavigate, useSearchParams} from "react-router-dom";
import React, {createContext, FunctionComponent, PropsWithChildren, useState} from "react";
import {Temporal} from "@js-temporal/polyfill";
import {TemporalDatePicker} from "./TemporalDatePicker";
import {SyncButton} from "./SyncButton";
import {ClassifyButton} from "./ClassifyButton";

export const DateContext = createContext({start: Temporal.Now.plainDateISO(),end: Temporal.Now.plainDateISO()})

export const Layout: FunctionComponent<PropsWithChildren> = ({children}) => {
    const [queryParams] = useSearchParams()
    const startString = queryParams.get('start')
    const endString = queryParams.get('end')
    const start = startString ? Temporal.PlainDate.from(startString) : Temporal.Now.plainDateISO()
    const end = endString ? Temporal.PlainDate.from(endString) : Temporal.Now.plainDateISO()
    const [date, setDate] = useState({start,end})
    const navigate = useNavigate()

    return (
        <>
            <Card>
                <Flex>
                    <Button text="Dashboard" handleClick={() => navigate('/')}/>
                    <Button text="Statements" handleClick={() => navigate('/statements')}/>
                    <Button text="Categories" handleClick={() => navigate('/categories')}/>
                    <Button text="Settings" handleClick={() => navigate('/settings')}/>
                    <TemporalDatePicker defaultStartDate={start} defaultEndDate={end} handleSelect={(start: Temporal.PlainDate,end:Temporal.PlainDate)=>setDate({start,end})}/>
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

