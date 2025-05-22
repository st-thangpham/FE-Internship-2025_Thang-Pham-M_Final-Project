import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import { formatDate } from '@app/core/helpers/date-format.helper';
import BlogActionMenu from '../components/BlogActionMenu';
import { usePosts } from '@app/shared/hooks/userPosts';

import defaultAvatar from '/imgs/avatar.jpg';
import defaultCover from '/imgs/logo.png';
import likeIcon from '/icons/like.svg';
import commentIcon from '/icons/comment.svg';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { post, loadingDetail, fetchDetail, resetDetail } = usePosts();

  useEffect(() => {
    fetchDetail(id);
    return () => {
      resetDetail();
    };
  }, [fetchDetail, resetDetail]);

  const getCoverImage = () => {
    if (!post?.cover || post.cover === 'cover') return defaultCover;
    return post.cover;
  };

  if (loadingDetail) {
    return (
      <div className="page page-blog-detail">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-description" />
        <div className="skeleton skeleton-meta" />
        <div className="skeleton skeleton-hero-cover" />
        <div className="skeleton skeleton-content" />
      </div>
    );
  }

  if (!loadingDetail && !post) {
    return (
      <div className="page page-blog-detail not-found">
        <h2>Blog Post Not Found</h2>
        <p>The post you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="page page-blog-detail">
      <div className="container">
        <article className="blog">
          <div className="blog-header">
            <h2 className="blog-title">{post.title}</h2>
            <h3 className="blog-description">{post.description}</h3>

            <div className="blog-author">
              <div className="author-info">
                <img
                  src={post.user.picture || defaultAvatar}
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
              <span className="blog-stat">{formatDate(post.createdAt)}</span>
            </div>
            <div className="blog-actions">
              <div className="blog-stats">
                <span className="blog-stat">
                  <img
                    className="blog-stat-icon"
                    src={likeIcon}
                    alt="Like icon"
                  />
                  {post.likes}
                </span>
                <span className="blog-stat">
                  <img
                    className="blog-stat-icon"
                    src={commentIcon}
                    alt="Comment icon"
                  />
                  {post.comments}
                </span>
              </div>
              <BlogActionMenu
                postId={post.id}
                authorId={post.userId}
                showAction={true}
                status={post.status}
                isDetailPage={true}
              />
            </div>
          </div>

          <div className="line"></div>

          {post.cover && (
            <div className="blog-cover">
              <div className="cover-wrapper">
                <img
                  src={getCoverImage()}
                  alt="Cover"
                  className="cover-image"
                />
              </div>
            </div>
          )}

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags?.length > 0 && (
            <div className="blog-tags">
              <h4 className="tag-title">Tags</h4>
              <ul className="tag-grid-list">
                {post.tags.map((tag, index) => (
                  <li key={index} className="tag-item">
                    <Link to={`/blogs?tag=${encodeURIComponent(tag)}`}>
                      #{tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
