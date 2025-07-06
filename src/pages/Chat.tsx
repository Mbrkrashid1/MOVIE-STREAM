
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { useFriends } from '@/hooks/useFriends';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, UserPlus, Check, X, Send, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
  const { user, signOut } = useAuth();
  const { chatRooms, messages, currentChatRoom, setCurrentChatRoom, sendMessage } = useChat();
  const { friends, friendRequests, users, searchUsers, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = useFriends();
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(newMessage);
    setNewMessage('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchUsers(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center justify-between">
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
        <Button
          variant="ghost"
          onClick={signOut}
          className="text-white hover:bg-green-700"
        >
          Sign Out
        </Button>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3 rounded-none">
              <TabsTrigger value="chats">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chats
              </TabsTrigger>
              <TabsTrigger value="friends">
                <Users className="h-4 w-4 mr-2" />
                Friends
              </TabsTrigger>
              <TabsTrigger value="add">
                <UserPlus className="h-4 w-4 mr-2" />
                Add
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chats" className="h-full mt-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  {chatRooms.map((room) => (
                    <Card
                      key={room.id}
                      className={`cursor-pointer transition-colors ${
                        currentChatRoom === room.id ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentChatRoom(room.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-green-100 text-green-700">
                              {room.name ? room.name[0] : room.type === 'movie_discussion' ? 'M' : 'C'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">
                              {room.name || 'Direct Chat'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {room.type === 'movie_discussion' ? 'Movie Discussion' : 'Direct Chat'}
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
                      <h3 className="font-semibold mb-3">Friend Requests</h3>
                      <div className="space-y-2">
                        {friendRequests.map((request) => (
                          <Card key={request.id}>
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-blue-100 text-blue-700">
                                      {request.user_profile?.display_name?.[0] || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">
                                    {request.user_profile?.display_name}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => acceptFriendRequest(request.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
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

                  <h3 className="font-semibold mb-3">Friends</h3>
                  <div className="space-y-2">
                    {friends.map((friendship) => {
                      const friend = friendship.user_id === user.id 
                        ? friendship.friend_profile 
                        : friendship.user_profile;
                      
                      return (
                        <Card key={friendship.id} className="cursor-pointer hover:bg-gray-50">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-green-100 text-green-700">
                                  {friend?.display_name?.[0] || 'F'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{friend?.display_name}</h4>
                                <p className="text-sm text-gray-500">@{friend?.username}</p>
                              </div>
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
                  />
                </div>
                <ScrollArea className="h-[calc(100%-80px)]">
                  <div className="space-y-2">
                    {users.map((user) => (
                      <Card key={user.id}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-blue-100 text-blue-700">
                                  {user.display_name?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{user.display_name}</h4>
                                <p className="text-sm text-gray-500">@{user.username}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
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

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentChatRoom ? (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id === user.id
                            ? 'bg-green-500 text-white'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_id === user.id ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {format(new Date(message.created_at), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
