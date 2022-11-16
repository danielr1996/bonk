import {useContext, useState} from "react";
import {DateContext} from "../../Layout";
import {StatementTable} from "../../components/StatementTable";
import {useGetStatementsQuery} from "../../redux/api";
import {useSearchParams} from "react-router-dom";

export const Statements = ()=>{
    const dateRange = useContext(DateContext)
    const [categories] = useSearchParams()
    const {data: statements} = useGetStatementsQuery({...dateRange,categories: [...categories].map(([,category])=>category)})
    return <StatementTable statements={statements} />
}
