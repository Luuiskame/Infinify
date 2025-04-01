"use client"
import { useAppSelector } from '@/redux/hooks';
import LoginBtn from '@/shared/LoginBtn';
import React from 'react'

const Login = () => {

    const user = useAppSelector((state) => state.userReducer.user);


  return (
    <div>
          {!user && <LoginBtn />}
    </div>
  )
}

export default Login