import { DataTableCol } from "../../../../components/data-table/types";

export const UpcomingDataGridCols: DataTableCol[] = [
    // {
    //     title: '',
    //     control: 'CheckBox'
    // },
    {
        title: 'Job Title',
        control: 'job_title',
        isLink: true
    },
    {
        title: 'Company',
        control: 'company_name'
    },
    {
        title: 'Candidate',
        control: 'candidate_fullname'
    },
    {
        title: 'Date and time',
        control: 'interview_schedule',
        sortable: true,
        defaultSort: true
    },
    {
        title: 'Link',
        control: 'meeting_link',
        isLink: true
    },
    // {
    //     title: 'Fees',
    //     control: 'fees'
    // },
    // {
    //     title: 'Status',
    //     control: 'interview_status'
    // },
    // {
    //     title: 'Actions',
    //     control: 'Accepted'
    // }
];
