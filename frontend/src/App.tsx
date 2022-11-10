import React, {FunctionComponent, useState} from 'react';
import '@tremor/react/dist/esm/tremor.css';
import {useGetAccountsQuery, useStatementRequestMutation, useTanResponseMutation} from "./redux/api";
import { SelectBox, SelectBoxItem, Button } from "@tremor/react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

export const App: FunctionComponent = ()=>{
  const accounts = (useGetAccountsQuery()?.data) || []
  const [account, setAccount] = useState()
  const [sync] = useStatementRequestMutation()
  const [submitTan] = useTanResponseMutation()
  const onClick = async ()=>{
    // @ts-ignore
    const response = await sync(account.iban)
    // @ts-ignore
    if(!response.data.finished){
      // @ts-ignore
      let tan = prompt("Please enter Tan for request "+response.data.message.id)
      // @ts-ignore
      submitTan({tan, id: response.data.message.id, iban: account.iban})
    }
  }
  return <>
    <SelectBox
        defaultValue={accounts[0]}
        handleSelect={setAccount}
        placeholder="Select Account"
        marginTop="mt-0"
    >
      {accounts.map(account=><SelectBoxItem
          key={account.iban}
          value={account}
          text={account.iban}
          icon={undefined} />)}
    </SelectBox>
    <Button
        text="Sync"
        icon={ArrowPathIcon}
        handleClick={onClick}
    />
  </>
}
