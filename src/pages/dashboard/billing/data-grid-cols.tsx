import { DataTableCol } from "../../../components/billing/type";

export const BillingDataGridCols: DataTableCol[] = [
    {
        title: 'Date',
        control: 'date'
    },
    {
        title:'Billing Type',
        control:'billing_type'
    },
    // {
    //     title: 'Description',
    //     control: 'description'
    // },
    // {
    //     title: 'Service Period',
    //     control: 'service_period'
    // },
    {
        title: 'Payment method',
        control: 'payment_method'
    },
    {
        title: 'Amount',
        control: 'amount'
    },
];