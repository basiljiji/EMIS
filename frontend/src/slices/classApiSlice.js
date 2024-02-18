import { ADMIN_CLASS_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const classSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getClasses: builder.query({
            query: () => ({
                url: ADMIN_CLASS_URL
            }),
            keepUnusedDataFor: 5,
        })
    })
})

export const { useGetClassesQuery } = classSlice