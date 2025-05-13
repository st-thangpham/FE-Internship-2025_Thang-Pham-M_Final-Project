import React from 'react';

const BlogListItemSkeleton: React.FC = () => {
  return (
    <>
      <div className="blog-author">
        <div className="skeleton skeleton-avatar author-avatar" />
        <div className="skeleton skeleton-author-name author-name" />
      </div>

      <div className="blog-content">
        <div className="blog-info">
          <div className="skeleton skeleton-title blog-title" />
          <div className="skeleton skeleton-description blog-description" />
          <div className="skeleton skeleton-date blog-created-at" />
        </div>

        <div className="blog-cover">
          <div className="skeleton skeleton-cover cover-image" />
        </div>
      </div>
    </>
  );
};

export default BlogListItemSkeleton;
