import {useLoaderData, useParams} from "react-router-dom";

export const Statement = ()=>{
    const {id} = useParams()
    return <>Statement {id}</>
}
