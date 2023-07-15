import { DataTableCol } from "../../../../components/data-table/types";

export const UsersDataGridCols: DataTableCol[] = [
    {
        title: '',
        control: 'CheckBox'
    },
    {
        title: 'First name',
        control: 'user_firstname'
    },
    {
        title: 'Last name',
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
        title: 'Gender',
        control: 'gender'
    },
    {
        title: 'Role',
        control: 'role'
    },
    {
        title: 'Location',
        control: 'location'
    },
    {
        title: 'Locked',
        control: 'locked'
    },
    {
        title: 'Status',
        control: 'status'
    },
    {
        title: 'Actions',
        control: 'both'
    },
];




