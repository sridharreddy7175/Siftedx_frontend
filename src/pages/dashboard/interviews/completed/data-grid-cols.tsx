import { DataTableCol } from "../../../../components/data-table/types";

export const CompletedDataGridCols: DataTableCol[] = [
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
    // {
    //     title: 'Link',
    //     control: 'meeting_link'
    // },
    {
        title: 'Fees',
        control: 'sme_fee'
    },
    {
        title: 'Status',
        control: 'interview_status'
    },
    {
        title: 'Report',
        control: 'Completed'
    }
];
