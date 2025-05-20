import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { Post } from '@shared/models/post';
import { formatDate } from '@app/core/helpers/date-format.helper';
import BlogActionMenu from './BlogActionMenu';
import { AuthContext } from '@app/shared/contexts/auth.context';

import defaultAvatar from '/imgs/avatar.jpg';
import logo from '/imgs/logo.png';

interface BlogListItemProps {
  post: Post;
  isProfilePage?: boolean;
}

const BlogListItem: React.FC<BlogListItemProps> = ({
  post,
  isProfilePage = false,
}) => {
  const { user } = useContext(AuthContext)!;
  const isAuthor = user?.id === post.userId;

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = logo;
  };

  return (
    <>
      {!isProfilePage && (
        <div className="blog-author">
          <img
            src={post?.user?.picture || defaultAvatar}
            alt={post.user.displayName}
            className="author-avatar"
          />
          <Link
            className="author-name txt-link"
            to={isAuthor ? `/profile/me` : `/profile/${post.user.id}`}
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
              status={post.status}
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
