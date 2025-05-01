
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFriendshipStore, FriendRequest } from '@/stores/useFriendshipStore';
import { useMessagingStore, DirectMessage } from '@/stores/useMessagingStore';
import { Send, Check, X } from 'lucide-react';

export const FriendsPanelContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('friends');
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState<string>('');
  
  const { 
    friends, 
    friendRequests, 
    fetchFriends, 
    fetchFriendRequests,
    respondToFriendRequest
  } = useFriendshipStore();
  
  const {
    directMessages,
    fetchDirectMessages,
    sendDirectMessage
  } = useMessagingStore();
  
  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, [fetchFriends, fetchFriendRequests]);
  
  useEffect(() => {
    if (activeConversation) {
      fetchDirectMessages(activeConversation);
    }
  }, [activeConversation, fetchDirectMessages]);
  
  const handleSendMessage = async () => {
    if (!activeConversation || !messageInput.trim()) return;
    
    await sendDirectMessage(activeConversation, messageInput);
    setMessageInput('');
  };
  
  const getFriendInfo = (friend: FriendRequest) => {
    // If the current user is the requestor, then the friend is the addressee
    // If the current user is the addressee, then the friend is the requestor
    const isCurrentUserRequestor = friend.requestor_id === 'current-user';
    return isCurrentUserRequestor ? friend.addressee : friend.requestor;
  };

  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
      <TabsList className="w-full grid grid-cols-3 mb-4">
        <TabsTrigger value="friends">Friends</TabsTrigger>
        <TabsTrigger value="requests">
          Requests
          {friendRequests.length > 0 && (
            <span className="ml-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {friendRequests.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
      </TabsList>
      
      <TabsContent value="friends" className="h-[500px] overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {friends.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">You don't have any friends yet.</p>
              <p className="text-gray-500 mt-2">Find racers to add as friends!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {friends.map((friend) => {
                const friendInfo = getFriendInfo(friend);
                if (!friendInfo) return null;
                
                return (
                  <div 
                    key={friend.id} 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => {
                      setActiveConversation(friendInfo.id);
                      setActiveTab('messages');
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={friendInfo.avatar_url} />
                        <AvatarFallback>{friendInfo.display_name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{friendInfo.display_name}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="requests" className="h-[500px] overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {friendRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No friend requests.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {friendRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={request.requestor?.avatar_url} />
                      <AvatarFallback>{request.requestor?.display_name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{request.requestor?.display_name}</p>
                      <p className="text-xs text-gray-500">Wants to be friends</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 rounded-full bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                      onClick={() => respondToFriendRequest(request.id, 'accepted')}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                      onClick={() => respondToFriendRequest(request.id, 'rejected')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="messages" className="h-[500px] flex flex-col">
        {activeConversation ? (
          <>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full pr-4">
                {/* Show messages */}
                {directMessages[activeConversation]?.length > 0 ? (
                  <div className="space-y-3 py-3">
                    {directMessages[activeConversation].map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender_id === 'current-user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`rounded-lg px-4 py-2 max-w-[80%] ${
                            message.sender_id === 'current-user' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 dark:bg-gray-800'
                          }`}
                        >
                          <p className="break-words">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">No messages yet.</p>
                  </div>
                )}
              </ScrollArea>
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex items-center space-x-2 mt-auto">
              <Input 
                placeholder="Type your message..." 
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1"
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage} 
                disabled={!messageInput.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Select a friend to start messaging.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default FriendsPanelContent;
