import React from 'react'

import { ChatMessage } from '@/types';

interface props {
  chatId: string;
  lastMessage: ChatMessage
}


export default function LastMessage({chatId, lastMessage}: props) {
  return (
    <p key={chatId}>{lastMessage?.content || 'Come say hi'} </p>
  )
}
