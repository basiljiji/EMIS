import { TEACHER_RESOURCE_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const resourceTeacherSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchFolders: builder.mutation({
            query: (data) => ({
                url: `${TEACHER_RESOURCE_URL}/`,
                method: 'POST',
                body: data
            }),
            keepUnusedDataFor: 5,
        }),
        fetchResources: builder.query({
            query: (folderName) => ({
                url: `${TEACHER_RESOURCE_URL}/${folderName}`,
                method: 'GET'
            }),
        }),
    })
})

export const { useFetchFoldersMutation, useFetchResourcesQuery } = resourceTeacherSlice