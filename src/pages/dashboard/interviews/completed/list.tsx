import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Form, Modal, Offcanvas } from 'react-bootstrap';
import { LookUpService } from '../../../../app/service/lookup.service';
import { SmeService } from '../../../../app/service/sme.service';
import { SX_ROLES } from '../../../../app/utility/app-codes';
import { DataTable } from '../../../../components/data-table'
import FormBuilder from '../../../../components/form-builder';
import { AppLoader } from '../../../../components/loader';
import NoData from '../../../../components/no-data';
import { CompletedDataGridCols } from './data-grid-cols';
import { Utility } from '../../../../app/utility';

export const InterviewCompletedList = () => {
    let { id, code } = useParams<{ id: string, code: string }>();
    const companyId = parseInt(id);
    const companyCode = code;
    const [pageArray, setPageNumbers] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [recordsList, setrecordsList] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const companyForm = useRef<any>({});
    const [searchData, setSearchData] = useState<any>({});
    const [interviews, setInterviews] = useState<any>([]);
    const history = useHistory();
    const userId = sessionStorage.getItem('userUuid') || '';
    const role = sessionStorage.getItem('userRole');
    const company = sessionStorage.getItem('company_uuid') || '';
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [skills, setSkills] = useState<any[]>([]);
    const filterOptionsref = useRef<any>(null);
    const [selectedCategorie, setSelectedCategorie] = useState<any>('');
    const [selectedskill, setSelectedSkill] = useState<any>('');
    const [fromDate, setFromDate] = useState<any>('');
    const [toDate, setToDate] = useState<any>('');
    const [searchStr, setSearchStr] = useState('');
    const [selectedCandidatesList, setSelectedCandidatesList] = useState<any[]>([]);
    const [selectedCandidate, setSelectedCandidate] = useState<any>({});
    const [avalableCalenderTimes, setAvalableCalenderTimes] = useState<any[]>([]);
    const [showFirstCandidate, setShowFirstCandidate] = React.useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const handleClickOutside = (event: any) => {
        if (filterOptionsref.current && !filterOptionsref.current.contains(event.target)) {
            setShowFilterOptions(false);
        }
    };


    useEffect(() => {
        getInterviews(1, '','','');
        getCategories();
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    let userData = sessionStorage.getItem("userRole")

    const isClearButton = () => {
        if (searchStr) {
            setIsFilterOpen(true)

        }
        else {
            setIsFilterOpen(false)

        }


    }

    const clearFilter = (event: any) => {
        // setInterviews([])
     
        setSearchStr('');
       
        setFromDate('')
        setToDate('')
        setShowFilterOptions(false);
        getInterviews(1, '', '', '');
        // isClearButton();
        setIsFilterOpen(false)
    }

    const getInterviews = (activePage: any, search: string, fromDate: string,
        toDate: string) => {
        setLoading(true);
        isClearButton()
        if (role === SX_ROLES.CompanyAdmin) {
            const data = {
                status: 'completed',
                search: search,
                start: (activePage * 10) - 10,
                count: 10,
                category: selectedCategorie,
                skill: selectedskill,
                from_date: fromDate,
                to_date: toDate
            }
            SmeService.getCommingInterviews(company, data).then(res => {

                if (res.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    setLoading(false);
                    res.records?.forEach((element: any) => {
                        element.candidate_name = `${element?.candidate_firstname} ${element?.candidate_lastname}`
                        element.skills = element?.job_mandatory_skills?.split(',');
                        element.interview_status = "Completed"
                    });
                    setPageNumbers(res.totalRows);
                    setInterviews(res.records)
                }
            })
        } else {
            const data = {
                status: 'completed',
                search: search,
                start: (activePage * 10) - 10,
                count: 10,
                category: selectedCategorie,
                skill: selectedskill,
                from_date: fromDate,
                to_date: toDate
            }
            SmeService.getSmeInterviews(userId, data).then(res => {

                if (res.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    setLoading(false);


                    res.records.forEach((element: any) => {
                        element.candidate_name = `${element?.candidate_firstname} ${element?.candidate_lastname}`
                        element.interview_schedule= Utility.formatInterviewSchedule(element.interview_schedule); 
                        element.skills = element?.job_mandatory_skills?.split(',');
                        element.interview_status = "Completed"
                    });
                    setInterviews(res.records);
                }
            })
        }
    }


    const onSearchText = (event: any) => {
        
        if (event.key === "Enter") {
            getInterviews(1, event.target.value, fromDate, toDate);
           
          }
    };

    const onPageChange = (data: any) => {
        setActivePage(data);
        getInterviews(data, searchStr, fromDate, toDate);
    }

    const onCandidateEdit = () => {
        sessionStorage.setItem('selectedCandidate', JSON.stringify(selectedCandidate));
        history.push(`/dashboard/candidates/form/${selectedCandidate?.uuid}`);
    }

    const onEditrecords = (data: any) => {
        if (data?.type === 'complete') {
            history.push(`/dashboard/interviews/evaluation-report-view/${data.item?.uuid}`);
        } else if (data.type === 'link' && userData === "SME") {
            sessionStorage.setItem("selectedInterviewCompany", data?.item?.company_uuid);
            history.push(
                `/dashboard/interviewview/description/${data?.item?.job_uuid}/${data?.item?.uuid}`
            );

            // setShowCancelPopup(true);
        }
        else if (data.type === "link" && userData === "CompanyAdmin") {
            setShowFirstCandidate(true);
            setSelectedCandidate(data?.item);
        }
    }

    const onDeleterecords = (data: any) => {
        const id = data.id;
    }

    const handleInput = (data: any) => {
        setSearchData(data);
    };
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

    const onSearchTextEmpty = (event: any) => {
        setSearchStr(event.target.value)
        if (!event.target.value) {
            getInterviews(1, event.target.value,fromDate, toDate);
            setIsFilterOpen(false);
          }
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
        getInterviews(1, searchStr, fromDate, toDate);
        if (fromDate && toDate) {
            setIsFilterOpen(true);
          }
    }
    return (
        <div>
            <div className='siftedx-table job_description_padding mt-lg-0 ms-3 me-3 ms-lg-3 me-lg-3' style={{minHeight:"500px"}}>
                {loading &&
                    <AppLoader loading={loading}></AppLoader>
                }
                <div className="row py-3" >
                    <div className="col-md-12 my-2 px-3">
                        <div className='px-lg-3 d-sm-flex justify-content-sm-between'>
                            <div className='d-flex select_all_left_side mb-sm-0 mb-3'>
                                {/* {(selectedCategorie || selectedskill || fromDate || toDate) &&
                                    <div>Filter By:&nbsp;&nbsp;
                                        {selectedCategorie && <span className='pe-3'>Category: &nbsp;{selectedCategorie}</span>}
                                        {selectedskill && <span>Skill: &nbsp;{selectedskill}</span>}
                                        <br />
                                        {fromDate && <span className='pe-3'>From Date: &nbsp;{fromDate}</span>}
                                        {toDate && <span>To Date: &nbsp;{toDate}</span>}
                                    </div>
                                } */}
                            </div>
                            <div className='d-flex search_and_filter_right_side position-relative'>
                                <div className="input-group candidate_search_bar_border mt-1">
                                    <input type="text" className="form-control form_control_border form-search" placeholder="Search candidates by name" aria-label="Username"
                                     value={searchStr} aria-describedby="basic-addon1" 
                                    onKeyPress={(e) => onSearchText(e)} onInput={(e) => onSearchTextEmpty(e)} />
                                    <span className="input-group-text input_group_text" id="basic-addon1">
                                        <i className="fa fa-search pointer" aria-hidden="true"  onClick={() => getInterviews(1, searchStr, fromDate, toDate)} ></i></span>

                                </div>
                                <button className='large_btn_filter rounded ms-3 d-flex pt-1 pb-1 mt-1' onClick={onShowFilterOptions}>
                                    <svg width="17" height="11" className='my-auto mx-1' viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.75 10.75H10.25V9H6.75V10.75ZM0.625 0.25V2H16.375V0.25H0.625ZM3.25 6.375H13.75V4.625H3.25V6.375Z" fill="black" />
                                    </svg> Filter
                                </button>
                                {
                                    isFilterOpen &&
                                    <button className='large_btn_filter  ms-3 rounded mt-1 w-auto px-2'
                                        onClick={clearFilter}
                                    >Clear&nbsp;Filter</button>
                                }
                                {showFilterOptions &&
                                    <>
                                        <div className='popup_overlay' onClick={() => setShowFilterOptions(false)}></div>
                                        <div ref={filterOptionsref} className='row rounded-3 sx-bg-page p-3 position-absolute end-0 top-100 mt-1 z-index-1055'>
                                            {/* <div className='mb-2 col-12 col-lg-6'>
                                                <div className='ms-2'>
                                                    <label className="form-label job_dis_form_label">Category</label>
                                                    <select className="form-select job_dis_form_control" name='job_category' aria-label="Default select example" value={selectedCategorie} onChange={(e) => onCategory(e.target.value)}>
                                                        <option selected>Select category</option>
                                                        {categories.map((data: any, index: number) => { return <option key={index} value={data}>{data}</option> })}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='mb-2 col-12 col-lg-6'>
                                                <div className='ms-2'>
                                                    <label className="form-label job_dis_form_label">Skill</label>
                                                    <select className="form-select job_dis_form_control" aria-label="Default select example" value={selectedskill} onChange={(e) => onChanegSkill(e)}>
                                                        <option value="">Select</option>
                                                        {skills.map((data: any, index: number) => { return <option key={index} value={data.skill}>{data.skill}</option> })}
                                                    </select>
                                                </div>
                                            </div> */}
                                            <div className='mb-2 col-12 col-lg-6'>
                                                <div className='ms-2'>
                                                    <label className="form-label job_dis_form_label">From Date</label>
                                                    <input className="form-control job_dis_form_control" type="date"
                                                    //  max={moment().format('YYYY-MM-DD')} 
                                                     defaultValue={fromDate} onChange={(e) => onChangeFromDate(e)} />
                                                </div>
                                            </div>
                                            <div className='mb-2 col-12 col-lg-6'>
                                                <div className='ms-2'>
                                                    <label className="form-label job_dis_form_label">To Date</label>
                                                    <input className="form-control job_dis_form_control" type="date" 
                                                    // max={moment().format('YYYY-MM-DD')}
                                                     defaultValue={toDate} onChange={(e) => onChangeToDate(e)} />
                                                </div>
                                            </div>
                                            <div className='col-12 text-end mt-2'>
                                                <button className='large_btn_apply px-4 rounded w-sm-100' onClick={onFliterGo}>Filter</button>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {interviews.length > 0 ? <DataTable TableCols={CompletedDataGridCols} tableData={interviews} editInfo={onEditrecords} deleteInfo={onDeleterecords}
                    activePageNumber={activePage} searchText={onSearchText} pageNumber={onPageChange} pageNumbers={pageArray}></DataTable>
                    : <div className="text-center">
                        <NoData message=""></NoData>
                    </div>
                }
            </div>

            <Offcanvas show={showFirstCandidate} onHide={() => setShowFirstCandidate(false)} placement={'end'}>
                <Offcanvas.Body>
                    <div>
                        <div className="bg-white p-4">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h5 className="download_heading">
                                        {selectedCandidate?.candidate_firstname}{" "}
                                        {selectedCandidate?.candidate_lastname}
                                    </h5>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p>
                                        Added on{" "}
                                        <b className="download_heading_name">
                                            {moment(selectedCandidate?.created_dt).format(
                                                "DD MMM YYYY"
                                            )}
                                        </b>
                                        &nbsp; by &nbsp;
                                        <b className="download_heading_name">Recruiter Name</b>
                                    </p>
                                </div>
                                <div>
                                    {/* <button
                                        className="large_btn rounded"
                                        onClick={() => onCandidateEdit()}
                                    >
                                        Edit
                                    </button> */}
                                    <button
                                        className="dashboard_happy_monday_dot_btn px-2 py-1 rounded mx-2"
                                        onClick={() => setShowFirstCandidate(false)}
                                    >
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M11.8327 1.34167L10.6577 0.166668L5.99935 4.825L1.34102 0.166668L0.166016 1.34167L4.82435 6L0.166016 10.6583L1.34102 11.8333L5.99935 7.175L10.6577 11.8333L11.8327 10.6583L7.17435 6L11.8327 1.34167Z"
                                                fill="black"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="mt-3">
                                    <h5 className="download_heading">Basic Details</h5>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 p-2">
                                    <div className="row">
                                        <div className="col-md-2">
                                            <p className="download_heading_title">Name</p>
                                        </div>
                                        <div className="col-md-10">
                                            <p>
                                                {selectedCandidate?.candidate_firstname}{" "}
                                                {selectedCandidate?.candidate_lastname}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <p className="download_heading_title">Email</p>
                                        </div>
                                        <div className="col-md-10">
                                            <p>{selectedCandidate?.user_email}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <p className="download_heading_title">Mobile</p>
                                        </div>
                                        <div className="col-md-10">
                                            <p>{selectedCandidate?.mobile_no}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <p className="download_heading_title">LinkedIn</p>
                                        </div>
                                        <div className="col-md-10">
                                            <p>
                                                {" "}
                                                <a
                                                    style={{
                                                        color: "#000000",
                                                        textDecoration: "none",
                                                        cursor: "pointer",
                                                    }}
                                                    href={selectedCandidate?.linkedin_url}
                                                    target="_blank"
                                                >
                                                    {
                                                        selectedCandidate?.linkedin_url ? (
                                                            selectedCandidate?.linkedin_url
                                                        ) : (
                                                            <>&nbsp;</>
                                                        )
                                                    }
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <p className="download_heading_title">Added</p>
                                        </div>
                                        <div className="col-md-10">
                                            <p>
                                                {moment(selectedCandidate?.created_at).format(
                                                    "DD MMM YYYY"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <p className="download_heading_title">CV</p>
                                        </div>
                                        <div className="col-md-10">
                                            <a
                                                style={{ color: "#000000" }}
                                                href={selectedCandidate?.resume_urls}
                                                target="_blank"
                                            >
                                                Document
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="my-1 w-75">
                                    <hr />
                                </div>
                                <div className="col-12 mt-3 p-2">
                                    <h6 className="download_heading_title">Availability</h6>
                                    {avalableCalenderTimes.length > 0 ? (
                                        <div>
                                            {avalableCalenderTimes?.map(
                                                (data: any, index: number) => {
                                                    return (
                                                        <div className="row " key={index}>
                                                            <div className="col-md-10">
                                                                <div>
                                                                    <p className="top_para_styles fw_7 mb-0 mt-1">
                                                                        {moment(data?.availability_date).format(
                                                                            "DD MMMM YYYY"
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    {data?.times?.map(
                                                                        (time: any, timeIndex: number) => {
                                                                            return (
                                                                                <div
                                                                                    key={timeIndex}
                                                                                    className="top_para_styles fw_4"
                                                                                >
                                                                                    {time?.time_from} - {time?.time_to}
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    ) : (
                                        <div>No Availability</div>
                                    )}
                                </div>

                                <div className="my-1 w-75">
                                    <hr />
                                </div>
                                <div className="col-12 mt-3 p-2">
                                    <h6 className="download_heading_title">Report</h6>
                                    <div>
                                        <div className="row">
                                            <div className="col-6 font_bolder p-2 download_heading_title">Experience</div>
                                            <div className="col-6 font_bolder p-2 download_heading_title">Skills</div>
                                        </div>
                                        {selectedCandidate.skills?.map(
                                            (data: any, index: number) => {
                                                return (
                                                    <div className="row " key={index}>
                                                        <div className="col-6 p-2">{data}</div>
                                                        <div className="col-6 p-2">
                                                            {selectedCandidate.exp[index]}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas >

        </div>
    )
}