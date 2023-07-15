import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { SmeService } from "../../../../app/service/sme.service";
import { Utility } from "../../../../app/utility";
import { DataTable } from "../../../../components/data-table";
import FormBuilder from "../../../../components/form-builder";
import { AppLoader } from "../../../../components/loader";
import NoData from "../../../../components/no-data";
import { UpcomingDataGridCols } from "./data-grid-cols";

export const ReportNeededList = () => {
  let { id, code } = useParams<{ id: string; code: string }>();
  const companyId = parseInt(id);
  const companyCode = code;
  const [pageArray, setPageNumbers] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [recordsList, setrecordsList] = useState<any>([]);
  const [interviews, setInterviews] = useState<any>([]);

  const [loading, setLoading] = useState(false);

  const companyForm = useRef<any>({});
  const [searchData, setSearchData] = useState<any>({});
  const userId = sessionStorage.getItem("userUuid") || "";

  const history = useHistory();
  const [fromDate, setFromDate] = useState<any>("");
  const [toDate, setToDate] = useState<any>("");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const filterOptionsref = useRef<any>(null);
  const [searchStr, setSearchStr] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const clearFilter = (event: any) => {
   
    setSearchStr('');
   
    setFromDate('');
    setToDate('');
    setShowFilterOptions(false);
    getInterviews(1, "", "", "");
    
    setIsFilterOpen(false);
  };

  const getInterviews = (activePage: any, search: string, fromDate: string,
    toDate: string) => {
    setLoading(true);
    isClearButton();
    const data = {
      search: search,
      start: activePage * 10 - 10,
      count: 10,
      from_date: fromDate,
      to_date: toDate,
      status: "INTERVIEW_TAKEN",
    };
    SmeService.getSmeInterviews(userId, data).then((res) => {
      if (res.error) {
        toast.error(res?.error?.message);
        setLoading(false);
      } else {
        setLoading(false);
        res.records.forEach((element: any) => {
          element.skills = element?.job_mandatory_skills?.split(",");
          element.candidateFullName = `${element.candidate_firstname} ${element.candidate_lastname}`;
          element.interview_schedule = Utility.formatInterviewSchedule(element.interview_schedule); 
          element.interview_status = "Interview Taken";
        });
        setInterviews(res.records);
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
    if (data?.type === "edit") {
      history.push(
        `/dashboard/interviews/evaluation-report/${data?.item.uuid}`
      );
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

  const onShowFilterOptions = () => {
    setShowFilterOptions(true);
  };

  const onSearchTextEmpty = (event: any) => {
    setSearchStr(event.target.value);
    if (!event.target.value) {
      getInterviews(1, event.target.value,fromDate, toDate);
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
                    onInput={(e) => onSearchTextEmpty(e)}
                    value={searchStr}
                  />
                  <span
                    className="input-group-text input_group_text"
                    id="basic-addon1"
                  >
                    <i
                      className="fa fa-search pointer"
                      aria-hidden="true"
                      onClick={() => getInterviews(1, searchStr, fromDate, toDate)}
                    ></i>
                  </span>
                </div>
                <button
                  className="large_btn_filter rounded ms-3 d-flex pt-1 pb-1 mt-1"
                  onClick={onShowFilterOptions}
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
                  <>
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
                            // max={moment().format("YYYY-MM-DD")}
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
                            // max={moment().format("YYYY-MM-DD")}
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {interviews?.length > 0 ? (
          <DataTable
            TableCols={UpcomingDataGridCols}
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
      </div>
    </div>
  );
};
