export interface SMEInterview {
    candidate_firstname: string;
    candidate_lastname:string;
    candidate_timezone_offset:string;
    candidate_uuid:string;
    category_code:string;
    company_name:string;
    company_uuid:string;
    instructions_to_sme: string;
    interview_duration: number
    interview_schedule: Date;
    job_mandatory_skills:string;
    job_title:string;
    job_uuid:string;
    sme_fee: number;
    sme_timezone_offset: number;
    sme_uuid: string;
    uuid: string;

    // frontend
    candidate_fullname: string;
}