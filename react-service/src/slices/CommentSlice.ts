import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Comment } from '../modelo/Comment';

const API_URL = 'http://localhost:8080/api/comments';

interface CommentState {
    comments: Comment[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CommentState = { comments: [], status: 'idle', error: null };

export const fetchComments = createAsyncThunk('comments/fetchComments', async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al cargar los comentarios');
    return (await response.json()) as Comment[];
});

export const createComment = createAsyncThunk('comments/createComment', async (comment: Comment) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment)
    });
    if (!response.ok) throw new Error('Error al crear el comentario');
    return (await response.json()) as Comment;
});

export const updateComment = createAsyncThunk('comments/updateComment', async (comment: Comment) => {
    const response = await fetch(`${API_URL}/${comment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment)
    });
    if (!response.ok) throw new Error('Error al actualizar el comentario');
    return comment;
});

export const deleteComment = createAsyncThunk('comments/deleteComment', async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar el comentario');
    return id;
});

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchComments.fulfilled, (state, action: PayloadAction<Comment[]>) => {
                state.status = 'succeeded';
                state.comments = action.payload;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(createComment.fulfilled, (state, action: PayloadAction<Comment>) => {
                state.comments.push(action.payload);
            })
            .addCase(updateComment.fulfilled, (state, action: PayloadAction<Comment>) => {
                const index = state.comments.findIndex(c => c.id === action.payload.id);
                if (index !== -1) state.comments[index] = action.payload;
            })
            .addCase(deleteComment.fulfilled, (state, action: PayloadAction<number>) => {
                state.comments = state.comments.filter(c => c.id !== action.payload);
            });
    },
});

export default commentSlice.reducer;