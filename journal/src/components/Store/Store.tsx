import {combineReducers} from 'redux';
import { configureStore } from '@reduxjs/toolkit'
import ScrollReducer from './Reducers/ScrollReducer';
import HomeReducer from './Reducers/HomeReducer';
import loginReducer from './Reducers/LoginReducer';
import FolderTreeReducer from './Reducers/FolderTreeReducer';
import CurrentPathReducer from './Reducers/CurrentPathReducer';
import RefreshPostsReducer from "./Reducers/RefreshPostsReducer"
import thunk from 'redux-thunk';
const Reducers = combineReducers({
    scrollReducer:ScrollReducer,
    homeReducer:HomeReducer,
    loginReducer,
    FolderTreeReducer,
    CurrentPathReducer,
    RefreshPostsReducer
})

export const store = configureStore({
    reducer: Reducers,
    middleware:[thunk]
})


export type ScrlState= ReturnType<typeof store.getState>




