import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Post } from '@shared/models/post';
import { PostService } from '@shared/services/blog.service';
import BlogListItem from '../components/BlogListItem';
import BlogListItemSkeleton from '../components/BlogListItemSkeleton';

const SIZE_PAGE = 5;
const SIZE_SKELETON = 3;

type BlogListProps = {
  filterTag?: string;
  userId?: string;
  posts?: Post[];
  hideAuthor?: boolean;
};

const BlogList = ({
  filterTag,
  userId,
  posts: propPosts,
  hideAuthor = false,
}: BlogListProps) => {
  const [posts, setPosts] = useState<Post[]>(propPosts || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const postService = new PostService();

  const observer = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (!propPosts && !userId) {
      setPosts([]);
      setPage(1);
      setHasMore(true);
    }
  }, [filterTag]);

  useEffect(() => {
    if (propPosts) {
      setPosts(propPosts);
      setHasMore(false);
      return;
    }

    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await postService.getPublicPosts(
          page,
          SIZE_PAGE,
          filterTag
        );
        const fetchedPosts = res.data;
        setPosts((prev) => [...prev, ...fetchedPosts]);
        if (fetchedPosts.length < SIZE_PAGE) setHasMore(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!propPosts && !userId) fetchPosts();
  }, [page, filterTag, userId, propPosts]);

  useEffect(() => {
    if (!propPosts && bottomRef.current) {
      const observerInstance = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      });

      observerInstance.observe(bottomRef.current);
      return () => observerInstance.disconnect();
    }

    window.scrollTo(0, 0);
  }, [posts, hasMore, isLoading, propPosts]);

  const renderSkeletons = (count: number) =>
    Array.from({ length: count }).map((_, i) => (
      <li className="list-item" key={`skeleton-${i}`}>
        <BlogListItemSkeleton />
      </li>
    ));

  return (
    <ul className="list list-blog">
      {posts.map((post, index) => {
        const isLast = index === posts.length - 1;
        return (
          <li
            className="list-item"
            key={post.id}
            ref={!propPosts && isLast ? bottomRef : null}
          >
            <BlogListItem post={post} hideAuthor={hideAuthor} />
          </li>
        );
      })}

      {isLoading && posts.length > 0 && renderSkeletons(1)}

      {!hasMore && posts.length > 0 && (
        <li className="blog-notification">No more blogs.</li>
      )}

      {isLoading && posts.length === 0 && renderSkeletons(SIZE_SKELETON)}

      {!isLoading && posts.length === 0 && (
        <li className="blog-notification">No blog posts found for this tag.</li>
      )}
    </ul>
  );
};

export default BlogList;
