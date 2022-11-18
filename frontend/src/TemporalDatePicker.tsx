import {Datepicker} from "@tremor/react";
import {Temporal} from "@js-temporal/polyfill";
import {FunctionComponent} from "react";

const toPlainDate = (date: Date): Temporal.PlainDate => Temporal.Instant.from(date.toJSON()).toZonedDateTimeISO(Temporal.Now.timeZone()).toPlainDate()
const toDate = (date: Temporal.PlainDate): Date => new Date(date.toJSON())

type Props = {
    defaultStartDate: Temporal.PlainDate,
    defaultEndDate: Temporal.PlainDate,
    handleSelect: (range: {start: Temporal.PlainDate, end: Temporal.PlainDate})=>any
} & {[key in string]: any}

export const TemporalDatePicker: FunctionComponent<Props> = ({defaultStartDate, defaultEndDate,handleSelect, ...props}) => {

    const onChange = (start: Date, end: Date) => {
        handleSelect({start: toPlainDate(start), end: toPlainDate(end)})
    }

    return <Datepicker
        {...props}
        defaultStartDate={toDate(defaultStartDate)}
        defaultEndDate={toDate(defaultEndDate)}
        enableRelativeDates={true}
        handleSelect={onChange}/>
}
