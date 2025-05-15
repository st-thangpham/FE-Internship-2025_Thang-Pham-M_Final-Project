import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '@app/shared/contexts/auth.context';

import moreIcon from '/icons/more.svg';

interface BlogActionMenuProps {
  postId: number;
  authorId: number;
  showAction?: boolean;
}

const BlogActionMenu: React.FC<BlogActionMenuProps> = ({
  postId,
  authorId,
  showAction = false,
}) => {
  const { user: authUser } = useContext(AuthContext)!;
  const [showDropdown, setShowDropdown] = useState(false);

  const isAuthor = authUser?.id === authorId;

  if (!showAction || !isAuthor) return null;

  return (
    <div className="blog-action-menu">
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
