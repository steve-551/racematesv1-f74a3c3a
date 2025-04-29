
import React, { useEffect, useState } from 'react';
import { useNoticeBoardStore } from '@/stores/useNoticeBoardStore';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Calendar, MessageSquare, User, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const NoticeBoard: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { 
    posts, 
    currentPost, 
    replies, 
    isLoading, 
    error,
    createPost,
    fetchPosts,
    fetchPost,
    fetchReplies,
    addReply,
    updatePostStatus
  } = useNoticeBoardStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (selectedPost) {
      fetchPost(selectedPost);
      fetchReplies(selectedPost);
    }
  }, [selectedPost, fetchPost, fetchReplies]);

  useEffect(() => {
    if (activeTab !== 'all') {
      fetchPosts(activeTab);
    } else {
      fetchPosts();
    }
  }, [activeTab, fetchPosts]);

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostCategory) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createPost({
        title: newPostTitle,
        content: newPostContent,
        category: newPostCategory,
        expires_at: null,
        status: 'open'
      });
      
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostCategory('');
      setIsCreateDialogOpen(false);
      toast.success('Your notice has been posted');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const handlePostReply = async () => {
    if (!replyContent.trim() || !selectedPost) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      await addReply(selectedPost, replyContent);
      setReplyContent('');
      toast.success('Reply posted');
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    }
  };

  const handlePostStatusChange = async (postId: string, status: 'open' | 'closed') => {
    try {
      await updatePostStatus(postId, status);
      toast.success(`Post marked as ${status}`);
    } catch (error) {
      console.error('Error updating post status:', error);
      toast.error('Failed to update post status');
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      'driver_needed': 'bg-blue-500',
      'spotter_needed': 'bg-yellow-500',
      'crew_chief_needed': 'bg-purple-500',
      'team_opening': 'bg-green-500',
      'practice_session': 'bg-orange-500',
      'other': 'bg-gray-500'
    };
    
    return (
      <Badge className={`${categoryColors[category] || 'bg-gray-500'}`}>
        {category.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge className={status === 'open' ? 'bg-green-500' : 'bg-red-500'}>
        {status}
      </Badge>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-orbitron">Racing Notice Board</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>Post Notice</Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="driver_needed">Driver Needed</TabsTrigger>
            <TabsTrigger value="spotter_needed">Spotter Needed</TabsTrigger>
            <TabsTrigger value="crew_chief_needed">Crew Chief Needed</TabsTrigger>
            <TabsTrigger value="team_opening">Team Opening</TabsTrigger>
            <TabsTrigger value="practice_session">Practice Session</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading && !selectedPost ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 mx-auto mb-4" />
            <p>Loading notices...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400">No notices found. Be the first to post!</p>
              </div>
            ) : (
              posts.map((post) => (
                <Card 
                  key={post.id} 
                  className={`cursor-pointer hover:shadow-lg transition-shadow ${post.status === 'closed' ? 'opacity-60' : ''}`}
                  onClick={() => setSelectedPost(post.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg line-clamp-1">{post.title}</CardTitle>
                      {getStatusBadge(post.status)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm line-clamp-3 mb-4">{post.content}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        {getCategoryBadge(post.category)}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={post.author?.avatar_url} />
                        <AvatarFallback>{post.author?.display_name?.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{post.author?.display_name || 'Unknown'}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Post Creation Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Notice</DialogTitle>
              <DialogDescription>
                Post a notice to the racing community. Be clear about what you need!
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="E.g., Need a spotter for Spa 24h"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="driver_needed">Driver Needed</SelectItem>
                    <SelectItem value="spotter_needed">Spotter Needed</SelectItem>
                    <SelectItem value="crew_chief_needed">Crew Chief Needed</SelectItem>
                    <SelectItem value="team_opening">Team Opening</SelectItem>
                    <SelectItem value="practice_session">Practice Session</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Describe what you're looking for... Be specific about timing, requirements, and how to contact you."
                  rows={5}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreatePost}>Post Notice</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Post Viewing Dialog */}
        <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            {isLoading && selectedPost ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 mx-auto mb-4" />
                <p>Loading notice details...</p>
              </div>
            ) : currentPost && (
              <>
                <DialogHeader>
                  <div className="flex justify-between items-center">
                    <DialogTitle>{currentPost.title}</DialogTitle>
                    {getStatusBadge(currentPost.status)}
                  </div>
                  <DialogDescription className="flex items-center space-x-2 pt-1">
                    <Clock className="h-3 w-3" />
                    <span>{format(new Date(currentPost.created_at), 'PPP')}</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar>
                      <AvatarImage src={currentPost.author?.avatar_url} />
                      <AvatarFallback>{currentPost.author?.display_name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{currentPost.author?.display_name || 'Unknown'}</p>
                      <div className="mt-1">
                        {getCategoryBadge(currentPost.category)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                    {currentPost.content}
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-4">Responses ({replies.length})</h3>
                    {replies.length === 0 ? (
                      <p className="text-gray-500 text-sm italic">No responses yet. Be the first to respond!</p>
                    ) : (
                      <div className="space-y-4">
                        {replies.map((reply) => (
                          <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={reply.author?.avatar_url} />
                                <AvatarFallback>{reply.author?.display_name?.charAt(0) || '?'}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{reply.author?.display_name || 'Unknown'}</span>
                              <span className="text-xs text-gray-500">
                                {format(new Date(reply.created_at), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <p className="text-sm">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Reply input */}
                    {currentPost.status === 'open' ? (
                      <div className="mt-4 space-y-3">
                        <Textarea
                          placeholder="Your response..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          rows={3}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => handlePostStatusChange(currentPost.id, 'closed')}>
                            Mark as Closed
                          </Button>
                          <Button onClick={handlePostReply}>Reply</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 bg-red-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-red-600">This notice has been closed and is no longer accepting responses.</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => handlePostStatusChange(currentPost.id, 'open')}
                        >
                          Reopen
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default NoticeBoard;
