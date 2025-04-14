import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export const getUsersApi = createApi({
  reducerPath: "getUsersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    credentials: 'include'
  }),
  endpoints: (builder) => ({
    searchUsers: builder.query({
      query: ({ q }) => ({
        url: `search-users?q=${q}`,
        method: "GET",
      }),
    }),
    searchUsersById: builder.query({
      query: ({ userId }) => ({
        url: `search-users/${userId}`,
        method: "GET",
      }),
    }),     
    getRecentUsers: builder.query({
      query: ({ limit, userId = null }) => {
        let url = `get-recent-users?limit=${limit}`;
        if (userId !== null && userId !== undefined) {
          url += `&userId=${userId}`;
        }
        return {
          url,
          method: "GET",
        };
      },
    }),
  })
})

export const { useSearchUsersQuery, useSearchUsersByIdQuery, useGetRecentUsersQuery } = getUsersApi;