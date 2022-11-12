import {useContext, useState} from "react";
import {DateContext} from "../../Layout";
import {StatementTable} from "../../components/StatementTable";
import {useGetStatementsQuery} from "../../redux/api";

export const Statements = ()=>{
    const dateRange = useContext(DateContext)
    const {data: statements} = useGetStatementsQuery()
    return <StatementTable statements={statements} />
}
