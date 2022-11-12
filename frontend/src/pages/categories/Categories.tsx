import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";

export const Categories = ()=>{
    const [categories, setCategories] = useState([])
    useEffect(()=>{
        (async()=>{
            const res = await fetch('http://localhost:3030/categories')
            setCategories(await res.json())
        })()
    },[])
    return <ul>
        {categories.map(category=><li key={category}><Link to={`/categories/${category}`}>{category}</Link></li>)}
    </ul>
}
