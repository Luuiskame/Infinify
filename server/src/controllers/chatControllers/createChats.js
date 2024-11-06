import { supabase } from "../../db.js";

export const createChats = async (req, res) => {
  let { participantsIds, chatType, chatName } = req.body;

  try {
    // Input validation
    if (!Array.isArray(participantsIds) || participantsIds.length < 2) {
      return res.status(400).json({
        error: 'At least two participants are required',
      });
    }

    if (!['direct', 'group'].includes(chatType)) {
      return res.status(400).json({
        error: 'Invalid chat type. Must be either "direct" or "group"',
      });
    }

    // For direct chats, ensure exactly 2 participants and no chat name
    if (chatType === 'direct') {
      if (participantsIds.length !== 2) {
        return res.status(400).json({
          error: 'Direct chats must have exactly 2 participants',
        });
      }
      chatName = null;
    }

    // For group chats, ensure chat name is provided
    if (chatType === 'group' && !chatName?.trim()) {
      return res.status(400).json({
        error: 'Group chats require a name',
      });
    }

    // Start a transaction
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .insert([
        {
          chat_type: chatType,
          chat_name: chatName,
        },
      ])
      .select()
      .single();

    if (chatError) {
      throw chatError;
    }

    // Prepare participants data
    const participantsData = participantsIds.map((userId, index) => ({
      chat_id: chat.id,
      user_id: userId,
      is_admin: chatType === 'group' && index === 0
    }));

    // Insert participants
    const { error: participantsError } = await supabase
      .from('chat_participants')
      .insert(participantsData);

    if (participantsError) {
      // If adding participants fails, the chat will be automatically deleted due to ON DELETE CASCADE
      throw participantsError;
    }

    // Fetch complete chat data with participants
    const { data: completeChat, error: fetchError } = await supabase
      .from('chats')
      .select(`
        *,
        chat_participants (
          user_id,
          is_admin,
          joined_at
        )
      `)
      .eq('id', chat.id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Send success response
    res.status(201).json({
      data: completeChat,
    });

  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({
      error: 'Failed to create chat',
      details: error.message,
    });
  }
};
