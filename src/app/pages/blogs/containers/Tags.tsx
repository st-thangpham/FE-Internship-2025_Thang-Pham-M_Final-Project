import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { tags } from '@app/core/constants/utils';

const Tags = () => {
  const navigate = useNavigate();
  const listRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const checkScroll = () => {
    if (listRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = listRef.current;
      setAtStart(scrollLeft <= 0);
      setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    }
  };

  const handleClick = (tag: string) => {
    navigate(`/blog?tag=${encodeURIComponent(tag)}`);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (listRef.current) {
      const scrollAmount = 150;
      listRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = listRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll);
      return () => ref.removeEventListener('scroll', checkScroll);
    }
  }, []);

  return (
    <div className="tags-wrapper">
      {!atStart && (
        <button
          className="btn btn-scroll left"
          onClick={() => scroll('left')}
        ></button>
      )}

      <div className="tag-slider-container">
        <ul className="tag-slider-list" ref={listRef}>
          {tags.map((tag) => (
            <li key={tag} className="tag-item" onClick={() => handleClick(tag)}>
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {!atEnd && (
        <button
          className="btn btn-scroll right"
          onClick={() => scroll('right')}
        ></button>
      )}
    </div>
  );
};

export default Tags;
