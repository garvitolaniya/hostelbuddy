import React from 'react';
import { Message } from '@/contexts/ChatContext';
import { MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { issueCategories } from './IssueCategoryDropdown';

interface StatsPanelProps {
  messages: Message[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({ messages }) => {
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return messages.filter(m => m.sender === 'user').length;
    
    return messages.filter(message => {
      if (message.sender !== 'user') return false;
      
      const lowerText = message.text.toLowerCase();
      switch(categoryId) {
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
          return false;
      }
    }).length;
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Messages
          </CardTitle>
          <MessageSquare size={16} className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{messages.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            +{messages.filter(m => m.sender === 'user').length} from users
          </p>
        </CardContent>
      </Card>
      
      {/* Category-specific stat cards */}
      {issueCategories.filter(cat => cat.id !== 'all').map(category => (
        <Card key={category.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {category.label}
            </CardTitle>
            {category.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCategoryCount(category.id)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((getCategoryCount(category.id) / getCategoryCount('all')) * 100)}% of total issues
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsPanel;
