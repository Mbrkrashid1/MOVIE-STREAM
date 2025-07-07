
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
  const [loading, setLoading] = useState(true);

  // Fetch user's chat rooms
  useEffect(() => {
    if (!user) return;

    const fetchChatRooms = async () => {
      const { data: participantRooms, error } = await supabase
        .from('chat_participants')
        .select('chat_room_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching chat participants:', error);
        setLoading(false);
        return;
      }

      if (!participantRooms || participantRooms.length === 0) {
        setChatRooms([]);
        setLoading(false);
        return;
      }

      const roomIds = participantRooms.map(p => p.chat_room_id);
      const { data: rooms, error: roomsError } = await supabase
        .from('chat_rooms')
        .select('*')
        .in('id', roomIds);

      if (roomsError) {
        console.error('Error fetching chat rooms:', roomsError);
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
  }, [user, toast]);

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
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentChatRoom]);

  const sendMessage = async (content: string, messageType: string = 'text', movieReferenceId?: string) => {
    if (!user || !currentChatRoom || !content.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        chat_room_id: currentChatRoom,
        sender_id: user.id,
        content: content.trim(),
        message_type: messageType,
        movie_reference_id: movieReferenceId
      });

    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
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
        created_by: user.id
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
    if (!user) return null;

    const { data: newRoom, error: roomError } = await supabase
      .from('chat_rooms')
      .insert({
        type: 'movie_discussion',
        name: `${movieTitle} Discussion`,
        movie_id: movieId,
        created_by: user.id
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
    createDirectChat,
    createMovieDiscussion,
    loading
  };
}
