
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  CheckCheck
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

  const emojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉'];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-green-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-green-100 text-green-700">
              {chatName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{chatName}</h3>
            <p className="text-xs text-green-100">
              {isTyping ? 'typing...' : 'online'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-green-700"
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-green-700"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-green-700"
          >
            <Search className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-green-700"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>View contact</DropdownMenuItem>
              <DropdownMenuItem>Media, links, and docs</DropdownMenuItem>
              <DropdownMenuItem>Search</DropdownMenuItem>
              <DropdownMenuItem>Mute notifications</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Block</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-green-50 to-white">
        <div className="space-y-4">
          {messages.map((message, index) => {
            const isOwnMessage = message.sender_id === user?.id;
            const showTime = index === 0 || 
              new Date(messages[index - 1].created_at).getTime() - new Date(message.created_at).getTime() > 60000;

            return (
              <div key={message.id}>
                {showTime && (
                  <div className="text-center my-4">
                    <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
                      {formatMessageTime(message.created_at)}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-md relative ${
                      isOwnMessage
                        ? 'bg-green-500 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${
                      isOwnMessage ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">
                        {format(new Date(message.created_at), 'HH:mm')}
                      </span>
                      {isOwnMessage && (
                        <div className="flex">
                          <CheckCheck className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    
                    {/* Message tail */}
                    <div className={`absolute bottom-0 w-0 h-0 ${
                      isOwnMessage 
                        ? 'right-0 border-l-8 border-l-green-500 border-b-8 border-b-transparent'
                        : 'left-0 border-r-8 border-r-white border-b-8 border-b-transparent'
                    }`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        {showEmojiPicker && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setNewMessage(prev => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="text-2xl hover:bg-gray-200 p-2 rounded-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-end gap-2">
          <div className="flex-1 flex items-end bg-gray-100 rounded-3xl px-4 py-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-500 hover:text-gray-700 h-8 w-8"
            >
              <Smile className="h-5 w-5" />
            </Button>
            
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none outline-none resize-none max-h-20 py-2 px-2 text-sm"
              rows={1}
              style={{ minHeight: '20px' }}
            />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFileUpload}
              className="text-gray-500 hover:text-gray-700 h-8 w-8"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 h-8 w-8"
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>
          
          {newMessage.trim() ? (
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="bg-green-500 hover:bg-green-600 text-white rounded-full h-12 w-12 shadow-lg"
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              size="icon"
              className="bg-green-500 hover:bg-green-600 text-white rounded-full h-12 w-12 shadow-lg"
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*,audio/*"
          onChange={(e) => {
            // Handle file upload logic here
            console.log('File selected:', e.target.files?.[0]);
          }}
        />
      </div>
    </div>
  );
}
