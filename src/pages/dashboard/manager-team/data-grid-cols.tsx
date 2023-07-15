import { DataTableCol } from "../../../components/data-table/types";

export const MembersDataGridCols: DataTableCol[] = [
    {
        title: '',
        control: 'CheckBox'
    },
    {
        title: '',
        control: 'Profile'
    },
    {
        title: 'Name',
        control: 'name'
    },
    {
        title: 'Email',
        control: 'user_email'
    },
    {
        title: 'Actions',
        control: 'candidate'
    }
];
