
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Search, 
  ArrowLeft, 
  Camera,
  Edit3,
  Phone,
  Video,
  Settings,
  Users,
  Plus
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { WhatsAppChat } from '@/components/chat/WhatsAppChat';

export default function Chat() {
  const { user } = useAuth();
  const { chatRooms, currentChatRoom, setCurrentChatRoom } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<{id: string, name: string} | null>(null);
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 w-full">
      {/* Facebook Messenger Style Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Chats</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {chatRooms.length} conversations
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full h-10 w-10"
            >
              <Camera className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full h-10 w-10"
            >
              <Edit3 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Messenger"
              className="pl-10 bg-gray-100 dark:bg-gray-700 border-0 rounded-full focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 pb-4">
          <div className="flex gap-3 overflow-x-auto">
            <div className="flex flex-col items-center gap-1 min-w-[60px]">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Groups</span>
            </div>
            <div className="flex flex-col items-center gap-1 min-w-[60px]">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Video className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Rooms</span>
            </div>
            <div className="flex flex-col items-center gap-1 min-w-[60px]">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Calls</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="p-2">
          {chatRooms.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">No conversations yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Start a conversation with someone
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {chatRooms.map((room) => (
                <Card
                  key={room.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md border-0 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    currentChatRoom === room.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => handleChatSelect(room)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                            {room.name ? room.name[0].toUpperCase() : room.type === 'movie_discussion' ? 'M' : 'C'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {room.name || 'Direct Chat'}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatLastMessageTime(room.updated_at)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {room.type === 'movie_discussion' ? 'Movie Discussion' : 'Start a conversation'}
                          </p>
                          {Math.random() > 0.7 && (
                            <Badge variant="default" className="bg-blue-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                              {Math.floor(Math.random() * 9) + 1}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-6 z-50">
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full h-14 w-14 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
