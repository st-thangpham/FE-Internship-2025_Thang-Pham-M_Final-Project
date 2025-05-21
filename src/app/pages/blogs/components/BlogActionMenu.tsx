import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ConfirmModal from '@shared/components/partials/ConfirmModal';
import { usePosts } from '@shared/hooks/userPosts';
import { AuthContext } from '@app/shared/contexts/auth.context';

import moreIcon from '/icons/more.svg';
import lockIcon from '/icons/lock.svg';

interface BlogActionMenuProps {
  postId: number;
  authorId: number;
  showAction?: boolean;
  status: 'public' | 'private';
  isDetailPage?: boolean;
  isProfilePage?: boolean;
}

const BlogActionMenu: React.FC<BlogActionMenuProps> = ({
  postId,
  authorId,
  showAction = false,
  status,
  isDetailPage = false,
}) => {
  const { userId } = useContext(AuthContext)!;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const isAuthor = userId === authorId;

  const { removePost } = usePosts();

  if (!showAction || !isAuthor) return null;

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    const success = await removePost(String(postId));
    if (success) {
      if (isDetailPage) {
        navigate(-1);
      }
    }
  };

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
            <Link
              to={`/blogs/update/${postId}`}
              onClick={() => setShowDropdown(false)}
            >
              Update
            </Link>
          </li>
          <li
            className="list-item"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setShowDropdown(false);
              setShowConfirm(true);
            }}
          >
            Delete
          </li>
        </ul>
      )}

      {showConfirm && (
        <ConfirmModal
          isOpen={showConfirm}
          title="Delete Post"
          message="Are you sure you want to delete this post? This action cannot be undone."
          cancelLabel="Cancel"
          confirmLabel="Delete"
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default BlogActionMenu;
