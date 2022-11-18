import {Button, Flex, Card} from "@tremor/react"
import {useNavigate} from "react-router-dom";
import React, {FunctionComponent, PropsWithChildren} from "react";
import {SyncButton} from "./SyncButton";
import {ClassifyButton} from "./ClassifyButton";
import {RecurringFilter} from "./components/filter/RecurringFilter";
import {DateFilter} from "./components/filter/DateFilter";
import {CategoryFilter} from "./components/filter/CategoryFilter";


export const Layout: FunctionComponent<PropsWithChildren> = ({children}) => {
    const navigate = useNavigate()

    return (
        <>
            <Card>
                <Flex>
                    <Button text="Dashboard" handleClick={() => navigate('/')}/>
                    <Button text="Statements" handleClick={() => navigate('/statements')}/>
                    <Button text="Settings" handleClick={() => navigate('/settings')}/>
                    <DateFilter/>
                    <CategoryFilter />
                    <RecurringFilter/>
                    <SyncButton/>
                    <ClassifyButton/>
                </Flex>
            </Card>
            {children}
        </>
    );
}

