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
    tagTypes: ['statements','accounts','categories'],
    baseQuery: dynamicBaseQuery,
    endpoints: (builder) => ({
        XstatementRequest: builder.mutation<any, string>({
            invalidatesTags: (res)=>res?.finished ? ['statements'] :[],
            query: (iban: string) => `ingest/${iban}`
        }),
        XtanResponse: builder.mutation<any, {id: string, tan: string, iban: string}>({
            invalidatesTags: (res)=>res?.finished ? ['statements'] :[],
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
            invalidatesTags: ['accounts'],
            query: (accounts) => ({url: `users/me/accounts`, method: 'PUT', body: accounts}),
        }),
        getStatements: builder.query<Statement[], {start: Temporal.PlainDate, end: Temporal.PlainDate, categories?:(string|null)[]}>({
            providesTags: ['statements'],
            query: ({start,end,categories})=>  {
                const categoryParams = categories ? '&'+categories.map(category=>category || 'null').map(category=>new URLSearchParams({categories: category})).join('&'):''
                return `statements?${new URLSearchParams({start: start.toJSON(),end: end.toJSON()})}${categoryParams}`
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
        getCategories: builder.query<string[], void>({
            providesTags: ['categories'],
            query: ()=> {
                return `categories`
            },
        }),

    }),
})
export const {
    useGetAccountsQuery,
    useSetAccountsMutation,
    useGetStatementsQuery,
    useGetCategoriesQuery,
    useXstatementRequestMutation,
    useXtanResponseMutation,
    useXclassifyMutation,
} = backend
