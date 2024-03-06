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
                url: `${ADMIN_SECTION_URL}/add`,
                method: 'POST',
                body: data
            })
        }),
        editSection: builder.mutation({
            query: (data) => ({
                url: `${ADMIN_SECTION_URL}/edit/${data.sectionId}`,
                method: 'PATCH',
                body: data
            })
        }),
        deleteSection: builder.mutation({
            query: (sectionId) => ({
                url: `${ADMIN_SECTION_URL}/delete/${sectionId}`,
                method: 'PATCH'
            })
        })
    })
})

export const { useGetSectionsQuery, useAddSectionMutation, useEditSectionMutation, useDeleteSectionMutation } = sectionSlice