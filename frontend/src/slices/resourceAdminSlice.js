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
        getResourceByFolder: builder.query({
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
                url: `${RESOURCE_URL}/folder/${folderId}`,
                method: 'GET',
            })
        }),
        deleteResource: builder.mutation({
            query: (data) => ({
                url: `${RESOURCE_URL}/filename/${data.resourceId}`,
                method: 'PATCH',
                body: data
            })
        }),
        getSubFolders: builder.query({
            query: (folderName) => ({
                url: `${RESOURCE_URL}/${folderName}`,
                method: 'GET'
            })
        }),
        addSubfolder: builder.mutation({
            query: (data) => ({
                url: `${RESOURCE_URL}/${data.folderName}`,
                method: 'POST',
                body: data
            })
        }),
        uploadFilesSubfolder: builder.mutation({
            query: ({ folderName, subfolderName, formData }) => ({
                url: `${RESOURCE_URL}/upload/${folderName}/${subfolderName}`,
                method: 'POST',
                body: formData
            }),
            keepUnusedDataFor: 5,
        }),
        renameSubfolder: builder.mutation({
            query: (data) => ({
                url: `${RESOURCE_URL}/subfolder/rename/${data.folderId}`,
                method: 'PATCH',
                body: data
            })
        }),
        deleteSubfolder: builder.mutation({
            query: (data) => ({
                url: `${RESOURCE_URL}/subfolder/delete/${data.subfolderId}`,
                method: 'PATCH',
                body: data
            })
        }),
        getSingleSubfolderData: builder.query({
            query: ({folderName, subfolderName}) => ({
                url: `${RESOURCE_URL}/folder/${folderName}/${subfolderName}`,
                method: 'GET',
            })
        }),

    })
})

export const {
    useAddFolderMutation,
    useGetAllFoldersQuery,
    useUploadReourcesMutation,
    useRenameFolderMutation,
    useEditFolderAccessMutation,
    useDeleteFolderMutation,
    useGetSingleFolderDataQuery,
    useDeleteResourceMutation,
    useAddSubfolderMutation,
    useGetSubFoldersQuery,
    useRenameSubfolderMutation,
    useDeleteSubfolderMutation,
    useUploadFilesSubfolderMutation,
    useGetSingleSubfolderDataQuery,
    useGetResourceByFolderQuery
} = resourceAdminSlice