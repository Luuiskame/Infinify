"use client"; // Ensure this is a client-side component

import { usePathname } from "next/navigation"; // Import usePathname from next/navigation
import Header from "./Header";

export default function HeaderWrapper() {
  const pathname = usePathname(); // Get the current pathname

  // Only render the header if the route is NOT "/chats/[chatId]"
  if (pathname && pathname.startsWith("/chats/")) {
    return null; // Do not render the header for the chat route
  }

  return <Header />; // Render the header for all other routes
}
