import moment from "moment";
import React, { useEffect, useState } from "react";
import InterviewOpportunities from "../../../assets/icon_images/Interview Opportunities.svg";
import UpcomingInterviews from "../../../assets/icon_images/Upcoming interviews.svg";
import OpenJobs from '../../../assets/icon_images/open_jobs.svg';
// import Job from "../../assets/icon_images/job.svg";
interface Props {
    jobsList: any;
    companyUpcomingInterview: any;
}



const RecruiterDashBoard = (props: Props) => {
    const userdData = sessionStorage.getItem("loginData") || "";
    const [loginUserdata, setLoginUserdata] = useState(
        userdData ? JSON.parse(userdData) : {}
    );




    return (
        <>
            {/* <div className="col-md-7 col-xl-8 mb-5"> */}
            <div className="row bg-white rounded-3 p-4 me-md-3">
                <div className="col-lg-6 col-md-5 col-12 mb-4 mb-md-0">
                    <div>
                        <h5 className="top_heading_styles">
                            Happy {moment().format("dddd")} {" "}
                            {loginUserdata?.user_firstname}{" "}
                            {loginUserdata?.user_lastname}
                        </h5>
                        <p className="top_para_styles mb-2">welcome to a faster tech screening <br />experience</p>
                        <p className="top_para_styles mb-0">Let us help you find the right candidates<br /> with our expert SMEs</p>
                    </div>
                </div>
                <div className="col-lg-6 col-12">
                    <div className='row'>
                        <div className='col-6'>
                            <div className="rounded-3 py-3 px-2 bg-interview h-100 me-lg-3 me-1">
                                <div className="d-flex align-items-center justify-content-between px-2 text-white">
                                    <h2 className="text-heading-2">
                                        {props?.jobsList ? props?.jobsList : 0}
                                    </h2>
                                    <img
                                        src={OpenJobs}
                                        alt="Interview Requests"
                                        className=""
                                    />

                                </div>
                                <div className="mt-1 text-white">Open jobs</div>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className="rounded-3 py-3 px-2 bg-upcoming-interview h-100 ms-lg-3 ms-1">
                                <div className="d-flex align-items-center justify-content-between px-2 text-white">
                                    <h2 className="text-heading-2">
                                        {/* {jobsList.length} */}
                                        {props.companyUpcomingInterview ? props.companyUpcomingInterview : 0}
                                    </h2>
                                    <img
                                        src={UpcomingInterviews}
                                        alt="Interview Requests"
                                        className=""
                                    />
                                </div>
                                <div className="mt-3 text-white">Upcoming Interviews</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* </div> */}

        </>
    )
}

export default RecruiterDashBoard;