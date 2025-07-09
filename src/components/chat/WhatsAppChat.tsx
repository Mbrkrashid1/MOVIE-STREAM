
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
  Camera, 
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  CheckCheck,
  Image,
  ThumbsUp,
  Heart,
  Play,
  Pause
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VoiceMessageRecorder } from '@/components/chat/VoiceMessageRecorder';

interface WhatsAppChatProps {
  chatRoomId: string;
  chatName: string;
  onBack: () => void;
}

export function WhatsAppChat({ chatRoomId, chatName, onBack }: WhatsAppChatProps) {
  const { user } = useAuth();
  const { messages, sendMessage, uploadAudio } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
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

  const handleSendVoiceMessage = async (audioBlob: Blob) => {
    const audioUrl = await uploadAudio(audioBlob);
    if (audioUrl) {
      await sendMessage('Voice message', 'voice', audioUrl);
    }
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

  const toggleAudioPlayback = (messageId: string, audioUrl: string) => {
    if (playingAudio === messageId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(messageId);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => setPlayingAudio(null);
    }
  };

  const emojis = ['😀', '😂', '😍', '🤔', '👍', '❤️', '🔥', '💯', '🎉', '🎬'];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {chatName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{chatName}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {isTyping ? 'typing...' : 'Active now'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full h-10 w-10 text-blue-600"
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full h-10 w-10 text-blue-600"
            >
              <Video className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full h-10 w-10"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>View profile</DropdownMenuItem>
                <DropdownMenuItem>Media & files</DropdownMenuItem>
                <DropdownMenuItem>Search in conversation</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                <DropdownMenuItem>Something's wrong</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Block</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 relative">
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
                      <Badge variant="secondary" className="text-xs bg-gray-200 dark:bg-gray-700">
                        {formatMessageTime(message.created_at)}
                      </Badge>
                    </div>
                  )}
                  
                  <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
                    <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-2xl px-4 py-2 shadow-sm ${
                          isOwnMessage
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {message.message_type === 'voice' && message.audio_url ? (
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => toggleAudioPlayback(message.id, message.audio_url!)}
                              size="sm"
                              variant="ghost"
                              className="p-1"
                            >
                              {playingAudio === message.id ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full w-1/3"></div>
                            </div>
                            <span className="text-xs">0:15</span>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                            {message.content}
                          </p>
                        )}
                        <div className={`flex items-center justify-end gap-1 mt-1 ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          <span className="text-xs">
                            {format(new Date(message.created_at), 'HH:mm')}
                          </span>
                          {isOwnMessage && (
                            <CheckCheck className="h-3 w-3 text-blue-200" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {!isOwnMessage && (
                      <Avatar className="h-6 w-6 ml-2 order-2">
                        <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white text-xs">
                          {chatName[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-wrap gap-2 max-w-4xl mx-auto">
            {emojis.map((emoji, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNewMessage(prev => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg h-10 w-10"
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFileUpload}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full h-10 w-10 text-blue-600"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full h-10 w-10 text-blue-600"
            >
              <Camera className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full h-10 w-10 text-blue-600"
            >
              <Image className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 flex items-end bg-gray-100 dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 focus-within:border-blue-500 transition-colors">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full h-10 w-10 flex-shrink-0 ml-2"
            >
              <Smile className="h-5 w-5" />
            </Button>
            
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Aa"
              className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-sm placeholder:text-gray-500 focus:ring-0 focus:border-0"
            />
            
            <VoiceMessageRecorder
              onSendVoiceMessage={handleSendVoiceMessage}
              disabled={false}
            />
          </div>
          
          {newMessage.trim() ? (
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              size="icon"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Heart className="h-5 w-5" />
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
