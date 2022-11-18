import {StatementTable} from "../../components/StatementTable";
import {useGetStatementsQuery} from "../../redux/api";
import {useAppSelector} from "../../redux/hooks";

export const Statements = ()=>{
    const range = useAppSelector(({date})=>date)
    const recurring = useAppSelector(({recurring})=>recurring.value)
    const categories = useAppSelector(({category})=>category.value)
    const {data: statements} = useGetStatementsQuery({
        ...range,
        categories,
        recurring,
    })
    return <>
        <StatementTable statements={statements} />
    </>
}
