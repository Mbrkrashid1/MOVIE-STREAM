
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Friendship = Database['public']['Tables']['friendships']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface FriendWithProfile extends Friendship {
  friend_profile?: Profile;
  user_profile?: Profile;
}

export function useFriends() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [friends, setFriends] = useState<FriendWithProfile[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendWithProfile[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchFriendsAndRequests = async () => {
      // Fetch accepted friendships with profile information
      const { data: acceptedFriends, error: friendsError } = await supabase
        .from('friendships')
        .select('*')
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (friendsError) {
        console.error('Error fetching friends:', friendsError);
      } else {
        // Fetch profile information for friends
        const friendsWithProfiles = await Promise.all(
          (acceptedFriends || []).map(async (friendship) => {
            const friendId = friendship.user_id === user.id ? friendship.friend_id : friendship.user_id;
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', friendId)
              .single();
            
            return {
              ...friendship,
              friend_profile: profile,
            };
          })
        );
        setFriends(friendsWithProfiles);
      }

      // Fetch pending friend requests with sender profile information
      const { data: pendingRequests, error: requestsError } = await supabase
        .from('friendships')
        .select('*')
        .eq('friend_id', user.id)
        .eq('status', 'pending');

      if (requestsError) {
        console.error('Error fetching requests:', requestsError);
      } else {
        // Fetch profile information for request senders
        const requestsWithProfiles = await Promise.all(
          (pendingRequests || []).map(async (request) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', request.user_id)
              .single();
            
            return {
              ...request,
              user_profile: profile,
            };
          })
        );
        setFriendRequests(requestsWithProfiles);
      }

      setLoading(false);
    };

    fetchFriendsAndRequests();
  }, [user]);

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
      .neq('id', user?.id || '')
      .limit(10);

    if (error) {
      console.error('Error searching users:', error);
    } else {
      setUsers(data || []);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('friendships')
      .insert({
        user_id: user.id,
        friend_id: friendId,
        status: 'pending'
      });

    if (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Friend request sent!"
      });
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    if (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Error",
        description: "Failed to accept friend request",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Friend request accepted!"
      });
      // Refresh data
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    }
  };

  const rejectFriendRequest = async (requestId: string) => {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', requestId);

    if (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        title: "Error",
        description: "Failed to reject friend request",
        variant: "destructive"
      });
    } else {
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    }
  };

  return {
    friends,
    friendRequests,
    users,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    loading
  };
}
