import { ADMIN_SECTION_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const sectionSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSections: builder.query({
            query: () => ({
                url: ADMIN_SECTION_URL
            }),
            keepUnusedDataFor: 5,
        }),
        addSection: builder.mutation({
            query: (data) => ({
                url: 'ADMIN_SECTION_URL/add',
                method: 'POST',
                body: data
            })
        })
    })
})

export const { useGetSectionsQuery , useAddSectionMutation } = sectionSlice