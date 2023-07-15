import { HttpResponse } from "../http-response";

export interface CheckoutSession extends HttpResponse{
    CheckoutUrl:string;
}