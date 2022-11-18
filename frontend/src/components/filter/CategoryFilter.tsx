import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import React, {useEffect} from "react";
import {updateUrlWithSearchParams} from "../../lib/updateUrlWithSearchParams";
import {useSearchParams} from "react-router-dom";
import {useGetCategoriesQuery} from "../../redux/api";
import {MultiSelectBox, MultiSelectBoxItem} from "@tremor/react"
import {setCategories} from "../../redux/categorySlice";
export const CategoryFilter = () => {
    const {data: availableCategories} = useGetCategoriesQuery()
    const dispatch = useAppDispatch()
    const categories = useAppSelector(({category}) => category.value)
    const [searchParams] = useSearchParams()
    useEffect(()=>{
        const categoryParams = [...searchParams].filter(([key])=>key==='categories').map(([,category])=>category)
        dispatch(setCategories(categoryParams))
    },[dispatch])
    const handleClick = (categories: (string|null)[]) => {
        dispatch(setCategories(categories))
        updateUrlWithSearchParams(searchParams => {
            searchParams.delete('categories')
            categories.map(category=>{
                searchParams.append('categories', category || 'null')
            })
            return searchParams
        })
    }

    return <>
        {JSON.stringify(categories)}

        <MultiSelectBox
            defaultValues={categories}
            handleSelect={handleClick}
            placeholder="Select Category"
            maxWidth="max-w-none"
            marginTop="mt-0"
        >
            {(['Tanken','Amazon']).map(category=>
                    <MultiSelectBoxItem
                        key={category}
                        text={category || 'Keine Kategorie'}
                        value={category}
                    />)}
        </MultiSelectBox>
    </>
}
