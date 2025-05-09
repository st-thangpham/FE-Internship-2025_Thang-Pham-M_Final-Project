import React from 'react';
import { Footer } from '@app/shared/components/layout';
import BlogList from './BlogList';
import RecommendedTopics from './RecommendedTopics';

const Home = () => {
  return (
    <div className="home-page">
      <div className="pages-container">
        <div className="page-inner">
          <div className="content-layout">
            <div className="main-content">
              <BlogList />
            </div>
            <aside className="sidebar">
              <RecommendedTopics />
              <Footer />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
