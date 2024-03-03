import { ADMIN_SUBJECT_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const subjectSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubjects: builder.query({
            query: () => ({
                url: ADMIN_SUBJECT_URL
            }),
            keepUnusedDataFor: 5,
        }),
        addSubject: builder.mutation({
            query: (data) => ({
                url: 'ADMIN_SUBJECT_URL/add',
                method: 'POST',
                body: data
            })
        })
    })
})

export const { useGetSubjectsQuery, useAddSubjectMutation } = subjectSlice