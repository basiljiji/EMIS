import { FIXTURE_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const fixtureSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFixtures: builder.query({
            query: () => ({
                url: `${FIXTURE_URL}/`
            }),
            providesTags: ['Fixtures'],
            keepUnusedDataFor: 5,
        }),
        addFixture: builder.mutation({
            query: (data) => ({
                url: `${FIXTURE_URL}/add`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Fixtures']
        }),
        getFixtureDetails: builder.query({
            query: (fixtureId) => ({
                url: `${FIXTURE_URL}/${fixtureId}`
            }),
            providesTags: ['Fixtures'],
            keepUnusedDataFor: 5,
        }),
        editFixture: builder.mutation({
            query: (data) => ({
                url: `${FIXTURE_URL}/edit/${data.fixtureId}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Fixtures']
        }),
        deleteFixture: builder.mutation({
            query: (fixtureId) => ({
                url: `${FIXTURE_URL}/delete/${fixtureId}`,
                method: 'PATCH'
            }),
            invalidatesTags: ['Fixtures']
        })
    }),
})

export const { useGetFixturesQuery, useAddFixtureMutation, useGetFixtureDetailsQuery, useEditFixtureMutation, useDeleteFixtureMutation } = fixtureSlice