import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Post } from '../modelo/Post';

const API_URL = 'http://localhost:8080/api/posts';

interface PostState {
    posts: Post[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PostState = { posts: [], status: 'idle', error: null };

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al cargar los posts');
    return (await response.json()) as Post[];
});

export const createPost = createAsyncThunk('posts/createPost', async (post: Post) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    });
    if (!response.ok) throw new Error('Error al crear el post');
    return (await response.json()) as Post;
});

export const updatePost = createAsyncThunk('posts/updatePost', async (post: Post) => {
    const response = await fetch(`${API_URL}/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    });
    if (!response.ok) throw new Error('Error al actualizar el post');
    return post;
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar el post');
    return id;
});

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
                state.status = 'succeeded';
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
                state.posts.push(action.payload);
            })
            .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
                const index = state.posts.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.posts[index] = action.payload;
            })
            .addCase(deletePost.fulfilled, (state, action: PayloadAction<number>) => {
                state.posts = state.posts.filter(p => p.id !== action.payload);
            });
    },
});

export default postSlice.reducer;