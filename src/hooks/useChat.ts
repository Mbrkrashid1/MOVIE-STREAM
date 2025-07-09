import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Message = Database['public']['Tables']['messages']['Row'];
type ChatRoom = Database['public']['Tables']['chat_rooms']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export function useChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatRoom, setCurrentChatRoom] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch user's chat rooms - remove login requirement
  useEffect(() => {
    const fetchChatRooms = async () => {
      const { data: rooms, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching chat rooms:', error);
        toast({
          title: "Error",
          description: "Failed to load chat rooms",
          variant: "destructive"
        });
      } else {
        setChatRooms(rooms || []);
      }
      setLoading(false);
    };

    fetchChatRooms();
  }, [toast]);

  // Fetch messages for current chat room
  useEffect(() => {
    if (!currentChatRoom) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_room_id', currentChatRoom)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_room_id=eq.${currentChatRoom}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          
          // Show notification for new messages
          if (user && newMessage.sender_id !== user.id) {
            showNotification(newMessage);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentChatRoom, user]);

  const showNotification = (message: Message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Message', {
        body: message.content,
        icon: '/favicon.ico'
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "Notifications enabled",
          description: "You'll receive notifications for new messages"
        });
      }
    }
  };

  const sendMessage = async (content: string, messageType: string = 'text', audioUrl?: string) => {
    if (!currentChatRoom || !content.trim()) return;

    const messageData = {
      chat_room_id: currentChatRoom,
      sender_id: user?.id || 'anonymous',
      content: content.trim(),
      message_type: messageType,
      audio_url: audioUrl
    };

    const { error } = await supabase
      .from('messages')
      .insert(messageData);

    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const uploadAudio = async (audioBlob: Blob): Promise<string | null> => {
    try {
      const fileName = `voice_${Date.now()}.webm`;
      const { data, error } = await supabase.storage
        .from('content')
        .upload(`voice-messages/${fileName}`, audioBlob);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('content')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading audio:', error);
      toast({
        title: "Error",
        description: "Failed to upload voice message",
        variant: "destructive"
      });
      return null;
    }
  };

  const createDirectChat = async (friendId: string) => {
    if (!user) return null;

    // Check if direct chat already exists between these users
    const { data: existingParticipants } = await supabase
      .from('chat_participants')
      .select('chat_room_id')
      .eq('user_id', user.id);

    if (existingParticipants) {
      for (const participant of existingParticipants) {
        const { data: otherParticipant } = await supabase
          .from('chat_participants')
          .select('*')
          .eq('chat_room_id', participant.chat_room_id)
          .eq('user_id', friendId)
          .single();

        if (otherParticipant) {
          return participant.chat_room_id;
        }
      }
    }

    // Create new chat room
    const { data: newRoom, error: roomError } = await supabase
      .from('chat_rooms')
      .insert({
        type: 'direct',
        created_by: user?.id || 'anonymous'
      })
      .select()
      .single();

    if (roomError) {
      console.error('Error creating chat room:', roomError);
      return null;
    }

    // Add participants
    const { error: participantError } = await supabase
      .from('chat_participants')
      .insert([
        { chat_room_id: newRoom.id, user_id: user.id },
        { chat_room_id: newRoom.id, user_id: friendId }
      ]);

    if (participantError) {
      console.error('Error adding participants:', participantError);
      return null;
    }

    return newRoom.id;
  };

  const createMovieDiscussion = async (movieId: string, movieTitle: string) => {
    const { data: newRoom, error: roomError } = await supabase
      .from('chat_rooms')
      .insert({
        type: 'movie_discussion',
        name: `${movieTitle} Discussion`,
        movie_id: movieId,
        created_by: user?.id || 'anonymous'
      })
      .select()
      .single();

    if (roomError) {
      console.error('Error creating movie discussion:', roomError);
      return null;
    }

    // Add creator as participant
    const { error: participantError } = await supabase
      .from('chat_participants')
      .insert({
        chat_room_id: newRoom.id,
        user_id: user.id
      });

    if (participantError) {
      console.error('Error adding participant:', participantError);
      return null;
    }

    return newRoom.id;
  };

  return {
    chatRooms,
    messages,
    currentChatRoom,
    setCurrentChatRoom,
    sendMessage,
    uploadAudio,
    createDirectChat,
    createMovieDiscussion,
    requestNotificationPermission,
    loading
  };
}
