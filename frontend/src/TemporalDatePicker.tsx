import {Datepicker} from "@tremor/react";
import {Temporal} from "@js-temporal/polyfill";

const toPlainDate = (date: Date): Temporal.PlainDate => Temporal.Instant.from(date.toJSON()).toZonedDateTimeISO(Temporal.Now.timeZone()).toPlainDate()
const toDate = (date: Temporal.PlainDate): Date => new Date(date.toJSON())
export const TemporalDatePicker = ({defaultStartDate, defaultEndDate, ...props}:any) => {


    const onChange = (start: Date, end: Date) => {
        props.handleSelect({start: toPlainDate(start), end: toPlainDate(end)})
    }

    return <Datepicker
        {...props}
        defaultStartDate={toDate(defaultStartDate)}
        defaultEndDate={toDate(defaultEndDate)}
        enableRelativeDates={true}
        handleSelect={onChange}/>
}
