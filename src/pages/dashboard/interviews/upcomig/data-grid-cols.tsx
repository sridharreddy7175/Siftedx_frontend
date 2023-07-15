import { DataTableCol } from "../../../../components/data-table/types";

export const UpcomingDataGridCols: DataTableCol[] = [
    // {
    //     title: '',
    //     control: 'CheckBox'
    // },
    {
        title: 'Candidate',
        control: 'candidateFullName',
        isLink:true
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
        title: 'Link',
        control: 'meeting_link'
    },
    {
        title: 'Fees',
        control: 'sme_fee'
    },
    {
        title: 'Status',
        control: 'interview_status'
    }
];
