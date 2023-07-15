import moment from "moment";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link, useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { SMEInterview } from "../../../../app/model/interview/sme-interview";
import { JobsService } from "../../../../app/service/jobs.service";
import { Utility } from "../../../../app/utility";
import { DataTable } from "../../../../components/data-table";
import FormBuilder from "../../../../components/form-builder";
import { AppLoader } from "../../../../components/loader";
import NoData from "../../../../components/no-data";
import { OpportunitiesDataGridCols } from "./data-grid-cols";

export const OpportunitiesList = () => {
  let { id, code } = useParams<{ id: string; code: string }>();
  const companyId = parseInt(id);
  const companyCode = code;
  const [pageArray, setPageNumbers] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [loading, setLoading] = useState(false);
  const companyForm = useRef<any>({});
  const [searchData, setSearchData] = useState<any>({});
  const [interviews, setInterviews] = useState<SMEInterview[]>([]);
  const userId = sessionStorage.getItem("userUuid") || "";
  const [showAcceptPopup, setShowAcceptPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [selectedJob, setSelectedJob] = React.useState<any>({});
  const [fromDate, setFromDate] = useState<any>("");
  const [toDate, setToDate] = useState<any>("");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const filterOptionsref = useRef<any>(null);
  const [searchStr, setSearchStr] = useState<any>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const history = useHistory();
  const handleClickOutside = (event: any) => {
    if (
      filterOptionsref.current &&
      !filterOptionsref.current.contains(event.target)
    ) {
      setShowFilterOptions(false);
    }
  };
  useEffect(() => {
    getInterviews(1, "", "", "");
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const isClearButton = () => {
    if (searchStr) {
      setIsFilterOpen(true);
    } else {
      setIsFilterOpen(false);
    }
  };

  const getInterviews = (
    activePage: any,
    search: string,
    fromDate: string,
    toDate: string
  ) => {
    setLoading(true);
    isClearButton();
    const data = {
      search: search,
      start: activePage * 10 - 10,
      count: 10,
      from_date: fromDate,
      to_date: toDate,
    };
    setInterviews([]);
    JobsService.smeInterviewOpportunities(userId, data).then((res) => {
      if (res.error) {
        toast.error(res?.error?.message);
        setLoading(false);
      } else {
        setLoading(false);
        res.records.forEach((element: any) => {
          element.candidate_fullname = `${element.candidate_firstname} ${element.candidate_lastname}`;
          element.interview_schedule = Utility.formatInterviewSchedule(
            element.interview_schedule
          );
        });
        setInterviews([...res.records]);

        // setInterviews(filteredInterviews);
      }
    });
  };
  const onSearchText = (event: any) => {
    if (event.key === "Enter") {
      getInterviews(1, event.target.value, fromDate, toDate);
    }
  };

  const onPageChange = (data: any) => {
    setActivePage(data);
  };

  const onEditrecords = (data: any) => {
    setSelectedJob(data?.item);
    if (data.type === "accept") {
      setShowAcceptPopup(true);
    } else if (data.type === "reject") {
      setShowCancelPopup(true);
    } else if (data.type === "link") {
      sessionStorage.setItem(
        "selectedInterviewCompany",
        data?.item?.company_uuid
      );
      history.push(
        `/dashboard/interviewview/description/${data?.item?.job_uuid}/${data?.item?.uuid}`
      );
      // setShowCancelPopup(true);
    }
    // history.push(`/dashboard/sme/info/${companyId}/recordsform/${companyCode}/${data.id}`);
  };

  const onDeleterecords = (data: any) => {
    const id = data.id;
  };

  const onRejectJob = () => {
    setLoading(true);
    JobsService.smeRejectInterview(selectedJob?.uuid).then((res) => {
      if (res?.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        setShowCancelPopup(false);
        setLoading(false);
        getInterviews(1, "", "", "");
        toast.success("Rejected successfully");
      }
    });
  };

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

  const onShowFilterOptions = (event: SyntheticEvent) => {
    setShowFilterOptions(!showFilterOptions);
    event.stopPropagation();
    event.preventDefault();
  };

  const onSearchTextEmpty = (event: any) => {
    setSearchStr(event.target.value);
    if (!event.target.value) {
      getInterviews(1, event.target.value, fromDate, toDate);
      setIsFilterOpen(false);
    }
  };

  const onChangeFromDate = (event: any) => {
    setFromDate(event.target.value);
  };

  const onChangeToDate = (event: any) => {
    setToDate(event.target.value);
  };

  const onFliterGo = () => {
    setShowFilterOptions(false);
    getInterviews(1, searchStr, fromDate, toDate);
    if (fromDate && toDate) {
      setIsFilterOpen(true);
    }
  };
  const clearFilter = (event: any) => {
    // setInterviews([])
    setSearchStr("");
   
    setShowFilterOptions(false);
    setFromDate('');
    setToDate('');
    getInterviews(1, "", "", "");
    // isClearButton();
    setIsFilterOpen(false);
  };

  return (
    <div>
      <div className="siftedx-table job_description_padding mt-lg-0 ms-3 me-3 ms-lg-3 me-lg-3" style={{minHeight:"500px"}}>
        {loading && <AppLoader loading={loading}></AppLoader>}
        <div className="row py-3">
          <div className="col-md-12 my-2 px-3">
            <div className="px-lg-3 d-sm-flex justify-content-sm-between">
              <div className="d-flex select_all_left_side mb-sm-0 mb-3">
                {/* {(fromDate || toDate) &&
                                    <div>Filter By:&nbsp;&nbsp;
                                        {fromDate && <span className='pe-3'>From Date: &nbsp;{fromDate}</span>}
                                        {toDate && <span>To Date: &nbsp;{toDate}</span>}
                                    </div>
                                } */}
              </div>
              <div className="d-flex search_and_filter_right_side position-relative">
                <div className="input-group candidate_search_bar_border mt-1">
                  <input
                    type="text"
                    className="form-control form_control_border form-search"
                    placeholder="Search candidates by name"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    onKeyPress={(e) => onSearchText(e)}
                    value={searchStr}
                    onInput={(e) => onSearchTextEmpty(e)}
                  />
                  <span
                    className="input-group-text input_group_text bg-none"
                    id="basic-addon1"
                  >
                    <i
                      className="fa fa-search pointer"
                      aria-hidden="true"
                      onClick={() =>
                        getInterviews(1, searchStr, fromDate, toDate)
                      }
                    ></i>
                  </span>
                </div>
                <button
                  className="large_btn_filter rounded ms-3 d-flex pt-1 pb-1 mt-1"
                  onClick={(e) => onShowFilterOptions(e)}
                >
                  <svg
                    width="17"
                    height="11"
                    className="my-auto mx-1"
                    viewBox="0 0 17 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.75 10.75H10.25V9H6.75V10.75ZM0.625 0.25V2H16.375V0.25H0.625ZM3.25 6.375H13.75V4.625H3.25V6.375Z"
                      fill="black"
                    />
                  </svg>{" "}
                  Filter
                </button>
                {isFilterOpen && (
                  <button
                    className="large_btn_filter  ms-3 rounded mt-1 w-auto px-2"
                    onClick={clearFilter}
                  >
                    Clear&nbsp;Filter
                  </button>
                )}
                {showFilterOptions && (
                  <div>
                    <div
                      className="popup_overlay"
                      onClick={() => setShowFilterOptions(false)}
                    ></div>
                    <div
                      ref={filterOptionsref}
                      className="row rounded-3 sx-bg-page p-3 position-absolute end-0 top-100 mt-1 z-index-1055"
                    >
                      <div className="mb-2 col-12 col-lg-6">
                        <div className="me-lg-2">
                          <label className="form-label job_dis_form_label">
                            From Date
                          </label>
                          <input
                            className="form-control job_dis_form_control mt-2"
                            type="date"
                            // max={moment().format('YYYY-MM-DD')}
                            defaultValue={fromDate}
                            onChange={(e) => onChangeFromDate(e)}
                          />
                        </div>
                      </div>
                      <div className="mb-2 col-12 col-lg-6">
                        <div className="ms-lg-2">
                          <label className="form-label job_dis_form_label">
                            To Date
                          </label>
                          <input
                            className="form-control job_dis_form_control mt-2"
                            type="date"
                            // max={moment().format('YYYY-MM-DD')}
                            defaultValue={toDate}
                            onChange={(e) => onChangeToDate(e)}
                          />
                        </div>
                      </div>
                      <div className="col-12 text-end mt-2">
                        <button
                          className="large_btn_apply px-4 rounded w-sm-100"
                          onClick={onFliterGo}
                        >
                          Filter
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {interviews.length > 0 ? (
          <DataTable
            TableCols={OpportunitiesDataGridCols}
            tableData={interviews}
            editInfo={onEditrecords}
            deleteInfo={onDeleterecords}
            activePageNumber={activePage}
            searchText={onSearchText}
            pageNumber={onPageChange}
            pageNumbers={pageArray}
          ></DataTable>
        ) : (
          <div className="text-center">
            <NoData message=""></NoData>
          </div>
        )}

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

        {/* <Modal
                    show={showAcceptPopup}
                    onHide={() => setShowAcceptPopup(false)}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            <div>
                                <div className='invite_team_heading'>Are you sure you want to Accept</div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='border rounded-3'>
                            <div className='py-3'>
                                <ul className='list-inline d-flex my-auto'>
                                    <li className='my-auto'>
                                        <ul className='list-inline'>
                                            <li className='top_para_styles p-2'>{selectedJob?.job_title}</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className='text-end my-3 pe-2'>
                            <button className='large_btn_apply rounded me-3' onClick={onAcceptJob}>Yes</button>
                            <button className='btn-signup rounded' onClick={() => setShowAcceptPopup(false)}>No</button>
                        </div>
                    </Modal.Footer>
                </Modal> */}

        <Modal
          show={showCancelPopup}
          onHide={() => setShowCancelPopup(false)}
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
              Are you sure you want reject this interview request
            </p>
            <p className="top_para_styles p-0 m-0 text-center mt-3 mb-0">
              <b>{selectedJob?.job_title}</b>
            </p>
            <div className="row">
              <div className="col-6 px-3 py-3 mt-3">
                <button
                  type="button"
                  className="rounded text-decoration-none open_cv ps-3 pt-1 pb-1 pe-3 ms-2 ms-lg-0 ms-sm-2 fw-normal bg-transparent"
                  onClick={() => setShowCancelPopup(false)}
                >
                  No
                </button>
              </div>
              <div className="col-6 text-end px-3 py-3 mt-3">
                <button
                  type="button"
                  className="rounded text-decoration-none ps-4 pt-1 pb-1 pe-4 fw-normal upload_cv"
                  onClick={onRejectJob}
                >
                  Yes
                </button>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>

        {/* <Modal
                    show={showAcceptPopup}
                    onHide={() => setShowAcceptPopup(false)}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            <div>
                                <div className='invite_team_heading'>Are you sure you want to Accept</div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='border rounded-3'>
                            <div className='py-3'>
                                <ul className='list-inline d-flex my-auto'>
                                    <li className='my-auto'>
                                        <ul className='list-inline'>
                                            <li className='top_para_styles p-2'>{selectedJob?.job_title}</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className='text-end my-3 pe-2'>
                            <button className='large_btn_apply rounded me-3' onClick={onAcceptJob}>Yes</button>
                            <button className='btn-signup rounded' onClick={() => setShowAcceptPopup(false)}>No</button>
                        </div>
                    </Modal.Footer>
                </Modal> */}
        {/* <Modal
                    show={showCancelPopup}
                    onHide={() => setShowCancelPopup(false)}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            <div>
                                <div className='invite_team_heading'>Are you sure you want to Reject</div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='border rounded-3'>
                            <div className='py-3'>
                                <ul className='list-inline d-flex my-auto'>
                                    <li className='my-auto'>
                                        <ul className='list-inline'>
                                            <li className='top_para_styles p-2'>{selectedJob?.job_title}</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className='text-end my-3 pe-2'>
                            <button className='large_btn_apply rounded me-3' onClick={onRejectJob}>Yes</button>
                            <button className='btn-signup rounded' onClick={() => setShowCancelPopup(false)}>No</button>
                        </div>
                    </Modal.Footer>
                </Modal> */}
      </div>
    </div>
  );
};
