import React from 'react';
import { useNavigate } from 'react-router';
import { tags } from '@app/core/constants/utils';

const RecommendedTopics = () => {
  const navigate = useNavigate();
  const handleClick = (tag: string) => {
    navigate(`/blog?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="recommended-topics">
      <h3 className="title">Topics</h3>
      <ul className="tag-grid-list">
        {tags.map((tag) => (
          <li key={tag} className="tag-item" onClick={() => handleClick(tag)}>
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendedTopics;
