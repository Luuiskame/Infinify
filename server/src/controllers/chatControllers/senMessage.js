import { supabase } from "../../db.js";

/**
 * Send a message in a chat
 * @param {Object} messageData - The message data
 * @param {string} messageData.chatId - UUID of the chat
 * @param {string} messageData.senderId - UUID of the message sender
 * @param {string} messageData.content - The message content data to cache
 * @returns {Promise<Object>} The created message with additional info
 */

export const sendMessage = async (messageData) => {
  const { chatId, senderId, content } = messageData;

  try {
    // Insert the message and get related user data
    const { data: message, error: messageError } = await supabase
      .from("chat_messages")
      .insert([
        {
          chat_id: chatId,
          sender_id: senderId,
          content: content,
        },
      ])
      .select(
        `
          id,
          chat_id,
          sender_id,
          content,
          created_at,
          updated_at,
          is_edited,
          read,
          sender:user(
            id,
            email,
            profile_photo,
            display_name
          )
        `
      )
      .single();

    if (messageError) throw messageError;

    // Update chat's last_message_at
    const { error: updateError } = await supabase
      .from("chats")
      .update({
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", chatId);

    if (updateError) throw updateError;

    // Update sender's last_read_at
    const { error: participantError } = await supabase
      .from("chat_participants")
      .update({ last_read_at: new Date().toISOString() })
      .eq("chat_id", chatId)
      .eq("user_id", senderId);

    if (participantError) throw participantError;

    // Get other participants
    const { data: participants, error: participantsError } = await supabase
      .from("chat_participants")
      .select("user_id")
      .eq("chat_id", chatId)
      .neq("user_id", senderId);

    if (participantsError) throw participantsError;

    // Map to the required ChatMessage format
    const formattedMessage = {
      id: message.id,
      chat_id: message.chat_id,
      sender_id: message.sender_id,
      profile_photo: message.sender.profile_photo,
      display_name: message.sender.display_name,
      content: message.content,
      created_at: message.created_at,
      updated_at: message.updated_at,
      is_edited: message.is_edited,
      read: message.read,
    };

    return {
      message: formattedMessage,
      recipients: participants.map((p) => p.user_id),
      chat: {
        id: chatId,
        last_message_at: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw new Error("Failed to send message: " + error.message);
  }
};


/**
 * Helper function to validate that a user is a participant in a chat
 * @param {string} chatId - The chat ID
 * @param {string} userId - The user ID to check
 * @returns {Promise<boolean>} Whether the user is a participant
 */
export const validateChatParticipant = async (chatId, userId) => {
  const { data, error } = await supabase
    .from("chat_participants")
    .select("user_id")
    .eq("chat_id", chatId)
    .eq("user_id", userId)
    .single();

  console.log("message sender exist");

  if (error) {
    console.error("Error validating chat participant:", error);
    return false;
  }

  return !!data;
};
