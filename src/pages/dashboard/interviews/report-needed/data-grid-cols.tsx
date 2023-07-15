import { DataTableCol } from "../../../../components/data-table/types";

export const UpcomingDataGridCols: DataTableCol[] = [
    // {
    //     title: '',
    //     control: 'CheckBox'
    // },
    {
        title: 'Candidate',
        control: 'candidateFullName',
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
    {
        title: 'Status',
        control: 'interview_status'
    },
    {
        title: 'Report',
        control: 'ReportNeeded'
    }
];
