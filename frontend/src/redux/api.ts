import {BaseQueryFn, createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {getConfigValue} from "../lib/config";
import {getToken} from "../auth/AuthWrapper";

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
    tagTypes: [],
    baseQuery: dynamicBaseQuery,
    endpoints: (builder) => ({
        getAccounts: builder.query<any[], void>({
            providesTags: [],
            query: () => `users/me/accounts`,
        }),
        statementRequest: builder.mutation<any, string>({
            invalidatesTags: [],
            query: (iban: string) => `ingest/${iban}`
        }),
        tanResponse: builder.mutation<any, {id: string, tan: string, iban: string}>({
            invalidatesTags: [],
            query: ({id,tan, iban}) => ({url: `ingest/tan/${iban}?tan=${tan}&id=${id}`, method: 'POST'})
        })
    }),
})
export const {
    useGetAccountsQuery,
    useStatementRequestMutation,
    useTanResponseMutation,
} = backend
