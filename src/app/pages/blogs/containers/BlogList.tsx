import React, { useEffect, useRef } from 'react';
import BlogListItem from '../components/BlogListItem';
import BlogListItemSkeleton from '../components/BlogListItemSkeleton';
import { Post } from '@shared/models/post';
import { usePosts } from '@shared/hooks/userPosts';

const SIZE_PAGE = 5;
const SIZE_SKELETON = 3;

type BlogListProps = {
  filterTag?: string;
  posts?: Post[];
  hideAuthor?: boolean;
};

const BlogList = ({
  filterTag,
  posts: propPosts,
  hideAuthor = false,
}: BlogListProps) => {
  const {
    posts,
    currentPage,
    loadMore,
    loading,
    tagFilter,
    getPosts,
    reset,
    filterByTag,
  } = usePosts();

  const bottomRef = useRef<HTMLLIElement | null>(null);
  const usingPropPosts = !!propPosts;

  // Fetch on filter tag change
  useEffect(() => {
    if (!usingPropPosts && filterTag !== tagFilter) {
      reset();
      filterByTag(filterTag || '');
      getPosts(1, SIZE_PAGE, filterTag);
    }
  }, [filterTag, usingPropPosts, tagFilter, getPosts, reset, filterByTag]);

  // Infinite scroll
  useEffect(() => {
    if (!usingPropPosts && bottomRef.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && loadMore && !loading) {
          getPosts(currentPage + 1, SIZE_PAGE, tagFilter);
        }
      });

      observer.observe(bottomRef.current);
      return () => observer.disconnect();
    }
  }, [
    bottomRef.current,
    loadMore,
    loading,
    currentPage,
    tagFilter,
    usingPropPosts,
    getPosts,
  ]);

  const renderSkeletons = (count: number) =>
    Array.from({ length: count }).map((_, i) => (
      <li className="list-item" key={`skeleton-${i}`}>
        <BlogListItemSkeleton />
      </li>
    ));

  const data = usingPropPosts ? propPosts! : posts;

  return (
    <ul className="list list-blog">
      {data.map((post, index) => {
        const isLast = index === data.length - 1;
        return (
          <li
            className="list-item"
            key={post.id}
            ref={!usingPropPosts && isLast ? bottomRef : null}
          >
            <BlogListItem post={post} hideAuthor={hideAuthor} />
          </li>
        );
      })}

      {!usingPropPosts && loading && posts.length > 0 && renderSkeletons(1)}

      {!usingPropPosts &&
        loading &&
        posts.length === 0 &&
        renderSkeletons(SIZE_SKELETON)}

      {data.length === 0 && !loading && (
        <li className="blog-notification">No blog posts found.</li>
      )}
    </ul>
  );
};

export default BlogList;
