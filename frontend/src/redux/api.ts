import {BaseQueryFn, createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {getConfigValue} from "../lib/config";
import {getToken} from "../auth/AuthWrapper";
import {Statement} from "../models/Statement";
import {Temporal} from "@js-temporal/polyfill";
import {start} from "repl";

const dynamicBaseQuery: BaseQueryFn = async (args, WebApi, extraOptions) => {
    const rawBaseQuery = fetchBaseQuery({
        baseUrl: getConfigValue("API"),
        prepareHeaders: (headers) => {
            const token = getToken()
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        }
    })
    return rawBaseQuery(args, WebApi, extraOptions)
}

export const backend = createApi({
    reducerPath: 'backend',
    tagTypes: ['statements','accounts','categories','balance'],
    baseQuery: dynamicBaseQuery,
    endpoints: (builder) => ({
        XstatementRequest: builder.mutation<any, string>({
            invalidatesTags: (res)=>res?.finished ? ['statements','balance'] :[],
            query: (iban: string) => `ingest/${iban}`
        }),
        XtanResponse: builder.mutation<any, {id: string, tan: string, iban: string}>({
            invalidatesTags: (res)=>res?.finished ? ['statements','balance'] :[],
            query: ({id,tan, iban}) => ({url: `ingest/tan/${iban}?tan=${tan}&id=${id}`, method: 'POST'})
        }),
        Xclassify: builder.mutation<any, void>({
            invalidatesTags: ['statements'],
            query: () => ({url: `classify`})
        }),
        getAccounts: builder.query<any[], void>({
            providesTags: ['accounts'],
            query: () => `users/me/accounts`,
        }),
        setAccounts: builder.mutation<void, any[]>({
            invalidatesTags: ['accounts','balance'],
            query: (accounts) => ({url: `users/me/accounts`, method: 'PUT', body: accounts}),
        }),
        getStatements: builder.query<Statement[], {start: Temporal.PlainDate, end: Temporal.PlainDate, categories?:(string|null)[], recurring: 'true'|'false'|'neither'}>({
            providesTags: ['statements'],
            query: ({start,end,categories, recurring})=>  {
                const categoryParams = categories ? '&'+categories.map(category=>category || 'null').map(category=>new URLSearchParams({categories: category})).join('&'):''
                const dateParams = new URLSearchParams({start: start.toJSON(),end: end.toJSON()})
                const recurringParams = `${recurring !== 'neither' ? new URLSearchParams({recurring}) : ''}`
                return `statements?${dateParams}${categoryParams}${recurringParams}`
            },
            transformResponse: (statements: any[])=>{
                return statements.map(statement=>{
                    return {
                        ...statement,
                        valuta: Temporal.Instant.from(statement.valuta).toZonedDateTimeISO(Temporal.Now.timeZone()).toPlainDate(),
                        booked: Temporal.Instant.from(statement.booked).toZonedDateTimeISO(Temporal.Now.timeZone()).toPlainDate(),
                    }
                })
            }
        }),
        getStatementsGroupedByDate: builder.query<any[], {start: Temporal.PlainDate, end: Temporal.PlainDate, keys: string[]} >({
            providesTags: [],
            query: ({start, end,keys})=> {
                const keyParams = keys.map(key=>new URLSearchParams({keys: key})).join('&')
                const dateParams = new URLSearchParams({start: start.toJSON(),end: end.toJSON()})
                return `statements/bydate?${dateParams}&${keyParams}`
            },
        }),
        getStatementsGroupedByCategory: builder.query<any[], {start: Temporal.PlainDate, end: Temporal.PlainDate} >({
            providesTags: [],
            query: ({start, end})=> {
                const dateParams = new URLSearchParams({start: start.toJSON(),end: end.toJSON()})
                return `statements/bycategory?${dateParams}`
            },
        }),
        getCategories: builder.query<string[], void>({
            providesTags: ['categories'],
            query: ()=> {
                return `categories`
            },
        }),
        getBalance: builder.query<{ account: string, balance: number }[], { iban: string }[] >({
            providesTags: ['balance'],
            query: (accounts)=> {
                const accountParams = accounts.map(account=>new URLSearchParams({accounts: account.iban})).join('&')
                return `balance?${accountParams}`
            },
        }),

    }),
})
export const {
    useGetAccountsQuery,
    useSetAccountsMutation,
    useGetStatementsQuery,
    useGetStatementsGroupedByDateQuery,
    useGetStatementsGroupedByCategoryQuery,
    useGetCategoriesQuery,
    useGetBalanceQuery,
    useXstatementRequestMutation,
    useXtanResponseMutation,
    useXclassifyMutation,
} = backend
