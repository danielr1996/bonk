import React, {FunctionComponent, useState} from "react";
import {useGetAccountsQuery, useXstatementRequestMutation, useXtanResponseMutation} from "./redux/api";
import {Button, Flex, SelectBox, SelectBoxItem} from "@tremor/react";
import {ArrowPathIcon} from "@heroicons/react/24/solid";

export const SyncButton: FunctionComponent = ()=>{
    const {data: accounts = [], isLoading} = useGetAccountsQuery()
    const [account, setAccount] = useState(accounts[0])
    const [sync] = useXstatementRequestMutation()
    const [submitTan] = useXtanResponseMutation()
    const onClick = async () => {
        // TODO:
        const response: any = await sync(account.iban)
        if (!response.data.finished) {
            const tan = prompt("Please enter Tan for request " + response.data.message.id)
            if(tan !== null){
                submitTan({tan, id: response.data.message.id, iban: account.iban})
            }
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
