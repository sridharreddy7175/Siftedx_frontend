import { DataTableCol } from "../../../../components/data-table/types";

export const CandidatesDataGridCols: DataTableCol[] = [
    {
        title: '',
        control: 'CheckBox'
    },
    {
        title: 'First Name',
        control: 'user_firstname',
        isLink: true
    },
    {
        title: 'Last Name',
        control: 'user_lastname'
    },
    {
        title: 'Email',
        control: 'user_email'
    },
    {
        title: 'Mobile Number',
        control: 'mobile_no'
    },
    {
        title: 'Recruiter',
        control: ''
    },
    {
        title: 'Resume Urls',
        control: 'resume_urls'
    },
    {
        title: 'Added',
        control: ''
    },
    {
        title: 'Total Experience',
        control: 'total_experience'
    },
    {
        title: 'Skills',
        control: 'skills_codes'
    },
    {
        title: 'Availability Time',
        control: 'availability_time'
    },
    {
        title: 'Actions',
        control: 'candidates'
    },
];
