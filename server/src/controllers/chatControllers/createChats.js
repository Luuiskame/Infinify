import { supabase } from "../../db.js";

export const createChats = async (participantsIds, chatType, chatName) => {
  try {
    // Input validation
    if (!Array.isArray(participantsIds) || participantsIds.length !== 2) {
      return {
        status: 400,
        json: { error: "Direct chats must have exactly 2 participants" },
      };
    }

    if (chatType !== "direct") {
      return {
        status: 400,
        json: { error: "This function only supports direct chats" },
      };
    }

    // Check if a direct chat already exists between these two users
    const { data: existingChats, error: existingChatsError } = await supabase
      .from("chat_participants")
      .select("chat_id")
      .eq("user_id", participantsIds[0]);

    if (existingChatsError) throw existingChatsError;

    const chatIds = existingChats.map((chat) => chat.chat_id);

    const { data: commonChats, error: commonChatsError } = await supabase
      .from("chat_participants")
      .select("chat_id")
      .eq("user_id", participantsIds[1])
      .in("chat_id", chatIds);

    if (commonChatsError) throw commonChatsError;

    // If common chats exist, verify they are direct chats
    if (commonChats.length > 0) {
      const { data: directChat, error: directChatError } = await supabase
        .from("chats")
        .select("id")
        .eq("chat_type", "direct")
        .in(
          "id",
          commonChats.map((chat) => chat.chat_id)
        )
        .single();

      if (directChatError && directChatError.code !== "PGRST116") {
        throw directChatError;
      }

      if (directChat) {
        // If chat exists, fetch and return it
        return {
          status: 200,
          json: await fetchChatById(directChat.id),
        };
      }
    }

    // If chat doesn't exist, create a new one
    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .insert([{ chat_type: "direct", chat_name: null }])
      .select()
      .single();

    if (chatError) throw chatError;

    // Insert participants
    const participantsData = participantsIds.map((userId) => ({
      chat_id: chat.id,
      user_id: userId,
      is_admin: false,
    }));

    const { error: participantsError } = await supabase
      .from("chat_participants")
      .insert(participantsData);

    if (participantsError) throw participantsError;

    // Fetch and return the chat details
    return {
      status: 201,
      json: await fetchChatById(chat.id),
    };
  } catch (error) {
    console.error("Error finding or creating chat:", error);
    return {
      status: 500,
      json: {
        error: "Failed to find or create chat",
        details: error.message,
      },
    };
  }
};

// Helper function to fetch chat details
const fetchChatById = async (chatId) => {
  const { data: participants, error: fetchError } = await supabase
    .from("chat_participants")
    .select(
      `
      chat_id,
      user_id,
      is_admin,
      joined_at,
      user: user_id (display_name, profile_photo)
    `
    )
    .eq("chat_id", chatId);

  if (fetchError) throw fetchError;

  return {
    chatInfo: {
      id: chatId,
      chat_type: "direct",
      chat_name: null,
      last_message_at: null,
      unread_messages: 0,
    },
    chat_participants: participants.map((participant) => ({
      chat_id: participant.chat_id,
      user_id: participant.user_id,
      is_admin: participant.is_admin,
      joined_at: participant.joined_at,
      display_name: participant.user.display_name,
      profile_photo: participant.user.profile_photo,
    })),
    isFetched: true,
    chat_messages: []
  };
};
