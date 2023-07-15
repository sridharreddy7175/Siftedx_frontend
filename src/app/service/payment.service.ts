import API from "../utility/axios";

export class PaymentService {
    public static registerPaymentMethod(): Promise<any> {
        return API.post<any>('payment/register');
    }

    public static getPaymentMethods(): Promise<any> {
        return API.get<any>('payment/methods');
    }

    public static deletePaymentMethod(id: string): Promise<any> {
        return API.delete<any>(`payment/method/${id}`);
    }
}