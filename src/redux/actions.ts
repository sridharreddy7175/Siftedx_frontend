import { LOADING, LOGINPOPUP, LOGOUT, USERDATA } from "./types";

export const UserLogout = () => {
    return {
        type: LOGOUT
    }
}

export const Loading = (data: any) => {
    return {
        type: LOADING,
        data
    }
}

export const LoginPopup = (data: any) => {
    return {
        type: LOGINPOPUP,
        data
    }
}

export const UserData = (data: any) => {
    return {
        type: USERDATA,
        data
    }
}