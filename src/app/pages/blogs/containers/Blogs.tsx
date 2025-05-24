import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import BlogList from '../../blogs/containers/BlogList';
import Tags from '../components/Tags';
import { usePosts } from '@shared/hooks/usePosts';
import { SIZE_PAGE } from '@app/shared/contexts/constant';

const Blogs = () => {
  const [searchParams] = useSearchParams();
  const tag = searchParams.get('tag') || '';

  const {
    postList,
    getPosts,
    reset,
    filterByTag,
    currentPage,
    loading,
    loadMore,
  } = usePosts();

  useEffect(() => {
    reset();
    filterByTag(tag);
    getPosts(1, SIZE_PAGE, tag);
  }, [tag]);

  const handleReachEnd = () => {
    if (!loading && loadMore) {
      getPosts(currentPage + 1, SIZE_PAGE, tag);
    }
  };

  return (
    <div className="page page-blogs">
      <div className="container">
        <div className="page-inner">
          <div className="content-layout">
            <Tags />
            <div className="main-content">
              <h2 className="page-title txt-bold">{tag || 'All Blogs'}</h2>
              <div className="line"></div>
              <BlogList
                posts={postList}
                loading={loading}
                onReachEnd={handleReachEnd}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
