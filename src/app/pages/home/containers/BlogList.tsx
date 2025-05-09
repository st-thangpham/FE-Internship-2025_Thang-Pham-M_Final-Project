import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Post } from '@shared/models/post';
import { getPublicPosts } from '@shared/services/blog.service';
import BlogListItem from './BlogListItem';
import BlogListItemSkeleton from './BlogListItemSkeleton';

const SIZE_PAGE = 5; // Number of posts per page
const SIZE_SKELETON = 3;

const BlogList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isBouncingUp, setIsBouncingUp] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isBouncingUp) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore) {
          setIsBouncingUp(true);
          setTimeout(() => {
            setPage((prev) => prev + 1);
            setIsBouncingUp(false);
          }, 500);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isBouncingUp, hasMore]
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getPublicPosts(page, SIZE_PAGE);
        const newPosts = res.data;

        setPosts((prev) => [...prev, ...newPosts]);
        if (newPosts.length < SIZE_PAGE) {
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return (
    <>
      <ul
        className={`list list-blog ${isLoading ? 'is-loading' : ''} ${
          isBouncingUp ? 'bounce-up' : ''
        }`}
      >
        {posts.map((post, index) => {
          const isLast = index === posts.length - 1;
          return (
            <div ref={isLast ? lastPostRef : null} key={post.id}>
              <BlogListItem post={post} />
            </div>
          );
        })}
        <div className="blog-loading-wrapper">
          {isLoading && posts.length > 0 && <BlogListItemSkeleton />}

          {!hasMore && <p className="blog-notification">No more blogs.</p>}
        </div>
      </ul>
      {isLoading && posts.length === 0 && (
        <ul className="list list-blog">
          {Array.from({ length: SIZE_SKELETON }).map((_, i) => (
            <BlogListItemSkeleton key={i} />
          ))}
        </ul>
      )}
    </>
  );
};

export default BlogList;
