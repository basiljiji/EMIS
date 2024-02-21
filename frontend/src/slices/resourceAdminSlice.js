import { RESOURCE_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const resourceAdminSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // getReport: builder.query({
        //     query: () => ({
        //         url: REPORT_URL
        //     }),
        //     keepUnusedDataFor: 5,
        // }),
        addFolder: builder.mutation({
            query: (data) => ({
                url: `${RESOURCE_URL}/`,
                method: 'POST',
                body: data
            }),
            keepUnusedDataFor: 5,
        })
    })
})

export const { useAddFolderMutation } = resourceAdminSlice