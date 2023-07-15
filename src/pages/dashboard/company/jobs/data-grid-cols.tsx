import { DataTableCol } from "../../../../components/data-table/types";

export const JobsDataGridCols: DataTableCol[] = [
    {
        title: 'Title',
        control: 'job_title'
    },
    {
        title: 'Description',
        control: 'job_description'
    },
    {
        title: 'Skills',
        control: 'job_skills'
    },
    {
        title: 'Positions',
        control: 'positions'
    },
    {
        title: 'Location',
        control: 'location'
    },
    {
        title: 'Validity Start',
        control: 'validity_start_dt'
    },
    {
        title: 'Validity End',
        control: 'validity_end_dt'
    },
    {
        title: 'Status',
        control: 'status'
    },
    {
        title: 'Recruiter',
        control: ''
    },
    {
        title: 'Actions',
        control: 'Jobs'
    },
];
export const JobsCandidateGridCols: DataTableCol[] = [
    // {
    //     title: '',
    //     control: 'CheckBox'
    // },
    {
        title: 'Name',
        control: 'user_firstname',
        isLink: true
    },
    {
        title: 'Email',
        control: 'user_email'
    },
    {
        title: 'Stage',
        control: 'interviewStatus'
    },
    // {
    //     title: 'Availability',
    //     control: 'availability_time'
    // },
    // {
    //     title: 'Tags',
    //     control: 'tags'
    // },
    // {
    //     title: 'Ratings',
    //     control: ''
    // },
    {
        title: 'Availability',
        control: 'candidateInverviewStatus'
    }
]

export const JobsInterviewsGridCols: DataTableCol[] = [
    {
        title: '',
        control: 'CheckBox'
    },
    {
        title: 'Candidate',
        control: 'candidateFullName'
    },
    {
        title: 'Interviewer SME',
        control: 'smeFullName'
    },
    {
        title: 'Date and Time',
        control: 'interview_schedule'
    },
    {
        title: 'Link',
        control: 'meeting_link'
    },
    {
        title: 'Status',
        control: 'interview_status'
    },
    {
        title: 'Actions',
        control: 'candidateInverviewStatusReport'
    }
]

export const JobsInterviewsRecruiterGridCols: DataTableCol[] = [
    {
        title: 'Candidate',
        control: 'candidateFullName'
    },
    {
        title: 'Interviewer',
        control: 'smeFullName'
    },
    {
        title: 'Date and Time',
        control: 'interview_schedule'
    },
    {
        title: 'Link',
        control: 'meeting_link',
        isLink:true
    },
    {
        title: 'Status',
        control: 'interview_status'
    },
    
]

export const JobsReportsRecruiterGridCols: DataTableCol[] = [
    {
        title: 'Candidate',
        control: 'candidateFullName'
    },
    {
        title: 'Rate Per Interview',
        control: 'smeFullName'
    },
    {
        title: 'Experience',
        control: 'experience'
    },
    {
        title: 'Competency',
        control: 'competency'
    },
    {
        title: 'Recording',
        control: 'smeFullName'
    },
    {
        title: 'Report',
        control: 'jobReports'
    }
]

export const JobsReportsGridCols: DataTableCol[] = [
    {
        title: '',
        control: 'CheckBox'
    },
    {
        title: 'Candidate',
        control: 'candidateFullName'
    },
    {
        title: 'Interviewer SME',
        control: 'smeFullName'
    },
    {
        title: 'Experience',
        control: 'experience'
    },
    {
        title: 'Competency',
        control: 'competency'
    },
    {
        title: 'Skills',
        control: 'skills'
    },
    {
        title: 'Actions',
        control: 'jobReports'
    }
]


export const SkillDataGridCols: DataTableCol[] = [
    {
        title: 'Skill',
        control: 'skill'
    },
    {
        title: 'Experience',
        control: 'experienceDisplay'
    }
];