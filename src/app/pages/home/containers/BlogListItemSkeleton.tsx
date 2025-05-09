import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BlogListItemSkeleton = () => {
  return (
    <li className="list-item">
      <div className="blog-author">
        <Skeleton height={24} width={24} />
        <Skeleton height={14} width={100} />
      </div>

      <div className="blog-content">
        <div className="blog-info">
          <Skeleton height={60} width={250} />
          <Skeleton height={60} width={250} />
        </div>

        <div className="blog-cover">
          <Skeleton height={140} width={100} />
        </div>
      </div>
    </li>
  );
};

export default BlogListItemSkeleton;
