import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import { Offcanvas } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { JobsService } from '../../../../app/service/jobs.service';
import { LookUpService } from '../../../../app/service/lookup.service';
import { SmeService } from '../../../../app/service/sme.service';
import { DataTable } from '../../../../components/data-table';
import { AppLoader } from '../../../../components/loader';
import NoData from '../../../../components/no-data';
import { JobsInterviewsGridCols, JobsInterviewsRecruiterGridCols } from './data-grid-cols';
import { SX_ROLES } from "../../../../app/utility/app-codes";


export const JobInterviews = () => {
    let { id, jobId } = useParams<{ id: string, jobId: string }>();
    const [loading, setLoading] = useState(false);
    const [jobsInterviews, setJobsInterviews] = useState<any[]>([]);
    const [activePage, setActivePage] = useState(1);
    const [pageArray, setPageNumbers] = useState(1);
    const companyId = id || sessionStorage.getItem('company_uuid') || '';
    const role = sessionStorage.getItem("userRole")
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState<any>({});
    const [selectedCandidateReport, setSelectedCandidateReport] = useState<any>({});
    const [interviewsZoomInfo, setInterviewsZoomInfo] = useState<any>();
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const filterOptionsref = useRef<any>(null);
    const [selectedCategorie, setSelectedCategorie] = useState<any>('');
    const [selectedskill, setSelectedSkill] = useState<any>('');
    const [fromDate, setFromDate] = useState<any>('');
    const [toDate, setToDate] = useState<any>('');
    const [categories, setCategories] = useState<any[]>([]);
    const [skills, setSkills] = useState<any[]>([]);
    const handleClickOutside = (event: any) => {
        if (filterOptionsref.current && !filterOptionsref.current.contains(event.target)) {
            setShowFilterOptions(false);
        }
    };
    const [searchStr, setSearchStr] = useState('');

    useEffect(() => {
        getJobsData(1, '');
        getCategories();
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    const onSearchTextEmpty = (event: any) => {
        setSearchStr(event.target.value)
        if (!event.target.value) {
            getJobsData(1, event.target.value);
        }
    }

    const getJobsData = (activePage: any, search: string) => {
        setLoading(true);
        const data = {
            search: search,
            start: (activePage * 10) - 10,
            count: 10,
            from_date: fromDate,
            to_date: toDate
        }
        JobsService.getJobsInterviews(jobId, data).then(
            res => {
                if (res.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    console.log("res 11", res)
                    res.records?.forEach((element: any) => {
                    console.log("Element---->", element.interview_status==="WAITING_FOR_SME_ACCEPT")

                        element.candidateFullName = `${element?.user_firstname} ${element?.user_lastname}`
                        element.smeFullName = `${element?.sme_firstname} ${element?.sme_lastname}`
                        // element.interview_status = "Interview taken"
                        element.interview_status = element?.interview_status === 'WAITING_FOR_SME_ACCEPT' ? 'Wating for SME to accept'
                        : element?.interview_status === 'INTERVIEW_SCHEDULED' ? 'Interview Scheduled'
                          : element?.interview_status === 'INTERVIEW_TAKEN' ?
                            'Interview Taken' : element?.interview_status === 'COMPLETED' ?
                              'Interview Completed' : element?.interview_status === 'CANCELLED_BY_SME' ?
                                'Cancelled by SME' : element?.interview_status === 'CANDIDATE_NOT_ATTENDED' ?
                                  'Candidate Not Attended' : '';
                    

                    });
                    setJobsInterviews([...res?.records]);
                    setPageNumbers(res.totalRows);
                    setLoading(false);
                }
            }
        )
    }
    const onEditjobs = (data: any) => {
        if (data?.type === 'report') {
            setLoading(true);
            setSelectedCandidateReport({})
            setSelectedCandidate(data?.item);
            SmeService.interviewFeedBackByInterview(data?.item?.uuid).then(
                res => {
                    if (res.error) {
                        toast.error(res?.error?.message);
                        setLoading(false);
                    } else {
                        setShow(true);
                        setLoading(false);
                        if (res.length > 0) {
                            const reportData: any = res[0];
                            reportData.skillsRating = JSON.parse(reportData?.feedback)
                            setSelectedCandidateReport(reportData);
                        }
                    }
                }
            )
            SmeService.interviewZoomInfo(data?.item?.uuid).then(
                res => {
                    if (res.error) {
                        toast.error(res?.error?.message);
                        setLoading(false);
                    } else {
                        setInterviewsZoomInfo({ ...res });
                    }
                }
            )
            // history(`/dashboard/companies/info/${id}/jobs/info/${jobId}/reportview`)
        }
    }
    const onDeletejobs = (data: any) => {
        const id = data.id;
    }
    const onSearchText = (data: any) => {
    };

    const onPageChange = (data: any) => {
        setActivePage(data);
    }

    const getCategories = () => {
        LookUpService.jobcategories().then(
            res => {
                setCategories(res);
            }
        )
    }

    const onShowFilterOptions = () => {
        setShowFilterOptions(true)
    }

    const onCategory = (event: any) => {
        setSkills([]);
        setSelectedCategorie(event);
        if (event) {
            LookUpService.skills(event).then(
                res => {
                    setSkills(res);
                }
            )
        }
    }

    const onChanegSkill = (event: any) => {
        setSelectedSkill(event.target.value);
    }

    const onChangeFromDate = (event: any) => {
        setFromDate(event.target.value);
    }

    const onChangeToDate = (event: any) => {
        setToDate(event.target.value);
    }

    const onFliterGo = () => {
        setShowFilterOptions(false);
        getJobsData(1, searchStr);
    }

    const onViewReports = () => {
        const job = sessionStorage.getItem('selectedJob');
        history.push(`/dashboard/companies/info/${companyId}/jobs/info/${job}/reports`);
    }
    return (
        <div>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }

            {

                role === SX_ROLES.Recruiter || role === SX_ROLES.CompanyAdmin
                    ?
                    <div className='container-fluid'>
                        <div className='row  mt-4 '>
                            <div className='col-12'>
                                {jobsInterviews.length > 0 ?
                                    <DataTable TableCols={JobsInterviewsRecruiterGridCols} tableData={jobsInterviews} editInfo={onEditjobs} deleteInfo={onDeletejobs}
                                        activePageNumber={activePage} searchText={onSearchText} pageNumber={onPageChange} pageNumbers={pageArray}></DataTable> :
                                    <div className="tab-pane" id="nav-profile">
                                        <NoData message=""></NoData>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <div className='border_color rounded-3 p-3 bg-white'>
                        <div className="row mb-3" >
                            <div className="col-md-12 my-2 px-3">
                                <div className='px-lg-3 d-sm-flex justify-content-sm-between'>
                                    <div className='d-flex select_all_left_side mb-sm-0 mb-3' style={{ width: "50%" }}>
                                        {(selectedCategorie || selectedskill || fromDate || toDate) &&
                                            <div>Filter By:&nbsp;&nbsp;
                                                {selectedCategorie && <span className='pe-3'>Category: &nbsp;{selectedCategorie}</span>}
                                                {selectedskill && <span>Skill: &nbsp;{selectedskill}</span>}
                                                <br />
                                                {fromDate && <span className='pe-3'>Added on from: &nbsp;{fromDate}</span>}
                                                {toDate && <span>Added on to: &nbsp;{toDate}</span>}
                                            </div>
                                        }

                                    </div>
                                    <div className='d-flex search_and_filter_right_side position-relative' style={{ width: "50%" }}>
                                        <div className="input-group candidate_search_bar_border mt-1" style={{ width: "49%" }}>
                                            <input type="text" className="form-control form_control_border" placeholder="Search candidates by name" aria-label="Username" aria-describedby="basic-addon1" onKeyPress={(e) => onSearchText(e)} onInput={(e) => onSearchTextEmpty(e)} />
                                            <span className="input-group-text input_group_text" id="basic-addon1"><i className="fa fa-search pointer" aria-hidden="true" onClick={() => getJobsData(1, searchStr)}></i></span>
                                        </div>
                                        <button className='large_btn_filter rounded ms-3 me-3 d-flex pt-1 pb-1 mt-1' onClick={onShowFilterOptions}>
                                            <svg width="17" height="11" className='my-auto mx-1' viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6.75 10.75H10.25V9H6.75V10.75ZM0.625 0.25V2H16.375V0.25H0.625ZM3.25 6.375H13.75V4.625H3.25V6.375Z" fill="black" />
                                            </svg> Filter
                                        </button>
                                        <button className='all_members_add_members_btn px-4 py-2 rounded-2 my-1' onClick={onViewReports}>View Reports</button>

                                        {showFilterOptions && <div ref={filterOptionsref} className='filter_options row'>

                                            <div className='mb-2 col-6'>
                                                <label className="form-label job_dis_form_label">Added on from</label>
                                                <input className="form-control job_dis_form_control" type="date" max={moment().format('YYYY-MM-DD')} defaultValue={fromDate} onChange={(e) => onChangeFromDate(e)} />
                                            </div>
                                            <div className='mb-2 col-6'>
                                                <label className="form-label job_dis_form_label">Added on to</label>
                                                <input className="form-control job_dis_form_control" type="date" max={moment().format('YYYY-MM-DD')} defaultValue={toDate} onChange={(e) => onChangeToDate(e)} />
                                            </div>
                                            <div className='text-center'>
                                                <button className='large_btn px-4 rounded' onClick={onFliterGo}>Go</button>
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {jobsInterviews.length > 0 ? <DataTable TableCols={JobsInterviewsGridCols} tableData={jobsInterviews} editInfo={onEditjobs} deleteInfo={onDeletejobs}
                            activePageNumber={activePage} searchText={onSearchText} pageNumber={onPageChange} pageNumbers={pageArray}></DataTable> : <div className="tab-pane" id="nav-profile">
                            <NoData message=""></NoData>
                        </div>}
                    </div>

            }

            <div>
                <Offcanvas show={show} onHide={() => setShow(false)} placement={'end'}>
                    <Offcanvas.Body>
                        <div className=''>
                            <div className='bg-white p-4'>
                                <div className='d-flex justify-content-between'>
                                    <div>
                                        <h5 className='download_heading'>{selectedCandidate?.candidateFullName} - by {selectedCandidate?.smeFullName}</h5>
                                        <p className='download_para'>Report by SME based on the interview</p>
                                    </div>
                                    <div>
                                        <button className='large_btn rounded'>Download</button>
                                        <button className='dashboard_happy_monday_dot_btn px-2 py-1 rounded mx-2' onClick={() => setShow(false)}><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.8327 1.34167L10.6577 0.166668L5.99935 4.825L1.34102 0.166668L0.166016 1.34167L4.82435 6L0.166016 10.6583L1.34102 11.8333L5.99935 7.175L10.6577 11.8333L11.8327 10.6583L7.17435 6L11.8327 1.34167Z" fill="black" />
                                        </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <h6 className='mb-4 report_heading'>Report</h6>
                                    <ul className='d-flex list-inline'>
                                        <li>
                                            <ul className='list-inline'>
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
                                                <li><p className='report_details'> {selectedCandidateReport?.id} &nbsp;</p></li>
                                                <li><p className='report_details text-decoration-underline'>{selectedCandidate?.smeFullName}</p></li>
                                                <li><p className='report_details'>{moment(selectedCandidate?.interview_schedule).format('DD MMM YYYY')}</p></li>
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
                                                            return <p className='mb-0 pt-3'>
                                                                <span>
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
                                                                    <span className='skills_border_color ms-3'>{data?.skill}</span>
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
                                    <p>
                                        <audio src={selectedCandidateReport?.audio_summary_url} controls />
                                    </p>
                                </div>
                                <div className='my-5 text-end px-5'>
                                    <p>Passcode: {interviewsZoomInfo?.passcode}</p>
                                    {interviewsZoomInfo?.recordingData?.map((data: any, index: number) => {
                                        return <p><a key={index} className='right_side_para_links m-0 p-0 my-2' href={data?.play_url} target="_blanck">Video link</a></p>
                                    })}
                                    <p className='right_side_para_links m-0 p-0'>Full Report</p>
                                </div>
                            </div>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
        </div>
    )
}