import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Ckeditor from '@app/shared/components/partials/Ckeditor';
import { Select } from '@shared/components/partials/Select';
import { STATUS_OPTIONS, TAG_OPTIONS } from '@shared/contexts/constant';
import ConfirmModal from '@app/shared/components/partials/ConfirmModal';
import { usePosts } from '@shared/hooks/userPosts';

type FormValues = {
  title: string;
  description: string;
  tags: { label: string; value: string }[];
  status: string;
  cover: string | null;
};

const BlogUpdate = () => {
  const [rawContent, setRawContent] = useState('');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const { post, fetchDetail, loadingDetail, resetDetail, submitUpdatePost } =
    usePosts();

  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      status: 'public',
      tags: [],
      cover: null,
    },
  });

  const parseEditorContent = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const cover = doc.querySelector('img')?.getAttribute('src') || '';
    doc.querySelector('img')?.remove();
    const content = doc.body.innerHTML.trim();
    return { cover, content };
  };

  useEffect(() => {
    if (!id) return;
    fetchDetail(id);
    return () => resetDetail();
  }, [id, fetchDetail, resetDetail]);

  useEffect(() => {
    if (!post || !post.title) return;

    const mappedTags = (post.tags || [])
      .map((tag: string) => TAG_OPTIONS.find((opt) => opt.value === tag))
      .filter(Boolean) as { label: string; value: string }[];

    setValue('title', post.title);
    setValue('description', post.description || '');
    setValue('status', post.status);
    setValue('tags', mappedTags);
    setValue('cover', post.cover);

    const contentWithCover = post.cover
      ? `<img src="${post.cover}" alt="Cover Image" />${post.content || ''}`
      : post.content || '';

    setRawContent(contentWithCover);
  }, [post, setValue]);

  const handleUpdate = async () => {
    const { title, description, tags, status } = getValues();
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

    if (!tags || tags.length === 0) {
      return toast.error('Please select at least one tag.');
    }

    const payload = {
      title,
      description,
      content,
      tags: tags.map((t) => t.value),
      status: status as 'public' | 'private',
      cover,
    };

    const success = await submitUpdatePost(id!, payload);
    if (success) {
      navigate(`/blogs/${id}`);
    }
  };

  const handleConfirmUpdate = async () => {
    setShowConfirm(false);
    await handleUpdate();
  };

  useEffect(() => {
    const handleEvent = () => setShowConfirm(true);
    window.addEventListener('submitBlog', handleEvent);
    return () => window.removeEventListener('submitBlog', handleEvent);
  }, []);

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
                    disabled={loadingDetail}
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
                    disabled={loadingDetail}
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
                      value={field.value.map((t) => t.value)}
                      onChange={(e) => {
                        const selected = e.target.value as string[];
                        const selectedOptions = TAG_OPTIONS.filter((opt) =>
                          selected.includes(opt.value)
                        );
                        field.onChange(selectedOptions);
                      }}
                      errorMsg={errors.tags?.message}
                      isMulti
                      maxSelect={4}
                      isDisabled={loadingDetail}
                    />
                  )}
                />
              </div>

              <div className="col-12 col-wide-3">
                <Controller
                  control={control}
                  name="status"
                  rules={{ required: 'Status is required' }}
                  render={({ field }) => (
                    <Select
                      name="status"
                      label="Status"
                      options={STATUS_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      errorMsg={errors.status?.message}
                      isDisabled={loadingDetail}
                    />
                  )}
                />
              </div>
            </div>

            {!loadingDetail && (
              <div className="form-group">
                <Ckeditor
                  value={rawContent}
                  onChange={(val) => setRawContent(val)}
                />
              </div>
            )}
          </form>
        </div>
      </div>
      {showConfirm && (
        <ConfirmModal
          isOpen={showConfirm}
          title="Update Post"
          message="Are you sure you want to update this post?"
          cancelLabel="Cancel"
          confirmLabel="Update"
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleConfirmUpdate}
        />
      )}
    </div>
  );
};

export default BlogUpdate;
