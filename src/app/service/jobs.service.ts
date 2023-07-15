import { SMEInterview } from "../model/interview/sme-interview";
import { JobListResponse } from "../model/job/job-list.res";
import API from "../utility/axios";

export class JobsService {
    static getJobs(companyId: string): Promise<any> {
        return API.get(`/job/company/${companyId}`);
    }

    static getJobsByStatus(companyId: string, status: string, search: string, start: number, count: number): Promise<JobListResponse> {
        return API.get(`/job/company/${companyId}`, { params: { status, search, start, count } });
    }

    static getJobsByFavourite(companyId: string, favourite: string): Promise<any> {
        return API.get(`/job/company/${companyId}`, { params: { favourite } });
    }

    static getJobsByUuid(uuid: string): Promise<any> {
        return API.get(`/job/${uuid}`);
    }

    static addJobs(data: any): Promise<any> {
        return API.post(`/job`, data);
    }

    static updateJob( uuid: string,data: any,): Promise<any> {
        return API.put(`/job/${uuid}`, data);
    }

    static JobAccessToUser(data: any): Promise<any> {
        return API.put(`/job/access`, data);
    }

    static changeJobStatus(data: any): Promise<any> {
        return API.put(`/job/status`, data);
    }
    static deleteJob(uuid: any): Promise<any> {
        return API.delete(`/job/${uuid}`);
    }

    static getJobsInterviews(uuid: string, data: any): Promise<any> {
        return API.get(`/job/interviews/${uuid}`, { params: data });
    }

    static getJobsTeamMembers(uuid: string): Promise<any> {
        return API.get(`/job/members/${uuid}`);
    }

    static smeInterviewOpportunities(uuid: string, data: any): Promise<{ totalRows: number, records: SMEInterview[], error?: any }> {
        return API.get(`/sme/interviews/${uuid}`, { params: data });
    }

    static smeInterviewOpportunitiesForDahsboard(uuid: string, from_date: any): Promise<{ totalRows: number, records: SMEInterview[], error?: any }> {
        return API.get(`/sme/interviews/${uuid}`, { params: { from_date } });
    }
    static smeAcceptInterview(uuid: string): Promise<any> {
        return API.put(`/interview/sme-accept/${uuid}`);
    }

    static smeRejectInterview(uuid: string): Promise<any> {
        return API.put(`interview/sme-reject/${uuid}`);
    }

    static getInterviewById(uuid: string): Promise<any> {
        return API.get(`interview/${uuid}`);
    }

    static getJobsByUser(start: number, limit: number): Promise<any> {
        return API.get(`job/user?start=${start}&count=${limit}`);
    }

    static jobFavourite(data: any): Promise<any> {
        return API.post(`/job/favourite`, data);
    }
    
    static getInterviewDates(companyId: string, data: any): Promise<any> {
        return API.get(`/interview/company/${companyId}`, { params: data });
    }   
   
}
