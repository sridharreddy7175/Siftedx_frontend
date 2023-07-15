import API from "../utility/axios";

export class UsersService {
    static getUsers(companyId: string, search: string): Promise<any> {
        return API.get(`/user/company/${companyId}`, { params: { search } });
    }

    static getUsersByRole(company: string, role: string, search: string): Promise<any> {
        return API.get(`/user/${company}/${role}`, { params: { search } });
    }

    static addUser(data: any): Promise<any> {
        return API.post(`/user`, data);
    }

    static getRecruiter(companyId: string): Promise<any> {
        return API.get(`/user/${companyId}/Recruiter`);
    }

    static getUserByUuid(uuid: string): Promise<any> {
        return API.get(`/user/${uuid}`);
    }

    static updateUser(data: any): Promise<any> {
        return API.post(`/user/${data?.uuid}`, data);
    }

    static deleteUser(uuid: string): Promise<any> {
        return API.delete(`/user/${uuid}`);
    }
    static updateUserRole(data: any): Promise<any> {
        return API.put(`/user/role`, data);
    }
    static addUserCompany(data: any): Promise<any> {
        return API.post(`/user/company`, data);
    }

    static sendEmailVerification(email: any): Promise<any> {
        return API.post(`/user/send-email-verification/${email}`);
    }

    static verifyEmail(code: any): Promise<any> {
        return API.post(`/user/verify-email/${code}`);
    }

    static invitation(data: any): Promise<any> {
        return API.post(`invitation`, data);
    }

    static getInvitation(uuid: string): Promise<any> {
        return API.get(`/invitation/${uuid}`);
    }

    static acceptInvitation(uuid: string, data: any): Promise<any> {
        return API.post(`/invitation/accept/${uuid}`, data);
    }

    static getCompanyStrenth(uuid: string): Promise<any> {
        return API.get(`user/company/strength/${uuid}`);
    }

    static temporarilyDeactivate(uuid: string, status: string): Promise<any> {
        return API.put(`user/active/${uuid}/${status}`);
    }

    static getDeactivatedUsers(uuid: string, search: string): Promise<any> {
        return API.get(`user/status/${uuid}/2`, { params: { search } });
    }

    static resumeuploadurl(fileType: string): Promise<any> {
        console.log('upload resume');
        
        return API.get(`/user/resumeuploadurl/${fileType}`);
    }

    static profileVideoUrl(data: any): Promise<any> {
        return API.post(`/user/profile-video-url`, data);
    }

    static profilePic(data: any): Promise<any> {
        return API.post(`/user/profile-pic-url`, data);
    }

    static forgotPassword(email: string): Promise<any> {
        return API.post(`/user/forgot-password/${email}`);
    }

    static resetPassword(data: any): Promise<any> {
        return API.post(`/user/reset-password`, data);
    }

    static candidateResumeuploadurl(company: string): Promise<any> {
        return API.get(`/company/resumeuploadurl/${company}`);
    }

    static getPendingInvitation(company: string): Promise<any> {
        return API.get(`/invitation/company/${company}?status=pending`);
    }

    static getUserCredentials(code: string): Promise<any> {
        return API.get(`/user/getUserLinkedInDetails/${code}`);
    }

    static userPasswordChange(data: any): Promise<any> {
        return API.post(`/user/change-password`, data);
    }

    static userPasswordChangeOtp(email: string): Promise<any> {
        return API.get(`/user/changepwd-otp/${email}`);
    }

    static userPasswordChangeOtpAndValidate(password: string): Promise<any> {
        return API.post(`/user/changepwd-otp`, {password});
    }

    static userDeleteAccount(otp: any): Promise<any> {
        return API.delete(`/user/delete-account/${otp}`);
    }

    // /user/pwd-reset-link/:id

    static userPasswordResetLink(id: string): Promise<any> {
        return API.get(`/user/pwd-reset-link/${id}`);
    }

    static userDeleteOtp(email: string): Promise<any> {
        return API.get(`/user/deleteaccount-otp/${email}`);
    }

    static updateProfileCompleteStatus(step: number): Promise<any> {
        return API.put(`/user/profile-steps/${step}`);
    }

    static signUpWithGoogle(token: number): Promise<any> {       
        return API.post(`/user/signup-google/${token}`);
    }

    static signUpWithLinkedIn(token: string): Promise<any> {       
        return API.post(`/user/signup-linkedin/${token}`);
    }
}
