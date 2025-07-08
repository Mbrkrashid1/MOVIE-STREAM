
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { useFriends } from '@/hooks/useFriends';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Users, 
  UserPlus, 
  Check, 
  X, 
  ArrowLeft, 
  Search, 
  MoreVertical, 
  Camera, 
  Edit3,
  Phone,
  Video,
  Settings
} from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 w-full">
      {/* Professional Header */}
      <div className="bg-card/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-muted/50 rounded-full h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">HausaBox Chat</h1>
                <p className="text-sm text-muted-foreground">Connect with the community</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted/50 rounded-full h-10 w-10"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted/50 rounded-full h-10 w-10"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Professional Tabs */}
        <div className="px-4 pb-2 max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted/50 w-full justify-start max-w-md">
              <TabsTrigger value="chats" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chats
              </TabsTrigger>
              <TabsTrigger value="status" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Status
              </TabsTrigger>
              <TabsTrigger value="calls" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Calls
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-120px)] w-full max-w-7xl mx-auto">
        <div className="w-full bg-card/30 backdrop-blur-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="chats" className="h-full mt-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {/* Search Bar */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search conversations..."
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Chat List */}
                  <div className="space-y-2">
                    {chatRooms.map((room) => (
                      <Card
                        key={room.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md border-border/50 bg-card/50 backdrop-blur-sm ${
                          currentChatRoom === room.id ? 'ring-2 ring-primary/50 bg-primary/5' : 'hover:bg-card/80'
                        }`}
                        onClick={() => handleChatSelect(room)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border-2 border-border/50">
                              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-foreground font-semibold">
                                {room.name ? room.name[0].toUpperCase() : room.type === 'movie_discussion' ? 'M' : 'C'}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-foreground truncate">
                                  {room.name || 'Direct Chat'}
                                </h3>
                                <span className="text-xs text-muted-foreground">
                                  {formatLastMessageTime(room.updated_at)}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground truncate">
                                  {room.type === 'movie_discussion' ? 'Movie Discussion' : 'Start a conversation'}
                                </p>
                                {Math.random() > 0.7 && (
                                  <Badge variant="default" className="text-xs">
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
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="status" className="h-full mt-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <Card className="mb-6 border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <h3 className="font-semibold text-foreground">My Status</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-border/50">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-foreground font-semibold">
                              {user?.email?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5">
                            <Camera className="h-3 w-3 text-primary-foreground" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            Tap to add a status update
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-foreground mb-2">No recent updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Status updates from your contacts will appear here
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="calls" className="h-full mt-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-foreground mb-2">No recent calls</h3>
                    <p className="text-sm text-muted-foreground">
                      Your call history will appear here
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Professional Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Edit3 className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
