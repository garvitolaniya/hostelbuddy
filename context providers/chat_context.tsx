import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export type MessageSender = 'user' | 'bot' | 'admin';

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  isAudioMessage?: boolean;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string, isAudioMessage?: boolean) => void;
  isTyping: boolean;
  clearMessages: () => void;
  adminReply: (messageId: string, reply: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Common hostel issues and responses for the bot
const hostelResponses: Record<string, string[]> = {
  'wifi': [
    "I understand you're having WiFi issues. Have you tried restarting your device and reconnecting?",
    "WiFi problems can be frustrating. Let me escalate this to our IT admin for assistance.",
    "Our WiFi network might be undergoing maintenance. Let me check the status for you."
  ],
  'room': [
    "For room-related issues, please provide more details about the problem.",
    "I'll note down your room concern and forward it to our maintenance team.",
    "Room maintenance requests are usually addressed within 24-48 hours."
  ],
  'roommate': [
    "Roommate conflicts can be challenging. Have you tried discussing the issue directly with them?",
    "I can arrange a mediation session with a resident advisor if needed.",
    "Let me know if you'd prefer to discuss roommate issues privately with hostel management."
  ],
  'water': [
    "Water supply issues have been noted. Our maintenance team will check it shortly.",
    "Is the water supply completely off, or is it a pressure/temperature issue?",
    "The water issue might be affecting multiple rooms. I'll check the building status."
  ],
  'food': [
    "I'll forward your feedback about the hostel food to our catering manager.",
    "Could you provide specific details about your food concern?",
    "We take food quality issues seriously and will investigate your report."
  ],
  'security': [
    "Security concerns are our top priority. A security officer will be notified immediately.",
    "Please provide details about the security issue you're experiencing.",
    "For urgent security matters, please also contact the security desk directly at extension 1234."
  ],
  'payment': [
    "For payment inquiries, you can check your account status on the student portal.",
    "I'll connect you with our finance department for payment-related questions.",
    "Payment deadlines and options are listed on our website under Student Services."
  ],
  'noise': [
    "Noise complaints are addressed by our resident advisors. I'll notify them of the issue.",
    "Could you specify which area the noise is coming from?",
    "Quiet hours are from 10 PM to 7 AM. We'll look into enforcing this better."
  ],
  'laundry': [
    "For laundry facility issues, our maintenance team will check the machines.",
    "Is a specific washing machine or dryer not working properly?",
    "We'll make sure the laundry area is serviced as soon as possible."
  ],
  'mail': [
    "Mail and packages are typically processed within 24 hours of arrival.",
    "You can pick up your mail from the reception desk during office hours.",
    "If you're expecting an important package, I can check its status for you."
  ]
};

// Default bot responses for unrecognized queries
const defaultResponses = [
  "I understand you're having an issue with the hostel. Could you provide more details so I can better assist you?",
  "I'd like to help with your hostel concern. Can you elaborate on the problem you're experiencing?",
  "Thank you for reaching out. To address your hostel issue effectively, I need a bit more information.",
  "I'm here to help with your hostel needs. Please share more specifics about your situation.",
];

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('hostelHelperMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (e) {
        console.error('Error parsing saved messages', e);
      }
    } else {
      // Add welcome message if no saved messages
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "Hello! I'm your Hostel Helper Buddy. How can I assist you with your hostel-related concerns today?",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('hostelHelperMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Helper function to generate bot responses
  const generateBotResponse = useCallback((userMessage: string): string => {
    const lowercasedMessage = userMessage.toLowerCase();
    
    // Check for keywords in the user message
    for (const [keyword, responses] of Object.entries(hostelResponses)) {
      if (lowercasedMessage.includes(keyword)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    // If no keywords match, use a default response
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }, []);

  // Function to send a new message
  const sendMessage = useCallback((text: string, isAudioMessage = false) => {
    if (!text.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      isAudioMessage,
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Generate bot response after delay (simulating thinking/typing)
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1500); // 1.5 second delay to simulate bot thinking
  }, [generateBotResponse]);

  // Function for admin to reply to specific messages
  const adminReply = useCallback((messageId: string, reply: string) => {
    if (!reply.trim() || !user || user.role !== 'admin') return;
    
    const adminMessage: Message = {
      id: Date.now().toString(),
      text: reply,
      sender: 'admin',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, adminMessage]);
    toast.success('Reply sent to user');
  }, [user]);

  // Function to clear all messages
  const clearMessages = useCallback(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: "Hello! I'm your Hostel Helper Buddy. How can I assist you with your hostel-related concerns today?",
      sender: 'bot',
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
    localStorage.removeItem('hostelHelperMessages');
    toast.success('Conversation history cleared');
  }, []);

  const value = {
    messages,
    sendMessage,
    isTyping,
    clearMessages,
    adminReply,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
