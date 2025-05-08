import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Spinner } from '@app/shared/components/common/Spinner';
import { Post } from '@shared/models/post';
import { getPublicPosts } from '@shared/services/blog.service';
import BlogListItem from './BlogListItem';

const SIZE_PAGE = 7; // Number of posts per page

const BlogList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isBouncingUp, setIsBouncingUp] = useState(false); // 👈 New

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
    <div
      className={`blog-list ${isLoading ? 'is-loading' : ''} ${
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
        {isLoading && <Spinner className="spinner-sm" />}
        {!hasMore && <p className="blog-notification">No more blogs.</p>}
      </div>
    </div>
  );
};

export default BlogList;
