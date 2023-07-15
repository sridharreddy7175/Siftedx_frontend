import moment from "moment";
import React, { useEffect, useRef, useState, SyntheticEvent } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { CandidatesService } from "../../../../app/service/candidates.service";
import { LookUpService } from "../../../../app/service/lookup.service";
import { DataTable } from "../../../../components/data-table";
import FormBuilder from "../../../../components/form-builder";
import { AppLoader } from "../../../../components/loader";
import { InterviewsDataGridCols } from "./data-grid-cols";

export const FavouritesCandidates = () => {
  let { id } = useParams<{ id: string }>();
  const companyId = sessionStorage.getItem("company_uuid") || "";
  const [pageArray, setPageNumbers] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [interviewList, setinterviewList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [candidatesList, setcandidatesList] = useState<any>([]);

  const location = useLocation();
  const companyForm = useRef<any>({});
  const [searchData, setSearchData] = useState<any>({});
  const history = useHistory();
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const filterOptionsref = useRef<any>(null);
  const [selectedCategorie, setSelectedCategorie] = useState<any>("");
  const [selectedskill, setSelectedSkill] = useState<any>("");
  const [fromDate, setFromDate] = useState<any>("");
  const [toDate, setToDate] = useState<any>("");
  const [searchStr, setSearchStr] = useState("");

  const handleClickOutside = (event: any) => {
    if (
      filterOptionsref.current &&
      !filterOptionsref.current.contains(event.target)
    ) {
      setShowFilterOptions(false);
    }
  };
  useEffect(() => {
    getCandidates(1, "");
    getCategories();
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const getCandidates = (activePage: any, search: string) => {
    setcandidatesList([]);
    setLoading(true);
    const data = {
      status: "interview_scheduled",
      search: search,
      start: activePage * 10 - 10,
      count: 10,
      category: selectedCategorie,
      skill: selectedskill,
      from_date: fromDate,
      to_date: toDate,
      favourite: true,
    };
    CandidatesService.getCompanyCandidateFav(companyId, data).then((res) => {
      console.log("res", res);
      res.records?.forEach((element: any) => {
        element.fullName = `${element?.user_firstname} ${element?.user_lastname}`;
        element.created_dt = moment(element?.created_dt).format("YYYY-MM-DD");
        element.tagsList = element.tags.split(",");
      });
      setcandidatesList([...res.records]);
      setPageNumbers(res.totalRows);
      setLoading(false);
    });
  };

  const onPageChange = (data: any) => {
    setActivePage(data);
    getCandidates(data, searchStr);
  };

  const onSearchText = (data: any) => {};

  const onEditinterview = (data: any) => {
    console.log("data", data);
    // history.push(`/dashboard/sme/info/${companyId}/interviewsform/${data.id}`);
  };

  const onDeleteinterview = (data: any) => {
    const id = data.id;
  };

  const getCategories = () => {
    LookUpService.jobcategories().then((res) => {
      setCategories(res);
    });
  };

  // const onShowFilterOptions = () => {
  //     setShowFilterOptions(true)
  // }

  const onCategory = (event: any) => {
    setSkills([]);
    if (event) {
      LookUpService.skills(event).then((res) => {
        setSkills(res);
      });
    }
  };

  const onChanegSkill = (event: any) => {};

  const onFliterGo = () => {
    setShowFilterOptions(false);
  };

  const onChangeFromDate = (event: any) => {
    setFromDate(event.target.value);
  };

  const onChangeToDate = (event: any) => {
    setToDate(event.target.value);
  };

  const onShowFilterOptions = (event: SyntheticEvent) => {
    setShowFilterOptions(!showFilterOptions);
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <div>
      {loading && <AppLoader loading={loading}></AppLoader>}

      <div className="px-lg-3 d-sm-flex justify-content-sm-between">
        <div className="d-flex select_all_left_side mb-sm-0 mb-3">
          <div className="form-check mt-2">
            {/* <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label className="form-check-label text-black" style={{ fontSize: "13px" }}>
                                    Select All
                                </label> */}
          </div>
          {/*<button className='small_btn rounded ms-3 move_padding'>Move</button>*/}
        </div>
        <div className="d-flex search_and_filter_right_side position-relative">
          <div className="input-group candidate_search_bar_border mt-1">
            {/* <span className="input-group-text input_group_text" id="basic-addon1"><i className="fa fa-search pointer" aria-hidden="true"></i></span> */}
            <input
              type="text"
              className="form-control form_control_border"
              placeholder="Search candidates by name"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
            <span
              className="input-group-text input_group_text"
              id="basic-addon1"
            >
              <i className="fa fa-search pointer" aria-hidden="true"></i>
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
                      max={moment().format("YYYY-MM-DD")}
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
                      max={moment().format("YYYY-MM-DD")}
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
      {/* <div className='px-3 d-flex justify-content-between'>
                        <div className='d-flex'>
                            <div className="form-check mt-2">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label className="form-check-label text-black" style={{ fontSize: "13px" }}>
                                    Select All
                                </label>
                            </div>
                            <button className='dashboard_happy_monday_dot_btn px-3 rounded ms-3'>More</button>
                        </div>
                        <div className='d-flex'>
                            <div className="input-group search_bar_border">
                                <span className="input-group-text input_group_text" id="basic-addon1"><i className="fa fa-search pointer" aria-hidden="true"></i></span>
                                <input type="text" className="form-control form_control_border py-2" placeholder="Search" aria-label="Username" aria-describedby="basic-addon1" />
                            </div>
                            <button className='dashboard_happy_monday_dot_btn px-4 rounded ms-3 d-flex my-auto py-2'><svg width="17" height="11" className='my-auto mx-1' viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.75 10.75H10.25V9H6.75V10.75ZM0.625 0.25V2H16.375V0.25H0.625ZM3.25 6.375H13.75V4.625H3.25V6.375Z" fill="#1D2851" />
                            </svg> Filter</button>
                        </div>
                    </div> */}
      <div className="mt-4">
        {!loading && (
          <DataTable
            TableCols={InterviewsDataGridCols}
            tableData={candidatesList}
            editInfo={onEditinterview}
            deleteInfo={onDeleteinterview}
            activePageNumber={activePage}
            searchText={onSearchText}
            pageNumber={onPageChange}
            pageNumbers={pageArray}
          ></DataTable>
        )}
      </div>
    </div>
  );
};
