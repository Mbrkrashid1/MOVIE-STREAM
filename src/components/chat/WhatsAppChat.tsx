
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
    <div className="flex flex-col h-screen bg-white">
      {/* WhatsApp-style Header */}
      <div className="bg-green-500 text-white p-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-green-600 rounded-full h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-10 w-10 border-2 border-white/20">
            <AvatarFallback className="bg-white/20 text-white font-medium">
              {chatName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white truncate">{chatName}</h3>
            <p className="text-xs text-green-100">
              {isTyping ? 'typing...' : 'last seen recently'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-green-600 rounded-full h-10 w-10"
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-green-600 rounded-full h-10 w-10"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-green-600 rounded-full h-10 w-10"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>View contact</DropdownMenuItem>
              <DropdownMenuItem>Media, links, and docs</DropdownMenuItem>
              <DropdownMenuItem>Search</DropdownMenuItem>
              <DropdownMenuItem>Mute notifications</DropdownMenuItem>
              <DropdownMenuItem>Wallpaper</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Block</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* WhatsApp Chat Background Pattern */}
      <div className="flex-1 relative" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e5ddd5' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: '#e5ddd5'
      }}>
        {/* Messages Container */}
        <ScrollArea className="h-full p-4">
          <div className="space-y-3 pb-4">
            {messages.map((message, index) => {
              const isOwnMessage = message.sender_id === user?.id;
              const showTime = index === 0 || 
                new Date(messages[index - 1].created_at).getTime() - new Date(message.created_at).getTime() > 60000;

              return (
                <div key={message.id}>
                  {showTime && (
                    <div className="text-center my-3">
                      <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-600 shadow-sm">
                        {formatMessageTime(message.created_at)}
                      </span>
                    </div>
                  )}
                  
                  <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg shadow-sm relative ${
                        isOwnMessage
                          ? 'bg-green-500 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      <div className={`flex items-end justify-end gap-1 mt-1 ${
                        isOwnMessage ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs leading-none">
                          {format(new Date(message.created_at), 'HH:mm')}
                        </span>
                        {isOwnMessage && (
                          <CheckCheck className="h-3 w-3 text-blue-200" />
                        )}
                      </div>
                      
                      {/* WhatsApp-style Message Tail */}
                      <div className={`absolute bottom-0 ${
                        isOwnMessage 
                          ? 'right-0 w-0 h-0 border-l-8 border-l-green-500 border-b-8 border-b-transparent'
                          : 'left-0 w-0 h-0 border-r-8 border-r-white border-b-8 border-b-transparent'
                      }`} />
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* WhatsApp-style Input Area */}
      <div className="bg-gray-100 p-3 border-t border-gray-200">
        {showEmojiPicker && (
          <div className="mb-3 p-3 bg-white rounded-lg shadow-lg border">
            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setNewMessage(prev => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="text-2xl hover:bg-gray-100 p-2 rounded-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-end gap-2">
          {/* Input Container */}
          <div className="flex-1 flex items-end bg-white rounded-3xl px-4 py-2 shadow-sm border border-gray-200">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-500 hover:text-gray-700 h-8 w-8 flex-shrink-0"
            >
              <Smile className="h-5 w-5" />
            </Button>
            
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message"
              className="flex-1 bg-transparent border-none outline-none resize-none max-h-20 py-2 px-2 text-sm placeholder-gray-500"
              rows={1}
            />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFileUpload}
              className="text-gray-500 hover:text-gray-700 h-8 w-8 flex-shrink-0"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 h-8 w-8 flex-shrink-0"
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Send/Mic Button */}
          {newMessage.trim() ? (
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="bg-green-500 hover:bg-green-600 text-white rounded-full h-12 w-12 shadow-lg flex-shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              size="icon"
              className="bg-green-500 hover:bg-green-600 text-white rounded-full h-12 w-12 shadow-lg flex-shrink-0"
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
