import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Photo } from '../modelo/Photo';

const API_URL = 'http://localhost:8080/api/photos';

interface PhotoState {
    photos: Photo[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PhotoState = { photos: [], status: 'idle', error: null };

export const fetchPhotos = createAsyncThunk('photos/fetchPhotos', async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al cargar las fotos');
    return (await response.json()) as Photo[];
});

export const createPhoto = createAsyncThunk('photos/createPhoto', async (photo: Photo) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photo)
    });
    if (!response.ok) throw new Error('Error al crear la foto');
    return (await response.json()) as Photo;
});

export const updatePhoto = createAsyncThunk('photos/updatePhoto', async (photo: Photo) => {
    const response = await fetch(`${API_URL}/${photo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photo)
    });
    if (!response.ok) throw new Error('Error al actualizar la foto');
    return photo;
});

export const deletePhoto = createAsyncThunk('photos/deletePhoto', async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar la foto');
    return id;
});

const photoSlice = createSlice({
    name: 'photos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPhotos.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchPhotos.fulfilled, (state, action: PayloadAction<Photo[]>) => {
                state.status = 'succeeded';
                state.photos = action.payload;
            })
            .addCase(fetchPhotos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(createPhoto.fulfilled, (state, action: PayloadAction<Photo>) => {
                state.photos.push(action.payload);
            })
            .addCase(updatePhoto.fulfilled, (state, action: PayloadAction<Photo>) => {
                const index = state.photos.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.photos[index] = action.payload;
            })
            .addCase(deletePhoto.fulfilled, (state, action: PayloadAction<number>) => {
                state.photos = state.photos.filter(p => p.id !== action.payload);
            });
    },
});

export default photoSlice.reducer;