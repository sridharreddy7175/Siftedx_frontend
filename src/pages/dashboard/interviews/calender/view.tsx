
import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { SmeService } from "../../../../app/service/sme.service";
import { toast } from "react-toastify";
import { useHistory } from 'react-router-dom';

const InterviewCalenderView = () => {
    const localizer = momentLocalizer(moment)
    const [loading, setLoading] = useState(false);
    const [interviews, setInterviews] = useState<any>([]);
    const history = useHistory();

    useEffect(() => {
        getInterviews();
    }, []);

    const getInterviews = () => {
        setLoading(true);
        SmeService.getUpcomingInterviewsDahsboard().then(res => {
            if (res.error) {
                toast.error(res?.error?.message);
                setLoading(false);
            } else {
                setLoading(false);
                res.records.forEach((element: any) => {
                    element.candidate_name = `${element?.candidate_firstname} ${element?.candidate_lastname}`;
                    element.start = new Date(element?.interview_schedule);
                    element.end = new Date(element?.interview_schedule);
                    element.skills = element?.job_mandatory_skills?.split(',');
                });
                setInterviews(res)
            }
        })
    }

    const onBack = () => {
        history.goBack();
    }
    return (
        <div className="px-3">
            <div className="row px-4 py-4">
                <div className="col-md-12">
                    <h5>Accepted Interviews : Calendar View
                        <button className="small_btn rounded-3 py-1 pull-right" onClick={() => onBack()}>Previous</button>
                    </h5>
                    <h6>Alternate view of your accepted interviews</h6>
                </div>
            </div>
            <div className="row">
                <div className="col-md-8 px-4">
                    <div className="availablity-interview-part bg-white p-4">
                        <Calendar
                            localizer={localizer}
                            events={interviews}
                            startAccessor="start"
                            endAccessor="end"
                            titleAccessor='candidate_name'
                            style={{ height: 500 }}
                        />
                    </div>
                </div>
                <div className="col-md-4 px-3">
                    {/* <div className="notifications-view bg-white p-4">
                        <h6>Notifications</h6>
                        <span>How would you like to be notified?</span>
                        <div className="row mt-4">
                            <div className="col-md-3">
                                <span className="fw-bold">07 Feb</span><br />
                                <span>Mon</span>
                            </div>
                            <div className="col-md-7">
                                <div className="fw-bold">Candidate Name,</div>
                                <div className="fw-bold">Senior AI Engineer</div>
                                <div>Mon 07 Feb, 16:00 - 17:00</div>
                            </div>
                        </div>

                    </div> */}
                </div>
            </div>
        </div>
    );
}
export default InterviewCalenderView;