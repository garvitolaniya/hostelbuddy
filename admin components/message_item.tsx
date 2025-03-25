import React from 'react';
import { format } from 'date-fns';
import UserAvatar from '@/components/UserAvatar';
import { Message } from '@/contexts/ChatContext';
import { issueCategories } from './IssueCategoryDropdown';

interface MessageItemProps {
  message: Message;
  isSelected: boolean;
  onClick: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isSelected, onClick }) => {
  // Determine which categories apply to this message
  const getCategoriesForMessage = (text: string) => {
    const lowerText = text.toLowerCase();
    
    return issueCategories.filter(cat => {
      if (cat.id === 'all') return false;
      
      switch(cat.id) {
        case 'wifi':
          return lowerText.includes('wifi') || lowerText.includes('internet');
        case 'water':
          return lowerText.includes('water') || lowerText.includes('tap');
        case 'electricity':
          return lowerText.includes('electricity') || lowerText.includes('power');
        case 'lift':
          return lowerText.includes('lift') || lowerText.includes('elevator');
        case 'maintenance':
          return lowerText.includes('repair') || lowerText.includes('broken');
        default:
          return false;
      }
    });
  };

  const relevantCategories = getCategoriesForMessage(message.text);

  return (
    <div 
      className={`p-4 mb-3 rounded-lg transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'bg-primary/10 border-primary/30' 
          : 'bg-card hover:bg-muted/50'
      } border`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <UserAvatar 
          name="User" 
          avatarUrl="https://ui-avatars.com/api/?name=User&background=random"
          size="sm"
        />
        <div>
          <p className="text-sm font-medium">User</p>
          <p className="text-xs text-muted-foreground">
            {format(message.timestamp, 'MMM d, h:mm a')}
          </p>
        </div>
      </div>
      <p className="text-sm">{message.text}</p>
      
      {/* Add category indicators */}
      <div className="flex flex-wrap gap-1 mt-2">
        {relevantCategories.map(category => (
          <div key={category.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">
            {category.icon}
            <span className="ml-1">{category.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageItem;
