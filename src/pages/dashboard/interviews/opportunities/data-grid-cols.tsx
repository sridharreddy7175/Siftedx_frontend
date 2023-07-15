import { DataTableCol } from "../../../../components/data-table/types";

export const OpportunitiesDataGridCols: DataTableCol[] = [
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
        title: 'Date & Time',
        control: 'interview_schedule',
        sortable: true,
        defaultSort: true
    },
    // {
    //     title: 'Link',
    //     control: 'meeting_link'
    // },
    // {
    //     title: 'Fees',
    //     control: 'fees'
    // },
    {
        title: 'Actions',
        control: 'Request'
    }
];
