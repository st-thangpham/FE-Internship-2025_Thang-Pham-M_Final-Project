import React from 'react';

import { Post } from '@shared/models/post';

import defaultAvatar from '/imgs/avatar.jpg';
import logo from '/imgs/logo.png';

interface BlogListItemProps {
  post: Post;
}

const BlogListItem: React.FC<BlogListItemProps> = ({ post }) => {
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = logo;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');

    if (date.getFullYear() === now.getFullYear()) {
      return `${day}/${month}`;
    }

    return `${day}/${month}/${date.getFullYear()}`;
  };

  return (
    <>
      <div className="blog-author">
        <img
          src={post.user.picture || defaultAvatar}
          alt={post.user.displayName}
          className="author-avatar"
        />
        <span className="author-name txt-link">{post.user.displayName}</span>
      </div>

      <a className="blog-content">
        <div className="blog-info">
          <h3 className="blog-title">{post.title}</h3>
          <p className="blog-description">{post.description}</p>
          <p className="blog-created-at">{formatDate(post.createdAt)}</p>
        </div>

        {post.cover && (
          <div className="blog-cover">
            <img
              src={post.cover}
              alt="Blog's Cover"
              className="cover-image"
              onError={handleImageError}
            />
          </div>
        )}
      </a>
    </>
  );
};

export default BlogListItem;
