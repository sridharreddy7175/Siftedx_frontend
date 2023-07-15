import React, { useState, useRef } from "react";
import HAMBURGER_ICON from "./../../assets/icon_images/hamburger_list_menu.svg";
import GROUP_ICON from "./../../assets/icon_images/Group_icon.svg";
import ADDCANDIDATE_ICON from "./../../assets/icon_images/candidates_in_jobs.svg";
import FLAG_ICON from "./../../assets/icon_images/Group 3615.svg";
import ALERT_CIRCLE_ICON from "./../../assets/icon_images/alert_circle_danger_error_icon.svg";

export interface JobListContextMenuItem {
  label: string;
  value: string;
}
interface Props {
  data: any;
  actions: JobListContextMenuItem[];
  onAction: (actionItem: JobListContextMenuItem) => void;
  onOpenJob: () => void;
  openArchive: boolean;
  onSelectRow: any;
  onChangeReopen:() => void;
}

export const JobListItem: React.FC<Props> = (props: Props) => {

  const tags = props?.data?.tags ? props?.data?.tags.split(",") : [];

 

  return (
    <>
      <div
        className=" pt-1 pb-2 job-list-item "
        style={{
          // position: "relative",
          borderBottom: "1px solid #dee2e6",
        }}
      >
   
        <div className=" d-flex justify-content-between pb-1 rounded-top">
          <ul className="list-inline my-auto">
            <li className="side_heading">
              {props.openArchive === true && (
                <>
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    checked={props?.data?.checked}
                    id="flexCheckDefault"
                    onChange={(e) => props.onSelectRow(e)}
                  />
                </>
              )}
              {props.data?.job_title}
            </li>
            <li className="sx-text-secondary fs_14">
              {props?.data?.location}. {props?.data?.category_code}
            </li>
          </ul>
          <ul className="d-flex list-inline my-auto pe-3">
            {props.openArchive === true && (
              <li>
                <button
                  className="large_btn_apply btn-outline-primary rounded me-3"
                  onClick={props?.onChangeReopen}
                >
                  Reopen
                </button>
              </li>
            )}
            <li>
              <button
                className="large_btn_apply rounded"
                onClick={props?.onOpenJob}
              >
                Open
              </button>
            </li>

            {props.actions.length > 0 && (
              <li className="position-relative job-actions-link pointer ms-3">
                <img src={HAMBURGER_ICON} alt="" />
                <div className="job-list-actions px-2 py-1 chat_arrow_container mt-1 border shadow">
                  <div className="chat_arrow"></div>
                  <ul className="list-inline mb-0">
                    {props.actions.map((el, index: number) => (
                      <li
                        onClick={() => props.onAction(el)}
                        key={index}
                        className="job-list-action-item"
                      >
                        {" "}
                        {el.label}{" "}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )}
          </ul>
        </div>
        <div className="d-flex justify-content-between ">
          <ul className="d-flex list-inline mb-0">
            <li className="me-md-3 me-sm-2 me-1" data-tip="Candidates Added">
              <span className="me-1">
                <img src={ADDCANDIDATE_ICON}></img>
                {/* <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M16 0H1.99C0.88 0 0.00999999 0.9 0.00999999 2L0 16C0 17.1 0.88 18 1.99 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM16 12H12C12 13.66 10.65 15 9 15C7.35 15 6 13.66 6 12H1.99V2H16V12ZM13 7H11V4H7V7H5L9 11L13 7Z"
                                        fill="#9C9C9C"
                                    />
                                </svg> */}
              </span>{" "}
              <span className="side_heading">
                {props.data?.total_candidates_pending}
              </span>
            </li>

            <li
              className="mx-md-3 mx-sm-2 mx-1"
              data-tip="Interviews Scheduled"
            >
              <span className="me-1">
                <img src={GROUP_ICON}></img>
                {/* <svg
                                    width="18"
                                    height="20"
                                    viewBox="0 0 18 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M16 2H15V0H13V2H5V0H3V2H2C0.89 2 0 2.9 0 4V18C0 19.1 0.89 20 2 20H16C17.1 20 18 19.1 18 18V4C18 2.9 17.1 2 16 2ZM9 5C10.66 5 12 6.34 12 8C12 9.66 10.66 11 9 11C7.34 11 6 9.66 6 8C6 6.34 7.34 5 9 5ZM15 17H3V16C3 14 7 12.9 9 12.9C11 12.9 15 14 15 16V17Z"
                                        fill="#9C9C9C"
                                    />
                                </svg> */}
              </span>{" "}
              <span className="side_heading">
                {props.data?.total_candidates_scheduled}
              </span>
            </li>

            <li className="mx-md-3 mx-sm-2 mx-1 " data-tip="To Be Rescheduled">
              <span className="me-1">
                <img src={ALERT_CIRCLE_ICON}></img>
                {/* <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
                                        fill="#9C9C9C"
                                    />
                                </svg> */}
              </span>{" "}
              <span className="side_heading">
                {props.data?.total_candidates_rescheduled}
              </span>
            </li>

            <li className="mx-md-3 mx-sm-2 mx-1" data-tip="Candidates Screened">
              <span className="me-1">
                <img src={FLAG_ICON}></img>
              </span>{" "}
              <span className="side_heading">
                {props.data?.total_candidates_completed}
              </span>
            </li>

            <li className="d-lg-inline d-none">
              <span className="top_right_styles ms-3">Tags: </span>
              {tags.length > 0 ? (
                tags.map((data: any, index: number) => {
                  return (
                    <span key={index}>
                      {index < 2 && (
                        <span
                          className="sx-bg-color text-black fs_14 me-2"
                          style={{
                            borderRadius: "10px",
                            paddingInline: "12px",
                          }}
                        >
                          {data}
                        </span>
                      )}
                    </span>
                  );
                })
              ) : (
                <span className="top_para_styles ">No Tags</span>
              )}
            </li>
          </ul>

          <div>
            <h6 className="side_heading pe-3">
              <span>{props.data?.total_candidates}</span> Candidates
            </h6>
          </div>
        </div>
        <div className="d-inline d-lg-none">
          <span className="top_right_styles">Tags: </span>
              {tags.length > 0 ? (
                tags.map((data: any, index: number) => {
                  return (
                    <span key={index}>
                      {index < 2 && (
                        <span
                          className="sx-bg-color text-black fs_14 me-2 d-inline-block"
                          style={{
                            borderRadius: "10px",
                            paddingInline: "12px",
                          }}
                        >
                          {data}
                        </span>
                      )}
                    </span>
                  );
                })
              ) : (
                <span className="top_para_styles ">No Tags</span>
              )}</div>
      </div>
    </>
  );
};
