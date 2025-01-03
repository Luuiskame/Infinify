// messages/layout.tsx
import React from "react";
import PreviewChat from "@/components/ChatPreview/PreviewChat";

const MessagesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <aside className="w-full lg:w-[33%] p-4 h-screen">
        <PreviewChat />
      </aside>
      <main className="flex-1 p-4 h-screen hidden md:block">{children}</main>
    </div>
  );
};

export default MessagesLayout;
