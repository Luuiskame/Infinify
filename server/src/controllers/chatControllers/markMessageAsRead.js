import { supabase } from "../../db.js";

export const markMessagesAsRead = async ({ chatId, userId }) => {
  try {
    // Fetch unread messages for the specified chat, excluding the user's own messages
    const { data: unreadMessages, error: fetchError } = await supabase
      .from("chat_messages")
      .select("id, chat_id, sender_id, content, created_at, updated_at, read")
      .eq("chat_id", chatId)
      .eq("read", false)
      .neq("sender_id", userId); // Exclude user's own messages

    if (fetchError) {
      return {
        error: "Error fetching unread messages",
        errorDetails: fetchError,
      };
    }

    if (!unreadMessages || unreadMessages.length === 0) {
      return { message: "No unread messages from other users found for this chat." };
    }

    // Update messages to mark them as read
    const { error: updateError } = await supabase
      .from("chat_messages")
      .update({ read: true })
      .in(
        "id",
        unreadMessages.map((msg) => msg.id) // Update only the fetched messages
      );

    if (updateError) {
      return {
        error: "Error updating messages to read",
        errorDetails: updateError,
      };
    }

    return {
      message: `${unreadMessages.length} messages from other users marked as read.`,
      updatedMessages: unreadMessages.map((msg) => ({
        ...msg,
        read: true,
      })),
      viewerId: userId
    };
  } catch (error) {
    console.error("Error in markMessagesAsRead:", error);
    return {
      error: "Unexpected error occurred while marking messages as read",
      errorDetails: error.message,
    };
  }
};
