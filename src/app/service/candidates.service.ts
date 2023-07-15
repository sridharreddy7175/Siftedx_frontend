import { UsersListItem } from "../model/users/users-list";
import API from "../utility/axios";

export class CandidatesService {
    static getCandidates(companyId: string): Promise<any> {
        return API.get(`/candidate/${companyId}`);
    }

    static getCandidatesBySearch(companyId: string, data: any): Promise<any> {
        return API.get(`/candidate/${companyId}`, { params: data });
    }

    static addCandidate(data: UsersListItem): Promise<any> {
        return API.post(`/candidate`, data);
    }

    static updateCandidate(data: UsersListItem): Promise<any> {
        return API.put(`/candidate/${data?.uuid}`, data);
    }

    static getCandidateById(company: string, uuid: string): Promise<any> {
        return API.get(`/candidate/${company}/${uuid}`);
    }

    static deleteCandidate(uuid: string): Promise<UsersListItem> {
        return API.delete(`/candidate/${uuid}`);
    }

    static jobmapping(data: any): Promise<any> {
        return API.post(`/candidate/assign`, data);
    }
    static getJobCandidates(job: string, status: string): Promise<any> {
        return API.get(`/candidate/job/${job}`, { params: { status } });
    }
    static getReScheduled(job: string): Promise<any> {
        return API.get(`/candidate/rescheduled/${job}`);
    }

    static getNotScheduled(job: string): Promise<any> {
        return API.get(`/candidate/not-scheduled/${job}`);
    }

    static availability(candidate_uuid: string, data: any): Promise<any> {
        return API.post(`candidate/availability/${candidate_uuid}`, data);
    }

    static getCandidateAvailability(candidate_uuid: string): Promise<any> {
        return API.get(`candidate/availability/${candidate_uuid}`);
    }

    static getCandidateInterview(interview: string): Promise<any> {
        return API.get(`candidate/interview/${interview}`);
    }
    static getCompanyCandidateInterview(company: string, data: any): Promise<any> {
        return API.get(`interview/company/${company}`, { params: data });
    }

    static candidateFavourite(data: any): Promise<any> {
        return API.post(`/candidate/favourite`, data);
    }

    static getCompanyCandidateFav(company: string, data: any): Promise<any> {
        return API.get(`candidate/${company}`, { params: data });
    }

    static deleteJobCandidate(uuid: string): Promise<any> {
        return API.delete(`/candidate/remove/${uuid}`);
    }
}
