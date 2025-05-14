import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { formatDate } from '@app/core/helpers/date-format.helper';
import { Post } from '@shared/models/post';
import { PostService } from '@shared/services/blog.service';

import defaultAvatar from '/imgs/avatar.jpg';
import defaultCover from '/imgs/logo.png';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const postService = new PostService();

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await postService.getPostById(id);
        setPost(response);
      } catch (error) {
        console.error('Failed to load post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const getCoverImage = () => {
    if (!post?.cover || post.cover === 'cover') return defaultCover;
    return post.cover;
  };

  const handleClick = (tag: string) => {
    navigate(`/blogs?tag=${encodeURIComponent(tag)}`);
  };

  if (loading) {
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

  if (!post) {
    return (
      <div className="page page-blog-detail not-found">
        <h2>Blog Post Not Found</h2>
        <p>The post you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="page page-blog-detail">
      <article className="blog">
        <div className="blog-header">
          <h2 className="title">{post.title}</h2>
          <h3 className="description">{post.description}</h3>

          <div className="blog-author">
            <div className="author-img">
              <img
                src={post.user.picture || defaultAvatar}
                alt={post.user.displayName}
                className="author-avatar"
              />
              <span className="author-name txt-link">
                {post.user.displayName}
              </span>
            </div>
            <span className="created-date">{formatDate(post.createdAt)}</span>
          </div>
        </div>

        <div className="line"></div>

        {post.cover && (
          <div className="blog-cover">
            <div className="cover-wrapper">
              <img src={getCoverImage()} alt="Cover" className="cover-image" />
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
                <li
                  key={index}
                  className="tag-item"
                  onClick={() => handleClick(tag)}
                >
                  #{tag}
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogDetail;
