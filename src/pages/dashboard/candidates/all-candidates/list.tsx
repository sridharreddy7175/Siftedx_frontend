import moment from 'moment';
import React, { useEffect, useRef, useState, SyntheticEvent } from 'react'
import { Modal, Offcanvas } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom'
import { CandidatesService } from '../../../../app/service/candidates.service';
import { LookUpService } from '../../../../app/service/lookup.service';
import { DataTable } from '../../../../components/data-table'
import { AppLoader } from '../../../../components/loader';
import { STORAGE_URL } from '../../../../config/constant';
import { AllCandidatesDataGridCols } from './data-grid-cols';
import Calendar from "react-calendar";



export const HrAllCandidates = () => {
  const [pageArray, setPageNumbers] = useState<any>(1);
  const [activePage, setActivePage] = useState(1);
  const [searchStr, setSearchStr] = useState('');
  const [loading, setLoading] = useState(false);
  const companyId = sessionStorage.getItem('company_uuid') || '';
  const history = useHistory();
  const [candidatesList, setcandidatesList] = useState<any>([]);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const filterOptionsref = useRef<any>(null);
  const [selectedCategorie, setSelectedCategorie] = useState<any>('');
  const [selectedskill, setSelectedSkill] = useState<any>('');
  const [fromDate, setFromDate] = useState<any>('');
  const [toDate, setToDate] = useState<any>('');
  const [showCandidate, setShowCandidate] = React.useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>('');
  const [avalableCalenderTimes, setAvalableCalenderTimes] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCalenderOpen,setIsCalenderOpen]=useState(false);

  const [selectedDate, onChangeDate] = useState<any>(new Date());
  const [calenderTimes, setCalenderTimes] = useState<any[]>([
    {
      time_from: "",
      time_to: "",
      availability_date: moment(selectedDate).format("YYYY-MM-DD"),
    },
  ]);


  const handleClickOutside = (event: any) => {
    if (filterOptionsref.current && !filterOptionsref.current.contains(event.target)) {
      setShowFilterOptions(false);
    }
  };
  useEffect(() => {
    getCandidates(1, '','','');
    getCategories();
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const getCandidates = (activePage: any, search: string, fromDate: string,
    toDate: string) => {
    setLoading(true);
    setcandidatesList([])
    isClearButton()
    const data = {
      search: search,
      start: (activePage * 10) - 10,
      count: 10,
      category: selectedCategorie,
      skill: selectedskill,
      from_date: fromDate,
      to_date: toDate
    }
    CandidatesService.getCandidatesBySearch(companyId, data).then(
      res => {
        res.records.forEach((element: any) => {
          // element.tagsList = element?.tags.split(',');
          element.tagsList = element.tags.split(',');

          element.created_dt = moment(element?.created_dt).format('YYYY-MM-DD');
        });
        setcandidatesList([...res.records]);
        setPageNumbers(res.totalRows);
        setLoading(false);
      }
    )
  }

  const onPageChange = (data: any) => {
    setActivePage(data);
    getCandidates(data, searchStr, fromDate,
      toDate);
  }

  const onEditrecords = (data: any) => {
    sessionStorage.setItem('selectedCandidate', JSON.stringify(data?.item));
    if (data.item && data.type === 'Resume') {
      window.open(`${STORAGE_URL}${data?.item?.resume_urls}`, '_blank')
    } else if (data.type === 'Edit') {
      history.push(`/dashboard/candidates/form/${data?.item?.uuid}`);
    } else if (data.type === 'View') {
      setShowCandidate(true);
      data.item.skills = data?.item?.skills_codes.split(',');
      data.item.exp = data?.item?.skills_exp.split(',');
      setSelectedCandidate(data?.item);
    }
    else if(data.type==="calender"){
      setIsCalenderOpen(true)
    }
    else if (data.candidate_uuid && data.is_favourite === true) {
      setLoading(true)
      CandidatesService.candidateFavourite(data)
      .then((res)=>{
        setLoading(false)
        history.push('/dashboard/candidates/favorites')
      })

    }
  }

  const onDeleterecords = (data: any) => {
    CandidatesService.deleteCandidate(data?.uuid).then(
      res => {
        getCandidates(1, searchStr, fromDate,
          toDate);
        setLoading(false);
      }
    )
  }

  const onSearchText = (event: any) => {
    if (event.key === 'Enter') {
      setIsFilterOpen(true);
      getCandidates(1, event.target.value, fromDate, toDate);

    }
  }

  const onSearchTextEmpty = (event: any) => {
    setSearchStr(event.target.value)
    if (!event.target.value) {
      getCandidates(1, event.target.value,fromDate, toDate);
      setIsFilterOpen(false);
    }
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


  const onShowFilterOptions = (event: SyntheticEvent) => {
    setShowFilterOptions(!showFilterOptions);
    event.stopPropagation();
    event.preventDefault();
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

  const onCandidateEdit = () => {
    history.push(`/dashboard/candidates/form/${selectedCandidate?.uuid}`);
  }

  const clearFilter = (event: any) => {
  
    setSearchStr('');
    setFromDate('');
    setToDate('');
    getCandidates(1, '','','');
    setIsFilterOpen(false);
}
const onSelectDate = (e: any) => {
  onChangeDate(e);
  handleonCalenderTime(e);
};
const handleonCalenderTime = (selectedDate: any) => {
    const times: any = calenderTimes;

    if (times.length > 0 ) {
      times.push({
        time_from: "",
        time_to: "",
        availability_date: moment(selectedDate).format("YYYY-MM-DD"),
        availability_day: 0,
        is_recurring: false,
      });
    } else {
      times[0].availability_date = moment(selectedDate).format("YYYY-MM-DD");
    }
    setCalenderTimes([...times]);
  };
  return (
    <div>
      {loading &&
        <AppLoader loading={loading}></AppLoader>
      }

      <div className='px-lg-3 d-sm-flex justify-content-sm-between'>
        <div className='d-flex select_all_left_side mb-sm-0 mb-3'>
        </div>
        <div className='d-flex search_and_filter_right_side position-relative px-3 '>
          <div className="input-group candidate_search_bar_border mt-1">
           
            <input type="text" className="form-control form_control_border" placeholder="Search candidates by name" aria-label="Username" aria-describedby="basic-addon1" onKeyPress={(e) => onSearchText(e)} value={searchStr} onInput={(e) => onSearchTextEmpty(e)} />
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
      <div className='mt-4'>
        {!loading &&
          <DataTable TableCols={AllCandidatesDataGridCols} tableData={candidatesList} editInfo={onEditrecords} deleteInfo={onDeleterecords}
            activePageNumber={activePage} searchText={onSearchText} pageNumber={onPageChange} pageNumbers={pageArray}></DataTable>
        }
      </div>


      {/* </div> */}


      <Offcanvas
        show={showCandidate}
        onHide={() => setShowCandidate(false)}
        placement={"end"}
      >
        <Offcanvas.Body>
          <div>
            <div className="bg-white p-4">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="download_heading">
                    {selectedCandidate?.user_firstname}{" "}
                    {selectedCandidate?.user_lastname}
                  </h5>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <div>
                  <p>
                    Added on{" "}
                    <b className="download_heading_name">
                      {moment(selectedCandidate?.created_at).format(
                        "DD MMM YYYY"
                      )}
                    </b>
                    &nbsp; by &nbsp;
                    <b className="download_heading_name">Recruiter Name</b>
                  </p>
                </div>
                <div>
                  <button
                    className="large_btn_apply rounded"
                    onClick={() => onCandidateEdit()}
                  >
                    Edit
                  </button>
                  {/* <button
                    className="dashboard_happy_monday_dot_btn px-2 py-1 rounded mx-2"
                    onClick={() => setShowCandidate(false)}
                  > */}
                  <button
                    className="large_btn_delete px-2 py-1 rounded mx-2"
                    onClick={() => setShowCandidate(false)}
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
                      <h6 className="download_heading_title">Name</h6>
                    </div>
                    <div className="col-md-10">
                      <p>
                        {selectedCandidate?.user_firstname}{" "}
                        {selectedCandidate?.user_lastname}
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                      <h6 className="download_heading_title">Email</h6>
                    </div>
                    <div className="col-md-10">
                      <p>{selectedCandidate?.user_email}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                      <h6 className="download_heading_title">Mobile</h6>
                    </div>
                    <div className="col-md-10">
                      <p>{selectedCandidate?.mobile_no}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                      <h6 className="download_heading_title">LinkedIn</h6>
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
                            //   "hello"
                          }
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                      <h6 className="download_heading_title">Added</h6>
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
                      <h6 className="download_heading_title">CV</h6>
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
                                  <h6 className="top_para_styles fw_7 mb-0 mt-1">
                                    {moment(data?.availability_date).format(
                                      "DD MMMM YYYY"
                                    )}
                                  </h6>
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
                  <h6 className="download_heading_title">Interviews</h6>
                  <div>No Interviews</div>
                </div>
                <div className="my-1 w-75">
                  <hr />
                </div>
                <div className="col-12 mt-3 p-2">
                  <h6 className="download_heading_title">Report</h6>
                  <div>
                    <div className="row">
                      <div className="col-6 font_bolder p-2">Experience</div>
                      <div className="col-6 font_bolder p-2">Skills</div>
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
      </Offcanvas>

      <Modal
        show={isCalenderOpen}
        onHide={() => setIsCalenderOpen(false)}
        aria-labelledby="contained-modal-title-vcenter"
        className="sx-close px-4"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
          
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mt-0 mt-lg-3 mb-4 '>

          <Calendar
          minDate={new Date()}
          calendarType="US"
          onChange={(e: any) => onSelectDate(e)}
          value={selectedDate}
          className="border-0"
        />
          {/* <label className="input">
                  <input
                    type="date"
                    className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field"
                    min={moment().add(1, "day").format("YYYY-MM-DD")}
                    id="Availability"
                    name="availability_time"
                    placeholder="Availability"
                  />

                  <span className={`input__label input__label_disabled`}>
                  Availability To Join From
                  </span>
                </label> */}
                <div className='d-flex justify-content-between mx-2 mt-3'>
                <button className='large_btn_filter ps-3 ps-lg-2 ' onClick={()=>setIsCalenderOpen(false)}>Cancel</button>

              <button className='large_btn_apply '>Set Availability</button>
              </div>
        
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};
