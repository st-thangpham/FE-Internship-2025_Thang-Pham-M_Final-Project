import React from 'react';

import { Post } from '@shared/models/post';
import { formatDate } from '@app/core/helpers/date-format.helper';

import defaultAvatar from '/imgs/avatar.jpg';
import logo from '/imgs/logo.png';
import BlogActionMenu from './BlogActionMenu';
import { Link } from 'react-router';

interface BlogListItemProps {
  post: Post;
  hideAuthor?: boolean;
}

const BlogListItem: React.FC<BlogListItemProps> = ({
  post,
  hideAuthor = false,
}) => {
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = logo;
  };

  return (
    <>
      {!hideAuthor && (
        <div className="blog-author">
          <img
            src={post?.user?.picture || defaultAvatar}
            alt={post.user.displayName}
            className="author-avatar"
          />
          <Link
            className="author-name txt-link"
            to={`/profile/${post.user.id}`}
          >
            {post.user.displayName}
          </Link>
        </div>
      )}

      <div className="blog-content">
        <div className="blog-info">
          <Link className="blog-link" to={`/blogs/${post.id}`}>
            <h3 className="blog-title">{post.title}</h3>
            <p className="blog-description">{post.description}</p>
          </Link>
          <div className="blog-actions">
            <span className="blog-created-at">
              {formatDate(post.createdAt)}
            </span>
            <BlogActionMenu
              postId={post.id}
              authorId={post.userId}
              showAction={true}
            />
          </div>
        </div>

        {post.cover && (
          <Link className="blog-cover blog-link" to={`/blogs/${post.id}`}>
            <img
              src={post.cover}
              alt="Blog's Cover"
              className="cover-image"
              onError={handleImageError}
            />
          </Link>
        )}
      </div>
    </>
  );
};

export default BlogListItem;
