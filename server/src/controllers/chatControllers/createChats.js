import { supabase } from "../../db.js";

export const createChats = async (req, res) => {
  let { participantsIds, chatType, chatName } = req.body;

  try {
    // Input validation
    if (!Array.isArray(participantsIds) || participantsIds.length < 2) {
      return res.status(400).json({ error: 'At least two participants are required' });
    }

    if (!['direct', 'group'].includes(chatType)) {
      return res.status(400).json({ error: 'Invalid chat type. Must be either "direct" or "group"' });
    }

    if (chatType === 'direct') {
      if (participantsIds.length !== 2) {
        return res.status(400).json({ error: 'Direct chats must have exactly 2 participants' });
      }
      chatName = null;
    }

    if (chatType === 'group' && !chatName?.trim()) {
      return res.status(400).json({ error: 'Group chats require a name' });
    }

    // Check if all participants exist
    const { data: users, error: usersError } = await supabase
      .from('user')
      .select('id')
      .in('id', participantsIds);

    if (usersError) throw usersError;

    if (users.length !== participantsIds.length) {
      return res.status(400).json({ error: 'One or more participants do not exist in the system' });
    }

    // Create chat
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .insert([{ chat_type: chatType, chat_name: chatName }])
      .select()
      .single();

    if (chatError) throw chatError;

    // Insert participants
    const participantsData = participantsIds.map((userId, index) => ({
      chat_id: chat.id,
      user_id: userId,
      is_admin: chatType === 'group' && index === 0
    }));

    const { error: participantsError } = await supabase
      .from('chat_participants')
      .insert(participantsData);

    if (participantsError) throw participantsError;

    // Fetch chat data including participant details
    const { data: participants, error: fetchError } = await supabase
      .from('chat_participants')
      .select(`
        chat_id,
        user_id,
        is_admin,
        joined_at,
        user: user_id (display_name, profile_photo)
      `)
      .eq('chat_id', chat.id);

    if (fetchError) throw fetchError;

    // Reshape the response to match ChatParticipant interface
    const formattedParticipants = participants.map(participant => ({
      chat_id: participant.chat_id,
      user_id: participant.user_id,
      is_admin: participant.is_admin,
      joined_at: participant.joined_at,
      display_name: participant.user.display_name,
      profile_photo: participant.user.profile_photo
    }));

    // Send response in the required format
    res.status(201).json({
      chatInfo: {
        id: chat.id,
      chat_type: chat.chat_type,
      chat_name: chat.chat_name,
      },
      chat_participants: formattedParticipants
    });

  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({
      error: 'Failed to create chat',
      details: error.message,
    });
  }
};
