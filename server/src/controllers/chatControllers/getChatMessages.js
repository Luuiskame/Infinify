import { supabase } from "../../db.js";

// Helper function to format individual messages
const formatMessage = (message) => ({
  id: message.id,
  chat_id: message.chat_id,
  sender_id: message.sender_id,
  profile_photo: message.sender?.profile_photo,
  display_name: message.sender?.display_name,
  content: message.content,
  created_at: message.created_at,
  updated_at: message.updated_at,
  is_edited: message.is_edited,
  read: message.read,
});

export const getChatMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Validate input
    if (!chatId) {
      return res.status(400).json({
        error: 'Chat ID is required',
      });
    }

    // Fetch chat messages with sender information
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select(`
        id,
        chat_id,
        sender_id,
        content,
        is_edited,
        read,
        created_at,
        updated_at,
        sender:user(
          id,
          email,
          profile_photo,
          display_name
        )
      `)
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      throw messagesError;
    }

    if (!messages?.length) {
      return res.status(404).json({
        error: 'No messages found for this chat',
      });
    }

    // Format each message
    const formattedMessages = messages.map(formatMessage);

    // Send success response
    res.status(200).json({
      messages: formattedMessages
    });

  } catch (error) {
    console.error('Error fetching chat messages:', error.message);
    res.status(500).json({
      error: 'Failed to fetch chat messages',
      details: error.message,
    });
  }
};
