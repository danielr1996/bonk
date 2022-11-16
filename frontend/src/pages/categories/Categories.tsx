import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useGetCategoriesQuery, useGetStatementsQuery} from "../../redux/api";
import {Badge} from "@tremor/react";

export const Categories = ()=>{
    const {data: categories} = useGetCategoriesQuery()
    return <>
        {(categories ||[]).map(category=><Link key={category} to={`/statements?categories=${category}`}>
            <Badge text={category || 'Keine Kategorie'} color={category ? 'gray' : 'red'}/>
        </Link>)}
    </>
}
