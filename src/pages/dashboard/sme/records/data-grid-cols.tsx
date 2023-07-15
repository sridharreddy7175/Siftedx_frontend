import { DataTableCol } from "../../../../components/data-table/types";

export const RecordsDataGridCols: DataTableCol[] = [
    {
        title: 'First Name',
        control: 'user_firstname'
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
        control: 'recruiter_uuid'
    },
    {
        title: 'Resume Urls',
        control: 'resume_urls'
    },
    {
        title: 'Photo Url',
        control: 'photo_url'
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
        title: 'Time Zone',
        control: 'time_zone'
    },
    {
        title: 'Actions',
        control: 'both'
    },
];
