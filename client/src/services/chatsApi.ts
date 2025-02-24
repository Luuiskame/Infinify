interface chats {
	id: number;
	avatar: string;
	name: string;
	message: string;
	time: string;
}

import { ChatMessage } from "@/types";

interface ChatMessagesResponse {
  messages: ChatMessage[]
}

interface ChatParticipant {
  user_id: string;
  is_admin: boolean;
  joined_at: string;
}

interface ChatData {
  id: string;
  created_at: string;
  chat_type: "direct" | "group";
  updated_at: string | null;
  chat_name: string | null;
  last_message_at: string | null;
  chat_participants: ChatParticipant[];
}

interface ChatResponse {
  data: ChatData;
}


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const chatsApi = createApi({
  reducerPath: "chatsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
  }),
  endpoints: (builder) => ({
    getPreviewChats: builder.query<chats[], {page:number, appToken:string|undefined}>({
      // api para solicitar datos de chats, contiene el parametro page, el cual indica el numero de pagina que se va a consultar
      query: ({page, appToken})=> ({
        url: `previewChats?page=${page}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${appToken}`,
        },
      }),
    }),
    getAllChatMessages: builder.mutation<ChatMessagesResponse, string>({
      query: (chatId)=> ({
        url: `chats/messages/${chatId}`,
        method: "GET",
      })
    }),
    createOrFindChat: builder.mutation<ChatResponse, {participantsIds: string[], chatType: string}>({
      query: (chatInfo)=> ({
        url: `/chats`,
        method: "POST",
        body: chatInfo
      })
    })

  }),
});

export const {
  useGetPreviewChatsQuery,useGetAllChatMessagesMutation,useCreateOrFindChatMutation
} = chatsApi;
