import React from 'react';
import BlogList from './BlogList';

const Home = () => {
  return (
    <div className="home-page">
      <div className="container">
        <div className="page-inner">
          <BlogList />
        </div>
      </div>
    </div>
  );
};

export default Home;
