import { DataTableCol } from "../../../../components/data-table/types";

export const RejectedDataGridCols: DataTableCol[] = [
    // {
    //     title: '',
    //     control: 'CheckBox'
    // },
    {
        title: 'Candidate',
        control: 'candidate_name',
        isLink: true
    },
    {
        title: 'Company',
        control: 'company_name'
    },
    {
        title: 'Date and time',
        control: 'interview_schedule',
        sortable: true,
        defaultSort: true
    },
    {
        title: 'Fees',
        control: 'sme_fee'
    },
    {
        title: 'Actions',
        control: 'Accept_Job'
    }
    // {
    //     title: 'Status',
    //     control: 'interview_status'
    // },
    // {
    //     title: 'Actions',
    //     control: 'Completed'
    // }
];
