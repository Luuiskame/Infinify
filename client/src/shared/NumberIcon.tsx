import React, { useState, useEffect } from 'react'
import { useAppSelector } from '@/redux/hooks'

export default function NumberIcon() {
  const [isDesktop, setIsDesktop] = useState(false);
  const unreadMessages = useAppSelector(state => state.chatsReducer.total_unread_messages)
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    // Check on mount
    checkScreenSize();
    
    // Add event listener for resizing
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  if (!unreadMessages || unreadMessages <= 0) return null;

  return (
    <div 
      style={{
        position: 'absolute', 
        bottom: isDesktop ? 'auto' : '3.6rem', 
        top: isDesktop ? '-1.2rem' : 'auto',
        right: isDesktop ? '-0.5rem' : undefined,
        backgroundColor: 'red', 
        color: 'white', 
        borderRadius: '9999px', 
        fontSize: '0.75rem', 
        zIndex: 10, 
        minWidth: '20px',
        textAlign: 'center',
      }}
    >
      {unreadMessages}
    </div>
  )
}