
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import FriendsPanelContent from './FriendsPanelContent';

interface FriendsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const FriendsPanel: React.FC<FriendsPanelProps> = ({ isOpen, onClose }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Friends & Messages</SheetTitle>
        </SheetHeader>
        <div className="mt-6 h-[90%]">
          <FriendsPanelContent />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FriendsPanel;
