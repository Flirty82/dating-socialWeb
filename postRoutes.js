const express = require('express');
const { getPosts, createPost, updatePost, deletePost } = require('../controllers/postController');
const router = express.Router();
const User = require('../models/userModel');
const Post = require('../models/postModel');

// Create a new post
router.post('/', async (req, res) => {
    const { userId, content, mediaUrl, mediaType } = req.body;

    const newPost = new Post({ userId, content, mediaUrl, mediaType });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    const posts = await Post.find().populate('userId', 'username profilePicture');
    res.json(posts);
});

// Update a post
router.put('/:id', async (req, res) => {
    const { content, mediaUrl, mediaType } = req.body;
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { content, mediaUrl, mediaType },
            { new: true }
        );
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
});

// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const membershipCheck = require('../middleware/membershipCheck');

// GET /api/posts - Get all posts for activity feed
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Post.find({ isActive: true })
      .populate('author', 'username profile.firstName profile.lastName profile.avatar membership')
      .populate('comments.author', 'username profile.firstName profile.lastName profile.avatar')
      .populate('comments.replies.author', 'username profile.firstName profile.lastName profile.avatar')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Filter posts based on user's membership level
    const filteredPosts = posts.filter(post => post.canUserView(user.membership));

    // Format posts for frontend
    const formattedPosts = filteredPosts.map(post => ({
      id: post._id,
      userId: post.author._id,
      userName: post.author.fullName || post.author.username,
      userAvatar: post.author.profile.avatar,
      userMembership: post.author.membership,
      content: post.content,
      type: post.type,
      mediaUrl: post.mediaUrl,
      membershipRequired: post.membershipRequired,
      timestamp: post.createdAt,
      likes: post.likeCount,
      likedBy: post.likes.map(like => like.user.toString()),
      comments: post.comments.map(comment => ({
        id: comment._id,
        userId: comment.author._id,
        userName: comment.author.fullName || comment.author.username,
        userAvatar: comment.author.profile.avatar,
        content: comment.content,
        timestamp: comment.createdAt,
        likes: comment.likes.length,
        likedBy: comment.likes.map(like => like.user.toString()),
        replies: comment.replies.map(reply => ({
          id: reply._id,
          userId: reply.author._id,
          userName: reply.author.fullName || reply.author.username,
          userAvatar: reply.author.profile.avatar,
          content: reply.content,
          timestamp: reply.createdAt,
          likes: reply.likes.length,
          likedBy: reply.likes.map(like => like.user.toString())
        }))
      })),
      isPinned: post.isPinned,
      canView: post.canUserView(user.membership),
      canInteract: user.membership !== 'free'
    }));

    res.json({
      posts: formattedPosts,
      pagination: {
        currentPage: page,
        hasMore: posts.length === limit
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// POST /api/posts - Create a new post (Platinum/Diamond only)
router.post('/', auth, membershipCheck(['platinum', 'diamond']), async (req, res) => {
  try {
    const { content, type = 'text', mediaUrl, membershipRequired = 'free' } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const user = await User.findById(req.user.id);
    
    const post = new Post({
      author: req.user.id,
      content: content.trim(),
      type,
      mediaUrl,
      membershipRequired: membershipRequired || user.membership
    });

    await post.save();
    
    // Populate author info
    await post.populate('author', 'username profile.firstName profile.lastName profile.avatar membership');

    const formattedPost = {
      id: post._id,
      userId: post.author._id,
      userName: post.author.fullName || post.author.username,
      userAvatar: post.author.profile.avatar,
      userMembership: post.author.membership,
      content: post.content,
      type: post.type,
      mediaUrl: post.mediaUrl,
      membershipRequired: post.membershipRequired,
      timestamp: post.createdAt,
      likes: 0,
      likedBy: [],
      comments: [],
      isPinned: false,
      canView: true,
      canInteract: true
    };

    res.status(201).json(formattedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// POST /api/posts/:id/like - Like/Unlike a post
router.post('/:id/like', auth, membershipCheck(['gold', 'platinum', 'diamond']), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const user = await User.findById(req.user.id);
    
    if (!post.canUserView(user.membership)) {
      return res.status(403).json({ error: 'Insufficient membership to view this post' });
    }

    const isLiked = post.isLikedBy(req.user.id);
    
    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);
    } else {
      // Like
      post.likes.push({ user: req.user.id });
      
      // Create notification if not liking own post
      if (post.author.toString() !== req.user.id) {
        const notification = new Notification({
          recipient: post.author,
          sender: req.user.id,
          type: 'like',
          message: `${user.fullName || user.username} liked your post`,
          relatedPost: post._id
        });
        await notification.save();
      }
    }

    await post.save();

    res.json({
      liked: !isLiked,
      likeCount: post.likeCount,
      likedBy: post.likes.map(like => like.user.toString())
    });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// POST /api/posts/:id/comment - Add a comment to a post
router.post('/:id/comment', auth, membershipCheck(['gold', 'platinum', 'diamond']), async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const user = await User.findById(req.user.id);
    
    if (!post.canUserView(user.membership)) {
      return res.status(403).json({ error: 'Insufficient membership to view this post' });
    }

    const comment = {
      author: req.user.id,
      content: content.trim(),
      likes: [],
      replies: []
    };

    post.comments.push(comment);
    await post.save();

    // Populate the new comment
    await post.populate('comments.author', 'username profile.firstName profile.lastName profile.avatar');
    
    const newComment = post.comments[post.comments.length - 1];

    // Create notification if not commenting on own post
    if (post.author.toString() !== req.user.id) {
      const notification = new Notification({
        recipient: post.author,
        sender: req.user.id,
        type: 'comment',
        message: `${user.fullName || user.username} commented on your post`,
        relatedPost: post._id,
        relatedComment: newComment._id
      });
      await notification.save();
    }

    const formattedComment = {
      id: newComment._id,
      userId: newComment.author._id,
      userName: newComment.author.fullName || newComment.author.username,
      userAvatar: newComment.author.profile.avatar,
      content: newComment.content,
      timestamp: newComment.createdAt,
      likes: 0,
      likedBy: [],
      replies: []
    };

    res.status(201).json(formattedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// POST /api/posts/:postId/comment/:commentId/reply - Add a reply to a comment
router.post('/:postId/comment/:commentId/reply', auth, membershipCheck(['gold', 'platinum', 'diamond']), async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Reply content is required' });
    }

    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const user = await User.findById(req.user.id);
    
    if (!post.canUserView(user.membership)) {
      return res.status(403).json({ error: 'Insufficient membership to view this post' });
    }

    const comment = post.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const reply = {
      author: req.user.id,
      content: content.trim(),
      likes: []
    };

    comment.replies.push(reply);
    await post.save();

    // Populate the new reply
    await post.populate('comments.replies.author', 'username profile.firstName profile.lastName profile.avatar');
    
    const newReply = comment.replies[comment.replies.length - 1];

    // Create notification if not replying to own comment
    if (comment.author.toString() !== req.user.id) {
      const notification = new Notification({
        recipient: comment.author,
        sender: req.user.id,
        type: 'reply',
        message: `${user.fullName || user.username} replied to your comment`,
        relatedPost: post._id,
        relatedComment: comment._id
      });
      await notification.save();
    }

    const formattedReply = {
      id: newReply._id,
      userId: newReply.author._id,
      userName: newReply.author.fullName || newReply.author.username,
      userAvatar: newReply.author.profile.avatar,
      content: newReply.content,
      timestamp: newReply.createdAt,
      likes: 0,
      likedBy: []
    };

    res.status(201).json(formattedReply);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ error: 'Failed to add reply' });
  }
});

// DELETE /api/posts/:id - Delete a post (author only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    post.isActive = false;
    await post.save();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;

// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists with this email or username' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      profile: {
        firstName,
        lastName
      }
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.fullName,
        avatar: user.profile.avatar,
        membership: user.membership
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.fullName,
        avatar: user.profile.avatar,
        membership: user.membership
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.fullName,
      avatar: user.profile.avatar,
      membership: user.membership,
      membershipExpiry: user.membershipExpiry,
      joinDate: user.joinDate,
      profile: user.profile
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

module.exports = router;

// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = { id: user._id };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;

// middleware/membershipCheck.js
const User = require('../models/User');

const membershipCheck = (allowedMemberships) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if membership is active
      if (!user.isMembershipActive()) {
        return res.status(403).json({ 
          error: 'Membership expired',
          membership: user.membership 
        });
      }

      // Check if user has required membership level
      if (!allowedMemberships.includes(user.membership)) {
        return res.status(403).json({ 
          error: 'Insufficient membership level',
          required: allowedMemberships,
          current: user.membership
        });
      }

      next();
    } catch (error) {
      console.error('Membership check error:', error);
      res.status(500).json({ error: 'Failed to verify membership' });
    }
  };
};

module.exports = membershipCheck;