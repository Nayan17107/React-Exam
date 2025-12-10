import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './src/Services/Reducer/index';

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});