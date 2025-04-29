
import React, { useState, useEffect, useRef } from 'react';
import { useMessagingStore } from '@/stores/useMessagingStore';
import { useRacerStore } from '@/stores/useRacerStore';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Send, MessageSquare } from 'lucide-react';

interface TeamChatProps {
  teamId: string;
}

const TeamChat: React.FC<TeamChatProps> = ({ teamId }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { teamMessages, fetchTeamMessages, sendTeamMessage, isLoading } = useMessagingStore();
  const { currentRacer } = useRacerStore();
  
  useEffect(() => {
    if (teamId) {
      fetchTeamMessages(teamId);
    }
  }, [teamId, fetchTeamMessages]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [teamMessages[teamId]]);
  
  const handleSendMessage = async () => {
    if (!message.trim() || !teamId) return;
    
    try {
      await sendTeamMessage(teamId, message);
      setMessage('');
    } catch (error) {
      console.error('Error sending team message:', error);
    }
  };

  if (!teamId) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-2" />
            <p>Select a team to view chat</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle>Team Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-2 mb-4 bg-gray-50 rounded-md">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-blue-500" />
            </div>
          ) : teamMessages[teamId]?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageSquare className="h-12 w-12 mb-2" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {teamMessages[teamId]?.map((msg) => {
                const isMine = currentRacer?.id === msg.sender_id;
                return (
                  <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    {!isMine && (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={msg.sender?.avatar_url} />
                        <AvatarFallback>{msg.sender?.display_name?.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                    )}
                    <div 
                      className={`rounded-lg px-3 py-2 max-w-[80%] ${
                        isMine 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      {!isMine && (
                        <p className="text-xs font-semibold mb-1">
                          {msg.sender?.display_name}
                        </p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {format(new Date(msg.created_at), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 mt-auto">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500">
            Team Voice Chat Coming Soon!
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamChat;
