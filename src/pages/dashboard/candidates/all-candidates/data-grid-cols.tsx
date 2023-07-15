import { DataTableCol } from "../../../../components/data-table/types";

export const AllCandidatesDataGridCols: DataTableCol[] = [
  // {
  //     title: '',
  //     control: 'CheckBox'
  // },
  {
    title: "Name",
    control: "user_firstname",
  },
  {
    title: "Skills",
    control: "skills_codes",
  },

  // {
  //     title: 'Email',
  //     control: 'user_email'
  // },

  // {
  //     title: 'Added on',
  //     control: 'created_dt'
  // },
  {
    title: "Availability to join from",
    control: "availability_time",
    isIcon: true,
  },
  {
    title: "Tags",
    control: "tags",
    isTags: true,
  },
  // {
  //     title: 'Ratings',
  //     control: 'rating'
  // },
  // {
  //   title:"Actions",
  //   control:"favourite"
  // }
  
  // {
  //     title: 'Actions',
  //     control: 'candidate'
  // }
];
