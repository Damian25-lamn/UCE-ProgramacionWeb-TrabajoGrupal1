import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/UserSlice';
import albumReducer from '../slices/AlbumSlice';
import postReducer from '../slices/PostSlice';
import commentReducer from '../slices/CommentSlice';
import photoReducer from '../slices/PhotoSlice';
import todoReducer from '../slices/TodoSlice';

export const store = configureStore({
    reducer: {
        users: userReducer,
        albums: albumReducer,
        posts: postReducer,
        comments: commentReducer,
        photos: photoReducer,
        todos: todoReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;