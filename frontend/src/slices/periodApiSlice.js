import { PERIOD_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const periodSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addAccessedFiles: builder.mutation({
            query: (data) => ({
                url: `${PERIOD_URL}/add`,
                method: 'POST',
                body: data
            }),
            keepUnusedDataFor: 5,
        }),
        getAllPeriods: builder.query({
            query: ({ pageNumber }) => ({
                url: `${PERIOD_URL}/all`,
                params: {
                    pageNumber
                }
            }),
            keepUnusedDataFor: 5,
        }),
        addTeacherClassData: builder.mutation({
            query: (data) => ({
                url: `${PERIOD_URL}/classdata`,
                method: 'POST',
                body: data
            })
        }),
        getPeriodsByTeacher:builder.query({
            query: (data) => ({
                url: `${PERIOD_URL}/teacher/${data.teacherId}`,
                method: 'GET'
            })
        }),
        getPeriodsReportAll: builder.query({
            query: () => ({
                url: `${PERIOD_URL}/report`,
                method: 'GET'
            })
        })
    })
})

export const { useAddAccessedFilesMutation, useGetAllPeriodsQuery, useAddTeacherClassDataMutation, useGetPeriodsByTeacherQuery, useGetPeriodsReportAllQuery } = periodSlice