import { ADMIN_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const adminAuthApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        adminLogin: builder.mutation({
            query: (data) => ({
                url: `${ADMIN_URL}/login`,
                method: "POST",
                body: data
            })
        }),
        adminLogout: builder.mutation({
            query: (data) => ({
                url: `${ADMIN_URL}/logout`,
                method: "POST",
                body: data
            })
        }),
    })
})

export const { useAdminLoginMutation, useAdminLogoutMutation } = adminAuthApiSlice