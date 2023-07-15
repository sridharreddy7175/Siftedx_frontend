import { DataTableCol } from "../../../../components/data-table/types";

export const InterviewsDataGridCols: DataTableCol[] = [
    // {
    //     title: '',
    //     control: 'CheckBox'
    // },
    {
        title: 'Name',
        control: 'fullName'
    },
    {
        title: 'Email',
        control: 'user_email'
    },
    {
        title: 'Added on',
        control: 'created_dt'
    },
    {
        title: 'Tags',
        control: "tags",
        isTags: true,
        },
    // {
    //     title: 'Ratings',
    //     control: ''
    // },
    // {
    //     title: 'Actions',
    //     control: 'candidate'
    // }
];




