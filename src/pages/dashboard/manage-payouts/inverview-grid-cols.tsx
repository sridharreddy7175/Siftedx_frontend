import { DataTableCol } from "../../../components/manage-payouts/type";

export const InterViewDataGridCols: DataTableCol[] = [
    {
        title: 'Date',
        control: 'date'
    },
    {
        title: 'Candidate',
        control: 'candidate_name'
    },
    {
        title: 'Organization',
        control: 'company_name'
    },
    {
        title: 'Earnings',
        control: 'sme_fee'
    },
];