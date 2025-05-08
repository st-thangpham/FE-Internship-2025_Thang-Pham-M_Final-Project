import React from 'react';

import { Post } from '@shared/models/post';
import defaultAvatar from '/imgs/avatar.jpg';

interface BlogListItemProps {
  post: Post;
}

const BlogListItem: React.FC<BlogListItemProps> = ({ post }) => {
  return (
    <div className="blog-list-item">
      <div className="blog-author">
        <img
          src={post.user.picture || defaultAvatar}
          alt={post.user.displayName}
          className="author-avatar"
        />
        <span className="author-name txt-link">{post.user.displayName}</span>
      </div>

      <div className="blog-content">
        <div className="blog-info">
          <h3 className="blog-title">{post.title}</h3>
          <p className="blog-description">{post.description}</p>
        </div>

        {post.cover && (
          <div className="blog-cover">
            <img src={post.cover} alt={post.title} className="cover-image" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListItem;
