import React from 'react';
import { useSearchParams } from 'react-router-dom';

import BlogList from '../../blogs/containers/BlogList';
import Tags from '../components/Tags';

const Blogs = () => {
  const [searchParams] = useSearchParams();
  const tag = searchParams.get('tag') || undefined;

  return (
    <div className="page page-blogs">
      <div className="container">
        <div className="page-inner">
          <div className="content-layout">
            <Tags />
            <div className="main-content">
              <h2 className="page-title txt-bold">{tag ? tag : 'All Blogs'}</h2>
              <div className="line"></div>
              <BlogList filterTag={tag} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
