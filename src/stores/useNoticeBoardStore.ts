
import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

export interface NoticePost {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: string;
  status: 'open' | 'closed';
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
}

export interface NoticeReply {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
}

interface NoticeBoardState {
  posts: NoticePost[];
  currentPost: NoticePost | null;
  replies: NoticeReply[];
  isLoading: boolean;
  error: string | null;
  
  createPost: (post: Omit<NoticePost, 'id' | 'author_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  fetchPosts: (filter?: string) => Promise<void>;
  fetchPost: (postId: string) => Promise<void>;
  fetchReplies: (postId: string) => Promise<void>;
  addReply: (postId: string, content: string) => Promise<void>;
  updatePostStatus: (postId: string, status: 'open' | 'closed') => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  deleteReply: (replyId: string) => Promise<void>;
}

export const useNoticeBoardStore = create<NoticeBoardState>((set, get) => ({
  posts: [],
  currentPost: null,
  replies: [],
  isLoading: false,
  error: null,
  
  createPost: async (post) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('notice_board_posts')
        .insert([{
          ...post,
          author_id: userData.user.id
        }])
        .select(`
          *,
          author:author_id(id, display_name, avatar_url)
        `);
      
      if (error) {
        console.error('Error creating notice post:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set(state => ({ 
        posts: [data[0], ...state.posts],
        isLoading: false
      }));
      
    } catch (error: any) {
      console.error('Error creating notice post:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchPosts: async (filter?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      let query = supabase
        .from('notice_board_posts')
        .select(`
          *,
          author:author_id(id, display_name, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      // Apply category filter if provided
      if (filter) {
        query = query.eq('category', filter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching notice posts:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set({ posts: data || [], isLoading: false });
      
    } catch (error: any) {
      console.error('Error fetching notice posts:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchPost: async (postId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('notice_board_posts')
        .select(`
          *,
          author:author_id(id, display_name, avatar_url)
        `)
        .eq('id', postId)
        .single();
      
      if (error) {
        console.error('Error fetching notice post:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set({ currentPost: data || null, isLoading: false });
      
    } catch (error: any) {
      console.error('Error fetching notice post:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchReplies: async (postId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('notice_board_replies')
        .select(`
          *,
          author:author_id(id, display_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching notice replies:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set({ replies: data || [], isLoading: false });
      
    } catch (error: any) {
      console.error('Error fetching notice replies:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  addReply: async (postId: string, content: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('notice_board_replies')
        .insert([{
          post_id: postId,
          author_id: userData.user.id,
          content
        }])
        .select(`
          *,
          author:author_id(id, display_name, avatar_url)
        `);
      
      if (error) {
        console.error('Error adding reply:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set(state => ({ 
        replies: [...state.replies, data[0]],
        isLoading: false
      }));
      
    } catch (error: any) {
      console.error('Error adding reply:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  updatePostStatus: async (postId: string, status: 'open' | 'closed') => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('notice_board_posts')
        .update({ status })
        .eq('id', postId)
        .select();
      
      if (error) {
        console.error('Error updating post status:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set(state => ({
        posts: state.posts.map(post => 
          post.id === postId ? { ...post, status } : post
        ),
        currentPost: state.currentPost && state.currentPost.id === postId 
          ? { ...state.currentPost, status } 
          : state.currentPost,
        isLoading: false
      }));
      
    } catch (error: any) {
      console.error('Error updating post status:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  deletePost: async (postId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('notice_board_posts')
        .delete()
        .eq('id', postId);
      
      if (error) {
        console.error('Error deleting post:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set(state => ({
        posts: state.posts.filter(post => post.id !== postId),
        currentPost: null,
        isLoading: false
      }));
      
    } catch (error: any) {
      console.error('Error deleting post:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  deleteReply: async (replyId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('notice_board_replies')
        .delete()
        .eq('id', replyId);
      
      if (error) {
        console.error('Error deleting reply:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set(state => ({
        replies: state.replies.filter(reply => reply.id !== replyId),
        isLoading: false
      }));
      
    } catch (error: any) {
      console.error('Error deleting reply:', error);
      set({ error: error.message, isLoading: false });
    }
  }
}));
