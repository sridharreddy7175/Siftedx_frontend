import React, { useEffect, useRef, useState, SyntheticEvent } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { DataTable } from '../../../../components/data-table';
import Pageheader from '../../../../components/page-header';
import { InterviewsDataGridCols } from './data-grid-cols';
import { SmeService } from '../../../../app/service/sme.service';
import { SX_ROLES } from '../../../../app/utility/app-codes';
import { toast } from 'react-toastify';
import { AppLoader } from '../../../../components/loader';
import NoData from '../../../../components/no-data';
import moment from 'moment';
import { Utility } from '../../../../app/utility';




export const InterviewList = () => {
    let { id, code } = useParams<{ id: string, code: string }>();
    const location = useLocation().pathname;
    const [activeStep, setActiveStep] = React.useState('active');
    const companyId = parseInt(id);
    const [pageArray, setPageNumbers] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [interviews, setInterviews] = useState<any>([]);
    const history = useHistory();
    const userId = sessionStorage.getItem('userUuid') || '';
    const role = sessionStorage.getItem('userRole');
    const company = sessionStorage.getItem('company_uuid') || '';
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const filterOptionsref = useRef<any>(null);
    const [selectedskill, setSelectedSkill] = useState<any>('');
    const [fromDate, setFromDate] = useState<any>('');
    const [toDate, setToDate] = useState<any>('');
    const [searchStr, setSearchStr] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isapiloaded, setisapiloaded] = useState<any>(false);


    const handleClickOutside = (event: any) => {
        if (filterOptionsref.current && !filterOptionsref.current.contains(event.target)) {
            setShowFilterOptions(false);
        }
    };
    useEffect(() => {
        onSelectTab('active');
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);



    const getInterviewsUpcoming = (activePage: any, search: string, fromDate: string,
        toDate: string) => {
        setInterviews([]);
        setLoading(true);
        const data = {
            status: 'interview_scheduled',
            search: search,
            start: (activePage * 10) - 10,
            count: 10,
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
                res.records.forEach((element: any) => {
                    element.candidate_name = `${element?.candidate_firstname} ${element?.candidate_lastname}`
                    element.smeFullName = `${element?.sme_firstname} ${element?.sme_lastname}`
                    element.skills = element?.job_mandatory_skills?.split(',');
                    element.interview_status = "Interview scheduled";
                    element.formated_schedule = Utility.formatInterviewSchedule(element.interview_schedule);
                });
                setPageNumbers(res.totalRows);
                setInterviews([...res.records])
            }
        })
    }


    const getInterviews = (activePage: any, search: string, fromDate: string,
        toDate: string) => {
        setInterviews([]);
        isClearButton()
        setLoading(true);
        const data = {
            status: 'completed',
            search: search,
            start: (activePage * 10) - 10,
            count: 10,
            skill: selectedskill,
            from_date: fromDate,
            to_date: toDate
        }
        SmeService.getCommingInterviews(company, data).then(res => {
            setisapiloaded(true);
            if (res.error) {
                toast.error(res?.error?.message);
                setLoading(false);
            } else {
                setLoading(false);
                res.records?.forEach((element: any) => {
                    element.candidate_name = `${element?.candidate_firstname} ${element?.candidate_lastname}`
                    element.skills = element?.job_mandatory_skills?.split(',');
                    element.interview_status = "Completed"
                    element.formated_schedule = Utility.formatInterviewSchedule(element.interview_schedule);
                });
                setPageNumbers(res.totalRows);
                setInterviews([...res.records])
            }
        })

        // else {
        //     const data = {
        //         status: 'completed',
        //         search: search,
        //         start: (activePage * 10) - 10,
        //         count: 10,
        //         skill: selectedskill,
        //         from_date: fromDate,
        //         to_date: toDate
        //     }
        //     SmeService.getSmeInterviews(userId, data).then(res => {
        //         if (res.error) {
        //             toast.error(res?.error?.message);
        //             setLoading(false);
        //         } else {
        //             setLoading(false);
        //             res.records.forEach((element: any) => {
        //                 element.candidate_name = `${element?.candidate_firstname} ${element?.candidate_lastname}`
        //                 element.skills = element?.job_mandatory_skills?.split(',');
        //                 element.interview_status = "Completed"
        //             });
        //             setInterviews([...res.records]);
        //         }
        //     })
        // }
    }


    const onSearchText = (event: any) => {
        if (event.key === "Enter") {
            setIsFilterOpen(true);
            getInterviews(1, event.target.value, fromDate, toDate);
          }
    };





    const onShowFilterOptions = (event: SyntheticEvent) => {
        setShowFilterOptions(!showFilterOptions);
        event.stopPropagation();
        event.preventDefault();
    }

    const onSearchTextEmpty = (event: any) => {
        setSearchStr(event.target.value)
        if (!event.target.value) {
            getInterviews(1, searchStr, fromDate,
                toDate);
        }
    }

    const isClearButton = () => {
        if (searchStr) {
            setIsFilterOpen(true)

        }
        else {
            setIsFilterOpen(false)

        }


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



    const onPageChange = (data: any) => {
        setActivePage(data);
    }

    const onEditinterview = (data: any) => {
        history.push(`/dashboard/companies/info/${companyId}/interviewsform/1`);
    }

    const onDeleteinterview = (data: any) => {
        const id = data.id;
    }


    const onDeleterecords = (data: any) => {
        const id = data.id;
    }




    const tabs = [
        {
            label: "Upcoming",
            path: 'active',
        },
        {
            label: "Completed",
            path: "completed",
        },
    ];

    const onSelectTab = (type: string) => {
        

        if (type === "active") {
            getInterviewsUpcoming(1, '','','');
        }
        else if (type === "completed") {
            getInterviews(1, '','','');
        }
        setActiveStep(type);

    };


    const clearFilter = (event: any) => {
        setSearchStr(''); 
        setFromDate('');
        setToDate('');
        setShowFilterOptions(false);
        if (activeStep === "active") {
            getInterviewsUpcoming(1, '','','');
        }
        else if (activeStep === "completed") {
            getInterviews(1, '','','');
        }
        setIsFilterOpen(false)
    }

    return (
        <div>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }

            {location === '/dashboard/interviews' &&

                <div className="container-fluid">
                    <Pageheader
                        title="Interviews"
                        subTitle="Complete list of past and future interviews scheduled"
                        buttonName="edit"
                        editButtonClick={() => { }}
                        hideButton={true}
                    />
                </div>
            }


            <div className="row ps-3 pe-3 pe-lg-5">
                <div className='col-12'>
                    <div className="row">
                        <div className="col-12">
                            <div className="ms-3 mt-2">
                                <ul className="nav">
                                    {tabs.map((data: any, index: number) => {
                                        return (
                                            <li
                                                key={index}
                                                className={`nav-item tab ${data?.path === activeStep
                                                    ? "active"
                                                    : ""
                                                    }`}
                                                style={{ fontSize: "14px" }}
                                            >
                                                <span
                                                    className="nav-link text-white all_members_nav_link_font_size nav-hover pointer"
                                                    onClick={() =>
                                                        onSelectTab(data?.path)
                                                    }
                                                >
                                                    {data?.label}{" "}
                                                    {data?.count ? data?.count : ""}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>

                            </div>

                            <div className="col-12">
                                <div className='bg-white rounded-3'>
                                    <div className='px-1 pb-4 pt-3'>
                                        <div className='px-lg-3 d-sm-flex justify-content-sm-between'>
                                            <div className='d-flex select_all_left_side mb-sm-0 mb-3'>
                                            </div>
                                            <div className='d-flex search_and_filter_right_side position-relative px-3 '>
                                                <div className="input-group candidate_search_bar_border mt-1">
                                                    <input type="text" className="form-control form_control_border" placeholder="Search Candidate Or Company" aria-label="Username" aria-describedby="basic-addon1" onKeyPress={(e) => onSearchText(e)} onInput={(e) => onSearchTextEmpty(e)} value={searchStr}/>
                                                    <span className="input-group-text input_group_text" id="basic-addon1"><i className="fa fa-search pointer" aria-hidden="true" onClick={() => getInterviews(1, searchStr, fromDate, toDate)}></i></span>
                                                </div>
                                                <button className='large_btn_filter rounded ms-3 d-flex my-auto pt-1 pb-1 mt-1' onClick={(e) => onShowFilterOptions(e)}><svg width="17" height="11" className='my-auto mx-1' viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.75 10.75H10.25V9H6.75V10.75ZM0.625 0.25V2H16.375V0.25H0.625ZM3.25 6.375H13.75V4.625H3.25V6.375Z" fill="black" />
                                                </svg> Filter
                                                </button>
                                                {
                                    isFilterOpen &&
                                    <button className='large_btn_filter  ms-3 rounded mt-1 w-auto px-2'
                                        onClick={clearFilter}
                                    >Clear&nbsp;Filter</button>
                                }
                                                {showFilterOptions && <div>
                                                    <div className='popup_overlay' onClick={() => setShowFilterOptions(false)}></div>
                                                    <div ref={filterOptionsref} className='row rounded-3 sx-bg-page p-3 position-absolute end-0 top-100 mt-1 z-index-1055'>
                                                        <div className='mb-2 col-12 col-lg-6'>
                                                            <div className='me-lg-2'>
                                                                <label className="form-label job_dis_form_label">From Date</label>
                                                                <input className="form-control job_dis_form_control mt-2" type="date"  defaultValue={fromDate} onChange={(e) => onChangeFromDate(e)} />
                                                            </div>
                                                        </div>
                                                        <div className='mb-2 col-12 col-lg-6'>
                                                            <div className='ms-lg-2'>
                                                                <label className="form-label job_dis_form_label">To Date</label>
                                                                <input className="form-control job_dis_form_control mt-2" type="date" defaultValue={toDate} onChange={(e) => onChangeToDate(e)} />
                                                            </div>
                                                        </div>
                                                        <div className='col-12 text-end mt-2'>
                                                            <button className='large_btn_apply px-4 rounded w-sm-100' onClick={onFliterGo}>Filter</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {interviews.length > 0 ? <DataTable TableCols={InterviewsDataGridCols} tableData={interviews} deleteInfo={onDeleterecords}
                                        activePageNumber={activePage} searchText={onSearchText} pageNumber={onPageChange} pageNumbers={pageArray}></DataTable>
                                        : <div className="text-center">
                                            {isapiloaded&&
                                            <NoData message=""></NoData>
                                             }
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=''>


            </div>
        </div>
    )
}