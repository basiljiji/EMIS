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
        }),
        editTeacher: builder.mutation({
            query: (data) => ({
                url: `${TEACHER_URL}/edit/${data.teacherId}`,
                method: "PATCH",
                body: data
            })
        }),
        deleteTeacher: builder.mutation({
            query: (teacherId) => ({
                url: `${TEACHER_URL}/delete/${teacherId}`,
                method: "PATCH"
            })
        }),
        teacherById: builder.query({
            query: (teacherId) => ({
                url: `${TEACHER_URL}/${teacherId}`
            })
        })
    }),
})

export const { useGetTeachersQuery, useAddTeacherMutation, useEditTeacherMutation, useDeleteTeacherMutation, useTeacherByIdQuery } = teacherSlice