import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBlocker, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import ConfirmModal from '@shared/components/partials/ConfirmModal';
import { usePosts } from '@shared/hooks/usePosts';
import { PostPayload } from '@shared/services/blog.service';
import BlogForm, { FormValues } from '../components/BlogForm';
import { parseEditorContent } from '@app/core/helpers/parse-content-helper';

const BlogCreate = () => {
  const navigate = useNavigate();
  const { submitPost } = usePosts();

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [allowLeave, setAllowLeave] = useState(false);

  const {
    control,
    getValues,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      status: 'public',
      tags: [],
      rawContent: '',
    },
  });

  const hasDirtyFields = !!(
    dirtyFields.title ||
    dirtyFields.description ||
    dirtyFields.rawContent ||
    dirtyFields.status ||
    dirtyFields.tags
  );

  const shouldBlock = useCallback(
    () => !allowLeave && hasDirtyFields,
    [allowLeave, hasDirtyFields]
  );
  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (blocker.state === 'blocked') setShowLeaveModal(true);
  }, [blocker.state]);

  const submitBlog = async () => {
    const { tags, status, title, description, rawContent } = getValues();
    const { cover, content } = parseEditorContent(rawContent);

    if (!title || title.length < 20)
      return toast.error('Title must be at least 20 characters.');
    if (!description || description.length < 50)
      return toast.error('Description must be at least 50 characters.');
    if (!content || content.length < 100)
      return toast.error('Content must be at least 100 characters.');
    if (!cover) return toast.error('Please upload your cover.');

    const payload: PostPayload = {
      title,
      description,
      content,
      cover,
      tags: tags,
      status: status as 'public' | 'private',
    };

    const res = await submitPost(payload);
    if (res) {
      reset();
      setAllowLeave(true);
      blocker.reset();
    }
  };

  useEffect(() => {
    window.addEventListener('submitBlog', submitBlog);
    return () => window.removeEventListener('submitBlog', submitBlog);
  }, [submitBlog]);

  useEffect(() => {
    if (allowLeave) navigate('/profile/me');
  }, [allowLeave, navigate]);

  return (
    <div className="page-write">
      <div className="container">
        <div className="page-content">
          <BlogForm control={control} errors={errors} />
        </div>
      </div>

      <ConfirmModal
        isOpen={showLeaveModal}
        title="Leave this page?"
        message="You're writing a post. Are you sure you want to leave?"
        cancelLabel="Cancel"
        confirmLabel="Leave"
        onCancel={() => {
          blocker.reset();
          setShowLeaveModal(false);
        }}
        onConfirm={() => {
          blocker.proceed();
          setShowLeaveModal(false);
        }}
      />
    </div>
  );
};

export default BlogCreate;
