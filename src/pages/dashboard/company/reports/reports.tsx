import React, { useState } from "react";
import FormBuilder from "../../../../components/form-builder";
import { DataTabe } from "../../../../components/reports/data-table";
import { SmeReportsDataGridCols } from "../../sme/reports/data-grid-cols";
import { CompanyReportsDataGridCols } from "./data-grid-cols";
import { SXROLES } from "../../../../app/utility/roles-codes";
import { SX_ROLES } from "../../../../app/utility/app-codes";
import Pageheader from "../../../../components/page-header";
import NoData from "../../../../components/no-data";
import { DataTable } from "../../../../components/data-table";
export const CompanyReportsPage = () => {
  const [loading, setLoading] = useState(false);
  const [interviewList, setinterviewList] = useState<any>([]);
  const [activeStep, setActiveStep] = React.useState("active");
  const userRole = sessionStorage.getItem("userRole");
  const [activePage, setActivePage] = useState(1);
  const [pageArray, setPageNumbers] = useState(1);

  const tabs = [
    {
      label: "Open Jobs",
      path: "active",
    },
    {
      label: "Closed Jobs",
      path: "draft",
    },
    {
      label: "Archived",
      path: "archived",
    },
  ];
  const onSelectTab = (type: string) => {
    setActiveStep(type);
  };

  const handleSmeInput = () => {};
  const handleInput = () => {};
  const handleSearch = () => {};
  const handleRefresh = () => {};
  const onPageChange = (data: any) => {
    setActivePage(data);
  };

  const onSearchText = (data: any) => {};
  return (
    <>
      {userRole === SX_ROLES.Recruiter ? (
        <>
          <div className="container-fluid">
            <Pageheader
              title="evaluation reports"
              subTitle="Complete list of evaluation reports for open, closed and archived jobs"
              buttonName=""
              editButtonClick={() => {}}
              hideButton={true}
            />
            <div className="row ps-3 pe-3">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    {/* <div className="mt-2  d-none d-lg-block"> */}
                    <div className="mt-2">
                      <div className="ms-3 mt-2">
                        <ul className="nav">
                          {tabs.map((data: any, index: number) => {
                            return (
                              <li
                                key={index}
                                className={`nav-item tab ${
                                  data?.path === activeStep ? "active" : ""
                                }`}
                                style={{ fontSize: "14px" }}
                              >
                                <span
                                  className="nav-link text-white all_members_nav_link_font_size nav-hover pointer"
                                  onClick={() => onSelectTab(data?.path)}
                                >
                                  {data?.label} {data?.count ? data?.count : ""}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                    <div className="d-block d-lg-none">
                      {/* <NavMenuTabs type="path" activeUrl={locationPath} menuItems={tabsData} activeTab={0} onChangeTab={() => { }}></NavMenuTabs> */}
                    </div>
                    <div className="col-12">
                      <div className="bg-white rounded-3">
                        <div className="pb-4 pt-3">
                          <div className="col-md-12 mt-2 mb-4 px-3">
                            <div className="px-lg-3 d-sm-flex justify-content-sm-between">
                              <div className="d-flex search_and_filter_right_side position-relative ms-auto">
                                <div className="input-group candidate_search_bar_border mt-1">
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
                                    <i
                                      className="fa fa-search pointer"
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                </div>

                                <button className="large_btn_filter rounded ms-3 d-flex pt-1 pb-1 mt-1">
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
                              </div>
                            </div>
                          </div>
                         
                          {/* <DataTable
                            TableCols={CompanyReportsDataGridCols}
                            tableData={interviewList}
                            activePageNumber={activePage}
                            searchText={onSearchText}
                            pageNumber={onPageChange}
                            pageNumbers={pageArray}
                          ></DataTable> */}
                          {interviewList.length > 0 ?
                                                     <DataTable TableCols={CompanyReportsDataGridCols} tableData={interviewList} 
                                            activePageNumber={activePage} searchText={onSearchText} pageNumber={onPageChange} pageNumbers={pageArray}></DataTable>
                                        : <div className="text-center">
                                            <NoData message=""></NoData>
                                        </div>
                                    }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 
                    <div className="row" >
                        <div className="col-md-6 d-none d-lg-block" style={{ fontSize: "14px" }}>
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

                        </div>

                        <div className="col-md-6 d-block d-lg-none" style={{ fontSize: "14px" }}>

                        </div>

                    </div> */}
          {/* <div className="row bg-white border rounded-3 px-3 py-3" style={{ marginBottom: '15px' }}>

                        <div className='d-flex search_and_filter_right_side position-relative ms-auto'>
                            <div className="input-group candidate_search_bar_border mt-1 ">
                                <input type="text" className="form-control form_control_border" placeholder="Search candidates by name" aria-label="Username" aria-describedby="basic-addon1" />
                                <span className="input-group-text input_group_text" id="basic-addon1"><i className="fa fa-search pointer" aria-hidden="true" ></i></span>
                            </div>
                            <button className='large_btn_filter rounded ms-3 d-flex pt-1 pb-1 mt-1'>
                                <svg width="17" height="11" className='my-auto mx-1' viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.75 10.75H10.25V9H6.75V10.75ZM0.625 0.25V2H16.375V0.25H0.625ZM3.25 6.375H13.75V4.625H3.25V6.375Z" fill="black" />
                                </svg> Filter
                            </button>
                        </div>
                        <DataTabe TableCols={CompanyReportsDataGridCols} tableData={interviewList}></DataTabe>
                    </div> */}
        </>
      ) : (
        <>
          <div className="col-md-10">
            <h5>Reports</h5>
            <p>All reports generated so far are here</p>
          </div>
          <div
            className="row bg-white border rounded-3 px-3 py-3"
            style={{ marginBottom: "15px" }}
          >
            <DataTabe
              TableCols={CompanyReportsDataGridCols}
              tableData={interviewList}
            ></DataTabe>
          </div>
        </>
      )}
    </>
  );
};
