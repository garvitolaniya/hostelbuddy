import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardContent } from '@/components/ui/card';
import { Message } from '@/contexts/ChatContext';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  selectedMessageId, 
  setSelectedMessageId 
}) => {
  return (
    <CardContent>
      <ScrollArea className="h-[500px] pr-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isSelected={selectedMessageId === message.id}
              onClick={() => setSelectedMessageId(message.id)}
            />
          ))
        ) : (
          <div className="text-center p-6 text-muted-foreground">
            No messages in this category
          </div>
        )}
      </ScrollArea>
    </CardContent>
  );
};

export default MessageList;
