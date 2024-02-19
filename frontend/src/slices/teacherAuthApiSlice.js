import { TEACHER_AUTH_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const teacherAuthApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${TEACHER_AUTH_URL}/login`,
                method: "POST",
                body: data
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${TEACHER_AUTH_URL}/logout`,
                method: "POST"
            })
        })
    })
})


export const { useLoginMutation, useLogoutMutation } = teacherAuthApiSlice