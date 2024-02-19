import { TEACHER_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const teacherSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTeachers: builder.query({
            query: () => ({
                url: TEACHER_URL
            }),
            keepUnusedDataFor: 5,
        })
    })
})

export const { useGetTeachersQuery } = teacherSlice