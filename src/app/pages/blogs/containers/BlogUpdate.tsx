import React, { useEffect, useState, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Ckeditor from '@app/shared/components/Ckeditor';
import { Select } from '@shared/components/partials/Select';
import { STATUS_OPTIONS, TAG_OPTIONS } from '@shared/contexts/constant';
import { PostService } from '@shared/services/blog.service';

type FormValues = {
  title: string;
  description: string;
  tags: { label: string; value: string }[];
  status: string;
  cover: string | null;
};

const BlogUpdate = () => {
  const [rawContent, setRawContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postService = React.useMemo(() => new PostService(), []);

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
    const firstImg = doc.querySelector('img');
    if (firstImg) firstImg.remove();

    const content = doc.body.innerHTML.trim();
    return { cover, content };
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    (async () => {
      try {
        const post = await postService.getPostById(id);

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
      } catch (error) {
        toast.error('Failed to load post data.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate, postService, setValue]);

  const handleUpdate = useCallback(async () => {
    const { title, description, tags, status } = getValues();
    const { cover, content } = parseEditorContent(rawContent);

    if (!title || title.length < 20) {
      return toast.error('Title must be at least 20 characters.');
    }

    if (!description || description.length < 20) {
      return toast.error('Description must be at least 20 characters.');
    }

    if (!content || content.length < 100) {
      return toast.error('Content must be at least 100 characters.');
    }

    if (!tags || tags.length === 0) {
      return toast.error('Please select at least one tag.');
    }

    try {
      await postService.updatePostById(id!, {
        title,
        description,
        content,
        tags: tags.map((t) => t.value),
        status: status as 'public' | 'private',
        cover,
      });

      toast.success('Post updated successfully!');
      navigate(`/blogs/${id}`);
    } catch (error) {
      toast.error('Failed to update post.');
    }
  }, [getValues, rawContent, id, navigate, postService]);

  useEffect(() => {
    const handleEvent = () => handleUpdate();
    window.addEventListener('submitBlog', handleEvent);
    return () => window.removeEventListener('submitBlog', handleEvent);
  }, [handleUpdate]);

  return (
    <div className="page-write">
      <div className="container">
        <div className="page-content">
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <Controller
                control={control}
                name="title"
                rules={{
                  required: 'Title is required',
                  minLength: {
                    value: 20,
                    message: 'Title must be at least 20 characters',
                  },
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="form-control form-title"
                    placeholder="Title"
                    rows={2}
                    disabled={loading}
                  />
                )}
              />
              {errors.title && (
                <p className="text-danger">{errors.title.message}</p>
              )}
            </div>

            <div className="form-group">
              <Controller
                control={control}
                name="description"
                rules={{
                  required: 'Description is required',
                  minLength: {
                    value: 20,
                    message: 'Description must be at least 20 characters',
                  },
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="form-control form-description"
                    placeholder="Description..."
                    rows={2}
                    disabled={loading}
                  />
                )}
              />
              {errors.description && (
                <p className="text-danger">{errors.description.message}</p>
              )}
            </div>

            <div className="row">
              <div className="col-12 col-wide-9">
                <Controller
                  control={control}
                  name="tags"
                  rules={{ required: 'Tags are required' }}
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
                      isDisabled={loading}
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
                      isDisabled={loading}
                    />
                  )}
                />
              </div>
            </div>

            {!loading && (
              <div className="form-group">
                <Ckeditor
                  value={rawContent}
                  onChange={(data) => setRawContent(data)}
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogUpdate;
