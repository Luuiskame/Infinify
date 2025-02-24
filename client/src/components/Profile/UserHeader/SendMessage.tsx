import React from 'react'
import { useCreateOrFindChatMutation } from '@/services/chatsApi'
import { useRouter } from 'next/navigation'

interface chatUsersInfo {
    localUser: string
    profileUser: string
}


export default function SendMessage(chatInfo: chatUsersInfo) {
    const router = useRouter()
    const [createOrFindChat,{isLoading, isError, data}] = useCreateOrFindChatMutation()

    const trigger = async ()=> {
        const chatPayload = {
            participantsIds: [chatInfo.localUser, chatInfo.profileUser],
            chatType: "direct"
        }
        const result = await createOrFindChat(chatPayload).unwrap()
        
        if(result.data.id){
            router.push(`chats/${result.data.id}`)
        }

    }
  return (
    <button
            onClick={trigger}
            type="button"
            className="bg-spotify-green text-white px-4 py-1 rounded-lg hover:bg-spotify-green/40 text-center font-sans font-bold text-lg"
          >
            {isLoading ? 'loading': 'Send Message'}
          </button>
  )
}
