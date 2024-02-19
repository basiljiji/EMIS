import { TEACHER_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const teacherSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTeachers: builder.query({
            query: () => ({
                url: TEACHER_URL
            }),
            keepUnusedDataFor: 5,
        }),
        addTeacher: builder.mutation({
            query: (data) => ({
                url: `${TEACHER_URL}/add`,
                method: "POST",
                body: data
            })
        })
    }),
})

export const { useGetTeachersQuery, useAddTeacherMutation } = teacherSlice