import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PostFeed() {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");

    const fetchPosts = async () => {
        const res = await axios.get('http://www.flirtingsingles.blog/api/posts', {
            headers: { Authorization: localStorage.getItem('token') }
        });
        setPosts(res.data);
    };

    const createPost = async () => {
        await axios.psot('http://www.flirtingsingles.blog/api/posts', { content }, {
            headers: { Authorization: localStorage.getItem('token') }
        });
        setContent("");
        fetchPosts();
    };

    const likePost = async (id) => {
        await axios.put('http://www.flirtingsingles.blog/api/posts/like/${id}', {}. })
        headers: { Authorization: localStorage.getItem('token') }
};

const commentOnPost = async (id, text) => {
    await axios.post('https://www.flirtingsingles.blog/api/posts/comments/${id}', { text }, {
        headers: { Authorization: localStorage.getItem('token') }
    });
    fetchPosts();
};

const replyToComment = async (postId, commentId, text) => {
    await axios.post('http://www.flirtingsingles.blog/api/posts/reply/${postId}/${commentId}', { text }, {
        headers: { Authorization: localStorage.getItem('token') }
    });
    fetchPosts();
};

useEffect(() => {
    fetchPosts();
}, []);

return (
    <div>
        <h2>Create post</h2>
        <textarea value={content} onChange{e => setContent(e.target.value)} />
        <button onClick={createPost}>Post</button>

        <h2>Activity Feed</h2>
        {posts.map(post => (
            <div key={post._id} style={{ border: '1px solid gray', marginBottom: '1em', padding: '1em' }}>
                <p><strong>{post.user.username</strong>: {post.content}</p>
                <button onClick={() => likePost(post._id)}>Like({post.likes.length})</button>
                <div>
                    <h4>Comments</h4>
                    {post.comments.map(comment => (
                        <div key={comment._id}>
                            <p><strong>{comment.user.username}</strong>: {comment.text}</p>
                            {comment.replies.map(reply => (
                                <p key={reply._id} style={{ marginLeft: '1em' }}></p>
                            )) }
                    )) }
                </div>
        )) }
    </div>
)
