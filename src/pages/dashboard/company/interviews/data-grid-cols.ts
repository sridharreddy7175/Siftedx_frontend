import { DataTableCol } from "../../../../components/data-table/types";

// export const InterviewsDataGridCols: DataTableCol[] = [
//     {
//         title: '',
//         control: 'CheckBox'
//     },
//     {
//         title: 'Candidate',
//         control: 'candidate'
//     },
//     {
//         title: 'Job Title',
//         control: 'job_title'
//     },
//     {
//         title: 'Interview Data & Time',
//         control: 'interview_date_time'
//     },
//     {
//         title: 'Interview Status',
//         control: 'interview_status'
//     },
//     {
//         title: 'Actions',
//         control: 'interviewbuttons'
//     },
// ];
export const InterviewsDataGridCols: DataTableCol[] = [
    // {
    //     title: '',
    //     control: 'CheckBox'
    // },
    {
        title: 'Candidate',
        control: 'candidate_name'
    },
    // {
    //     title: 'Job',
    //     control: 'job'
    // },
    {
        title: 'Company',
        control: 'company_name'
    },
    {
        title: 'Date & Time',
        control: 'formated_schedule'
    },
    {
        title:'Fees',
        control:"sme_fee"
    },
    {
        title: 'Status',
        control: 'interview_status'
    },
    // {
    //     title: 'Actions',
    //     control: 'interviewbuttons'
    // },
];




