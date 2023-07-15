import moment from "moment";
import React, { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { SmeService } from "../../../../app/service/sme.service";
import { DataTable } from "../../../../components/data-table";
import NoData from "../../../../components/no-data";
import {
  JobsReportsGridCols,
  JobsReportsRecruiterGridCols,
} from "./data-grid-cols";
import jsPDF from "jspdf";
import { SX_ROLES } from "../../../../app/utility/app-codes";
import { AppLoader } from "../../../../components/loader";
import { Modal } from "react-bootstrap";
import STAR_ICON from "../../../../assets/icon_images/star.svg";
import STAR_ICON_WITH_YELLOW from "../../../../assets/icon_images/star_yellow.svg";
import { JobsService } from "../../../../app/service/jobs.service";

export const JobReports = () => {
  let { id, jobId } = useParams<{ id: string; jobId: string }>();
  
  const [loading, setLoading] = useState(false);
  const [jobsList, setjobsList] = useState<any>([]);
  const [activePage, setActivePage] = useState(1);
  const [pageArray, setPageNumbers] = useState(1);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>({});
  const [selectedCandidateReport, setSelectedCandidateReport] = useState<any>(
    {}
  );
  const role = sessionStorage.getItem("userRole");
  let history = useHistory();
  const [showInstructionsPopup, setShowInstructionsPopup] = useState(false);


  const downloadPDF = () => {
    var doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      // format: [4, 2]
    });
    var content = document.getElementById("pdf-content");
    if (content) {
      doc.html(content, {
        callback: function (doc) {
          doc.save();
        },
      });
    }
  };

  // useEffect(()=>{
  //  getInterviewReports()
  // },[])

  // const getInterviewReports=()=>{
  //   setLoading(true)
  //   JobsService.getInterviewById(jobId)
  //   .then((res)=>{
  //     console.log("res",res)
  //     if (res.error) {
  //       toast.error(res?.error?.message);
  //       setLoading(false);
  //   }
  //   else {
  //     console.log("res",res)
  //   }
  //   })
  // }


  
  useEffect(() => {
    setLoading(true);
    SmeService.interviewFeedBackByJob(jobId).then((res) => {
      if (res.error) {
        toast.error(res?.error?.message);
        setLoading(false);
      } else {
        setLoading(false);
        res.forEach((element: any) => {
          element.candidateFullName = `${element?.candidate_firstname} ${element?.candidate_lastname}`;
          element.smeFullName = `${element?.sme_firstname} ${element?.sme_lastname}`;
        });
        setjobsList([...res]);
      }
    });
  }, []);
  const onEditjobs = (data: any) => {
    // /dashboard/companies/info/:id/jobs/info/:jobId/reportview
    console.log("edit", data);
    if (data?.type === "ReportView") {
      // history.push(`/dashboard/companies/info/:id/jobs/info/:jobId/reportview`)
      setShowInstructionsPopup(true);
    }
  };
  const onDeletejobs = (data: any) => {
    const id = data.id;
  };
  const onSearchText = (data: any) => {};

  const onPageChange = (data: any) => {
    setActivePage(data);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };
  const handleCloseCanves = () => {
    setShow(false);
  };
  const handleShowQuickState = () => {
    setShow2(true);
  };
  const handleCloseCanves2 = () => {
    setShow2(false);
  };
  const downloadFullreport=()=>{
    console.log("hghhhh")
  }
  return (
    <div>
      {loading && <AppLoader loading={loading}></AppLoader>}
      {role === SX_ROLES.Recruiter ? (
        <>
          <div className="px-lg-3 d-sm-flex justify-content-sm-between">
            <div className="d-flex select_all_left_side mb-sm-0 mb-3"></div>
            <div className="d-flex search_and_filter_right_side position-relative ">
              <div className="input-group candidate_search_bar_border mt-1">
                <input
                  type="text"
                  className="form-control form_control_border"
                  placeholder="Search Candidate By Name"
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
            </div>
          </div>
          <div className="mt-4">
            {jobsList.length > 0 ? (
              <DataTable
                TableCols={JobsReportsRecruiterGridCols}
                tableData={jobsList}
                editInfo={onEditjobs}
                deleteInfo={onDeletejobs}
                activePageNumber={activePage}
                searchText={onSearchText}
                pageNumber={onPageChange}
                pageNumbers={pageArray}
              ></DataTable>
            ) : (
              <div className="tab-pane" id="nav-profile">
                <NoData message=""></NoData>
              </div>
            )}
          </div>

          <Modal
            show={showInstructionsPopup}
            onHide={() => setShowInstructionsPopup(false)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="xl"
            className="sx-close px-4"
            backdropClassName="z-index-1055"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="">
                <div className="pb-3">
                  <div className="my-2">
                    <div className="container-fluid">
                      <div className="row align-items-center">
                        <div className="px-4 pb-4">
                          <div className="download_heading pe-3">
                            Evaluation Report For{" "}
                          </div>

                          <p className="sx-text-primary text-lg-end  text-sm-start fs_14 pointer me-3" onClick={()=>downloadFullreport()}>
                            <i
                              className="bi bi-download me-2"
                              style={{
                                fontSize: "18px",
                              }}
                            ></i>
                            Download Full Report
                          </p>
                          <div className="row">
                            <div className="col-md-5 border-end border-end-sm-none pe-md-5">
                              <div className="d-flex">
                                <p className="download_heading pe-3">Job </p>
                                <p className="top_para_styles">
                                  {" "}
                                  : {selectedCandidate?.job_title}
                                </p>
                              </div>
                              <div className="d-flex ">
                                <p className="download_heading pe-3">
                                  Interview ID
                                </p>
                                <p className="top_para_styles">
                                  {" "}
                                  : {selectedCandidateReport?.interview_id}
                                </p>
                              </div>
                              <div className="d-flex ">
                                <p className="download_heading pe-3">
                                  Interviewer
                                </p>
                                <p className="sx-text-primary fs_14">
                                  {" "}
                                  : {selectedCandidate?.smeFullName}
                                </p>
                              </div>
                              <div className="d-flex ">
                                <p className="download_heading pe-3">
                                  Interview date and time
                                </p>
                                <p className="top_para_styles">
                                  {" "}
                                  :{" "}
                                  {moment(
                                    selectedCandidate?.interview_schedule
                                  ).format("DD MMM YYYY HH:MM:SS")}
                                </p>
                              </div>
                              <div className="d-flex ">
                                <p className="download_heading pe-3">
                                  Time zone{" "}
                                </p>
                                <p className="top_para_styles"> :</p>
                              </div>
                              <div className="d-flex ">
                                <p className="download_heading pe-3">
                                  Experience{" "}
                                </p>
                                <p className="top_para_styles d-flex me-2">
                                  {" "}
                                  : 4.2
                                  <div className="ms-2">
                                    <span>
                                      <img src={STAR_ICON_WITH_YELLOW} alt="" />
                                    </span>
                                    <span>
                                      <img src={STAR_ICON_WITH_YELLOW} alt="" />
                                    </span>
                                    <span>
                                      <img src={STAR_ICON_WITH_YELLOW} alt="" />
                                    </span>
                                    <span>
                                      <img src={STAR_ICON_WITH_YELLOW} alt="" />
                                    </span>
                                    <span>
                                      <img src={STAR_ICON} alt="" />
                                    </span>
                                  </div>
                                </p>
                              </div>
                              <div className="d-flex border-bottom pb-2">
                                <p className="download_heading pe-3">
                                  Competency{" "}
                                </p>
                                <p className="top_para_styles d-flex">
                                  {" "}
                                  : 3.2
                                  <div className="ms-2">
                                    <span>
                                      <img src={STAR_ICON_WITH_YELLOW} alt="" />
                                    </span>
                                    <span>
                                      <img src={STAR_ICON_WITH_YELLOW} alt="" />
                                    </span>
                                    <span>
                                      <img src={STAR_ICON_WITH_YELLOW} alt="" />
                                    </span>
                                    <span>
                                      <img src={STAR_ICON_WITH_YELLOW} alt="" />
                                    </span>
                                    <span>
                                      <img src={STAR_ICON} alt="" />
                                    </span>
                                  </div>
                                </p>
                              </div>
                              {/* <hr /> */}
                              <p className="download_heading py-3">Skills </p>
                              <p className="top_para_styles border-bottom pb-4">
                                {selectedCandidateReport?.skillsRating?.map(
                                  (data: any, index: number) => {
                                    return (
                                      <p className="mb-0">
                                        <span>
                                          <span className="skills_border_color me-3">
                                            {data?.skill}
                                          </span>
                                          4.2
                                          <span className="ms-2">
                                            {Array.apply(null, Array(5)).map(
                                              (exp: any, expIndex: number) => {
                                                return (
                                                  <span className="">
                                                    {expIndex + 1 <=
                                                      data?.experience && (
                                                      <span>
                                                        <span>
                                                          <img
                                                            src={STAR_ICON}
                                                            alt=""
                                                          />
                                                        </span>
                                                      </span>
                                                    )}
                                                    {!(
                                                      expIndex + 1 <=
                                                      data?.experience
                                                    ) && (
                                                      <span>
                                                        <span>
                                                          <img
                                                            src={
                                                              STAR_ICON_WITH_YELLOW
                                                            }
                                                            alt=""
                                                          />
                                                        </span>
                                                      </span>
                                                    )}
                                                  </span>
                                                );
                                              }
                                            )}
                                          </span>
                                        </span>
                                      </p>
                                    );
                                  }
                                )}
                              </p>
                              {/* <hr /> */}
                              <p className="download_heading pe-3">
                                Audio summary{" "}
                              </p>
                              <p className="top_para_styles">
                                {selectedCandidateReport?.audio_summary_url ? (
                                  <p>
                                    {/* <audio src={`${CLOUDFRONT_URL}/${selectedCandidateReport?.audio_summary_url}`} controls /> */}
                                  </p>
                                ) : (
                                  <p>No audio summary</p>
                                )}
                              </p>
                              <p className="download_heading pe-3">
                                Video summary{" "}
                              </p>
                              <p className="top_para_styles">
                                {selectedCandidateReport?.audio_summary_url ? (
                                  <p>
                                    {/* <video src={`${CLOUDFRONT_URL}/${selectedCandidateReport?.audio_summary_url}`} controls /> */}
                                  </p>
                                ) : (
                                  <p>No video summary</p>
                                )}
                              </p>
                            </div>
                            <div className="col-md-7 mt-4 mt-md-2 ps-md-4 ps-sm-3">
                              <div>
                                <p className="download_heading">
                                  Short Summary
                                </p>
                                <p className="top_para_styles">
                                  {selectedCandidateReport?.short_summary ? (
                                    <p>
                                      {selectedCandidateReport?.short_summary}
                                    </p>
                                  ) : (
                                    <p>No short summary</p>
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="download_heading">
                                  Detailed Summary
                                </p>
                                <p className="top_para_styles">
                                  {selectedCandidateReport?.detailed_summary ? (
                                    <p>
                                      {
                                        selectedCandidateReport?.detailed_summary
                                      }
                                    </p>
                                  ) : (
                                    <p>No detailed summary</p>
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="download_heading">
                                  Response to Screening Instructions Providing
                                  by org
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <div className="border_color rounded-3 p-3 bg-white">
          <div className="row mb-3">
            <div className="col-md-12 my-2 px-3">
              <div className="px-lg-3 d-sm-flex justify-content-sm-between">
                <div className="d-flex select_all_left_side mb-sm-0 mb-3">
                  {/* <div className="form-check mt-2">
                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                            <label className="form-check-label text-black" style={{ fontSize: "13px" }}>
                                                Select All
                                            </label>
                                        </div> */}
                  {/*<button className='small_btn rounded ms-3 move_padding'>Move</button>*/}
                </div>
                <div className="d-flex search_and_filter_right_side">
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
          </div>

          <div className="">
            <Offcanvas show={show2} onHide={handleClose} placement={"end"}>
              <Offcanvas.Body>
                <div className="">
                  <div className="bg-white p-4">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="download_heading">
                          Rohan N Krishnamurthi - Clerra Hyatt
                        </h5>
                        <p className="download_para">
                          Report by SME based on the interview
                        </p>
                      </div>
                      <div>
                        <button className="large_btn rounded">
                          View Full Profile
                        </button>
                        <button
                          className="dashboard_happy_monday_dot_btn px-2 py-1 rounded mx-2"
                          onClick={() => handleCloseCanves2()}
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
                    <div className="mt-4">
                      <h6 className="mb-4 report_heading">Quick Stats</h6>
                      <ul className="d-flex list-inline">
                        <li>
                          <ul className="list-inline">
                            <li>
                              <p className="report_details_headings">
                                Added on
                              </p>
                            </li>
                            <li>
                              <p className="report_details_headings">
                                Added by
                              </p>
                            </li>
                            <li>
                              <p className="report_details_headings">
                                Availability
                              </p>
                            </li>
                            <li>
                              <p className="report_details_headings">
                                Experience
                              </p>
                            </li>
                            <li>
                              <p className="report_details_headings">
                                Competency
                              </p>
                            </li>
                            <li>
                              <p className="report_details_headings">Skills</p>
                            </li>
                          </ul>
                        </li>

                        <li className="ms-5">
                          <ul className="list-inline">
                            <li>
                              <p className="report_details">31 jan 2022</p>
                            </li>
                            <li>
                              <p className="report_details text-decoration-underline">
                                Recruiter Name
                              </p>
                            </li>
                            <li>
                              <p className="report_details">28 Feb, 4pm</p>
                            </li>
                            <li>
                              <p className="report_details">
                                4.2{" "}
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#FFA800"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#FFA800"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#FFA800"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#FFA800"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#A9A9A9"
                                  />
                                </svg>
                              </p>
                            </li>
                            <li>
                              <p className="report_details">
                                3.0{" "}
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#FFA800"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#FFA800"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#FFA800"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#A9A9A9"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#A9A9A9"
                                  />
                                </svg>
                              </p>
                            </li>
                            <li>
                              <p className="report_details">
                                <span className="skills_border_color">
                                  Photogrammetry
                                </span>
                                <span className="mx-3 skills_border_color">
                                  Satellite analytics
                                </span>
                                <span className="mx-3 skills_border_color">
                                  Python
                                </span>
                              </p>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Offcanvas.Body>
            </Offcanvas>
          </div>

          <div>
            <Offcanvas show={show} onHide={handleClose} placement={"end"}>
              <Offcanvas.Body>
                <div className="">
                  <div className="bg-white p-4">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="download_heading">
                          {selectedCandidate?.candidateFullName} - by{" "}
                          {selectedCandidate?.smeFullName}
                        </h5>
                        <p className="download_para">
                          Report by SME based on the interview
                        </p>
                      </div>
                      <div>
                        <button
                          className="large_btn rounded"
                          onClick={() => downloadPDF()}
                        >
                          Download
                        </button>
                        <button
                          className="dashboard_happy_monday_dot_btn px-2 py-1 rounded mx-2"
                          onClick={() => setShow(false)}
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
                    <div className="mt-4">
                      <h6 className="mb-4 report_heading">Report</h6>
                      <ul className="d-flex list-inline">
                        <li>
                          <ul className="list-inline">
                            <li>
                              <p className="report_details_headings">
                                Interview ID
                              </p>
                            </li>
                            <li>
                              <p className="report_details_headings">
                                Interviewer
                              </p>
                            </li>
                            <li>
                              <p className="report_details_headings">
                                Interview date{" "}
                              </p>
                            </li>
                            <li>
                              <p className="report_details_headings">
                                Experience
                              </p>
                            </li>
                            <li>
                              <p className="report_details_headings">
                                Competency
                              </p>
                            </li>
                            <li>
                              <p className="report_details_headings">Skills</p>
                            </li>
                          </ul>
                        </li>

                        <li className="ms-5">
                          <ul className="list-inline">
                            <li>
                              <p className="report_details">
                                {" "}
                                {selectedCandidateReport?.id}
                              </p>
                            </li>
                            <li>
                              <p className="report_details text-decoration-underline">
                                {selectedCandidate?.smeFullName}
                              </p>
                            </li>
                            <li>
                              <p className="report_details">
                                {moment(
                                  selectedCandidate?.interview_schedule
                                ).format("DD MMM YYYY")}
                              </p>
                            </li>
                            <li>
                              <p className="report_details">
                                4.2{" "}
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#FFA800"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#FFA800"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#FFA800"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#FFA800"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#A9A9A9"
                                  />
                                </svg>
                              </p>
                            </li>
                            <li>
                              <p className="report_details">
                                3.0{" "}
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#FFA800"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#FFA800"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#FFA800"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#A9A9A9"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="11"
                                  viewBox="0 0 12 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                    fill="#A9A9A9"
                                  />
                                </svg>
                              </p>
                            </li>
                            <li>
                              <p
                                className="report_details"
                                style={{ width: "500px" }}
                              >
                                {selectedCandidateReport?.skillsRating?.map(
                                  (data: any, index: number) => {
                                    return (
                                      <p className="mb-0 pt-3">
                                        <span>
                                          {Array.apply(null, Array(5)).map(
                                            (exp: any, expIndex: number) => {
                                              return (
                                                <span>
                                                  {expIndex + 1 <=
                                                    data?.experience && (
                                                    <span>
                                                      <svg
                                                        className="pointer"
                                                        width="12"
                                                        height="11"
                                                        viewBox="0 0 12 11"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                      >
                                                        <path
                                                          d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z"
                                                          fill="#FFA800"
                                                        />
                                                      </svg>
                                                    </span>
                                                  )}
                                                  {!(
                                                    expIndex + 1 <=
                                                    data?.experience
                                                  ) && (
                                                    <span>
                                                      <svg
                                                        className="pointer"
                                                        width="12"
                                                        height="11"
                                                        viewBox="0 0 12 11"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                      >
                                                        <path
                                                          d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z"
                                                          fill="#A9A9A9"
                                                        />
                                                      </svg>
                                                    </span>
                                                  )}
                                                </span>
                                              );
                                            }
                                          )}
                                          <span className="skills_border_color ms-3">
                                            {data?.skill}
                                          </span>
                                        </span>
                                      </p>
                                    );
                                  }
                                )}
                              </p>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="report_details_headings">Comments</h6>
                      <p className="report_details">
                        {selectedCandidateReport?.comments}
                      </p>
                    </div>
                    <div>
                      <h6 className="report_details_headings">Short Summary</h6>
                      <p className="report_details">
                        {selectedCandidateReport?.short_summary}
                      </p>
                    </div>
                    <div>
                      <h6 className="report_details_headings">
                        Detailed Summary
                      </h6>
                      <p className="report_details">
                        {selectedCandidateReport?.detailed_summary}
                      </p>
                    </div>
                    <div>
                      <h6 className="report_details_headings">Audio Summary</h6>
                      <p>
                        <audio
                          src={selectedCandidateReport?.audio_summary_url}
                          controls
                        />
                      </p>
                    </div>
                    <div className="my-5 text-end px-5">
                      <p className="right_side_para_links m-0 p-0 my-2">
                        Video link
                      </p>
                      <p className="right_side_para_links m-0 p-0">
                        Full Report
                      </p>
                    </div>
                  </div>
                </div>
              </Offcanvas.Body>
            </Offcanvas>
          </div>
          {jobsList.length > 0 ? (
            <DataTable
              TableCols={JobsReportsGridCols}
              tableData={jobsList}
              editInfo={onEditjobs}
              deleteInfo={onDeletejobs}
              activePageNumber={activePage}
              searchText={onSearchText}
              pageNumber={onPageChange}
              pageNumbers={pageArray}
            ></DataTable>
          ) : (
            <div className="tab-pane" id="nav-profile">
              <NoData message=""></NoData>
            </div>
          )}
          <div className="d-none">
            <div id="pdf-content" style={{ width: "100vw" }}>
              <div className="bg-white p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <h5 className="download_heading">
                      {selectedCandidate?.candidateFullName} - by{" "}
                      {selectedCandidate?.smeFullName}
                    </h5>
                    <p className="download_para">
                      Report by SME based on the interview
                    </p>
                  </div>
                  <div>
                    <button
                      className="large_btn rounded"
                      onClick={() => downloadPDF()}
                    >
                      Download
                    </button>
                    <button
                      className="dashboard_happy_monday_dot_btn px-2 py-1 rounded mx-2"
                      onClick={() => setShow(false)}
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
                <div className="mt-4">
                  <h6 className="mb-4 report_heading">Report</h6>
                  <ul className="d-flex list-inline">
                    <li>
                      <ul className="list-inline">
                        <li>
                          <p className="report_details_headings">
                            Interview ID
                          </p>
                        </li>
                        <li>
                          <p className="report_details_headings">Interviewer</p>
                        </li>
                        <li>
                          <p className="report_details_headings">
                            Interview date{" "}
                          </p>
                        </li>
                        <li>
                          <p className="report_details_headings">Experience</p>
                        </li>
                        <li>
                          <p className="report_details_headings">Competency</p>
                        </li>
                        <li>
                          <p className="report_details_headings">Skills</p>
                        </li>
                      </ul>
                    </li>

                    <li className="ms-5">
                      <ul className="list-inline">
                        <li>
                          <p className="report_details">
                            {" "}
                            {selectedCandidateReport?.id}
                          </p>
                        </li>
                        <li>
                          <p className="report_details text-decoration-underline">
                            {selectedCandidate?.smeFullName}
                          </p>
                        </li>
                        <li>
                          <p className="report_details">
                            {moment(
                              selectedCandidate?.interview_schedule
                            ).format("DD MMM YYYY")}
                          </p>
                        </li>
                        <li>
                          <p className="report_details">
                            4.2{" "}
                            <svg
                              width="12"
                              height="11"
                              viewBox="0 0 12 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                fill="#FFA800"
                              />
                            </svg>
                            <svg
                              width="12"
                              height="11"
                              viewBox="0 0 12 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                fill="#FFA800"
                              />
                            </svg>
                            <svg
                              width="12"
                              height="11"
                              viewBox="0 0 12 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                fill="#FFA800"
                              />
                            </svg>
                            <svg
                              width="12"
                              height="11"
                              viewBox="0 0 12 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                fill="#FFA800"
                              />
                            </svg>
                            <svg
                              width="12"
                              height="11"
                              viewBox="0 0 12 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                fill="#A9A9A9"
                              />
                            </svg>
                          </p>
                        </li>
                        <li>
                          <p className="report_details">
                            3.0{" "}
                            <svg
                              width="12"
                              height="11"
                              viewBox="0 0 12 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                fill="#FFA800"
                              />
                            </svg>
                            <svg
                              width="12"
                              height="11"
                              viewBox="0 0 12 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                fill="#FFA800"
                              />
                            </svg>
                            <svg
                              width="12"
                              height="11"
                              viewBox="0 0 12 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                fill="#FFA800"
                              />
                            </svg>
                            <svg
                              width="12"
                              height="11"
                              viewBox="0 0 12 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                fill="#A9A9A9"
                              />
                            </svg>
                            <svg
                              width="12"
                              height="11"
                              viewBox="0 0 12 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z"
                                fill="#A9A9A9"
                              />
                            </svg>
                          </p>
                        </li>
                        <li>
                          <p
                            className="report_details"
                            style={{ width: "500px" }}
                          >
                            {selectedCandidateReport?.skillsRating?.map(
                              (data: any, index: number) => {
                                return (
                                  <p className="mb-0 pt-3">
                                    <span>
                                      {Array.apply(null, Array(5)).map(
                                        (exp: any, expIndex: number) => {
                                          return (
                                            <span>
                                              {expIndex + 1 <=
                                                data?.experience && (
                                                <span>
                                                  <svg
                                                    className="pointer"
                                                    width="12"
                                                    height="11"
                                                    viewBox="0 0 12 11"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                  >
                                                    <path
                                                      d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z"
                                                      fill="#FFA800"
                                                    />
                                                  </svg>
                                                </span>
                                              )}
                                              {!(
                                                expIndex + 1 <=
                                                data?.experience
                                              ) && (
                                                <span>
                                                  <svg
                                                    className="pointer"
                                                    width="12"
                                                    height="11"
                                                    viewBox="0 0 12 11"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                  >
                                                    <path
                                                      d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z"
                                                      fill="#A9A9A9"
                                                    />
                                                  </svg>
                                                </span>
                                              )}
                                            </span>
                                          );
                                        }
                                      )}
                                      <span className="skills_border_color ms-3">
                                        {data?.skill}
                                      </span>
                                    </span>
                                  </p>
                                );
                              }
                            )}
                          </p>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className="report_details_headings">Comments</h6>
                  <p className="report_details">
                    {selectedCandidateReport?.comments}
                  </p>
                </div>
                <div>
                  <h6 className="report_details_headings">Short Summary</h6>
                  <p className="report_details">
                    {selectedCandidateReport?.short_summary}
                  </p>
                </div>
                <div>
                  <h6 className="report_details_headings">Detailed Summary</h6>
                  <p className="report_details">
                    {selectedCandidateReport?.detailed_summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
