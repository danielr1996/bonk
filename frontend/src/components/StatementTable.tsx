import {FunctionComponent} from "react";
import {
    Table,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    Badge
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
                <TableHeaderCell textAlignment="text-left">Valutadatum</TableHeaderCell>
                <TableHeaderCell textAlignment="text-left">Betrag</TableHeaderCell>
                <TableHeaderCell textAlignment="text-left">Gegenpartei</TableHeaderCell>
                <TableHeaderCell textAlignment="text-left">Kategorie</TableHeaderCell>
                <TableHeaderCell textAlignment="text-left">Wiederkehrend</TableHeaderCell>
                <TableHeaderCell textAlignment="text-left">Verwendungszweck</TableHeaderCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {(statements || []).map(statement=>
                <TableRow key={statement.id}>
                    <TableCell textAlignment="text-left">{statement.booked.toLocaleString()}</TableCell>
                    <TableCell textAlignment="text-left">{statement.valuta.toLocaleString()}</TableCell>
                    <TableCell textAlignment="text-left"><Badge text={`${statement.value} €`} color="blue"/></TableCell>
                    <TableCell textAlignment="text-left">{statement.other.name}</TableCell>
                    <TableCell textAlignment="text-left"><Link to={`?categories=${statement.category}`} replace={false}>
                        <Badge text={statement.category || 'Keine Kategorie'} color={statement.category ? 'gray' : 'red'}/>
                    </Link></TableCell>
                    <TableCell textAlignment="text-left">
                        <Badge text={statement.recurring ? 'Wiederkehrend' : 'Einmalig'} color={statement.recurring ? 'yellow' : 'blue'}/>
                    </TableCell>
                    <TableCell textAlignment="text-left">{statement.usage}</TableCell>
                </TableRow>
            )}
        </TableBody>
    </Table>
}
