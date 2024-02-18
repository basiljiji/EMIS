import { ADMIN_HOUR_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const hourSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHours: builder.query({
            query: () => ({
                url: ADMIN_HOUR_URL
            }),
            keepUnusedDataFor: 5,
        })
    })
})

export const { useGetHoursQuery } = hourSlice