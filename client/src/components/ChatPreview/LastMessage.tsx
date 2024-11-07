import React from 'react'

interface props {
  chatId: string;
}

export default function LastMessage({chatId}: props) {
  return (
    <p key={chatId}>LastMessage</p>
  )
}
