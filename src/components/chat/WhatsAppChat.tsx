
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  Camera, 
  MoreVertical,
  Phone,
  Video,
  Search,
  ArrowLeft,
  Check,
  CheckCheck,
  Image,
  File
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WhatsAppChatProps {
  chatRoomId: string;
  chatName: string;
  onBack: () => void;
}

export function WhatsAppChat({ chatRoomId, chatName, onBack }: WhatsAppChatProps) {
  const { user } = useAuth();
  const { messages, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    await sendMessage(newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'dd/MM/yyyy HH:mm');
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const emojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉', '🎬', '📱', '⭐', '🌟', '💪', '🙌'];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Professional Header */}
      <div className="bg-card/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-muted/50 rounded-full h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <Avatar className="h-10 w-10 border-2 border-border/50">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-foreground font-semibold">
                {chatName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{chatName}</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-xs text-muted-foreground">
                  {isTyping ? 'typing...' : 'online'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted/50 rounded-full h-10 w-10"
            >
              <Video className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted/50 rounded-full h-10 w-10"
            >
              <Phone className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted/50 rounded-full h-10 w-10"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>View contact</DropdownMenuItem>
                <DropdownMenuItem>Media & files</DropdownMenuItem>
                <DropdownMenuItem>Search</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                <DropdownMenuItem>Clear chat</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Block contact</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Chat Background */}
      <div className="flex-1 relative bg-gradient-to-br from-muted/10 to-muted/5">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4 pb-4 max-w-4xl mx-auto">
            {messages.map((message, index) => {
              const isOwnMessage = message.sender_id === user?.id;
              const showTime = index === 0 || 
                new Date(messages[index - 1].created_at).getTime() - new Date(message.created_at).getTime() > 300000;

              return (
                <div key={message.id}>
                  {showTime && (
                    <div className="text-center my-4">
                      <Badge variant="secondary" className="text-xs">
                        {formatMessageTime(message.created_at)}
                      </Badge>
                    </div>
                  )}
                  
                  <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                    <Card
                      className={`max-w-xs lg:max-w-md shadow-sm border-border/50 ${
                        isOwnMessage
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card text-card-foreground'
                      }`}
                    >
                      <CardContent className="p-3">
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                          {message.content}
                        </p>
                        <div className={`flex items-center justify-end gap-2 mt-2 ${
                          isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          <span className="text-xs">
                            {format(new Date(message.created_at), 'HH:mm')}
                          </span>
                          {isOwnMessage && (
                            <CheckCheck className="h-3 w-3" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Professional Input Area */}
      <div className="bg-card/95 backdrop-blur-sm border-t border-border/50 p-4">
        {showEmojiPicker && (
          <Card className="mb-4 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {emojis.map((emoji, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setNewMessage(prev => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-lg hover:bg-muted/50 rounded-lg h-10 w-10"
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 flex items-end bg-muted/50 backdrop-blur-sm rounded-2xl border border-border/50 focus-within:border-primary/50 transition-colors">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="hover:bg-muted/50 rounded-full h-10 w-10 flex-shrink-0 ml-2"
            >
              <Smile className="h-5 w-5" />
            </Button>
            
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 py-3 px-2 text-sm placeholder:text-muted-foreground"
              rows={1}
            />
            
            <div className="flex items-center mr-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFileUpload}
                className="hover:bg-muted/50 rounded-full h-10 w-10"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted/50 rounded-full h-10 w-10"
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {newMessage.trim() ? (
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12 w-12 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12 w-12 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*,audio/*,application/*"
          onChange={(e) => {
            console.log('File selected:', e.target.files?.[0]);
          }}
        />
      </div>
    </div>
  );
}
