import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  useEffect(() => {
    // Lấy danh sách bài viết
    axios.get('http://localhost:5000/api/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching posts:", error);
      });
  }, []);

  const handleAddPost = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/posts', newPost)
      .then(response => {
        setPosts([...posts, response.data]);
        setNewPost({ title: '', content: '' });
      })
      .catch(error => {
        console.error("There was an error adding the post:", error);
      });
  };

  return (
    <div>
      <h1>Content Management System</h1>
      <form onSubmit={handleAddPost}>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        />
        <button type="submit">Add Post</button>
      </form>
      
      <h2>Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;