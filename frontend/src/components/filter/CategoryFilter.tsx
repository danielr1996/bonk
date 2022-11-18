import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import React, {useEffect} from "react";
import {updateUrlWithSearchParams} from "../../lib/updateUrlWithSearchParams";
import {useSearchParams} from "react-router-dom";
import {useGetCategoriesQuery} from "../../redux/api";
import {SelectBox, SelectBoxItem,MultiSelectBox, MultiSelectBoxItem} from "@tremor/react"
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
        {JSON.stringify(categories[0])}
        <SelectBox
            defaultValue={categories[0]}
            handleSelect={value=>handleClick([value])}
            placeholder="Select Category"
            maxWidth="max-w-none"
            marginTop="mt-0"
        >
            {(availableCategories ||[]).map(category=>
                    <SelectBoxItem
                        key={category}
                        text={category || 'Keine Kategorie'}
                        value={category}
                    />)}
        </SelectBox>
    </>
}
