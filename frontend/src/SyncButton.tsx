import React, {FunctionComponent, useState} from "react";
import {useGetAccountsQuery, useXstatementRequestMutation, useXtanResponseMutation} from "./redux/api";
import {Button, Flex, SelectBox, SelectBoxItem} from "@tremor/react";
import {ArrowPathIcon} from "@heroicons/react/24/solid";

export const SyncButton: FunctionComponent = ()=>{
    const accounts = (useGetAccountsQuery()?.data) || []
    const [account, setAccount] = useState()
    const [sync] = useXstatementRequestMutation()
    const [submitTan] = useXtanResponseMutation()
    const onClick = async () => {
        // @ts-ignore
        const response = await sync(account.iban)
        console.log(response)
        // @ts-ignore
        if (!response.data.finished) {
            // @ts-ignore
            let tan = prompt("Please enter Tan for request " + response.data.message.id)
            // @ts-ignore
            submitTan({tan, id: response.data.message.id, iban: account.iban})
        }
    }
    return <Flex>
        <SelectBox
            defaultValue={accounts[0]}
            handleSelect={setAccount}
            placeholder="Select Account"
            maxWidth="max-w-none"
            marginTop="mt-0"
        >
            {accounts.map(account => <SelectBoxItem
                key={account.iban}
                value={account}
                text={account.iban}
                icon={undefined}/>)}
        </SelectBox>
        <Button
            text="Sync"
            icon={ArrowPathIcon}
            handleClick={onClick}
        />
    </Flex>
}
