import { HttpResponse } from "../http-response";

export interface CompanyListItem {
    company_name: string;
    contact_number: string;
    address_line_1: string;
    address_line_2: string;
    postal_code: string;
    category_code: string;
    country: string;
    address: string;
    city: string;
    contact_person: string;
    state: string;
    display_name: string;
}