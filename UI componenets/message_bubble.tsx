import React from 'react';
import { Message } from '@/contexts/ChatContext';
import UserAvatar from './UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Mic } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { user } = useAuth();
  const isUserMessage = message.sender === 'user';
  const isAdminMessage = message.sender === 'admin';
  
  const messageClasses = isUserMessage
    ? 'user-message ml-auto animate-slide-up'
    : isAdminMessage
    ? 'bot-message mr-auto border-amber-200 bg-amber-50 dark:bg-amber-900/20 animate-slide-up'
    : 'bot-message mr-auto animate-slide-up';
  
  const containerClasses = isUserMessage
    ? 'flex flex-row-reverse items-end space-x-reverse space-x-2'
    : 'flex items-end space-x-2';

  // Generate avatar info based on message sender
  const getAvatarInfo = () => {
    if (isUserMessage) {
      return {
        name: user?.name || 'User',
        avatar: user?.avatar,
      };
    } else if (isAdminMessage) {
      return {
        name: 'Admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=f59e0b&color=ffffff',
      };
    } else {
      return {
        name: 'Hostel Bot',
        avatar: 'https://ui-avatars.com/api/?name=HB&background=3b82f6&color=ffffff',
      };
    }
  };
  
  const { name, avatar } = getAvatarInfo();
  
  return (
    <div className={`mb-4 ${containerClasses}`}>
      <UserAvatar name={name} avatarUrl={avatar} size="sm" />
      
      <div className="flex flex-col max-w-[80%]">
        <div className={messageClasses}>
          {message.isAudioMessage && (
            <span className="flex items-center text-primary mb-1 text-xs font-medium">
              <Mic size={12} className="mr-1" /> Voice message
            </span>
          )}
          {message.text}
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
