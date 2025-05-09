import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BlogListItemSkeleton = () => {
  return (
    <li className="list-item">
      {/* Blog Author */}
      <div className="blog-author">
        <Skeleton circle height={24} width={24} />
        <Skeleton height={14} width={100} />
      </div>

      {/* Blog Content */}
      <div className="blog-content">
        <div className="blog-info">
          <Skeleton height={24} width="80%" />
          <Skeleton height={16} width="95%" />
        </div>

        <div className="blog-cover">
          <Skeleton height="100%" width="100%" />
        </div>
      </div>
    </li>
  );
};

export default BlogListItemSkeleton;
