import React, {FunctionComponent, useState} from "react";
import {
    useGetAccountsQuery,
    useXclassifyMutation,
    useXstatementRequestMutation,
    useXtanResponseMutation
} from "./redux/api";
import {Button, Flex, SelectBox, SelectBoxItem} from "@tremor/react";
import {ArrowPathIcon} from "@heroicons/react/24/solid";

export const ClassifyButton: FunctionComponent = ()=>{
    const [classify] = useXclassifyMutation()
    return <Flex>
        <Button
            text="Classify"
            icon={ArrowPathIcon}
            handleClick={classify}
        />
    </Flex>
}
