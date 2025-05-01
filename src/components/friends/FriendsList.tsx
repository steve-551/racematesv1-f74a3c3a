
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, UserMinus } from 'lucide-react';
import { useFriendshipStore, FriendRequest } from '@/stores/useFriendshipStore';
import { toast } from 'sonner';
import { useMessagingStore } from '@/stores/useMessagingStore';

interface FriendsListProps {
  onSendMessage?: (friendId: string) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ onSendMessage }) => {
  const { friends, removeFriend, isLoading } = useFriendshipStore();
  const navigate = useNavigate();

  const handleRemoveFriend = async (friendId: string) => {
    await removeFriend(friendId);
  };

  const handleViewProfile = (friendId: string) => {
    navigate(`/racers/${friendId}`);
  };

  const handleSendMessage = (friendId: string) => {
    if (onSendMessage) {
      onSendMessage(friendId);
    } else {
      toast.info('Message functionality will be implemented soon!');
    }
  };

  const getFriendInfo = (friend: FriendRequest) => {
    // If the current user is the requestor, then the friend is the addressee
    // If the current user is the addressee, then the friend is the requestor
    const isCurrentUserRequestor = friend.requestor_id === 'current-user';
    return isCurrentUserRequestor ? friend.addressee : friend.requestor;
  };

  return (
    <Card className="racing-card">
      <CardHeader>
        <CardTitle>Friends</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading friends...</p>
          </div>
        ) : friends.length > 0 ? (
          <div className="space-y-4">
            {friends.map((friend) => {
              const friendInfo = getFriendInfo(friend);
              if (!friendInfo) return null;

              return (
                <div key={friend.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-800">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 cursor-pointer" onClick={() => handleViewProfile(friendInfo?.id || '')}>
                      <AvatarImage src={friendInfo?.avatar_url} />
                      <AvatarFallback>{friendInfo?.display_name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium cursor-pointer" onClick={() => handleViewProfile(friendInfo?.id || '')}>
                        {friendInfo?.display_name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => handleSendMessage(friendInfo?.id || '')}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleRemoveFriend(friend.id)}>
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">You don't have any friends yet.</p>
            <Button className="mt-4" onClick={() => navigate('/find-racers')}>
              Find Racers
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendsList;
