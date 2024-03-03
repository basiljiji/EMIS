import { ADMIN_CLASS_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const classSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getClasses: builder.query({
            query: () => ({
                url: ADMIN_CLASS_URL
            }),
            keepUnusedDataFor: 5,
        }),
        addClass: builder.mutation({
            query: (data) => ({
                url: `${ADMIN_CLASS_URL}/add`,
                method: 'POST',
                body: data
            })
        }),
        deleteClass: builder.mutation({
            query: (classId) => ({
                url: `${ADMIN_CLASS_URL}/delete/${classId}`,
                method: 'DELETE'
            })
        })
    })
})

export const { useGetClassesQuery, useAddClassMutation, useDeleteClassMutation } = classSlice