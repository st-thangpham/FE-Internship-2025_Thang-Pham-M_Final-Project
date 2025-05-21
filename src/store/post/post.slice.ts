import { UserWithPosts } from '@app/shared/models/user';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PostResponse, Post } from '@shared/models/post';
import { PostPayload, PostService } from '@shared/services/blog.service';

const postService = new PostService();

interface PostState {
  postList: {
    data: Post[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    loadMore: boolean;
    tagFilter: string;
  };

  post: {
    data: Post | null;
    loadingDetail: boolean;
    errorDetail: string | null;
  };

  userWithPosts: {
    data: UserWithPosts | null;
    loadingUser: boolean;
    errorUser: string | null;
  };
}

const initialState: PostState = {
  postList: {
    data: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 0,
    loadMore: true,
    tagFilter: '',
  },

  post: {
    data: null,
    loadingDetail: false,
    errorDetail: null,
  },

  userWithPosts: {
    data: null,
    loadingUser: false,
    errorUser: null,
  },
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
      state.postList.data = [];
      state.postList.currentPage = 1;
      state.postList.totalPages = 0;
      state.postList.loadMore = true;
      state.postList.loading = false;
      state.postList.error = null;
    },
    setTagFilter(state, action: PayloadAction<string>) {
      state.postList.tagFilter = action.payload;
    },
    resetPostDetail(state) {
      state.post.data = null;
      state.post.loadingDetail = false;
      state.post.errorDetail = null;
    },
    clearUserWithPosts(state) {
      state.userWithPosts.data = null;
      state.userWithPosts.loadingUser = false;
      state.userWithPosts.errorUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch posts
      .addCase(fetchPublicPosts.pending, (state) => {
        state.postList.loading = true;
        state.postList.error = null;
      })
      .addCase(fetchPublicPosts.fulfilled, (state, action) => {
        const { data, currentPage, totalPage } = action.payload;
        state.postList.loading = false;
        state.postList.currentPage = currentPage;
        state.postList.totalPages = totalPage;

        if (currentPage === 1) {
          state.postList.data = data;
        } else {
          state.postList.data = [...state.postList.data, ...data];
        }

        state.postList.loadMore = data.length > 0 && currentPage < totalPage;
      })
      .addCase(fetchPublicPosts.rejected, (state, action) => {
        state.postList.loading = false;
        state.postList.error = action.payload ?? 'Failed to fetch posts';
      })

      // fetch post detail
      .addCase(fetchPostById.pending, (state) => {
        state.post.loadingDetail = true;
        state.post.errorDetail = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.post.loadingDetail = false;
        state.post.data = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.post.loadingDetail = false;
        state.post.errorDetail = action.payload ?? 'Failed to fetch post';
      })

      // create post
      .addCase(createPost.pending, (state) => {
        state.postList.loading = true;
        state.postList.error = null;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.postList.loading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.postList.loading = false;
        state.postList.error = action.payload as string;
      })

      // update post
      .addCase(updatePost.pending, (state) => {
        state.postList.loading = true;
        state.postList.error = null;
      })
      .addCase(updatePost.fulfilled, (state) => {
        state.postList.loading = false;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.postList.loading = false;
        state.postList.error = action.payload || 'Failed to update post';
      })

      // delete post
      .addCase(deletePost.pending, (state) => {
        state.postList.loading = true;
        state.postList.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const deletedId = action.payload;

        state.postList.data = state.postList.data.filter(
          (post) => post.id !== +deletedId
        );

        if (state.userWithPosts.data) {
          state.userWithPosts.data.Posts =
            state.userWithPosts.data.Posts.filter(
              (post) => post.id !== +deletedId
            );
        }

        state.postList.loading = false;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.postList.loading = false;
        state.postList.error = action.payload ?? 'Failed to delete post';
      })

      // fetch post by user
      .addCase(fetchUserWithPosts.pending, (state) => {
        state.userWithPosts.loadingUser = true;
        state.userWithPosts.errorUser = null;
      })
      .addCase(fetchUserWithPosts.fulfilled, (state, action) => {
        state.userWithPosts.loadingUser = false;
        state.userWithPosts.data = new UserWithPosts({
          ...action.payload,
          Posts: [...action.payload.Posts].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
        });
      })
      .addCase(fetchUserWithPosts.rejected, (state, action) => {
        state.userWithPosts.loadingUser = false;
        state.userWithPosts.errorUser =
          action.payload ?? 'Failed to fetch user';
      });
  },
});

export const { resetPosts, setTagFilter, resetPostDetail, clearUserWithPosts } =
  postSlice.actions;
export default postSlice.reducer;
