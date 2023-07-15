import API from "../utility/axios";

export class LoginService {
    static login(data: any): Promise<any> {
        return API.post(`/user/login`, data);
    }

    static loginWithGoogle(token: string): Promise<any> {
        return API.post(`/user/login-google/${token}`);
    }

    static loginWithLinkedin(token: string): Promise<any> {
        return API.post(`/user/login-linkedin/${token}`);
    }
}

