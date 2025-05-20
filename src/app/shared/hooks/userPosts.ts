import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  createPost,
  fetchPublicPosts,
  fetchPostById,
  resetPostDetail,
  resetPosts,
  setTagFilter,
  updatePost,
  deletePost,
  fetchUserWithPosts,
  clearUserWithPosts,
} from '@store/post/post.slice';
import { PostPayload } from '@shared/services/blog.service';
import { toast } from 'react-toastify';

export const usePosts = () => {
  const dispatch = useAppDispatch();
  const {
    posts,
    post,
    loading,
    error,
    loadingDetail,
    errorDetail,
    currentPage,
    totalPages,
    loadMore,
    tagFilter,
    userWithPosts,
    loadingUser,
    errorUser,
  } = useAppSelector((state) => state.posts);

  // Posts list + pagination
  const getPosts = useCallback(
    (page: number, size: number, tags?: string) => {
      dispatch(fetchPublicPosts({ page, size, tags }));
    },
    [dispatch]
  );

  const reset = useCallback(() => {
    dispatch(resetPosts());
  }, [dispatch]);

  const filterByTag = useCallback(
    (tag: string) => {
      dispatch(setTagFilter(tag));
    },
    [dispatch]
  );

  // Single post detail
  const fetchDetail = useCallback(
    (id?: string) => {
      if (id) dispatch(fetchPostById(id));
    },
    [dispatch]
  );

  const resetDetail = useCallback(() => {
    dispatch(resetPostDetail());
  }, [dispatch]);

  // User with posts
  const fetchUserPosts = useCallback(
    (userId: string) => {
      dispatch(fetchUserWithPosts(userId));
    },
    [dispatch]
  );

  const clearUserPosts = useCallback(() => {
    dispatch(clearUserWithPosts());
  }, [dispatch]);

  // Create new post
  const submitPost = useCallback(
    async (payload: PostPayload): Promise<boolean> => {
      try {
        await dispatch(createPost(payload)).unwrap();
        toast.success('Post created successfully!');
        return true;
      } catch (err: any) {
        toast.error(err || 'Failed to create post.');
        return false;
      }
    },
    [dispatch]
  );

  // Update post
  const submitUpdatePost = useCallback(
    async (id: string, payload: PostPayload): Promise<boolean> => {
      try {
        await dispatch(updatePost({ id, payload })).unwrap();
        toast.success('Post updated successfully!');
        return true;
      } catch (err: any) {
        toast.error(err || 'Failed to update post.');
        return false;
      }
    },
    [dispatch]
  );

  // Delete post
  const removePost = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await dispatch(deletePost(id)).unwrap();
        toast.success('Post deleted successfully!');
        return true;
      } catch (err: any) {
        toast.error(err || 'Failed to delete post.');
        return false;
      }
    },
    [dispatch]
  );

  return {
    posts,
    post,
    loading,
    error,
    loadingDetail,
    errorDetail,
    currentPage,
    totalPages,
    loadMore,
    tagFilter,

    userWithPosts,
    loadingUser,
    errorUser,

    getPosts,
    reset,
    filterByTag,
    fetchDetail,
    resetDetail,
    fetchUserPosts,
    clearUserPosts,
    submitPost,
    submitUpdatePost,
    removePost,
  };
};
