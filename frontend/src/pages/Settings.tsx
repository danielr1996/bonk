import {useGetAccountsQuery, useSetAccountsMutation} from "../redux/api";
import {Button} from "@tremor/react";
import React, {useEffect, useState} from "react";
import {SyncButton} from "../SyncButton";
import {ClassifyButton} from "../ClassifyButton";

const example = `
[
    {
        "username":"",
        "password":"",
        "iban":"",
        "bic":"",
        "blz":"",
        "account":""
    }
]
`
export const Settings= ()=>{
    const accounts = (useGetAccountsQuery()?.data) || []
    const [settings, setSettings] = useState('')
    useEffect(()=>{
        setSettings(JSON.stringify(accounts,null,4))
    },[accounts])
    const [save] = useSetAccountsMutation()
    const onClick = ()=>{
        save(JSON.parse(settings))
    }

    return <>

        <SyncButton/>
        <ClassifyButton/>
        <h1>Settings</h1>
        <textarea cols={100} rows={25} onChange={e=>setSettings(e.target.value)} value={settings} />
        <Button text="Save" handleClick={()=>onClick()}/>
        <h2>Example</h2>
        <pre>
            <code>
                {example}
            </code>
        </pre>
    </>
}
