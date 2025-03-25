import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from 'lucide-react';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, avatarUrl, size = 'md' }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <Avatar className={`${sizeClasses[size]} transition-all duration-300 hover:scale-105 animate-fade-in`}>
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback className="bg-primary/10 text-primary">
        {avatarUrl ? <User size={16} /> : getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
