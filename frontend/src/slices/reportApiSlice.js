import { REPORT_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const reportSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getReport: builder.query({
            query: () => ({
                url: REPORT_URL
            }),
            keepUnusedDataFor: 5,
        }),
        getpdf: builder.query({
            query: () => ({
                url: `${REPORT_URL}/pdf`
            }),
            keepUnusedDataFor: 5,
        })
    })
})

export const { useGetReportQuery } = reportSlice