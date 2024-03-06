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
                url: `${ADMIN_SUBJECT_URL}/add`,
                method: 'POST',
                body: data
            })
        }),

        editSubject: builder.mutation({
            query: (data) => ({
                url: `${ADMIN_SUBJECT_URL}/edit/${data.subjectId}`,
                method: 'PATCH',
                body: data
            })
        }),
        deleteSubject: builder.mutation({
            query: (subjectId) => ({
                url: `${ADMIN_SUBJECT_URL}/delete/${subjectId}`,
                method: 'PATCH'
            })
        })
    })
})

export const { useGetSubjectsQuery, useAddSubjectMutation, useEditSubjectMutation, useDeleteSubjectMutation } = subjectSlice