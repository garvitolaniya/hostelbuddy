import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ChevronDown, Trash2, Wifi, Droplet, Lightbulb, Building, Wrench, HelpCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import SpeechRecognition from './SpeechRecognition';
import { useChat } from '@/contexts/ChatContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from '@/components/ui/scroll-area';

const quickIssueCategories = [
  { id: 'wifi', label: 'WiFi Issues', icon: <Wifi size={16} />, prompt: "I'm having trouble with the WiFi connection in my room." },
  { id: 'water', label: 'Water Problems', icon: <Droplet size={16} />, prompt: "There's an issue with the water supply in my room." },
  { id: 'electricity', label: 'Electricity Issues', icon: <Lightbulb size={16} />, prompt: "I'm experiencing an electrical problem in my room." },
  { id: 'lift', label: 'Lift/Elevator Problems', icon: <Building size={16} />, prompt: "The hostel elevator isn't working properly." },
  { id: 'maintenance', label: 'Maintenance Request', icon: <Wrench size={16} />, prompt: "I need maintenance help with something in my room." },
];

const ChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const { messages, sendMessage, isTyping, clearMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showQuickIssues, setShowQuickIssues] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleSpeechResult = (text: string) => {
    if (text.trim()) {
      sendMessage(text, true);
    }
  };

  const handleQuickIssueSelect = (prompt: string) => {
    sendMessage(prompt);
    setShowQuickIssues(false);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Hostel Helper Buddy</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <ChevronDown size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowQuickIssues(!showQuickIssues)}>
              <HelpCircle size={16} className="mr-2" />
              {showQuickIssues ? 'Hide Quick Issues' : 'Show Quick Issues'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearMessages} className="text-destructive">
              <Trash2 size={16} className="mr-2" />
              Clear Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {showQuickIssues && (
        <div className="p-4 border-b bg-muted/20">
          <h3 className="text-sm font-medium mb-2">Select a common issue:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {quickIssueCategories.map(category => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => handleQuickIssueSelect(category.prompt)}
              >
                {category.icon}
                <span className="ml-2 truncate">{category.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex items-end space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs text-primary font-semibold">HB</span>
              </div>
              <div className="typing-indicator">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="text-input font-medium text-foreground"
            autoComplete="off"
          />
          <SpeechRecognition 
            onSpeechResult={handleSpeechResult} 
            disabled={isTyping} 
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputValue.trim() || isTyping}
            className={!inputValue.trim() ? "text-muted-foreground" : ""}
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
