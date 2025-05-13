import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Post } from '@shared/models/post';
import { getPublicPosts } from '@shared/services/blog.service';
import BlogListItem from '../components/BlogListItem';
import BlogListItemSkeleton from '../components/BlogListItemSkeleton';

const SIZE_PAGE = 5;
const SIZE_SKELETON = 3;

type BlogListProps = {
  filterTag?: string;
};

const BlogList = ({ filterTag }: BlogListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [filterTag]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await getPublicPosts(page, SIZE_PAGE, filterTag);
        const fetchedPosts = res.data;

        setPosts((prev) => [...prev, ...fetchedPosts]);
        if (fetchedPosts.length < SIZE_PAGE) {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page, filterTag]);

  const lastPostRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    if (bottomRef.current) {
      lastPostRef(bottomRef.current);
    }
  }, [posts, lastPostRef]);

  const renderSkeletons = (count: number) =>
    Array.from({ length: count }).map((_, i) => (
      <li className="list-item" key={`skeleton-${i}`}>
        <BlogListItemSkeleton />
      </li>
    ));

  return (
    <>
      <ul className="list list-blog">
        {posts.map((post, index) => {
          const isLast = index === posts.length - 1;
          return (
            <li
              className="list-item"
              key={post.id}
              ref={isLast ? bottomRef : null}
            >
              <BlogListItem post={post} />
            </li>
          );
        })}

        {isLoading && posts.length > 0 && renderSkeletons(1)}
        {!hasMore && posts.length > 0 && (
          <li className="blog-notification">No more blogs.</li>
        )}
      </ul>

      {isLoading && posts.length === 0 && (
        <ul className="list list-blog">{renderSkeletons(SIZE_SKELETON)}</ul>
      )}
    </>
  );
};

export default BlogList;
