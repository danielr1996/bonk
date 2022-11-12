import {useParams} from "react-router-dom";

export const Category = ()=>{
    const {category} = useParams()
    return <>{category}</>
}
