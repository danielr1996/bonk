import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import React, {useEffect} from "react";
import {updateUrlWithSearchParams} from "../../lib/updateUrlWithSearchParams";
import {useSearchParams} from "react-router-dom";
import {useGetCategoriesQuery} from "../../redux/api";
import {Block} from "@tremor/react"
import {addCategory, removeCategory, setCategories} from "../../redux/categorySlice";

export const CategoryFilter = () => {
    const {data: availableCategories} = useGetCategoriesQuery()
    const dispatch = useAppDispatch()
    const categories = useAppSelector(({category}) => category.value)
    const [searchParams] = useSearchParams()

    // Update state with params from url
    useEffect(() => {
        const categoryParams = [...searchParams].filter(([key]) => key === 'categories').map(([, category]) => category)
        dispatch(setCategories(categoryParams))
    }, [dispatch])

    // Update url with params from state
    useEffect(() => {
        updateUrlWithSearchParams(searchParams => {
            searchParams.delete('categories')
            categories.map(category => {
                searchParams.append('categories', category || 'null')
            })
            return searchParams
        })
    }, [categories])

    const handleChange = (e: any) => {
        const value = e.target.value !== '' ? e.target.value : null
        if (e.target.checked) {
            dispatch(addCategory(value))
        } else {
            dispatch(removeCategory(value))
        }
    }

    return <Block>
        {(availableCategories || []).map(category =>
            <label key={category}><input onChange={handleChange} type="checkbox" name="categories"
                                         defaultChecked={categories.includes(category)}
                                         value={category || ''}/>{category || 'Keine Kategorie'}</label>
        )}
    </Block>
}
