import { PERIOD_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const periodSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addAccessedFiles: builder.mutation({
            query: (data) => ({
                url: `${PERIOD_URL}/add`,
                method: 'POST',
                body: data
            }),
            keepUnusedDataFor: 5,
        }),
        getAllPeriods: builder.query({
            query: () => ({
                url: `${PERIOD_URL}/all`
            }),
            keepUnusedDataFor: 5,
        })
    })
})

export const { useAddAccessedFilesMutation, useGetAllPeriodsQuery } = periodSlice