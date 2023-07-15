import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { LookUpService } from '../../../../app/service/lookup.service';
import { SmeService } from '../../../../app/service/sme.service';
import { Utility } from '../../../../app/utility';
import { SX_ROLES } from '../../../../app/utility/app-codes';
import { DataTable } from '../../../../components/data-table'
import FormBuilder from '../../../../components/form-builder';
import { AppLoader } from '../../../../components/loader';
import NoData from '../../../../components/no-data';
import { RejectedDataGridCols } from './data-grid-cols';
import { Modal } from "react-bootstrap";
import { JobsService } from '../../../../app/service/jobs.service';


export const InterviewRejectedList = () => {
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
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showAcceptPopup, setShowAcceptPopup] = useState(false);
    const [selectedJob, setSelectedJob] = React.useState<any>({});

    const handleClickOutside = (event: any) => {
        if (filterOptionsref.current && !filterOptionsref.current.contains(event.target)) {
            setShowFilterOptions(false);
        }
    };


    const isClearButton = () => {
        if (searchStr) {
            setIsFilterOpen(true)

        }
        else {
            setIsFilterOpen(false)

        }


    }

   

    useEffect(() => {
        getInterviews(1, '', '', '');
        getCategories();
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    const getInterviews = (activePage: any, search: string, fromDate: string,
        toDate: string) => {
        setLoading(true);
        isClearButton()
        if (role === SX_ROLES.CompanyAdmin) {
            const data = {
                status: 'REJECTED_BY_SME',
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
                    });
                    setPageNumbers(res.totalRows);
                    setInterviews(res.records)
                }
            })
        } else {
            const data = {
                status: 'REJECTED_BY_SME',
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
                        element.interview_schedule = Utility.formatInterviewSchedule(element.interview_schedule); 
                        element.skills = element?.job_mandatory_skills?.split(',');
                        element.interview_status = "Rejected"
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

    const onEditrecords = (data: any) => {
    setSelectedJob(data?.item);
        if (data?.type === 'complete') {
            history.push(`/dashboard/interviews/evaluation-report-view/${data.item?.uuid}`);
        } else if (data.type === 'link') {
            sessionStorage.setItem("selectedInterviewCompany", data?.item?.company_uuid);
            history.push(
                `/dashboard/interviewview/description/${data?.item?.job_uuid}/${data?.item?.uuid}`
            );
            // setShowCancelPopup(true);
        }
        else if(data.type==="accept"){
            setShowAcceptPopup(true)
          
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
    const onAcceptJob = () => {
           setLoading(true);
        JobsService.smeAcceptInterview(selectedJob?.uuid).then((res) => {
          if (res?.error) {
            setLoading(false);
            toast.error(res?.error?.message);
          } else {
            setShowAcceptPopup(false);
            setLoading(false);
            getInterviews(1, "", "", "");
            toast.success("Accepted successfully");
          }
        });
       
      };
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

    const clearFilter = (event: any) => {
       
     
        setSearchStr('');
       
        setFromDate('')
        setToDate('')
        setShowFilterOptions(false);
        getInterviews(1, '', '', '');
        
        setIsFilterOpen(false)
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
                                    <input type="text" className="form-control form_control_border form-search" placeholder="Search candidates by name" aria-label="Username" aria-describedby="basic-addon1" onKeyPress={(e) => onSearchText(e)} onInput={(e) => onSearchTextEmpty(e)} value={searchStr} />
                                    <span className="input-group-text input_group_text" id="basic-addon1"><i className="fa fa-search pointer" aria-hidden="true" onClick={() => getInterviews(1, searchStr, fromDate, toDate)}></i></span>

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
                                                <button className='large_btn_apply px-4 rounded w-sm-100' style={{ top: "-180px" }} onClick={onFliterGo}>Filter</button>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {interviews.length > 0 ? <DataTable TableCols={RejectedDataGridCols} tableData={interviews} editInfo={onEditrecords} deleteInfo={onDeleterecords}
                    activePageNumber={activePage} searchText={onSearchText} pageNumber={onPageChange} pageNumbers={pageArray}></DataTable>
                    : <div className="text-center">
                        <NoData message=""></NoData>
                    </div>
                }

<Modal
          show={showAcceptPopup}
          onHide={() => setShowAcceptPopup(false)}
          aria-labelledby="contained-modal-title-vcenter"
          className="sx-close w-100"
          size="sm"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="top_para_styles p-0 m-0 text-center mt-3 mb-0">
              Are you sure you want accept this interview request
            </p>
            <p className="top_para_styles p-0 m-0 text-center mt-3 mb-0">
              <b>{selectedJob?.job_title}</b>
            </p>
            <div className="row">
              <div className="col-6 px-3 py-3 mt-3">
                <button
                  type="button"
                  className="rounded text-decoration-none open_cv ps-3 pt-1 pb-1 pe-3 ms-2 ms-lg-0 ms-sm-2 fw-normal bg-transparent"
                  onClick={() => setShowAcceptPopup(false)}
                >
                  No
                </button>
              </div>
              <div className="col-6 text-end px-3 py-3 mt-3">
                <button
                  type="button"
                  className="rounded text-decoration-none ps-4 pt-1 pb-1 pe-4 fw-normal upload_cv"
                  onClick={onAcceptJob}
                >
                  Yes
                </button>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
            </div>
        </div>
    )
}