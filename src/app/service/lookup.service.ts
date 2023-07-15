import { SXSkill } from "../model/skills/sx-skill";
import API from "../utility/axios";

export class LookUpService {
    static getCountry(): Promise<any> {
        return API.get(`/lookup/country`);
    }

    static getState(country: string): Promise<any> {
        return API.get(`/lookup/states/${country}`);
    }

    static jobcategories(): Promise<any> {
        return API.get(`/lookup/jobcategories`);
    }

    static skills(category: string): Promise<any> {
        return API.get(`/lookup/skills/${category}`);
    }
    static timezones(): Promise<any> {
        return API.get(`/lookup/timezones`);
    }

    static addSkillToCategory(data: any): Promise<any> {
        return API.post(`/lookup/category`, data);
    }

    static getAllSkills(): Promise<SXSkill[]> {
        return API.get(`/lookup/jobskills`);
    }
}


