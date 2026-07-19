import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

// 1. Importamos tu modelo real (el que ya tiene address y company conectados)
import type { User } from '../modelo/User'; 

const API_URL = 'http://localhost:8080/api/users';

interface UserState {
  users: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  users: [],
  status: 'idle',
  error: null,
};

// 2. Thunks asíncronos para el CRUD completo
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener usuarios');
  return (await response.json()) as User[];
});

export const createUser = createAsyncThunk('users/createUser', async (user: User) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    if (!response.ok) throw new Error('Error al crear el usuario');
    return (await response.json()) as User;
});

export const updateUser = createAsyncThunk('users/updateUser', async (user: User) => {
    const response = await fetch(`${API_URL}/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    if (!response.ok) throw new Error('Error al actualizar el usuario');
    return user; // Helidon retorna 204 No Content
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar el usuario');
    return id;
});

// 3. Creación del Slice y actualización del estado en memoria
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error desconocido';
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
          state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
          const index = state.users.findIndex(u => u.id === action.payload.id);
          if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
          state.users = state.users.filter(u => u.id !== action.payload);
      });
  },
});

export default userSlice.reducer;