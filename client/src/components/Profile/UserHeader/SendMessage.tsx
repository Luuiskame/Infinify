import React from 'react'
import { useCreateOrFindChatMutation } from '@/services/chatsApi'
import { useRouter } from 'next/navigation'
import { setOneChat } from '@/slices/chatSlice'
import { useAppDispatch } from '@/redux/hooks'

interface chatUsersInfo {
    localUser: string
    profileUser: string
}


export default function SendMessage(chatInfo: chatUsersInfo) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [createOrFindChat,{isLoading, isError, data}] = useCreateOrFindChatMutation()

    //! function to look for the avalaible chat before doing the req to our backend
    
    

    const trigger = async ()=> {
        const chatPayload = {
            participantsIds: [chatInfo.localUser, chatInfo.profileUser],
            chatType: "direct"
        }
        const result = await createOrFindChat(chatPayload).unwrap()
        console.log(result)

        const completedProperties = {
            ...result,
            chat_messages: [],
            isFetched: false
        }
        
        if(result?.chatInfo.id){
            dispatch(setOneChat(completedProperties))
            router.push(`/chats/${result.chatInfo.id}`)
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
