import React from 'react';
import { AlertCircle, Wifi, Droplet, Lightbulb, Building, Wrench } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

// Define issue categories with their corresponding icons
export const issueCategories = [
  { id: 'all', label: 'All Issues', icon: <AlertCircle size={16} /> },
  { id: 'wifi', label: 'WiFi Issues', icon: <Wifi size={16} /> },
  { id: 'water', label: 'Water Problems', icon: <Droplet size={16} /> },
  { id: 'electricity', label: 'Electricity Issues', icon: <Lightbulb size={16} /> },
  { id: 'lift', label: 'Lift/Elevator Problems', icon: <Building size={16} /> },
  { id: 'maintenance', label: 'General Maintenance', icon: <Wrench size={16} /> },
];

interface IssueCategoryDropdownProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const IssueCategoryDropdown: React.FC<IssueCategoryDropdownProps> = ({ 
  selectedCategory, 
  setSelectedCategory 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          {issueCategories.find(cat => cat.id === selectedCategory)?.icon}
          <span className="ml-2">{issueCategories.find(cat => cat.id === selectedCategory)?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {issueCategories.map(category => (
          <DropdownMenuItem 
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2 cursor-pointer"
          >
            {category.icon}
            {category.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default IssueCategoryDropdown;
