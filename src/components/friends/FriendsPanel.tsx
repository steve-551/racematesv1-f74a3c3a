
import React, { useEffect, useState } from 'react';
import { useFriendshipStore } from '@/stores/useFriendshipStore';
import { useMessagingStore } from '@/stores/useMessagingStore';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, UserPlus, Check, X, Send, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface FriendsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const FriendsPanel: React.FC<FriendsPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('friends');
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);

  const { 
    friends, 
    friendRequests, 
    sentRequests,
    fetchFriends, 
    fetchFriendRequests, 
    fetchSentRequests, 
    respondToFriendRequest
  } = useFriendshipStore();
  
  const {
    directMessages,
    fetchDirectMessages,
    sendDirectMessage,
    isLoading: isMessagesLoading
  } = useMessagingStore();

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
      fetchFriendRequests();
      fetchSentRequests();
    }
  }, [isOpen, fetchFriends, fetchFriendRequests, fetchSentRequests]);

  useEffect(() => {
    if (selectedFriendId) {
      fetchDirectMessages(selectedFriendId);
    }
  }, [selectedFriendId, fetchDirectMessages]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await respondToFriendRequest(requestId, 'accepted');
      toast.success('Friend request accepted');
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await respondToFriendRequest(requestId, 'rejected');
      toast.success('Friend request rejected');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedFriendId || !messageContent.trim()) {
      return;
    }

    try {
      await sendDirectMessage(selectedFriendId, messageContent);
      setMessageContent('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const openChatDialog = (friendId: string) => {
    setSelectedFriendId(friendId);
    setIsChatDialogOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Friends & Messages</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="friends">
              Friends ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="requests">
              Requests ({friendRequests.length})
            </TabsTrigger>
            <TabsTrigger value="sent">
              Sent ({sentRequests.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends" className="max-h-[50vh] overflow-y-auto">
            {friends.length === 0 ? (
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400">No friends yet. Add some fellow racers!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {friends.map((friend) => {
                  const friendDetails = friend.requestor_id === friend.addressee_id ? friend.addressee : friend.requestor;
                  return (
                    <Card key={friend.id} className="flex justify-between items-center p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={friendDetails?.avatar_url} />
                          <AvatarFallback>
                            {friendDetails?.display_name?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{friendDetails?.display_name}</p>
                        </div>
                      </div>
                      <div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openChatDialog(friendDetails?.id || '')}
                        >
                          <MessageSquare className="h-5 w-5" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="requests" className="max-h-[50vh] overflow-y-auto">
            {friendRequests.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400">No pending friend requests</p>
              </div>
            ) : (
              <div className="space-y-2">
                {friendRequests.map((request) => (
                  <Card key={request.id} className="flex justify-between items-center p-3">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={request.requestor?.avatar_url} />
                        <AvatarFallback>
                          {request.requestor?.display_name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.requestor?.display_name}</p>
                        <p className="text-xs text-gray-500">
                          Sent {format(new Date(request.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sent" className="max-h-[50vh] overflow-y-auto">
            {sentRequests.length === 0 ? (
              <div className="text-center py-8">
                <Send className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400">No pending friend requests sent</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sentRequests.map((request) => (
                  <Card key={request.id} className="flex justify-between items-center p-3">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={request.addressee?.avatar_url} />
                        <AvatarFallback>
                          {request.addressee?.display_name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.addressee?.display_name}</p>
                        <p className="text-xs text-gray-500">
                          Sent {format(new Date(request.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                        Pending
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
      
      {/* Chat Dialog */}
      <Dialog open={isChatDialogOpen} onOpenChange={setIsChatDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
          {selectedFriendId && (
            <>
              <DialogHeader>
                {friends.map((friend) => {
                  const friendDetails = friend.requestor_id === selectedFriendId ? friend.requestor : friend.addressee;
                  if (friendDetails?.id === selectedFriendId) {
                    return (
                      <div key={friend.id} className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={friendDetails.avatar_url} />
                          <AvatarFallback>
                            {friendDetails.display_name?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <DialogTitle>{friendDetails.display_name}</DialogTitle>
                      </div>
                    );
                  }
                  return null;
                })}
              </DialogHeader>
              
              <div className="flex flex-col h-[50vh]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-md mb-3">
                  {isMessagesLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-blue-500" />
                    </div>
                  ) : directMessages[selectedFriendId]?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <MessageSquare className="h-12 w-12 mb-2" />
                      <p>No messages yet. Say hello!</p>
                    </div>
                  ) : (
                    directMessages[selectedFriendId]?.map((message) => {
                      const isSentByMe = message.sender_id !== selectedFriendId;
                      return (
                        <div 
                          key={message.id}
                          className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`rounded-lg px-4 py-2 max-w-[80%] ${
                              isSentByMe 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {format(new Date(message.created_at), 'h:mm a')}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Input
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    type="submit"
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!messageContent.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default FriendsPanel;
