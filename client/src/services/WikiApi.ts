// src/features/wikipedia/wikipediaApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const wikipediaApi = createApi({
  reducerPath: 'wikipediaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://es.wikipedia.org/api/rest_v1/page/',
  }),
  endpoints: (builder) => ({
    getArtistSummary: builder.query({
      query: (artistName: string) => `summary/${encodeURIComponent(artistName)}`,
    }),
  }),
});

export const { useGetArtistSummaryQuery } = wikipediaApi;
