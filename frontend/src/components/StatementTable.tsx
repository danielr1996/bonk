import {FunctionComponent} from "react";
import {
    Table,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
} from "@tremor/react";
import {Link} from "react-router-dom";
import {Statement} from "../models/Statement";

type Props = {
    statements?: Statement[]
}
export const StatementTable: FunctionComponent<Props> = ({statements})=>{
    return <Table>
        <TableHead>
            <TableRow>
                <TableHeaderCell textAlignment="text-left">Buchungsdatum</TableHeaderCell>
                <TableHeaderCell textAlignment="text-left">Betrag</TableHeaderCell>
                <TableHeaderCell textAlignment="text-left">Gegenpartei</TableHeaderCell>
                <TableHeaderCell textAlignment="text-left">Kategorie</TableHeaderCell>
                <TableHeaderCell textAlignment="text-left">Verwendungszweck</TableHeaderCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {(statements || []).map(statement=>
                <TableRow key={statement.id}>
                    <TableCell textAlignment="text-left">{statement.booked.toLocaleString()}</TableCell>
                    <TableCell textAlignment="text-left">{statement.value}</TableCell>
                    <TableCell textAlignment="text-left">{statement.other.name}</TableCell>
                    <TableCell textAlignment="text-left"><Link to={`/categories/${statement.category}`}>{statement.category}</Link></TableCell>
                    <TableCell textAlignment="text-left">{statement.usage}</TableCell>
                </TableRow>
            )}
        </TableBody>
    </Table>
}
