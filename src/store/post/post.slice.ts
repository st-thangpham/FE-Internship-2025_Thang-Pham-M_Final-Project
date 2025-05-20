import { UserWithPosts } from '@app/shared/models/user';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PostResponse, Post } from '@shared/models/post';
import { PostPayload, PostService } from '@shared/services/blog.service';

const postService = new PostService();

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  loadMore: boolean;
  tagFilter: string;

  post: Post | null;
  loadingDetail: boolean;
  errorDetail: string | null;

  userWithPosts: UserWithPosts | null;
  loadingUser: boolean;
  errorUser: string | null;
}

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  loadMore: true,
  tagFilter: '',

  post: null,
  loadingDetail: false,
  errorDetail: null,

  userWithPosts: null,
  loadingUser: false,
  errorUser: null,
};

export const fetchPublicPosts = createAsyncThunk<
  PostResponse,
  { page: number; size: number; tags?: string },
  { rejectValue: string }
>('posts/fetchPublicPosts', async ({ page, size, tags }, thunkAPI) => {
  try {
    return await postService.getPublicPosts(page, size, tags);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch posts');
  }
});

export const fetchPostById = createAsyncThunk<
  Post,
  string,
  { rejectValue: string }
>('posts/fetchPostById', async (id, thunkAPI) => {
  try {
    return await postService.getPostById(id);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch post');
  }
});

export const createPost = createAsyncThunk<
  Post,
  PostPayload,
  { rejectValue: string }
>('post/createPost', async (payload, { rejectWithValue }) => {
  try {
    const response = await postService.createPost(payload);
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to create post');
  }
});

export const updatePost = createAsyncThunk<
  Post,
  { id: string; payload: PostPayload },
  { rejectValue: string }
>('post/updatePost', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await postService.updatePostById(id, payload);
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to update post');
  }
});

export const deletePost = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('post/deletePost', async (id, thunkAPI) => {
  try {
    await postService.deletePost(id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to delete post');
  }
});

export const fetchUserWithPosts = createAsyncThunk<
  UserWithPosts,
  string,
  { rejectValue: string }
>('posts/fetchUserWithPosts', async (userId, thunkAPI) => {
  try {
    const response = await postService.getUserWithPosts(userId);
    return new UserWithPosts(response);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch user');
  }
});

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    resetPosts(state) {
      state.posts = [];
      state.currentPage = 1;
      state.totalPages = 0;
      state.loadMore = true;
      state.loading = false;
      state.error = null;
    },
    setTagFilter(state, action: PayloadAction<string>) {
      state.tagFilter = action.payload;
    },
    resetPostDetail(state) {
      state.post = null;
      state.loadingDetail = false;
      state.errorDetail = null;
    },
    clearUserWithPosts(state) {
      state.userWithPosts = null;
      state.loadingUser = false;
      state.errorUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch posts
      .addCase(fetchPublicPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicPosts.fulfilled, (state, action) => {
        const { data, currentPage, totalPage } = action.payload;
        state.loading = false;
        state.currentPage = currentPage;
        state.totalPages = totalPage;

        if (currentPage === 1) {
          state.posts = data;
        } else {
          state.posts = [...state.posts, ...data];
        }

        state.loadMore = data.length > 0 && currentPage < totalPage;
      })
      .addCase(fetchPublicPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch posts';
      })

      // fetch post detail
      .addCase(fetchPostById.pending, (state) => {
        state.loadingDetail = true;
        state.errorDetail = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.post = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.errorDetail = action.payload ?? 'Failed to fetch post';
      })

      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update post';
      })

      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.posts = state.posts.filter(
          (post) => post.id !== Number(deletedId)
        );
        if (state.userWithPosts?.Posts) {
          state.userWithPosts.Posts = state.userWithPosts.Posts.filter(
            (post) => post.id !== Number(deletedId)
          );
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to delete post';
      })

      .addCase(fetchUserWithPosts.pending, (state) => {
        state.loadingUser = true;
        state.errorUser = null;
      })
      .addCase(fetchUserWithPosts.fulfilled, (state, action) => {
        state.loadingUser = false;
        state.userWithPosts = new UserWithPosts({
          ...action.payload,
          Posts: [...action.payload.Posts].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
        });
      })
      .addCase(fetchUserWithPosts.rejected, (state, action) => {
        state.loadingUser = false;
        state.errorUser = action.payload ?? 'Failed to fetch user';
      });
  },
});

export const { resetPosts, setTagFilter, resetPostDetail, clearUserWithPosts } =
  postSlice.actions;
export default postSlice.reducer;
