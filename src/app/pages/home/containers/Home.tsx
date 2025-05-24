import React, { useEffect } from 'react';
import BlogList from '../../blogs/containers/BlogList';
import RecommendedTopics from '../components/RecommendedTopics';
import { usePosts } from '@shared/hooks/usePosts';
import { SIZE_PAGE } from '@app/shared/contexts/constant';

const Home = () => {
  const { postList, getPosts, currentPage, reset, loading, loadMore } =
    usePosts();

  useEffect(() => {
    reset();
    getPosts(1, SIZE_PAGE, '');
  }, []);

  const handleReachEnd = () => {
    if (!loading && loadMore) {
      getPosts(currentPage + 1, SIZE_PAGE, '');
    }
  };

  return (
    <div className="page page-home">
      <div className="container">
        <div className="page-inner">
          <div className="content-layout">
            <div className="main-content">
              <section className="section section-blog">
                <BlogList
                  posts={postList}
                  loading={loading}
                  onReachEnd={handleReachEnd}
                />
              </section>
            </div>
            <aside className="sidebar">
              <RecommendedTopics />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
