import React, { useState } from 'react';
import axios from 'axios';

const AddPost = ({ onPostAdded }) => {
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const handleAddPost = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/posts', newPost)
      .then(response => {
        onPostAdded(response.data);  // Truyền bài viết mới lên component cha
        setNewPost({ title: '', content: '' });  // Làm trống form
      })
      .catch(error => {
        console.error("There was an error adding the post:", error);
      });
  };

  return (
    <div>
      <h2>Add New Post</h2>
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
    </div>
  );
};

export default AddPost;