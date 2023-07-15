import API from "../utility/axios";

export class NotificationsService {
    static getNotificationSettingCodes(): Promise<any> {
        return API.get(`/notification/setting/codes`);
    }

    static getNotificationSettings(): Promise<any> {
        return API.get(`/notification/settings`);
    }

    static notificationSettingCodes(data: any): Promise<any> {
        return API.post(`/notification/settings`, data);
    }

    static updateSmeStatus(userId: any, status: any): Promise<any> {
        return API.put(`/user/active/${userId}/${status}`);
    }

    static markAllAsRead(uuId: any): Promise<any> {
        return API.put(`/notification/mark-readall`,uuId);
    }



    static updateSmeAvailability(status: any): Promise<any> {
        return API.put(`/user/availability/${status}`);
    }
    static getNotification(): Promise<any> {
        return API.get(`/notification`);
    }
}
