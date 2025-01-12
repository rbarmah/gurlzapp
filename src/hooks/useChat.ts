import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { ChatMessage } from '../types/chat';
import { supabase } from '../lib/supabase';

export function useChat(chatId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [parentMessage, setParentMessage] = useState<ChatMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  const updateViewCount = useCallback(async () => {
    if (!user || !chatId) return;

    try {
      const { error } = await supabase.rpc('increment_view_count', {
        message_id: chatId,
        viewer_id: user.id,
      });

      if (error) throw error;
    } catch (err: any) {
      console.error('Error updating view count:', err);
    }
  }, [user, chatId]);

  const toggleLike = async (messageId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('toggle_message_like', {
        message_id: messageId,
        user_id: user.id,
      });

      if (error) throw error;

      if (messageId === chatId && parentMessage) {
        setParentMessage((prev) => ({
          ...prev!,
          likes: data.likes_count,
          likedBy: data.liked_by,
          isLiked: data.liked_by.includes(user.id),
        }));
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  likes: data.likes_count,
                  likedBy: data.liked_by,
                  isLiked: data.liked_by.includes(user.id),
                }
              : msg
          )
        );
      }

      return true;
    } catch (err: any) {
      console.error('Error toggling like:', err);
      setError(err?.message || 'Failed to update like');
      return false;
    }
  };

  const fetchMessages = useCallback(async () => {
    console.log('fetchMessages called with:', { user, chatId });
    if (!user) {
      console.log('No user, returning early');
      return;
    }
    setLoading(true);
    
    try {
      if (chatId) {
        console.log('Fetching specific chat:', chatId);
        const { data: parentData, error: parentError } = await supabase
          .from('chat_messages')
          .select(
            `
            *,
            profiles:user_id (
              id,
              username,
              avatar_url
            )
          `
          )
          .eq('id', chatId)
          .single();

        console.log('Parent data query result:', { parentData, parentError });

        if (parentError) throw parentError;

        const { data: commentsData, error: commentsError } = await supabase
          .from('chat_messages')
          .select(
            `
            *,
            profiles:user_id (
              id,
              username,
              avatar_url
            )
          `
          )
          .eq('parent_id', chatId)
          .order('created_at', { ascending: false });

        console.log('Comments data query result:', { commentsData, commentsError });

        if (commentsError) throw commentsError;

        if (parentData) {
          setParentMessage({
            id: parentData.id,
            content: parentData.content,
            author: {
              id: parentData.profiles.id,
              username: parentData.profiles.username,
              avatar: parentData.profiles.avatar_url,
            },
            isAnonymous: parentData.is_anonymous,
            isSuitableForMinors: parentData.is_suitable_for_minors,
            created_at: parentData.created_at,
            likes: parentData.likes_count || 0,
            likedBy: parentData.liked_by || [],
            comments: commentsData || [],
            viewCount: parentData.view_count || 0,
            color: parentData.color || 'bg-primary',
            isLiked: (parentData.liked_by || []).includes(user.id),
          });

          updateViewCount();
        }

        setMessages((commentsData || []).map((comment) => ({
          id: comment.id,
          content: comment.content,
          author: {
            id: comment.profiles.id,
            username: comment.profiles.username,
            avatar: comment.profiles.avatar_url,
          },
          isAnonymous: comment.is_anonymous,
          isSuitableForMinors: comment.is_suitable_for_minors,
          created_at: comment.created_at,
          likes: comment.likes_count || 0,
          likedBy: comment.liked_by || [],
          isLiked: (comment.liked_by || []).includes(user.id),
          comments: [],
          viewCount: comment.view_count || 0,
          color: comment.color || 'bg-primary',
        })));
      } else {
        console.log('Fetching all parent messages');
        const { data, error } = await supabase
          .from('chat_messages')
          .select(`
            *,
            profiles:user_id (
              id,
              username,
              avatar_url
            )
          `)
          .is('parent_id', null)
          .order('created_at', { ascending: false });

        console.log('Parent messages query result:', { data, error });

        if (error) throw error;

        const formattedMessages = (data || []).map((message) => ({
          id: message.id,
          content: message.content,
          author: {
            id: message.profiles.id,
            username: message.profiles.username,
            avatar: message.profiles.avatar_url,
          },
          isAnonymous: message.is_anonymous,
          isSuitableForMinors: message.is_suitable_for_minors,
          created_at: message.created_at,
          likes: message.likes_count || 0,
          likedBy: message.liked_by || [],
          isLiked: (message.liked_by || []).includes(user.id),
          comments: [],
          viewCount: message.view_count || 0,
          color: message.color || 'bg-primary',
        }));

        console.log('Formatted messages:', formattedMessages);
        setMessages(formattedMessages);
      }

      setError(null);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [user, chatId, updateViewCount]);

  const sendMessage = async (content: string, isAnonymous = false): Promise<boolean> => {
    if (!user) return false;
    setLoading(true);

    try {
      const { data: message, error: messageError } = await supabase
        .from('chat_messages')
        .insert({
          content,
          user_id: user.id,
          parent_id: chatId || null,
          is_anonymous: isAnonymous,
          is_suitable_for_minors: true,
          liked_by: [],
        })
        .select(
          `
          *,
          profiles:user_id (
            id,
            username,
            avatar_url
          )
        `
        )
        .single();

      if (messageError) throw messageError;

      const newMessage = {
        id: message.id,
        content: message.content,
        author: {
          id: message.profiles.id,
          username: message.profiles.username,
          avatar: message.profiles.avatar_url,
        },
        isAnonymous: message.is_anonymous,
        isSuitableForMinors: message.is_suitable_for_minors,
        created_at: message.created_at,
        likes: 0,
        likedBy: [],
        isLiked: false,
        comments: [],
        viewCount: 0,
        color: message.color || 'bg-primary',
      };

      setMessages((prev) => [newMessage, ...prev]);
      return true;
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err?.message || 'Failed to send message');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('chat_messages').delete().eq('id', messageId);

      if (error) throw error;

      if (messageId === chatId) {
        return true;
      }

      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      return true;
    } catch (err: any) {
      console.error('Error deleting message:', err);
      setError(err?.message || 'Failed to delete message');
      return false;
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `id=eq.${chatId}`,
        },
        (payload) => {
          if (payload.new) {
            setParentMessage(prev => prev ? {
              ...prev,
              likes: payload.new.likes_count || 0,
              likedBy: payload.new.liked_by || [],
              viewCount: payload.new.view_count || 0,
              isLiked: user ? (payload.new.liked_by || []).includes(user.id) : false,
            } : null);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `parent_id=eq.${chatId}`,
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [chatId, fetchMessages, user]);

  // Initial fetch
  useEffect(() => {
    console.log('Initial fetch effect triggered');
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    parentMessage,
    loading,
    error,
    sendMessage,
    fetchMessages,
    toggleLike,
    deleteMessage,
  };
}