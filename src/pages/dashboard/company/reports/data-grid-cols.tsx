import { DataTableCol } from "../../../../components/reports/type";

export const CompanyReportsDataGridCols: DataTableCol[] = [
    {
        title: 'Candidate',
        control: 'date'
    },
    {
        title: 'Job',
        control: 'company'
    },
    {
        title: 'Experience',
        control: 'interview_status'
    },
    {
        title: 'Competency',
        control: 'payment_status'
    },
    {
        title: 'Recording',
        control: 'feedback'
    },
    {
        title: 'Report',
        control: 'feedback'
    },
];