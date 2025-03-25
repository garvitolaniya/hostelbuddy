import React, { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserCog, MessageSquare, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import our new components
import IssueCategoryDropdown, { issueCategories } from './admin/IssueCategoryDropdown';
import MessageList from './admin/MessageList';
import ReplyPanel from './admin/ReplyPanel';
import StatsPanel from './admin/StatsPanel';

const AdminPanel: React.FC = () => {
  const { messages, adminReply } = useChat();
  const { user } = useAuth();
  const [replyText, setReplyText] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter messages based on selected category and user messages
  const filterMessages = () => {
    const userMessages = messages.filter(message => message.sender === 'user');
    
    if (selectedCategory === 'all') {
      return userMessages;
    }
    
    // Filter messages containing keywords related to the selected category
    return userMessages.filter(message => {
      const lowerText = message.text.toLowerCase();
      switch(selectedCategory) {
        case 'wifi':
          return lowerText.includes('wifi') || lowerText.includes('internet') || lowerText.includes('connection');
        case 'water':
          return lowerText.includes('water') || lowerText.includes('tap') || lowerText.includes('shower') || lowerText.includes('bathroom');
        case 'electricity':
          return lowerText.includes('electricity') || lowerText.includes('power') || lowerText.includes('light') || lowerText.includes('fan');
        case 'lift':
          return lowerText.includes('lift') || lowerText.includes('elevator');
        case 'maintenance':
          return lowerText.includes('maintenance') || lowerText.includes('repair') || lowerText.includes('broken') || lowerText.includes('fix');
        default:
          return true;
      }
    });
  };

  const filteredMessages = filterMessages();

  const handleReply = () => {
    if (!selectedMessageId || !replyText.trim()) {
      toast.error('Please select a message and write a reply');
      return;
    }

    adminReply(selectedMessageId, replyText);
    setReplyText('');
    setSelectedMessageId(null);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <UserCog size={48} className="text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
        <p className="text-muted-foreground">You need admin privileges to view this section.</p>
      </div>
    );
  }

  const selectedMessage = messages.find(m => m.id === selectedMessageId);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span>User Messages</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Statistics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="animate-fade-in">
          <div className="grid md:grid-cols-2 gap-6">
            {/* User Messages Column */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>User Messages</CardTitle>
                  <IssueCategoryDropdown 
                    selectedCategory={selectedCategory} 
                    setSelectedCategory={setSelectedCategory} 
                  />
                </div>
                <CardDescription>
                  {selectedCategory === 'all' 
                    ? 'Recent messages from users that may need attention' 
                    : `Filtered by ${issueCategories.find(cat => cat.id === selectedCategory)?.label}`}
                </CardDescription>
              </CardHeader>
              <MessageList 
                messages={filteredMessages} 
                selectedMessageId={selectedMessageId} 
                setSelectedMessageId={setSelectedMessageId} 
              />
            </Card>

            {/* Reply Column */}
            <Card>
              <CardHeader>
                <CardTitle>Send Reply</CardTitle>
                <CardDescription>
                  {selectedMessageId 
                    ? 'Respond to the selected message' 
                    : 'Select a message to respond to'}
                </CardDescription>
              </CardHeader>
              <ReplyPanel 
                selectedMessageId={selectedMessageId}
                selectedMessage={selectedMessage}
                replyText={replyText}
                setReplyText={setReplyText}
                handleReply={handleReply}
              />
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="animate-fade-in">
          <StatsPanel messages={messages} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
