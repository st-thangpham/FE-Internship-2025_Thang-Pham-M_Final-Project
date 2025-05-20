import React, { useEffect, useRef } from 'react';
import BlogListItem from '../components/BlogListItem';
import BlogListItemSkeleton from '../components/BlogListItemSkeleton';
import { Post } from '@shared/models/post';
import { usePosts } from '@shared/hooks/userPosts';
import { clearUserWithPosts } from '@store/post/post.slice';

const SIZE_PAGE = 5;
const SIZE_SKELETON = 3;

type BlogListProps = {
  filterTag?: string;
  posts?: Post[];
  isProfilePage?: boolean;
};

const BlogList = ({
  filterTag,
  posts: propPosts,
  isProfilePage = false,
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
      getPosts(1, SIZE_PAGE, filterTag || '');
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
  }, [loadMore, loading, currentPage, tagFilter, usingPropPosts, getPosts]);

  const renderSkeletons = (count: number) =>
    Array.from({ length: count }).map((_, i) => (
      <li className="list-item" key={`skeleton-${i}`}>
        <BlogListItemSkeleton />
      </li>
    ));

  const data = usingPropPosts ? propPosts! : posts;

  return (
    <ul className="list list-blog">
      {!usingPropPosts &&
        loading &&
        posts.length === 0 &&
        renderSkeletons(SIZE_SKELETON)}

      {data.map((post, index) => {
        const isLast = index === data.length - 1;
        return (
          <li
            className="list-item"
            key={post.id}
            ref={!usingPropPosts && isLast ? bottomRef : null}
          >
            <BlogListItem post={post} isProfilePage={isProfilePage} />
          </li>
        );
      })}

      {!usingPropPosts && loading && posts.length > 0 && renderSkeletons(1)}

      {data.length === 0 && !loading && (
        <li className="blog-notification">No blog posts found.</li>
      )}
    </ul>
  );
};

export default BlogList;
