import {Temporal} from "@js-temporal/polyfill";

export type Party = {
    name: string,
    iban: string,
    bic: string,
}

export type Statement = {
    id: string,
    valuta: Temporal.PlainDate,
    booked: Temporal.PlainDate,
    value: number,
    saldo: number,
    usage: string,
    text: string,
    additional: string,
    other: Party,
    self: Party,
    category: string,
    recurring: true,
}
