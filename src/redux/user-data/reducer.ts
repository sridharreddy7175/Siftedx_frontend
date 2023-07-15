import { LoadingReducerState, LoginPopupReducerState, UserDataReducerState } from "./user-reducer-state";
import {
    LOADING, LOGINPOPUP, USERDATA
} from "../types";


const loadingInitialState: LoadingReducerState = {
    loading: false,
}
const loginPopupInitialState: LoginPopupReducerState = {
    loginPopup: false,
    popupType: ''
}

const userDataInitialState: UserDataReducerState = {
    userData: {}
}

export const LoadingReducer: any = (loading: LoadingReducerState = loadingInitialState, action: any) => {
    switch (action.type) {
        case LOADING:
            return { loading: action.data };
        default:
            return loading;
    }
}

export const LoginPopupReducer: any = (isLogin: LoginPopupReducerState = loginPopupInitialState, action: any) => {
    switch (action.type) {
        case LOGINPOPUP:
            return { loginPopup: action.data };
        default:
            return isLogin;
    }
}

export const UserData: any = (isLogin: UserDataReducerState = userDataInitialState, action: any) => {
    switch (action.type) {
        case USERDATA:
            return action.data;
        default:
            return isLogin;
    }
}
