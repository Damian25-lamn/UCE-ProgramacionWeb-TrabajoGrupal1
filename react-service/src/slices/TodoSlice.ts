import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Todo } from '../modelo/Todo';

const API_URL = 'http://localhost:8080/api/todos';

interface TodoState {
    todos: Todo[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TodoState = { todos: [], status: 'idle', error: null };

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al cargar las tareas');
    return (await response.json()) as Todo[];
});

export const createTodo = createAsyncThunk('todos/createTodo', async (todo: Todo) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
    });
    if (!response.ok) throw new Error('Error al crear la tarea');
    return (await response.json()) as Todo;
});

export const updateTodo = createAsyncThunk('todos/updateTodo', async (todo: Todo) => {
    const response = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
    });
    if (!response.ok) throw new Error('Error al actualizar la tarea');
    return todo;
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar la tarea');
    return id;
});

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
                state.status = 'succeeded';
                state.todos = action.payload;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(createTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
                state.todos.push(action.payload);
            })
            .addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
                const index = state.todos.findIndex(t => t.id === action.payload.id);
                if (index !== -1) state.todos[index] = action.payload;
            })
            .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<number>) => {
                state.todos = state.todos.filter(t => t.id !== action.payload);
            });
    },
});

export default todoSlice.reducer;