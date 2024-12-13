import React from 'react'
import { useAppSelector } from '@/redux/hooks'

export default function NumberIcon() {
    const unreadMessages = useAppSelector(state=> state.chatsReducer.total_unread_messages)
  return (
    <div className='absolute text-red-500 p-4'>{unreadMessages}</div>
  )
}
