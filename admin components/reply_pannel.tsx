import React from 'react';
import { Message } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent } from '@/components/ui/card';
import { Send, MessageSquare } from 'lucide-react';

interface ReplyPanelProps {
  selectedMessageId: string | null;
  selectedMessage: Message | undefined;
  replyText: string;
  setReplyText: (text: string) => void;
  handleReply: () => void;
}

const ReplyPanel: React.FC<ReplyPanelProps> = ({
  selectedMessageId,
  selectedMessage,
  replyText,
  setReplyText,
  handleReply
}) => {
  return (
    <CardContent>
      {selectedMessageId ? (
        <div className="mb-4 p-4 bg-muted/30 rounded-lg border">
          <p className="text-sm font-medium mb-1">Selected Message:</p>
          <p className="text-sm">
            {selectedMessage?.text}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
          <MessageSquare size={32} className="mb-2" />
          <p>Select a message from the left panel</p>
        </div>
      )}
      
      <div className="mt-4">
        <Input
          placeholder="Type your reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          disabled={!selectedMessageId}
          className="mb-3"
        />
        <Button 
          onClick={handleReply} 
          disabled={!selectedMessageId || !replyText.trim()}
          className="w-full"
        >
          <Send size={16} className="mr-2" />
          Send Reply
        </Button>
      </div>
    </CardContent>
  );
};

export default ReplyPanel;
