import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditPost = ({ postId, onPostUpdated }) => {
  const [post, setPost] = useState({ title: '', content: '' });

  useEffect(() => {
    // Lấy bài viết cần chỉnh sửa
    if (postId) {
      axios.get(`http://localhost:5000/api/posts/${postId}`)
        .then(response => {
          setPost(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the post:", error);
        });
    }
  }, [postId]);

  const handleUpdatePost = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/posts/${postId}`, post)
      .then(response => {
        onPostUpdated(response.data);  // Truyền bài viết đã cập nhật lên component cha
      })
      .catch(error => {
        console.error("There was an error updating the post:", error);
      });
  };

  return (
    <div>
      <h2>Edit Post</h2>
      <form onSubmit={handleUpdatePost}>
        <input
          type="text"
          placeholder="Title"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
        />
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
};

export default EditPost;