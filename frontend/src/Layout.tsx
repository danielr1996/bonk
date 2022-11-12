import {Button, Datepicker, Divider, Flex, Card} from "@tremor/react"
import {Outlet, useNavigate} from "react-router-dom";
import React, {createContext, FunctionComponent, PropsWithChildren, useState} from "react";
import {Temporal} from "@js-temporal/polyfill";
import {TemporalDatePicker} from "./TemporalDatePicker";
import {SyncButton} from "./SyncButton";

export const DateContext = createContext({start: Temporal.Now.plainDateISO(),end: Temporal.Now.plainDateISO()})

export const Layout: FunctionComponent<PropsWithChildren> = ({children}) => {
    const [date, setDate] = useState({start: Temporal.Now.plainDateISO(),end: Temporal.Now.plainDateISO()})
    const navigate = useNavigate()
    return (
        <>
            <Card>
                <Flex>
                    <Button text="Dashboard" handleClick={() => navigate('/')}/>
                    <Button text="Statements" handleClick={() => navigate('/statements')}/>
                    <Button text="Categories" handleClick={() => navigate('/categories')}/>
                    <TemporalDatePicker handleSelect={(start: Temporal.PlainDate,end:Temporal.PlainDate)=>setDate({start,end})}/>
                    <SyncButton/>
                </Flex>
            </Card>
            <DateContext.Provider value={date}>
                {children}
            </DateContext.Provider>

        </>
    );
}

