import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Album } from '../modelo/Album';
const API_URL = 'http://localhost:8080/api/albums';

interface AlbumState {
    albums: Album[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AlbumState = { albums: [], status: 'idle', error: null };

export const fetchAlbums = createAsyncThunk('albums/fetchAlbums', async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al cargar los álbumes');
    return (await response.json()) as Album[];
});

export const createAlbum = createAsyncThunk('albums/createAlbum', async (album: Album) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(album)
    });
    if (!response.ok) throw new Error('Error al crear el álbum');
    return (await response.json()) as Album;
});

export const updateAlbum = createAsyncThunk('albums/updateAlbum', async (album: Album) => {
    const response = await fetch(`${API_URL}/${album.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(album)
    });
    if (!response.ok) throw new Error('Error al actualizar el álbum');
    return album; // Helidon retorna 204 No Content, devolvemos el objeto original para actualizar el estado
});

export const deleteAlbum = createAsyncThunk('albums/deleteAlbum', async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar el álbum');
    return id; 
});

const albumSlice = createSlice({
    name: 'albums',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAlbums.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchAlbums.fulfilled, (state, action: PayloadAction<Album[]>) => {
                state.status = 'succeeded';
                state.albums = action.payload;
            })
            .addCase(fetchAlbums.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Error desconocido';
            })
            .addCase(createAlbum.fulfilled, (state, action: PayloadAction<Album>) => {
                state.albums.push(action.payload);
            })
            .addCase(updateAlbum.fulfilled, (state, action: PayloadAction<Album>) => {
                const index = state.albums.findIndex(a => a.id === action.payload.id);
                if (index !== -1) state.albums[index] = action.payload;
            })
            .addCase(deleteAlbum.fulfilled, (state, action: PayloadAction<number>) => {
                state.albums = state.albums.filter(a => a.id !== action.payload);
            });
    },
});

export default albumSlice.reducer;