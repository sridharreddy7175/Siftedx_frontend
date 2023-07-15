import { DataTableCol } from "../data-table/types";
export const CandidateGridCols: DataTableCol[] = [
  {
    title: "Name",
    control: "user_firstname",
    // isLink: true,
  },
  {
    title: "Skills",
    control: "skills_codes",
  },
  // {
  //   title: "Availability",
  //   control: "availability_time",
  //   isIcon: true,
  // },
  {
    title: 'Availability',
    control: 'availability_time'
},
  {
    title: "Tags",
    control: "tags",
  },
  {
    title: "Interview Status",
    control: "interview_status",
  },
  {
    title: "",
    control: "delete_method",
  }

];
