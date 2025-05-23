import React, { useRef, useEffect } from 'react';
import BlogListItem from '../components/BlogListItem';
import BlogListItemSkeleton from '../components/BlogListItemSkeleton';
import { Post } from '@shared/models/post';

type BlogListProps = {
  posts: Post[];
  loading?: boolean;
  isProfilePage?: boolean;
  onReachEnd?: () => void;
};

const BlogList = ({
  posts,
  loading = false,
  isProfilePage = false,
  onReachEnd,
}: BlogListProps) => {
  const bottomRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (!onReachEnd || !bottomRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onReachEnd();
      }
    });

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [onReachEnd]);

  const renderSkeletons = (count: number) =>
    Array.from({ length: count }).map((_, i) => (
      <li className="list-item" key={`skeleton-${i}`}>
        <BlogListItemSkeleton />
      </li>
    ));

  return (
    <ul className="list list-blog">
      {loading && posts.length === 0 && renderSkeletons(3)}

      {posts.map((post, index) => {
        const isLast = index === posts.length - 1;
        return (
          <li
            className="list-item"
            key={post.id}
            ref={isLast ? bottomRef : null}
          >
            <BlogListItem post={post} isProfilePage={isProfilePage} />
          </li>
        );
      })}

      {loading && posts.length > 0 && renderSkeletons(1)}

      {!loading && posts.length === 0 && (
        <li className="blog-notification">No blog posts found.</li>
      )}
    </ul>
  );
};

export default BlogList;
