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

  // Define all functions before using them
  const formatMessage = (message: any): ChatMessage => ({
    id: message.id,
    content: message.content,
    author: {
      id: message.profiles?.id,
      username: message.profiles?.username,
      avatar: message.profiles?.avatar_url,
    },
    isAnonymous: message.is_anonymous,
    isSuitableForMinors: message.is_suitable_for_minors,
    created_at: message.created_at,
    likes: message.likes_count || 0,
    likedBy: message.liked_by || [],
    isLiked: user ? (message.liked_by || []).includes(user.id) : false,
    comments: [],
    viewCount: message.view_count || 0,
    color: message.color || 'bg-primary',
  });

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
        setParentMessage((prev) => prev ? {
          ...prev,
          likes: data.likes_count,
          likedBy: data.liked_by,
          isLiked: data.liked_by.includes(user.id),
        } : null);
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

  const deleteMessage = async (messageId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

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

      const newMessage = formatMessage(message);
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

  const fetchMessages = useCallback(async () => {
    console.log('fetchMessages called with:', { user, chatId });
    if (!user) {
      console.log('No user, returning early');
      return;
    }
    setLoading(true);
    
    try {
      if (chatId) {
        // Fetch specific chat and its comments
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

        if (commentsError) throw commentsError;

        if (parentData) {
          setParentMessage(formatMessage(parentData));
          updateViewCount();
        }

        setMessages((commentsData || []).map(formatMessage));
      } else {
        // Fetch main chat list
        const { data, error } = await supabase
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
          .is('parent_id', null)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMessages((data || []).map(formatMessage));
      }

      setError(null);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [user, chatId, updateViewCount]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    // Create a channel for all chat updates
    const channel = supabase
      .channel('chat_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          console.log('Received real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            if (chatId) {
              if (payload.new.parent_id === chatId) {
                const newMessage = formatMessage(payload.new);
                setMessages((prev) => [newMessage, ...prev]);
              }
            } else if (!payload.new.parent_id) {
              const newMessage = formatMessage(payload.new);
              setMessages((prev) => [newMessage, ...prev]);
            }
          } else if (payload.eventType === 'DELETE') {
            setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id
                  ? formatMessage(payload.new)
                  : msg
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user, chatId]);

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