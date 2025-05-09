import React from 'react';

const tags = [
  'Programming',
  'Self Improvement',
  'Data Science',
  'Writing',
  'Relationships',
  'Technology',
  'Politics',
];

const RecommendedTopics = () => (
  <div className="recommended-topics">
    <h3 className="title">Recommended topics</h3>
    <ul className="tag-list">
      {tags.map((tag) => (
        <li key={tag} className="tag-item">
          {tag}
        </li>
      ))}
    </ul>
  </div>
);

export default RecommendedTopics;
