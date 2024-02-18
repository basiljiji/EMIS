import { ADMIN_SUBJECT_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const subjectSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubjects: builder.query({
            query: () => ({
                url: ADMIN_SUBJECT_URL
            }),
            keepUnusedDataFor: 5,
        })
    })
})

export const { useGetSubjectsQuery } = subjectSlice