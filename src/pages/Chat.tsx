
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { useFriends } from '@/hooks/useFriends';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, UserPlus, Check, X, ArrowLeft, Search, MoreVertical } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { WhatsAppChat } from '@/components/chat/WhatsAppChat';

export default function Chat() {
  const { user, signOut } = useAuth();
  const { chatRooms, currentChatRoom, setCurrentChatRoom } = useChat();
  const { friends, friendRequests, users, searchUsers, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = useFriends();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<{id: string, name: string} | null>(null);
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchUsers(query);
  };

  const handleChatSelect = (chatRoom: any) => {
    setCurrentChatRoom(chatRoom.id);
    setSelectedChat({
      id: chatRoom.id,
      name: chatRoom.name || 'Direct Chat'
    });
  };

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'dd/MM/yy');
    }
  };

  if (selectedChat) {
    return (
      <WhatsAppChat
        chatRoomId={selectedChat.id}
        chatName={selectedChat.name}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-white hover:bg-green-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">HausaBox Chat</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-green-700"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-green-700"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            onClick={signOut}
            className="text-white hover:bg-green-700 text-sm"
          >
            Sign Out
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3 rounded-none bg-gray-100">
              <TabsTrigger value="chats" className="text-green-600 data-[state=active]:bg-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chats
              </TabsTrigger>
              <TabsTrigger value="friends" className="text-green-600 data-[state=active]:bg-white">
                <Users className="h-4 w-4 mr-2" />
                Friends
              </TabsTrigger>
              <TabsTrigger value="add" className="text-green-600 data-[state=active]:bg-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Add
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chats" className="h-full mt-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-1">
                  {chatRooms.map((room) => (
                    <Card
                      key={room.id}
                      className={`cursor-pointer transition-colors border-0 shadow-none hover:bg-gray-50 ${
                        currentChatRoom === room.id ? 'bg-green-50' : ''
                      }`}
                      onClick={() => handleChatSelect(room)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-green-100 text-green-700 text-lg font-semibold">
                              {room.name ? room.name[0] : room.type === 'movie_discussion' ? 'M' : 'C'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium truncate text-gray-900">
                                {room.name || 'Direct Chat'}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatLastMessageTime(room.updated_at)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {room.type === 'movie_discussion' ? 'Movie Discussion' : 'Tap to start chatting'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="friends" className="h-full mt-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {friendRequests.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3 text-gray-800">Friend Requests</h3>
                      <div className="space-y-2">
                        {friendRequests.map((request) => (
                          <Card key={request.id} className="border border-green-200">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-blue-100 text-blue-700">
                                      {request.user_profile?.display_name?.[0] || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <span className="font-medium text-gray-900">
                                      {request.user_profile?.display_name}
                                    </span>
                                    <p className="text-sm text-gray-500">wants to connect</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 h-8 w-8 p-0"
                                    onClick={() => acceptFriendRequest(request.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => rejectFriendRequest(request.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  <h3 className="font-semibold mb-3 text-gray-800">Friends</h3>
                  <div className="space-y-2">
                    {friends.map((friendship) => {
                      const friend = friendship.user_id === user.id 
                        ? friendship.friend_profile 
                        : friendship.user_profile;
                      
                      return (
                        <Card key={friendship.id} className="cursor-pointer hover:bg-gray-50 border-0 shadow-none">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-green-100 text-green-700">
                                  {friend?.display_name?.[0] || 'F'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{friend?.display_name}</h4>
                                <p className="text-sm text-gray-500">@{friend?.username}</p>
                              </div>
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="add" className="h-full mt-0">
              <div className="p-4">
                <div className="mb-4">
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="border-green-200 focus:border-green-500"
                  />
                </div>
                <ScrollArea className="h-[calc(100%-80px)]">
                  <div className="space-y-2">
                    {users.map((user) => (
                      <Card key={user.id} className="border-0 shadow-none hover:bg-gray-50">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-blue-100 text-blue-700">
                                  {user.display_name?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium text-gray-900">{user.display_name}</h4>
                                <p className="text-sm text-gray-500">@{user.username}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => sendFriendRequest(user.id)}
                            >
                              Add Friend
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-green-50 to-white">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageSquare className="h-24 w-24 mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-medium mb-2">Welcome to HausaBox Chat</h3>
              <p>Select a chat to start messaging with WhatsApp-style interface</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
