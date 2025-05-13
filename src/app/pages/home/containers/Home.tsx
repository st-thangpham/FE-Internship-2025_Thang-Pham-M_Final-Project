import React from 'react';
import { Footer } from '@app/shared/components/layout';
import BlogList from '../../blogs/containers/BlogList';
import RecommendedTopics from './RecommendedTopics';

const Home = () => {
  return (
    <div className="page page-home">
      <div className="container">
        <div className="page-inner">
          <div className="content-layout">
            <div className="main-content">
              <section className="section section-blog">
                <BlogList />
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
