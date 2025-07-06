import { useEffect, useState } from 'react';
import PostCard from './PostCard';

const ActivityFeed = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('/api/posts')
        .then(res => res.json())
        .then(data => setPost(data));
    }, []);

    return (
        <div>
            <h2>Activity Feed</h2>
            {posts.map(post => (
                <PostCard key={post._id} post={post}/>
            ))};
        </div>
    );
};

const handleCreatePost = async () => {
    if (!canCreatePost()) {
        alert('Upgrade to Platinum or Diamond to create posts!');
        return;
    }

    if (!newPost.trim()) return;

    setSubmittingPost(true);
    const result = await createPost(newPost.trim());

    if (result.success) {
        setNewPost('');
    } else {
        alert(result.error || 'Failed to create post');
    }
    setSubmittingPost(false);
};

const hanimport React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Send, MoreHorizontal, Music, Users, Crown, Diamond, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';

const ActivityFeed = () => {
    const { user: currentUser } = useAuth();
    const {
        posts,
        loading,
        error,
        hasMore,
        createPost,
        toggleLike,
        addComment,
        addReply,
        loadMore,
        refresh
    } = usePosts();

    const [newPost, setNewPost] = useState('');
    const [submittingPost, setSubmittingPost] = useState(false);
    const [showComments, setShowComments] = useState({});
    const [commentText, setCommentText] = useState({});
    const [replyText, setReplyText] = useState({});
    const [showReplies, setShowReplies] = useState({});
    const [actionLoading, setActionLoading] = useState({});

    // Default user if not logged in (for demo)
    const user = currentUser || {
        id: '1',
        name: 'Demo User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        membership: 'free'
    };

    const getMembershipIcon = (membership) => {
        switch (membership) {
            case 'gold': return <Crown className="w-4 h-4 text-yellow-500" />;
            case 'platinum': return <Crown className="w-4 h-4 text-gray-400" />;
            case 'diamond': return <Diamond className="w-4 h-4 text-blue-500" />;
            default: return null;
        }
    };

    const getMembershipColor = (membership) => {
        switch (membership) {
            case 'gold': return 'border-yellow-500';
            case 'platinum': return 'border-gray-400';
            case 'diamond': return 'border-blue-500';
            default: return 'border-gray-300';
        }
    };

    const canViewPost = (postMembership) => {
        const membershipLevels = { free: 0, gold: 1, platinum: 2, diamond: 3 };
        return membershipLevels[user.membership] >= membershipLevels[postMembership];
    };

    const canCreatePost = () => {
        return ['platinum', 'diamond'].includes(user.membership);
    };

    const canInteract = () => {
        return user.membership !== 'free'; // Free users can only view
    };

    const handleCreatePost = () => {
        if (!canCreatePost()) {
            alert('Upgrade to Platinum or Diamond to create posts!');
            return;
        }

        if (!newPost.trim()) return;

        const post = {
            id: Date.now().toString(),
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            userMembership: user.membership,
            content: newPost,
            timestamp: new Date(),
            likes: 0,
            likedBy: [],
            comments: [],
            type: 'text',
            membershipRequired: user.membership
        };

        setPosts([post, ...posts]);
        setNewPost('');
    };

    const handleLike = (postId) => {
        if (!canInteract()) {
            alert('Upgrade your membership to interact with posts!');
            return;
        }

        setPosts(posts.map(post => {
            if (post.id === postId) {
                const isLiked = post.likedBy.includes(user.id);
                return {
                    ...post,
                    likes: isLiked ? post.likes - 1 : post.likes + 1,
                    likedBy: isLiked
                        ? post.likedBy.filter(id => id !== user.id)
                        : [...post.likedBy, user.id]
                };
            }
            return post;
        }));
    };

    const handleComment = (postId) => {
        if (!canInteract()) {
            alert('Upgrade your membership to comment on posts!');
            return;
        }

        const comment = commentText[postId];
        if (!comment?.trim()) return;

        const newComment = {
            id: Date.now().toString(),
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            content: comment,
            timestamp: new Date(),
            likes: 0,
            likedBy: [],
            replies: []
        };

        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: [...post.comments, newComment]
                };
            }
            return post;
        }));

        setCommentText({ ...commentText, [postId]: '' });
    };

    const handleReply = (postId, commentId) => {
        if (!canInteract()) {
            alert('Upgrade your membership to reply to comments!');
            return;
        }

        const reply = replyText[`${postId}-${commentId}`];
        if (!reply?.trim()) return;

        const newReply = {
            id: Date.now().toString(),
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            content: reply,
            timestamp: new Date(),
            likes: 0,
            likedBy: []
        };

        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: post.comments.map(comment => {
                        if (comment.id === commentId) {
                            return {
                                ...comment,
                                replies: [...comment.replies, newReply]
                            };
                        }
                        return comment;
                    })
                };
            }
            return post;
        }));

        setReplyText({ ...replyText, [`${postId}-${commentId}`]: '' });
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* User Info & Membership Status */}
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                <div className="flex items-center space-x-3">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className={`w-12 h-12 rounded-full border-2 ${getMembershipColor(user.membership)}`}
                    />
                    <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-800">{user.name}</h3>
                            {getMembershipIcon(user.membership)}
                            <span className="text-sm text-gray-600 capitalize">{user.membership}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                            {user.membership === 'free' && 'View-only access • Upgrade to interact'}
                            {user.membership === 'gold' && 'Gold Member • Flirts & Music unlocked'}
                            {user.membership === 'platinum' && 'Platinum Member • Can create posts'}
                            {user.membership === 'diamond' && 'Diamond Member • Full access'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Create Post (Platinum/Diamond only) */}
            {canCreatePost() && (
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-start space-x-3">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                            <textarea
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder="What's on your mind?"
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                            />
                            <div className="flex justify-between items-center mt-3">
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <Music className="w-5 h-5" />
                                    <Users className="w-5 h-5" />
                                    <span className="text-sm">Text post</span>
                                </div>
                                <button
                                    onClick={handleCreatePost}
                                    disabled={!newPost.trim()}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Post</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-4">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg shadow-md">
                        {/* Post Header */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={post.userAvatar}
                                        alt={post.userName}
                                        className={`w-10 h-10 rounded-full border-2 ${getMembershipColor(post.userMembership)}`}
                                    />
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h4 className="font-semibold text-gray-800">{post.userName}</h4>
                                            {getMembershipIcon(post.userMembership)}
                                        </div>
                                        <p className="text-sm text-gray-500">{formatTimeAgo(post.timestamp)}</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="p-4">
                            {canViewPost(post.membershipRequired) ? (
                                <div>
                                    <p className="text-gray-800 mb-3">{post.content}</p>
                                    {post.type === 'music' && (
                                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg flex items-center space-x-2">
                                            <Music className="w-5 h-5" />
                                            <span>🎵 Music content available for Gold+ members</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-gray-100 p-4 rounded-lg text-center">
                                    <Crown className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p className="text-gray-600 mb-2">This content requires {post.membershipRequired} membership</p>
                                    <button className="text-blue-500 hover:text-blue-600 font-medium">
                                        Upgrade Now
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Post Actions */}
                        {canViewPost(post.membershipRequired) && (
                            <div className="px-4 py-2 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-6">
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            className={`flex items-center space-x-2 ${post.likedBy.includes(user.id)
                                                    ? 'text-red-500'
                                                    : 'text-gray-500 hover:text-red-500'
                                                } ${!canInteract() ? 'opacity-50' : ''}`}
                                        >
                                            <Heart className={`w-5 h-5 ${post.likedBy.includes(user.id) ? 'fill-current' : ''}`} />
                                            <span>{post.likes}</span>
                                        </button>
                                        <button
                                            onClick={() => setShowComments({ ...showComments, [post.id]: !showComments[post.id] })}
                                            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            <span>{post.comments.length}</span>
                                        </button>
                                        <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
                                            <Share2 className="w-5 h-5" />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Comments Section */}
                        {showComments[post.id] && canViewPost(post.membershipRequired) && (
                            <div className="border-t border-gray-100">
                                {/* Add Comment */}
                                {canInteract() && (
                                    <div className="p-4 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div className="flex-1 flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={commentText[post.id] || ''}
                                                    onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                                                    placeholder="Write a comment..."
                                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    onClick={() => handleComment(post.id)}
                                                    className="text-blue-500 hover:text-blue-600"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Comments List */}
                                <div className="space-y-3 p-4">
                                    {post.comments.map((comment) => (
                                        <div key={comment.id} className="space-y-2">
                                            <div className="flex items-start space-x-3">
                                                <img
                                                    src={comment.userAvatar}
                                                    alt={comment.userName}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <div className="flex-1">
                                                    <div className="bg-gray-100 p-3 rounded-lg">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <span className="font-medium text-sm">{comment.userName}</span>
                                                            <span className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-800">{comment.content}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                        <button className="hover:text-red-500">Like ({comment.likes})</button>
                                                        <button
                                                            onClick={() => setShowReplies({ ...showReplies, [comment.id]: !showReplies[comment.id] })}
                                                            className="hover:text-blue-500"
                                                        >
                                                            Reply
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Reply Input */}
                                            {showReplies[comment.id] && canInteract() && (
                                                <div className="ml-11 flex items-center space-x-2">
                                                    <input
                                                        type="text"
                                                        value={replyText[`${post.id}-${comment.id}`] || ''}
                                                        onChange={(e) => setReplyText({ ...replyText, [`${post.id}-${comment.id}`]: e.target.value })}
                                                        placeholder="Write a reply..."
                                                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                    />
                                                    <button
                                                        onClick={() => handleReply(post.id, comment.id)}
                                                        className="text-blue-500 hover:text-blue-600"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Replies */}
                                            {comment.replies.map((reply) => (
                                                <div key={reply.id} className="ml-11 flex items-start space-x-3">
                                                    <img
                                                        src={reply.userAvatar}
                                                        alt={reply.userName}
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="bg-gray-50 p-2 rounded-lg">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <span className="font-medium text-xs">{reply.userName}</span>
                                                                <span className="text-xs text-gray-500">{formatTimeAgo(reply.timestamp)}</span>
                                                            </div>
                                                            <p className="text-xs text-gray-800">{reply.content}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;