import React from 'react';
import axios from 'axios';

const PostList = ({ posts, onPostDelete, onPostEdit }) => {
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/posts/${id}`)
      .then(() => {
        onPostDelete(id);  // Cập nhật lại danh sách bài viết sau khi xóa
      })
      .catch(error => {
        console.error("There was an error deleting the post:", error);
      });
  };

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button onClick={() => onPostEdit(post._id)}>Edit</button>
            <button onClick={() => handleDelete(post._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;