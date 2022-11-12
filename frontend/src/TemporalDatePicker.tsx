import {Datepicker} from "@tremor/react";
import {Temporal} from "@js-temporal/polyfill";
const toPlainDate = (date: Date): Temporal.PlainDate =>Temporal.Instant.from(date.toJSON()).toZonedDateTimeISO(Temporal.Now.timeZone()).toPlainDate()
export const TemporalDatePicker = (props: any) => {


    const onChange = (start: Date, end: Date)=>{
        props.handleSelect(toPlainDate(start),toPlainDate(end))
    }

    return <Datepicker {...props} enableRelativeDates={true}
                       handleSelect={onChange} defaultStartDate={new Date()}/>
}
