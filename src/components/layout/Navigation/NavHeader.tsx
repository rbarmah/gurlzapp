import React from 'react';
import { Heart } from 'lucide-react';
import { User } from '../../../types';

interface NavHeaderProps {
  user: User | null;
}

export default function NavHeader({ user }: NavHeaderProps) {
  return (
    <div className="p-6 border-b border-primary-light/20">
      <div className="flex items-center space-x-3">
        <Heart className="w-8 h-8 text-secondary-dark" />
        <h1 className="text-2xl font-serif text-secondary-dark">Gurlz</h1>
      </div>
      {user && (
        <div className="mt-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-secondary-dark text-primary-dark flex items-center justify-center font-semibold">
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{user.username}</p>
            <p className="text-sm text-secondary-dark/80">{user.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}