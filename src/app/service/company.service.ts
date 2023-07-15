import { CheckoutSession } from "../model/company/checkout-session.res";
import API from "../utility/axios";

export class CompanyService {

    static getCompany(): Promise<any> {
        return API.get(`/company`);
    }

    static addCompany(data: any): Promise<any> {
        return API.post(`/company`, data);
    }

    static getCompanyById(id: string): Promise<any> {
        return API.get(`/company/${id}`);
    }

    static updateCompany(data: any): Promise<any> {
        return API.put(`/company/${data?.uuid}`, data);
    }

    static deleteCompany(uuid: string): Promise<any> {
        return API.delete(`/company/${uuid}`);
    }

    static getCompanyPlan(data: any): Promise<any> {
        return API.put(`company/plan`, data);
    }

    static creatreCompanyPaymentMethod(data: any): Promise<any> {
        return API.post(`/company/payment-method`, data);
    }

    static getCompanyPaymentMethod(uuid: string): Promise<any> {
        return API.get(`/company/payment-method/${uuid}`);
    }

    static updateCompanyPaymentMethod(uuid: string, data: any): Promise<any> {
        return API.put(`/company/payment-method/${uuid}`, data);
    }

    static deleteCompanyPaymentMethod(uuid: string): Promise<any> {
        return API.delete(`/company/payment-method/${uuid}`);
    }

    static getPayCheckoutsession(): Promise<CheckoutSession> {
        return API.get(`/payment/checkout-session`);
    }
}
