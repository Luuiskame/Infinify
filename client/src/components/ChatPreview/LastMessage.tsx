import React from 'react'

import { ChatMessage } from '@/types';

interface props {
  chatId: string;
  lastMessage: ChatMessage
  notificationsNumber: number
}


export default function LastMessage({chatId, lastMessage, notificationsNumber}: props) {
  return (
    <p className='overflow-hidden' key={chatId}> {notificationsNumber > 0 ? `${notificationsNumber} new messages` : `${lastMessage?.content ? lastMessage.content : 'tap to chat'}`} </p>

  )
}
