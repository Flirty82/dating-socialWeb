// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    localStorage.removeItem('authToken');
  }

  // Make authenticated request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Authentication APIs
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  async logout() {
    this.removeAuthToken();
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Posts APIs
  async getPosts(page = 1, limit = 10) {
    return this.request(`/posts?page=${page}&limit=${limit}`);
  }

  async createPost(postData) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async likePost(postId) {
    return this.request(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async commentOnPost(postId, content) {
    return this.request(`/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async replyToComment(postId, commentId, content) {
    return this.request(`/posts/${postId}/comment/${commentId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async deletePost(postId) {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  // Messages APIs
  async getMessages(userId) {
    return this.request(`/messages/${userId}`);
  }

  async sendMessage(messageData) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  // Users APIs
  async getUsers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/users?${queryParams}`);
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return this.request('/users/avatar', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }

  // Membership APIs
  async upgradeMembership(membershipType) {
    return this.request('/users/membership', {
      method: 'POST',
      body: JSON.stringify({ membershipType }),
    });
  }

  async getMembershipInfo() {
    return this.request('/users/membership');
  }

  // Notifications APIs
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;

// src/hooks/useAuth.js
import { useState, useEffect, useContext, createContext } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = apiService.getAuthToken();
      if (token) {
        const userData = await apiService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      apiService.removeAuthToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await apiService.login(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await apiService.register(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// src/hooks/usePosts.js
import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getPosts(pageNum, 10);
      
      if (reset) {
        setPosts(response.posts);
      } else {
        setPosts(prev => [...prev, ...response.posts]);
      }
      
      setHasMore(response.pagination.hasMore);
      setPage(pageNum);
    } catch (error) {
      setError(error.message);
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    try {
      const newPost = await apiService.createPost(postData);
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const likePost = async (postId) => {
    try {
      const response = await apiService.likePost(postId);
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: response.likeCount,
              likedBy: response.likedBy 
            }
          : post
      ));
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const commentOnPost = async (postId, content) => {
    try {
      const newComment = await apiService.commentOnPost(postId, content);
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              comments: [...post.comments, newComment] 
            }
          : post
      ));
      
      return newComment;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const replyToComment = async (postId, commentId, content) => {
    try {
      const newReply = await apiService.replyToComment(postId, commentId, content);
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? {
              ...post,
              comments: post.comments.map(comment =>
                comment.id === commentId
                  ? { ...comment, replies: [...comment.replies, newReply] }
                  : comment
              )
            }
          : post
      ));
      
      return newReply;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const loadMorePosts = () => {
    if (hasMore && !loading) {
      fetchPosts(page + 1);
    }
  };

  const refreshPosts = () => {
    fetchPosts(1, true);
  };

  return {
    posts,
    loading,
    error,
    hasMore,
    createPost,
    likePost,
    commentOnPost,
    replyToComment,
    loadMorePosts,
    refreshPosts,
  };
};

// src/components/ActivityFeedContainer.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';
import ActivityFeed from './ActivityFeed';

const ActivityFeedContainer = () => {
  const { user } = useAuth();
  const {
    posts,
    loading,
    error,
    hasMore,
    createPost,
    likePost,
    commentOnPost,
    replyToComment,
    loadMorePosts,
    refreshPosts,
  } = usePosts();

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button 
          onClick={refreshPosts}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <ActivityFeed
      user={user}
      posts={posts}
      onCreatePost={createPost}
      onLikePost={likePost}
      onCommentPost={commentOnPost}
      onReplyToComment={replyToComment}
      onLoadMore={loadMorePosts}
      hasMore={hasMore}
      loading={loading}
    />
  );
};

export default ActivityFeedContainer;