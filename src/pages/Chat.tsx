
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
import { MessageSquare, Users, UserPlus, Check, X, ArrowLeft, Search, MoreVertical, Camera, Edit } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 w-full">
      {/* WhatsApp-style Header */}
      <div className="bg-green-500 text-white shadow-lg w-full">
        <div className="flex items-center justify-between p-4 w-full">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-white hover:bg-green-600 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-medium">HausaBox</h1>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-green-600 rounded-full"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-green-600 rounded-full"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* WhatsApp-style Tabs */}
        <div className="px-4 pb-2 w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent w-full justify-start gap-8 border-none">
              <TabsTrigger 
                value="chats" 
                className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-0 font-medium"
              >
                CHATS
              </TabsTrigger>
              <TabsTrigger 
                value="status" 
                className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-0 font-medium"
              >
                STATUS
              </TabsTrigger>
              <TabsTrigger 
                value="calls" 
                className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-0 font-medium"
              >
                CALLS
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)] w-full">
        {/* WhatsApp-style Chat List */}
        <div className="w-full bg-white">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="chats" className="h-full mt-0">
              <ScrollArea className="h-full w-full">
                <div className="space-y-0 w-full">
                  {chatRooms.map((room) => (
                    <div
                      key={room.id}
                      className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors w-full ${
                        currentChatRoom === room.id ? 'bg-gray-50' : ''
                      }`}
                      onClick={() => handleChatSelect(room)}
                    >
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarFallback className="bg-gray-300 text-gray-700 text-lg font-medium">
                          {room.name ? room.name[0].toUpperCase() : room.type === 'movie_discussion' ? 'M' : 'C'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {room.name || 'Direct Chat'}
                          </h3>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatLastMessageTime(room.updated_at)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate">
                            {room.type === 'movie_discussion' ? 'Movie Discussion' : 'Tap to start chatting'}
                          </p>
                          {Math.random() > 0.7 && (
                            <div className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 ml-2">
                              {Math.floor(Math.random() * 9) + 1}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="status" className="h-full mt-0">
              <ScrollArea className="h-full w-full">
                <div className="p-4 w-full">
                  {/* My Status */}
                  <div className="flex items-center gap-3 p-2 mb-4 w-full">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gray-300 text-gray-700">
                          {user?.email?.[0]?.toUpperCase() || 'M'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <Camera className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">My status</h3>
                      <p className="text-sm text-gray-500">Tap to add status update</p>
                    </div>
                  </div>
                  
                  <div className="mb-4 w-full">
                    <h4 className="text-sm text-gray-500 font-medium mb-2">Recent updates</h4>
                    <div className="text-center py-8">
                      <p className="text-gray-500">No recent updates to show right now.</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="calls" className="h-full mt-0">
              <ScrollArea className="h-full w-full">
                <div className="p-4 w-full">
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent calls to show right now.</p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* WhatsApp-style Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full h-14 w-14 shadow-lg"
        >
          <Edit className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
