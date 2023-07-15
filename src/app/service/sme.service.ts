import { SMEInterview } from "../model/interview/sme-interview";
import { PreparedSkill } from "../model/skills/prepared-skill";
import API from "../utility/axios";

export class SmeService {
    static getSme(companyId: string): Promise<any> {
        return API.get(`/sme/${companyId}`);
    }

    static getAllSme(): Promise<any> {
        return API.get(`/sme`);
    }

    static addSme(data: any): Promise<any> {
        return API.post(`/sme`, data);
    }
    static registerSme(data: any): Promise<any> {
        return API.post(`/user/sme`, data);
    }
    static smeProfile(data: any): Promise<any> {
        return API.put(`/sme/profile`, data);
    }

    static smeSkillsAdd(data: any): Promise<any> {
        return API.put(`/sme/skills`, data);
    }

    static addSmeSkills(data: PreparedSkill[]): Promise<any> {
        return API.post(`/sme/skills`, data);
    }

    static getSmeProfileById(id: string): Promise<any> {
        return API.get(`sme/profile/${id}`);
    }

    static getSmeSkillsById(id: string): Promise<any> {
        return API.get(`sme/skills/${id}`);
    }

    static paymentMethod(data: any): Promise<any> {
        return API.post(`/sme/payment-method`, data);
    }

    static availability(data: any): Promise<any> {
        return API.post(`/sme/availability`, data);
    }

    static getAvailability(): Promise<any> {
        return API.get(`/sme/availability`);
    }

    static getUpcomingInterviews(data: any): Promise<{ totalRows: number, records: SMEInterview[], error?: any }> {
        return API.get(`/sme/upcoming-interviews`, { params: data });
    }

    static getUpcomingInterviewsDahsboard(): Promise<{ totalRows: number, records: SMEInterview[], error?: any }> {
        return API.get(`/sme/upcoming-interviews`);
    }

    static recommendedSmes(data: any): Promise<any> {
        return API.post(`jobmatch/recommended-smes`, data);
    }

    static getPaymentMethod(): Promise<any> {
        return API.get(`/sme/payment-method`);
    }

    static scheduleInterviews(data: any): Promise<any> {
        return API.post(`/jobmatch/schedule`, data);
    }

    static getSmeInterviews(uuid: string, data: any): Promise<{ totalRows: number, records: SMEInterview[], error?: any }> {
        return API.get(`sme/interviews/${uuid}`, { params: data });
    }

    static getSmeInterviewsEvalution(data: any): Promise<any> {
        return API.post(`/interview/feedback`, data);
    }

    static audioSummaryUrl(data: any): Promise<any> {
        return API.post(`/interview/audio-summary-url`, data);
    }

    static smeNotes(data: any): Promise<any> {
        return API.put(`/interview/notes`, data);
    }

    static getSmePayoutHistory(): Promise<any> {
        return API.get(`sme/payout-history`);
    }

    static getCommingInterviews(comapny: string, data: any): Promise<any> {
        return API.get(`interview/company/${comapny}`, { params: data });
    }
    static smeBookMark(data: any): Promise<any> {
        return API.post(`/sme/bookmark`, data);
    }

    static getUserFavSmes(): Promise<any> {
        return API.get(`/sme/user-favourites`);
    }
    static getCompanyFavSmes(company: string): Promise<any> {
        return API.get(`/sme/company-favourites/${company}`);
    }

    static interviewFeedBackByJob(job: string): Promise<any> {
        return API.get(`interview/feedbacks/${job}`);
    }
    static interviewFeedBackById(feedbackid: string): Promise<any> {
        return API.get(`interview/feedback/${feedbackid}`);
    }

    static interviewFeedBackByInterview(interview: string): Promise<any> {
        return API.get(`interview/interview-feedback/${interview}`);
    }

    static interviewInfoByInterview(interview: string): Promise<any> {
        return API.get(`interview/info/${interview}`);
    }

    static interviewZoomInfo(interview: string): Promise<any> {
        return API.get(`interview/zoom-info/${interview}`);
    }

    static completeInterview(interview: string): Promise<any> {
        return API.put(`interview/completed/${interview}`);
    }

    static getSmeZoomToken(): Promise<any> {
        return API.get(`/interview/sme-token`);
    }
    static getSmeProfileSteps(): Promise<any> {
        return API.get(`/sme/profile-steps`);
    }

}