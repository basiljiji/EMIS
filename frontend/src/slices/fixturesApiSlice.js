import { FIXTURE_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const fixtureSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFixtures: builder.query({
            query: () => ({
                url: `${FIXTURE_URL}/`
            }),
            keepUnusedDataFor: 5,
        })
    })
})

export const { useGetFixturesQuery } = fixtureSlice