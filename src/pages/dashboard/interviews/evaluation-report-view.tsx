import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { JobsService } from '../../../app/service/jobs.service';
import { SmeService } from '../../../app/service/sme.service';
import { AppLoader } from '../../../components/loader';
import Pageheader from '../../../components/page-header';
import { CLOUDFRONT_URL } from '../../../config/constant';
import STAR_ICON from '../../../assets/icon_images/star.svg';
import STAR_ICON_WITH_YELLOW from '../../../assets/icon_images/star_yellow.svg';
import jsPDF from "jspdf";


export const InterviewEvaluationReportView = () => {
    let { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [interview, setInterview] = useState<any>({});
    const [selectedCandidate, setSelectedCandidate] = useState<any>({});
    const [selectedCandidateReport, setSelectedCandidateReport] = useState<any>({});
    const [interviewsZoomInfo, setInterviewsZoomInfo] = useState<any>();
    const history = useHistory();


    useEffect(() => {
        getInterviews();
    }, []);

    const getInterviews = () => {
        setLoading(true);
        JobsService.getInterviewById(id).then(res => {
         
            if (res.error) {
                toast.error(res?.error?.message);
                setLoading(false);
            } else {
                setLoading(false);
                res[0].candidateFullName = `${res[0]?.candidate_firstname} ${res[0]?.candidate_lastname}`
                res[0].smeFullName = `${res[0]?.sme_firstname} ${res[0]?.sme_lastname}`
                setInterview(res[0])
                setSelectedCandidate(res[0]);
            }
        })

        setSelectedCandidateReport({})
        SmeService.interviewFeedBackByInterview(id).then(
            res => {
                if (res.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    setLoading(false);
                    if (res.length > 0) {
                        const reportData: any = res[0];
                        reportData.skillsRating = JSON.parse(reportData?.feedback)
                        setSelectedCandidateReport(reportData);
                    }
                }
            }
        )
        SmeService.interviewZoomInfo(id).then(
            res => {
                if (res.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    setInterviewsZoomInfo({ ...res });
                }
            }
        )
    }


    const back = (): void => {
        history.push('/dashboard/interviews/completedlist')
    }
    const downloadFullreport = () => {
        var doc = new jsPDF({
            orientation: "portrait",
            unit: "px",
            // format: [4, 2]
          });
          var content = document.getElementById("pdf-content");
          
          if (content) {
            doc.html(content, {
              callback: function (doc) {
                doc.save();
              },
            });
          }
    }

    return (
        <div>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }
            <div className='p-4 pb-2'>
                <div className='d-flex justify-content-between ms-2'>
                    <div>
                        <h5 className='download_heading'>{selectedCandidate?.candidateFullName} - by {selectedCandidate?.smeFullName}</h5>
                        <p className='download_para'>Report by SME based on the interview</p>
                    </div>
                    {/* <div>
                        <button className='large_btn_apply rounded me-3' onClick={() => history.push('/dashboard/interviews/completedlist')}>Back</button>
                        <button className='large_btn_apply rounded'>Download</button>
                    </div> */}
                </div>

            </div>
            <div className='ps-3 pe-3 pe-lg-5'>
                <div className='row rounded-3 bg-white'>

                    <div className='px-4 pb-4'>
                        <p className='sx-text-primary text-end mt-2 fs_14 pointer' onClick={() => downloadFullreport()}><i className="bi bi-download me-2" style={{
                            fontSize: "18px"
                        }}></i>Download Full Report</p>
                        <div className='row' id="pdf-content">
                            <div className='col-md-5 border-end border-end-sm-none pe-md-5 mt-2'>
                                <div className='d-flex'>
                                    <p className='download_heading pe-3'>Job </p>
                                    <p className='top_para_styles'> : {selectedCandidate?.job_title}</p>
                                </div>
                                <div className='d-flex '>
                                    <p className='download_heading pe-3'>Interview ID</p>
                                    <p className='top_para_styles'> : {selectedCandidateReport?.interview_id}</p>
                                </div>
                                <div className='d-flex '>
                                    <p className='download_heading pe-3'>Interviewer</p>
                                    <p className='sx-text-primary fs_14'> : {selectedCandidate?.smeFullName}</p>
                                </div>
                                <div className='d-flex '>
                                    <p className='download_heading pe-3'>Interview date and time</p>
                                    <p className='top_para_styles'> : {moment(selectedCandidate?.interview_schedule).format('DD MMM YYYY HH:MM:SS')}</p>
                                </div>
                                {/* <div className='d-flex '>
                                    <p className='download_heading pe-3'>Time zone </p>
                                    <p className='top_para_styles'> :</p>
                                </div> */}
                                <div className='d-flex '>
                                    <p className='download_heading pe-3'>Experience </p>
                                    <p className='top_para_styles d-flex me-2'> : 4.2 {/* <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                        </svg>
                                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                            </svg>
                                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                            </svg>
                                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                            </svg>
                                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#A9A9A9" />
                                        </svg> */}
                                        <div className='ms-2'>
                                            <span><img src={STAR_ICON_WITH_YELLOW} alt="" /></span>
                                            <span><img src={STAR_ICON_WITH_YELLOW} alt="" /></span>
                                            <span><img src={STAR_ICON_WITH_YELLOW} alt="" /></span>
                                            <span><img src={STAR_ICON_WITH_YELLOW} alt="" /></span>
                                            <span><img src={STAR_ICON} alt="" /></span>
                                        </div>
                                    </p>
                                </div>
                                <div className='d-flex border-bottom pb-2'>
                                    <p className='download_heading pe-3'>Competency </p>
                                    <p className='top_para_styles d-flex'> : 3.2 {/*<svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                        </svg>
                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                        </svg>
                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                        </svg>
                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                        </svg>
                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#A9A9A9" />
                                        </svg> */}
                                        <div className='ms-2'>
                                            <span><img src={STAR_ICON_WITH_YELLOW} alt="" /></span>
                                            <span><img src={STAR_ICON_WITH_YELLOW} alt="" /></span>
                                            <span><img src={STAR_ICON_WITH_YELLOW} alt="" /></span>
                                            <span><img src={STAR_ICON_WITH_YELLOW} alt="" /></span>
                                            <span><img src={STAR_ICON} alt="" /></span>
                                        </div>
                                    </p>
                                </div>
                                {/* <hr /> */}
                                {/* <p className='download_heading py-3'>Skills </p>
                                <p className='top_para_styles border-bottom pb-4'>

                                    {selectedCandidateReport?.skillsRating?.map((data: any, index: number) => {
                                        return <p className='mb-0'>
                                            <span>
                                                <span className='skills_border_color me-3'>{data?.skill}</span>
                                                4.2<span className="ms-2">
                                                {Array.apply(null, Array(5)).map((exp: any, expIndex: number) => {
                                                    return <span className=''>
                                                        {(expIndex + 1) <= data?.experience &&
                                                            <span>
                                                           
                                                               <span><img src={STAR_ICON} alt=""/></span>  
                                                            </span>}
                                                        {!((expIndex + 1) <= data?.experience) && <span>
                                                         
                                                            <span><img src={STAR_ICON_WITH_YELLOW} alt=""/></span>
                                                        </span>
                                                        }
                                                    </span>
                                                })}
                                                </span>
                                            </span>
                                        </p>
                                    })}

                                </p> */}
                                {/* <hr /> */}
                                <p className='download_heading pe-3 pt-3'>Audio summary </p>
                                <p className='top_para_styles'>

                                    {
                                        selectedCandidateReport?.audio_summary_url ?
                                            <p>
                                                <audio src={`${CLOUDFRONT_URL}/${selectedCandidateReport?.audio_summary_url}`} controls />
                                            </p>
                                            : <p>No audio summary</p>

                                    }
                                </p>
                                <div>
                                    <button className="large_btn_apply rounded-3 btn-outline-primary me-3 mt-3 mb-1"
                                        onClick={() => history.push('/dashboard/interviews/completedlist')}
                                    >Back</button>
                                </div>

                            </div>
                            <div className='col-md-7 mt-4 mt-md-2 ps-md-3'>
                                <div>
                                    <p className='download_heading'>
                                        Short Summary
                                    </p>
                                    <p className='top_para_styles'>

                                        {
                                            selectedCandidateReport?.short_summary ?
                                                <p>
                                                    {selectedCandidateReport?.short_summary}
                                                </p>
                                                : <p>No short summary</p>

                                        }

                                    </p>
                                </div>
                                <div>
                                    <p className='download_heading'>
                                        Detailed Summary
                                    </p>
                                    <p className='top_para_styles'>


                                        {
                                            selectedCandidateReport?.detailed_summary ?
                                                <p>
                                                    {selectedCandidateReport?.detailed_summary}
                                                </p>
                                                : <p>No detailed summary</p>

                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className='col-md-8 col-sm-12'>
                        <div className='ms-3 p-3 bg-white rounded-3'>
                            <div>
                                <h6 className='mb-4 report_heading'>Report</h6>
                                <ul className='d-flex list-inline'>
                                    <li>
                                        <ul className='list-inline'>
                                            <li><p className='report_details_headings'>Job Title</p></li>
                                            <li><p className='report_details_headings'>Interview ID</p></li>
                                            <li><p className='report_details_headings'>Interviewer</p></li>
                                            <li><p className='report_details_headings'>Interview date </p></li>
                                            <li><p className='report_details_headings'>Experience</p></li>
                                            <li><p className='report_details_headings'>Competency</p></li>
                                            <li><p className='report_details_headings'>Skills</p></li>
                                        </ul>
                                    </li>

                                    <li className='ms-5'>
                                        <ul className='list-inline'>
                                            <li><p className='report_details'> {selectedCandidate?.job_title}</p></li>
                                            <li><p className='report_details'> {selectedCandidateReport?.interview_id}</p></li>
                                            <li><p className='report_details text-decoration-underline'>{selectedCandidate?.smeFullName}</p></li>
                                            <li><p className='report_details'>{moment(selectedCandidate?.interview_schedule).format('DD MMM YYYY HH:MM:SS')}</p></li>
                                            <li><p className='report_details'>4.2 <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                            </svg>
                                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                </svg>
                                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                </svg>
                                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                </svg>
                                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#A9A9A9" />
                                                </svg>
                                            </p></li>
                                            <li><p className='report_details'>3.0 <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                            </svg>
                                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                </svg>
                                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                </svg>
                                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#A9A9A9" />
                                                </svg>
                                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#A9A9A9" />
                                                </svg>
                                            </p></li>
                                            <li>
                                                <p className='report_details' style={{ width: "500px" }}>
                                                    {selectedCandidateReport?.skillsRating?.map((data: any, index: number) => {
                                                        return <p className='mb-0'>
                                                            <span>
                                                                <span className='skills_border_color me-3'>{data?.skill}</span>
                                                                {Array.apply(null, Array(5)).map((exp: any, expIndex: number) => {
                                                                    return <span>
                                                                        {(expIndex + 1) <= data?.experience &&
                                                                            <span >
                                                                                <svg className='pointer' width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#FFA800" />
                                                                                </svg>
                                                                            </span>}
                                                                        {!((expIndex + 1) <= data?.experience) && <span>
                                                                            <svg className='pointer' width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#A9A9A9" />
                                                                            </svg>
                                                                        </span>
                                                                        }
                                                                    </span>
                                                                })}
                                                            </span>
                                                        </p>
                                                    })}
                                                </p>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h6 className='report_details_headings'>Comments</h6>
                                <p className='report_details'>{selectedCandidateReport?.comments}</p>
                            </div>
                            <div>
                                <h6 className='report_details_headings'>Short Summary</h6>
                                <p className='report_details'>{selectedCandidateReport?.short_summary}</p>
                            </div>
                            <div>
                                <h6 className='report_details_headings'>Detailed Summary</h6>
                                <p className='report_details'>{selectedCandidateReport?.detailed_summary}</p>
                            </div>
                            <div>
                                <h6 className='report_details_headings'>Audio Summary</h6>
                                {
                                    selectedCandidateReport?.audio_summary_url ?
                                        <p>
                                            <audio src={`${CLOUDFRONT_URL}/${selectedCandidateReport?.audio_summary_url}`} controls />
                                        </p>
                                        : <p>No audio summary</p>

                                }

                            </div>
                            <div className='my-3'>
                                <p className='right_side_para_links m-0 p-0 my-2'>Video link</p>
                                <p className='top_para_styles'>Passcode: {interviewsZoomInfo?.passcode}</p>
                                {interviewsZoomInfo?.recordingData?.map((data: any, index: number) => {
                                    return <p><a key={index} className='right_side_para_links m-0 p-0 my-2' href={data?.play_url} target="_blanck">Video link</a></p>
                                })}
                                {!interviewsZoomInfo?.recordingData && <p>No Video Links</p>}

                            </div>
                        </div>
                    </div> */}
                    {/* <div className='col-md-3 col-sm-12 evaluation_report_right_side_col_3'>
                    <div className='rounded-3 evaluation_report_right_side'>
                        <h6 className='related_links'>Related links</h6>
                        <ul className='list-inline' style={{ marginTop: "18px" }}>
                            <li className='para_style'>Job Description</li>
                            <li className='para_style'>Candidate Profile</li>
                           
                        </ul>
                    </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
