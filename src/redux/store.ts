import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { LoadingReducer, LoginPopupReducer, UserData } from './user-data/reducer';

export const store = createStore(combineReducers(
    {
        LoadingReducer: LoadingReducer,
        LoginPopupReducer: LoginPopupReducer,
        UserDataReducer: UserData,
    }
), applyMiddleware(thunk));
