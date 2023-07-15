import API from "../utility/axios";

export class RolesService {
    static getRoles(): Promise<any> {
        return API.get(`/roles`);
    }

    static addRole(data: any): Promise<any> {
        return API.post(`/role`, data);
    }
}
