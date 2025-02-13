"use client"
import Chat from '@/components/Chat/Chat'
import { useAppSelector } from '@/redux/hooks'
import React from 'react'

type Params = {
    idChat: string
}

const Page = ({ params }: { params: Params }) => {

   const { idChat } = params
  const data = useAppSelector((state) => state.userReducer.user)

  const user  = data?.user

   console.log(idChat)

  return (
    <div className="w-full h-full flex items-center justify-center">
       {user && <Chat/>}

      </div>
  )
}

export default Page