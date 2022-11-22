import {FunctionComponent} from "react";
import {useGetAccountsQuery, useGetBalanceQuery, useGetStatementsGroupedByCategoryQuery} from "../redux/api";
import {Card, Title, BarChart, Flex, Icon, Block, Text, Metric, ColGrid} from "@tremor/react"
import {useAppSelector} from "../redux/hooks";
export const Dashboard: FunctionComponent = ()=>{
    return <>
        <BalanceCard/>
        <ByCategory />
    </>
}

const BalanceCard = ()=>{
    const {data: accounts} = useGetAccountsQuery()
    const {data: balances} = useGetBalanceQuery(accounts || [])
    // TODO: Fix backend error when requesting balance with empty accounts
    return <ColGrid numColsSm={ 2 } numColsLg={ 3 } gapX="gap-x-6" gapY="gap-y-6">{(balances||[]).map(balance=><Card key={balance.account}>
        <Flex justifyContent="justify-start" spaceX="space-x-4">
            <Block truncate={ true }>
                <Text>{ balance.account }</Text>
                <Metric truncate={ true }>{ balance.balance }</Metric>
            </Block>
        </Flex>
    </Card>)}</ColGrid>
}

const ByCategory = ()=>{
    const range = useAppSelector(({date})=>date)
    const {data: categories} = useGetStatementsGroupedByCategoryQuery(range)
    return <Card marginTop="mt-2">
        <Title>Übersicht Einnahmen / Ausgaben</Title>
        <BarChart
            data={categories || []}
            categories={["saldo"]}
            dataKey="category"
            stack={true}
            relative={false}
            colors={["fuchsia"]}
        />
    </Card>
}

const ByDate = ({keys}: {keys: string[] }) => {
    // const {start,end} = useContext(DateContext)
    // const [statements, setStatements] = useState([])
    // useEffect(() => {
    //     (async () => {
    //         const res = await fetch(`http://localhost:3030/statements/bydate?start=${start.toString()}&end=${end.toString()}${keys.map(key => `&keys=${key}`).join('')}`)
    //         const statements = await res.json()
    //         setStatements(statements.map((statement: any) => {
    //             return {
    //                 ...statement,
    //                 debit: Math.abs(statement.debit),
    //                 credit: Math.abs(statement.credit),
    //                 saldo: Math.abs(statement.saldo),
    //                 date: `${statement['year'] || ''} ${statement['month'] || ''} ${statement['day'] || ''}`,
    //             }
    //         }))
    //     })()
    // }, [start,end, keys])
    // return <Card marginTop="mt-2">
    //     <Title>Übersicht Einnahmen / Ausgaben</Title>
    //     <BarChart
    //         data={statements}
    //         categories={["debit", "credit"]}
    //         dataKey="date"
    //         stack={true}
    //         relative={false}
    //         colors={["red", "green"]}
    //     />
    // </Card>
    return <></>
}
