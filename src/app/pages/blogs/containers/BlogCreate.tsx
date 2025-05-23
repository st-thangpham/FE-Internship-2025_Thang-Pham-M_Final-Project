import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useBlocker, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Ckeditor from '@app/shared/components/partials/Ckeditor';
import { Select } from '@shared/components/partials/Select';
import { STATUS_OPTIONS, TAG_OPTIONS } from '@shared/contexts/constant';
import { PostPayload } from '@shared/services/blog.service';
import { usePosts } from '@shared/hooks/usePosts';
import ConfirmModal from '@shared/components/partials/ConfirmModal';

type FormValues = {
  title: string;
  description: string;
  tags: string[];
  status: string;
  rawContent: string;
};

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

  const shouldBlock = useCallback(() => {
    return !allowLeave && hasDirtyFields;
  }, [allowLeave, hasDirtyFields]);

  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setShowLeaveModal(true);
    }
  }, [blocker.state]);

  const parseEditorContent = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const cover = doc.querySelector('img')?.getAttribute('src') || '';
    doc.querySelector('img')?.remove();
    const content = doc.body.innerHTML.trim();
    return { cover, content };
  };

  const submitBlog = async () => {
    const { tags, status, title, description, rawContent } = getValues();
    const { cover, content } = parseEditorContent(rawContent);

    if (!title || title.length < 20) {
      return toast.error('Title must be at least 20 characters.');
    }

    if (!description || description.length < 50) {
      return toast.error('Description must be at least 50 characters.');
    }

    if (!content || content.length < 100) {
      return toast.error('Content must be at least 100 characters.');
    }

    if (!cover) {
      return toast.error('Please upload your cover.');
    }

    const payload: PostPayload = {
      title,
      description,
      content,
      cover,
      tags,
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
    if (allowLeave) {
      navigate('/profile/me');
    }
  }, [allowLeave, navigate]);

  return (
    <div className="page-write">
      <div className="container">
        <div className="page-content">
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="form-control form-title"
                    placeholder="Title"
                    rows={2}
                  />
                )}
              />
            </div>

            <div className="form-group">
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="form-control form-description"
                    placeholder="Description..."
                    rows={2}
                  />
                )}
              />
            </div>

            <div className="row">
              <div className="col-12 col-wide-9">
                <Controller
                  control={control}
                  name="tags"
                  render={({ field }) => (
                    <Select
                      name="tags"
                      label="Tags"
                      options={TAG_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      errorMsg={errors.tags?.message}
                      isRequired
                      isMulti
                      maxSelect={4}
                    />
                  )}
                />
              </div>
              <div className="col-12 col-wide-3">
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      name="status"
                      label="Status"
                      options={STATUS_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            <div className="form-group">
              <Controller
                control={control}
                name="rawContent"
                render={({ field }) => (
                  <Ckeditor value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={showLeaveModal}
        title="Leave this page?"
        message="You're writing a post. Are you sure you want to leave this page?"
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
