import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AuthContext } from '@app/shared/contexts/auth.context';
import ConfirmModal from '@shared/components/ConfirmModal';
import { PostService } from '@shared/services/blog.service';

import moreIcon from '/icons/more.svg';
import lockIcon from '/icons/lock.svg';

interface BlogActionMenuProps {
  postId: number;
  authorId: number;
  showAction?: boolean;
  status: 'public' | 'private';
  isDetailPage?: boolean;
}

const BlogActionMenu: React.FC<BlogActionMenuProps> = ({
  postId,
  authorId,
  showAction = false,
  status,
  isDetailPage = false,
}) => {
  const { user: authUser } = useContext(AuthContext)!;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const isAuthor = authUser?.id === authorId;
  const postService = new PostService();

  if (!showAction || !isAuthor) return null;

  const handleDelete = async () => {
    try {
      await postService.deletePost(String(postId));
      toast.success('Post deleted successfully!');

      if (isDetailPage) {
        navigate(-1);
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Delete post failed:', error);
      toast.error('Failed to delete post. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    await handleDelete();
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
