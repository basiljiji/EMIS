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
        }),
        renameFolder: builder.mutation({
            query: (data) => ({
                url: `${RESOURCE_URL}/folder/rename/${data.folderId}`,
                method: 'PATCH',
                body: data
            })
        }),
        editFolderAccess: builder.mutation({
            query: (data) => ({
                url: `${RESOURCE_URL}/folder/access/${data.folderId}`,
                method: 'PUT',
                body: data
            })
        }),
        deleteFolder: builder.mutation({
            query: (data) => ({
                url: `${RESOURCE_URL}/folder/delete/${data.folderId}`,
                method: 'PATCH',
                body: data
            })
        }),
        getSingleFolderData: builder.query({
            query: (folderId) => ({
                url: `${RESOURCE_URL}/folder/edit/${folderId}`
            })
        }),
        deleteResource: builder.mutation({
            query: (data) => ({
                url: `${RESOURCE_URL}/filename/${data.resourceId}`,
                method: 'PATCH',
                body: data
            })
        }),
    })
})

export const {
    useAddFolderMutation,
    useGetAllFoldersQuery,
    useGetResourcesQuery,
    useUploadReourcesMutation,
    useRenameFolderMutation,
    useEditFolderAccessMutation,
    useDeleteFolderMutation,
    useGetSingleFolderDataQuery,
    useDeleteResourceMutation
} = resourceAdminSlice