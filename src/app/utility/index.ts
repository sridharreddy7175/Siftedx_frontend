import moment from "moment";
import { SyntheticEvent } from "react";
import { INTERVIEW_STATUS } from "./app-codes";

export class Utility {
  static PreventDefaultAndPropagation = (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  static formatInterviewSchedule = (schedule: string): string => {
    try {
      const interviewSchedule = moment(schedule);
      const startTime = interviewSchedule.format("YYYY-MM-DD, HH:mm");
      const endTime = moment(interviewSchedule).add(1, "h").format("HH:mm");
      return `${startTime}-${endTime}`;
    } catch (error) {
      return "";
    }
  };
  static getInterviewStatus = (status: string) => {
   
    try {
      let interviewStatus = "";
      switch (status) {
        case INTERVIEW_STATUS.EMPTY:
          interviewStatus = "";
          break;
        case INTERVIEW_STATUS.INTERVIEW_NOT_SCHEDULED:
          interviewStatus = "Interview Not Scheduled";
          break;
        case INTERVIEW_STATUS.NONE:
          interviewStatus = "Waiting for SME to accept";
          break;
        case INTERVIEW_STATUS.INTERVIEW_SCHEDULED:
          interviewStatus = "Interview Scheduled";
          break;
        case INTERVIEW_STATUS.INTERVIEW_TAKEN:
          interviewStatus = "Interview Taken";
          break;
        case INTERVIEW_STATUS.COMPLETED:
          interviewStatus = "Completed";
          break;
        case INTERVIEW_STATUS.CANCELLED_BY_SME:
          interviewStatus = "Cancelled by SME";
          break;
        case INTERVIEW_STATUS.CANDIDATE_NOT_ATTENDED:
          interviewStatus = "Candidate Not Attended";
          break;
        case INTERVIEW_STATUS.REJECTED_BY_SME:
          interviewStatus = "Rejected By Sme";
          break;

        default:
          break;
      }

      return interviewStatus;
    } catch (error) {
      return "";
    }
  };
}
