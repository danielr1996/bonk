import {FunctionComponent} from "react";
import {useGetAccountsQuery, useGetBalanceQuery} from "../redux/api";
import {Card, Flex, Icon, Block, Text, Metric, ColGrid} from "@tremor/react"
export const Dashboard: FunctionComponent = ()=>{
    return <>
        <BalanceCard/>
    </>
}

const BalanceCard = ()=>{
    const {data: accounts} = useGetAccountsQuery()
    const {data: balances} = useGetBalanceQuery(accounts || [])
    return <ColGrid numColsSm={ 2 } numColsLg={ 3 } gapX="gap-x-6" gapY="gap-y-6">{(balances||[]).map(balance=><Card key={balance.account}>
        <Flex justifyContent="justify-start" spaceX="space-x-4">
            <Block truncate={ true }>
                <Text>{ balance.account }</Text>
                <Metric truncate={ true }>{ balance.balance }</Metric>
            </Block>
        </Flex>
    </Card>)}</ColGrid>
}
