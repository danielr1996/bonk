import {useContext, useState} from "react";
import {DateContext} from "../../Layout";
import {StatementTable} from "../../components/StatementTable";
import {useGetStatementsQuery} from "../../redux/api";
import {useSearchParams} from "react-router-dom";

export const Statements = ()=>{
    const dateRange = useContext(DateContext)
    const [searchParams] = useSearchParams()
    const categories = [...searchParams].filter(([key])=>key==='categories').map(([,category])=>category)
    const {data: statements} = useGetStatementsQuery({
        ...dateRange,
        ...(categories.length >0 ?{categories}:{})
    })
    return <>
        <StatementTable statements={statements} />
    </>
}
