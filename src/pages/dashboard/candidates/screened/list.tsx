import moment from 'moment';
import React, { useEffect, useRef, useState, SyntheticEvent } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { CandidatesService } from '../../../../app/service/candidates.service';
import { LookUpService } from '../../../../app/service/lookup.service';
import { Utility } from '../../../../app/utility';
import { DataTable } from '../../../../components/data-table';
import FormBuilder from '../../../../components/form-builder';
import { AppLoader } from '../../../../components/loader';
import { InterviewsDataGridCols } from './data-grid-cols';

export const ScreenedCandidates = () => {
    const [pageArray, setPageNumbers] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [loading, setLoading] = useState(false);
    const companyForm = useRef<any>({});
    const [searchData, setSearchData] = useState<any>({});
    const companyId = sessionStorage.getItem('company_uuid') || '';
    const [candidatesList, setcandidatesList] = useState<any>([]);
    const history = useHistory();
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

    useEffect(() => {
        getCandidates(1, '','','');
        getCategories();
    }, []);

    const getCandidates = (activePage: any, search: string, fromDate: string,
        toDate: string) => {
        setcandidatesList([]);
        isClearButton()
        setLoading(true);
        const data = {
            status: 'COMPLETED',
            search: '',
            start: (activePage * 10) - 10,
            count: 10,
            from_date: fromDate,
            to_date: toDate,
            category: selectedCategorie,
            skill: selectedskill,
        }
        CandidatesService.getCompanyCandidateInterview(companyId, data).then(
            res => {
                res.records?.forEach((element: any) => {
                    element.fullName = `${element?.candidate_firstname} ${element?.candidate_lastname}`
                    // element.created_dt = moment(element?.created_dt).format('YYYY-MM-DD');
                    element.interview_schedule = Utility.formatInterviewSchedule(element.interview_schedule); 
                    element.interview_status=Utility.getInterviewStatus(element.interview_status)
                    
                });
                setcandidatesList([...res.records]);
                setPageNumbers(res.totalRows);
                setLoading(false);
            }
        )
    }


    const onSearchText = (event: any) => {
        if (event.key === 'Enter') {
            setIsFilterOpen(true);
            getCandidates(1, event.target.value, fromDate, toDate);
            setIsFilterOpen(false);
        }
    }
    const onPageChange = (data: any) => {
        setActivePage(data);
    }


    const onEditinterview = (data: any) => {
        if (data?.type === 'complete') {
            history.push(`/dashboard/interviews/evaluation-report-view/${data.item?.uuid}`);
        }
        // history.push(`/dashboard/sme/info/${companyId}/interviewsform/${data.id}`);
    }

    const onDeleteinterview = (data: any) => {
        const id = data.id;
    }
    const getCategories = () => {
        LookUpService.jobcategories().then(
            res => {
                setCategories(res);
            }
        )
    }

    const isClearButton = () => {
        if (searchStr) {
            setIsFilterOpen(true)
    
        }
        else {
            setIsFilterOpen(false)
    
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
        getCandidates(1, searchStr, fromDate, toDate);
        if (fromDate && toDate) {
          setIsFilterOpen(true);
        }
    }

    const onSearchTextEmpty = (event: any) => {
        setSearchStr(event.target.value)
        if (!event.target.value) {
            getCandidates(1, event.target.value,fromDate, toDate);
        }
    }



    const onShowFilterOptions = (event: SyntheticEvent) => {
        setShowFilterOptions(!showFilterOptions);
        event.stopPropagation();
        event.preventDefault();
    }

    const clearFilter = (event: any) => {
  
        setSearchStr('');
        setFromDate('');
        setToDate('');
        getCandidates(1, '','','');
        setIsFilterOpen(false);
    }
   

    return (
        <div>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }

            <div className='px-lg-3 d-sm-flex justify-content-sm-between'>
                <div className='d-flex select_all_left_side mb-sm-0 mb-3'>
                    {/* {(selectedCategorie || selectedskill || fromDate || toDate) &&
                                <div>Filter By:&nbsp;&nbsp;
                                    {selectedCategorie && <span className='pe-3'>Category: &nbsp;{selectedCategorie}</span>}
                                    {selectedskill && <span>Skill: &nbsp;{selectedskill}</span>}
                                    <br />
                                    {fromDate && <span className='pe-3'>Added on from: &nbsp;{fromDate}</span>}
                                    {toDate && <span>Added on to: &nbsp;{toDate}</span>}
                                </div>
                            } */}
                    {/* <div className="form-check mt-2">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label className="form-check-label text-black" style={{ fontSize: "13px" }}>
                                    Select All
                                </label>
                            </div> */}
                    {/*<button className='small_btn rounded ms-3 move_padding'>Move</button>*/}
                </div>
                <div className='d-flex search_and_filter_right_side position-relative px-3'>
                    <div className="input-group candidate_search_bar_border mt-1">
                        {/* <span className="input-group-text input_group_text" id="basic-addon1"><i className="fa fa-search pointer" aria-hidden="true" onClick={() => getCandidates(1, searchStr)}></i></span> */}
                        <input type="text" className="form-control form_control_border" placeholder="Search candidates by name" aria-label="Username" aria-describedby="basic-addon1" onKeyPress={(e) => onSearchText(e)} onInput={(e) => onSearchTextEmpty(e)} value={searchStr} />
                        <span className="input-group-text input_group_text" id="basic-addon1"><i className="fa fa-search pointer" aria-hidden="true" onClick={() => getCandidates(1, searchStr, fromDate, toDate)}></i></span>
                    </div>
                    <button className='large_btn_filter rounded ms-3 d-flex pt-1 pb-1 mt-1' onClick={(e) => onShowFilterOptions(e)}>
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
                                    <input className="form-control job_dis_form_control mt-2" type="date"  defaultValue={toDate} onChange={(e) => onChangeToDate(e)} />
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
            <div className='mt-4'>
                {!loading && <DataTable TableCols={InterviewsDataGridCols} tableData={candidatesList} editInfo={onEditinterview} deleteInfo={onDeleteinterview}
                    activePageNumber={activePage} searchText={onSearchText} pageNumber={onPageChange} pageNumbers={pageArray}></DataTable>}
            </div>

        </div>
    )
}