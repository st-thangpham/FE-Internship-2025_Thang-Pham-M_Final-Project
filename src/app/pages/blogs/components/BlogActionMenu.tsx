import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '@app/shared/contexts/auth.context';

import moreIcon from '/icons/more.svg';
import lockIcon from '/icons/lock.svg';
import { isPrivate } from '@babel/types';

interface BlogActionMenuProps {
  postId: number;
  authorId: number;
  showAction?: boolean;
  status: 'public' | 'private';
}

const BlogActionMenu: React.FC<BlogActionMenuProps> = ({
  postId,
  authorId,
  showAction = false,
  status,
}) => {
  const { user: authUser } = useContext(AuthContext)!;
  const [showDropdown, setShowDropdown] = useState(false);

  const isAuthor = authUser?.id === authorId;

  if (!showAction || !isAuthor) return null;

  return (
    <div className="blog-action-menu">
      {status === 'private' && (
        <div className="blog-status">
          <img src={lockIcon} alt="Lock Icon" />
        </div>
      )}
      <button
        className="btn btn-action"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        <img src={moreIcon} alt="More icon" />
      </button>

      {showDropdown && (
        <ul className="list dropdown-menu">
          <li className="list-item">
            <Link to={`/blogs/update/${postId}`}>Update</Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default BlogActionMenu;
