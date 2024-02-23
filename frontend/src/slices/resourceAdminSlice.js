import { RESOURCE_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const resourceAdminSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addFolder: builder.mutation({
            query: (data) => ({
                url: `${RESOURCE_URL}/`,
                method: 'POST',
                body: data
            }),
            keepUnusedDataFor: 5,
        }),
        getAllFolders: builder.query({
            query: () => ({
                url: `${RESOURCE_URL}/`
            })
        }),
        getResources: builder.query({
            query: (folderName) => ({
                url: `${RESOURCE_URL}/${folderName}`
            })
        }),
        uploadReources: builder.mutation({
            query: ({ folderName, formData }) => ({
                url: `${RESOURCE_URL}/upload/${folderName}`,
                method: 'POST',
                body: formData
            }),
            keepUnusedDataFor: 5,
        })
    })
})

export const { useAddFolderMutation, useGetAllFoldersQuery, useGetResourcesQuery, useUploadReourcesMutation } = resourceAdminSlice