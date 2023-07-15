import { DataTableCol } from "../../../../components/data-table/types";

export const InterviewsDataGridCols: DataTableCol[] = [
    {
        title: 'Name',
        control: 'fullName'
    },
    {
        title: 'Email',
        control: 'user_email'
    },
    {
        title: 'Interview  date',
        control: 'interview_schedule'
    },
  
    {
        title: 'Meeting link',
        control: 'meeting_link',
        isLink:true
    },
    // {
    //     title: 'Actions',
    //     control: 'both'
    // }
];




