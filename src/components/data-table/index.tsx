import React, { useEffect, useState, SyntheticEvent } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { DataTableCol } from "./types";
import "react-datepicker/dist/react-datepicker.css";
import NoData from "../no-data";
import moment from "moment";
import { Modal } from "react-bootstrap";
// import Delete from "../../../assets/icon_images/delete.png";
import Delete from "../../assets/icon_images/delete.png";
import DELETE_ICON from "../../assets/icon_images/delete.svg";
import Calendar_ICON from "../../assets/icon_images/calendar_date_meeting_reminder_time_icon.svg";
import Calendar from "react-calendar";
import { TimePicker } from "../../components/time";
import ValidationErrorMsgs from "../../app/utility/validation-error-msgs";
import Add from "../../assets/icon_images/Add.png";
import AvailabilityTime from "../availability-time/availabilityTime";
import REPORT_ICON from "../../assets/icon_images/report_icon.svg";

interface Props {
  tableData?: any;
  TableCols: DataTableCol[];
  searchText?: any;
  pageNumbers?: any;
  pageNumber: (value: any) => void;
  activePageNumber: number;
  editInfo?: any;
  deleteInfo?: any;
  isHidePagination?: boolean;
}

export const DataTable: React.FC<Props> = (props) => {
  const [activePage, setActivePage] = useState(1);
  const history = useHistory();
  const [canShowDeletePopup, setCanShowDeletePopup] = useState(false);
  const [selectedData, setSelectedData] = useState<any>({});
  const [showButtons, setShowButtons] = useState(false);
  const [showLinksDiv, setShowLinkDiv] = useState(false);
  const [tableData, setTableData] = useState<any>(props.tableData);
  const [checkedAll, setCheckedAll] = useState<any>(false);
  const location = useLocation();
  let isNotRowClick = false;
  const [canShowDefaultArrow, setCanShowDefaultArrow] = useState(true);
  const [sortingField, setSortingField] = useState("");
  const [sortingOrder, setSortingOrder] = useState("asc");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const locationPath: any = useLocation().pathname;

  useEffect(() => {
    setTableData([...props.tableData]);
    setActivePage(props?.activePageNumber);
  }, []);

  function handleRowClick(el: any, item: any) {
    setTimeout(() => {
      if (
        location.pathname.includes("candidates/candidates") &&
        !isNotRowClick
      ) {
        const data = {
          item: item,
          type: "link",
        };
        props.editInfo(data);
      } else {
        isNotRowClick = false;
      }
    }, 1000);
  }

  function onClickEdit(item: any, type: string) {
    const data = {
      item: item,
      type: type,
    };
    props.editInfo(data);
  }

  const onClickLink = (item: any, el: any, type: string) => {
    console.log("hello", el);
    if (el === true) {
      const data = {
        item: item,
        type: type,
      };
      props.editInfo(data);
    }
  };

  const onClickCalender = (item: any) => {
    console.log("hello1232");
    isNotRowClick = true;
    const data = {
      item: item,
      type: "calender",
    };
    props.editInfo(data);
    setTimeout(() => {
      isNotRowClick = false;
    }, 2000);
  };
  const onClickDelete = (item: any) => {
    const data = {
      item: item,
      type: "delete",
    };
    props.editInfo(data);
  };
  const onClickReport = (item: any) => {
    const data = {
      item: item,
      type: "report",
    };
    props.editInfo(data);
  };

  const onReportNeededEdit = (item: any) => {
    const data = {
      item: item,
      type: "edit",
    };
    props.editInfo(data);
  };

  const onActions = (item: any, type: string) => {
    const data = {
      item: item,
      type: type,
    };
    props.editInfo(data);
  };

  const addFavourite = (item: any, is_favourite: any) => {
    // console.log("hhhhh", item.uuid)
    const data = {
      candidate_uuid: item.uuid,
      is_favourite: true,
    };
    props.editInfo(data);
  };

  const onDeleteConformation = () => {
    if (props.deleteInfo) {
      props.deleteInfo(selectedData);
      handleDeleteClose();
    }
  };

  const handleDeleteClose = () => {
    setCanShowDeletePopup(false);
  };

  const handleMouseEnter = (e: any, index: number) => {
    setSelectedIndex(index);
    setShowButtons(true);
    setShowLinkDiv(false);
  };

  const handleMouseLeave = (e: any) => {
    setShowButtons(false);
  };

  const handleMouseEnterDiv = (e: any) => {
    setShowLinkDiv(true);
  };

  const handleMouseLeaveDiv = (e: any) => {
    setShowLinkDiv(true);
  };

  const handleMouseEnterInnerDiv = (e: any) => {
    setShowLinkDiv(true);
    setShowButtons(true);
  };

  const handleMouseLeaveInnerDiv = (e: any) => {
    setShowLinkDiv(false);
    setShowButtons(false);
  };

  const onCheckAll = (e: any) => {
    const data = tableData;
    data.forEach((element: any) => {
      element.isChecked = e.target.checked;
    });
    setTableData([...data]);
    setCheckedAll(e.target.checked);
  };
  const onSelectRow = (e: any, index: number) => {
    isNotRowClick = true;
    const data = tableData;
    data[index].isChecked = e.target.checked;
    setTableData([...data]);
    isChecked(data);
    setTimeout(() => {
      isNotRowClick = false;
    }, 2000);
  };

  const isChecked = (tableData: any) => {
    setCheckedAll(false);
    const data = tableData;
    const selectedData = data.find((data: any) => !data.isChecked);
    if (!selectedData) {
      setCheckedAll(true);
    }
  };

  const onClickNextPage = () => {
    props.pageNumber(activePage + 1);
    setActivePage(activePage);
  };

  const onClickPreviousPage = () => {
    props.pageNumber(activePage - 1);
    setActivePage(activePage);
  };

  const onClickPage = (number: number) => {
    props.pageNumber(number);
    setActivePage(number);
  };
  const onDeleteCandidate = (data: any) => {
    setSelectedData(data);
    isNotRowClick = true;
    setCanShowDeletePopup(true);
    setTimeout(() => {
      isNotRowClick = false;
    }, 2000);
  };

  const onSortingField = (data: any) => {
    // console.log("data---->",data)
    setCanShowDefaultArrow(false);
    const order =
      data === sortingField && sortingOrder === "asc" ? "desc" : "asc";

    console.log("data", data, order);
    setSortingField(data);
    setSortingOrder(order);
    if (data) {
      const reversed = order === "asc" ? 1 : -1;
      const preparedData = props.tableData.sort(
        (a: any, b: any) => reversed * a[data].toString().localeCompare(b[data])
      );
      setTableData([...preparedData]);
      // console.log("prepareData",preparedData)
      // const preparedData = props.tableData.sort((a: any, b: any) => a.itemIndex - b.itemIndex);
    }
  };

  return (
    <div>
      <>
        <div className="table-responsive px-3 pb-3 d-none d-md-block">
          <table className="table table-borderless table-striped table-sm fs_14 border-light">
            <thead className="thead-light">
              <tr>
                {props?.TableCols.map((el: any, index: number) => {
                  return el.control === "CheckBox" ? (
                    <th key={index} style={{ width: "95px" }}>
                      <span style={{ borderTop: "1px solid #F5F5F5" }}>
                        {el.control === "CheckBox" && (
                          <div className="form-check mt-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={checkedAll}
                              id="flexCheckDefault"
                              onChange={(e) => onCheckAll(e)}
                            />
                            <label
                              className="form-check-label text-black"
                              style={{ fontSize: "13px" }}
                            >
                              Select All
                            </label>
                          </div>
                        )}
                      </span>
                    </th>
                  ) : (
                    <th
                      style={{
                        borderTopLeftRadius: index === 0 ? "0.3rem" : "unset",
                        borderTopRightRadius:
                          index === props.TableCols.length - 1
                            ? "0.3rem"
                            : "unset",
                      }}
                      key={index}
                      className={`${el.title === "Actions" ? "text-center" : ""
                        }`}
                      onClick={() =>
                        el.sortable ? onSortingField(el.control) : null
                      }
                    >
                      {el.title === "Actions" ? "Actions" : el.title}
                      {((canShowDefaultArrow && index === 0 && el.sortable) ||
                        (el.defaultSort && canShowDefaultArrow)) && (
                          <i className="bi bi-arrow-down cursor-pointer p-2"></i>
                        )}
                      {sortingField && sortingField === el.control && (
                        <i
                          className={`${sortingOrder === "asc"
                            ? "bi bi-arrow-down cursor-pointer p-2"
                            : "bi bi-arrow-up cursor-pointer p-2"
                            }`}
                        ></i>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {tableData?.map((item: any, i: number) => (
                <tr
                  key={i}
                  onMouseEnter={(e) => handleMouseEnter(e, i)}
                  onMouseLeave={(e) => handleMouseLeave(e)}
                >
                  {props?.TableCols.map((el: any, index: number) => (
                    <td
                      key={index}
                      style={{
                        width: `${el.isTags
                          ? "150px"
                          : el.title === "Availability" && "23%"
                          }`,
                        position: `${el.control === "candidate" ? "relative" : "static"
                          }`,
                      }}
                      className={
                        el.control === "user_uuid"
                          ? "active-control"
                          : `${el.title === "Actions" ? "text-center" : ""}`
                      }
                      onClick={() => handleRowClick(el, item)}
                    >
                      {el.isLink && (
                        <span
                          style={{
                            cursor: "pointer",
                            color: "#F5BE17",
                            // textTransform: "capitalize",
                            fontWeight: 600,
                            fontStyle: "normal",
                            fontFamily: " 'Poppins', sans-serif",
                          }}
                          onClick={() =>
                            onClickLink(
                              item,
                              el.isLink,
                              el.control === "meeting_link"
                                ? "zoomLink"
                                : "link"
                            )
                          }
                        >
                          {item[el.control]}
                        </span>
                      )}

                      {/* {el.isTags &&
                        <span> {item[el.control]?.map((tags: any, tagsIndex: number) => {
                          return <span>{tagsIndex < 3 && <span key={tagsIndex} className="" style={{ display: "inline-block" }}> {tags} {tags && ','}</span>}</span>
                        })}</span>}  */}
                      {el.isTags && (
                        <>
                          {item?.tagsList?.map((tag: any, index: number) => {
                            // console.log("tags",tag.length-1)
                            return (
                              <span>
                                {index < 3 && (
                                  <span
                                    key={index}
                                    className=""
                                    style={{ display: "inline-block" }}
                                  >
                                    {tag}
                                    {tag && tag.length - 1 !== index && (
                                      <> , </>
                                    )}
                                  </span>
                                )}
                              </span>
                            );
                          })}
                          {item?.tagsList?.length > 3 && (
                            <span className="ms-1">...</span>
                          )}
                        </>
                      )}
                      {el.control === "CheckBox" && (
                        <div
                          className="form-check mt-2"
                          style={{ zIndex: "30" }}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={item?.isChecked}
                            onChange={(e) => onSelectRow(e, i)}
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label text-black"
                            style={{ fontSize: "13px" }}
                          ></label>
                        </div>
                      )}

                      {el.title !== "Reports Info" && !el.isLink && !el.isTags
                        ? item[el.control]
                        : ""}

                      {el.title === "Availability" &&
                        el.control === "availability_time" && (
                          <>
                            <img
                              src={Calendar_ICON}
                              style={{ float: "right" }}
                              className="pointer me-3 position-relative"
                              alt="calendar"
                              onClick={() => onClickCalender(item)}
                            />
                            {item["availabilities"]?.length > 0 ? (
                              <div>
                                {item["availabilities"]?.map(
                                  (data: any, index: number) => {
                                    return (
                                      <span key={index}>
                                        {index < 1 && (
                                          <span
                                            className="me-2"
                                          >
                                            {moment(
                                              data.availability_date
                                            ).format("YYYY-MM-DD")}
                                            ,
                                            <span className="ms-1">
                                              {" "}
                                              {data.time_from}-{data.time_to}
                                            </span>
                                            {/* moment().add(10, 'days').calendar(); */}
                                          </span>
                                        )}
                                      </span>
                                    );
                                  }
                                )}
                              </div>
                            ) : (
                              <span className="ms-2">Not Set</span>
                            )}
                          </>
                        )}
                      {el.title === "" && el.control === "delete_method" && (
                        <img
                          src={DELETE_ICON}
                          className={`pointer me-3 position-relative ${item.interview_status === "Interview Scheduled"
                            ? "disabled_button"
                            : ""
                            }`}
                          onClick={() => onClickDelete(item)}
                        />
                      )}
                      {(el.title === 'Availability to join from' && el.control === 'availability_time') &&
                        <>
                          <img src={Calendar_ICON} style={{ float: "right" }}
                            className="pointer me-3 position-relative" alt="calendar" onClick={() => onClickCalender(item)} />
                        </>
                      }

                      {el.title === "Actions" &&
                        el.control !== "Request" &&
                        el.control !== "Accepted" &&
                        el.control !== "ReportNeeded" &&
                        el.control !== "Completed" &&
                        el.control !== "candidateInverviewStatus" &&
                        el.control !== "candidateInverviewStatusReport" &&
                        el.control !== "jobReports" &&
                        el.control !== "Accept_Job" &&
                        el.control !== "favourite" && (
                          <button
                            className="small_btn rounded-3 me-2"
                            onMouseEnter={(e) => handleMouseEnterDiv(e)}
                            onMouseLeave={(e) => handleMouseLeaveDiv(e)}
                          >
                            <svg
                              width="16"
                              height="4"
                              viewBox="0 0 16 4"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM14 4C15.1 4 16 3.1 16 2C16 0.9 15.1 0 14 0C12.9 0 12 0.9 12 2C12 3.1 12.9 4 14 4ZM8 0C6.9 0 6 0.9 6 2C6 3.1 6.9 4 8 4C9.1 4 10 3.1 10 2C10 0.9 9.1 0 8 0Z"
                                fill="black"
                              />
                            </svg>
                          </button>
                        )}
                      {el.title === "Actions" &&
                        el.control === "candidateInverviewStatusReport" && (
                          <button
                            onClick={() => onClickReport(item)}
                            className="small_btn rounded-3 me-2"
                          >
                            Report
                          </button>
                        )}
                      {el.title === "Actions" &&
                        el.control === "candidateInverviewStatus" && (
                          <button
                            onClick={() => onClickCalender(item)}
                            style={{ zIndex: "30" }}
                          >
                            <i className="bi bi-calendar"></i>
                          </button>
                        )}

                      {el.title === "Actions" && el.control === "Accepted" && (
                        <button>
                          <i className="bi bi-calendar"></i>
                        </button>
                      )}
                      {el.title === "Report" && el.control === "ReportNeeded" && (
                        <button
                          className="large_btn_apply"
                          onClick={() => onReportNeededEdit(item)}
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                      )}
                      {el.title === "Report" && el.control === "Completed" && (
                        <img onClick={() => onActions(item, "complete")} style={{height:"28px", width:"28px"}}
                        src={REPORT_ICON}
                        alt="report icon"
                        className="pointer ms-2"
                      />
                        // <button>
                        //   <i
                        //     className="bi bi-file-earmark-fill"
                        //     onClick={() => onActions(item, "complete")}
                        //   ></i>
                        // </button>
                      )}

                      {el.title === "Actions" && el.control === "jobReports" && (
                        <button>
                          <i
                            className="bi bi-file-earmark-fill"
                            onClick={() => onActions(item, "ReportView")}
                          ></i>
                        </button>
                      )}

                      {el.title === "Report" && el.control === "jobReports" && (
                        <button>
                          <i
                            className="bi bi-file-earmark-fill"
                            onClick={() => onActions(item, "ReportView")}
                          ></i>
                        </button>
                      )}

                      {el.title === "Actions" && el.control === "Request" && (
                        <>
                          <button
                            className="large_btn_apply rounded-3 btn-outline-primary me-2"
                            onClick={() => onActions(item, "reject")}
                          >
                            Reject
                          </button>
                          <button
                            className="large_btn_apply rounded-3 me-2 "
                            onClick={() => onActions(item, "accept")}
                          >
                            Accept
                          </button>
                        </>
                      )}

                      {el.title === "Actions" && el.control === "Accept_Job" && (
                        <>
                          <button
                            className="large_btn_apply rounded-3 me-2 "
                            onClick={() => onActions(item, "accept")}
                          >
                            Accept
                          </button>
                        </>
                      )}

                      {el.title === "Actions" && el.control === "favourite" && (
                        <>
                          <button
                            className="large_btn_apply rounded-3 me-2 "
                            onClick={() => addFavourite(item, "isType")}
                          >
                            Add
                          </button>
                        </>
                      )}

                      {/* (showLinksDiv && el.title === 'Actions' && selectedIndex === i) && */}
                      {showLinksDiv &&
                        el.title === "Actions" &&
                        selectedIndex === i &&
                        el.control !== "candidate" && (
                          <div
                            className="all_members_links_div"
                            style={{ width: "300px" }}
                            onMouseEnter={(e) => handleMouseEnterInnerDiv(e)}
                            onMouseLeave={(e) => handleMouseLeaveInnerDiv(e)}
                          >
                            <ul className="list-inline">
                              <li className="move_to_draft pointer mb-2">
                                Make Admin
                              </li>
                              <li className="move_to_draft pointer mb-2">
                                Make Hiring Manager
                              </li>
                              <li className="move_to_draft pointer mb-2">
                                Remove from team
                              </li>
                              <li className="move_to_draft pointer mb-2">
                                Temporarily Deactivate from team
                              </li>
                            </ul>
                          </div>
                        )}
                      {showLinksDiv &&
                        el.title === "Actions" &&
                        selectedIndex === i &&
                        el.control === "candidate" && (
                          <div
                            className="all_members_links_div"
                            style={{ width: "300px" }}
                            onMouseEnter={(e) => handleMouseEnterInnerDiv(e)}
                            onMouseLeave={(e) => handleMouseLeaveInnerDiv(e)}
                          >
                            <ul className="list-inline ">
                              <li
                                className="move_to_draft pointer mb-2"
                                onClick={() => onClickEdit(item, "Edit")}
                              >
                                Edit
                              </li>
                              <li
                                className="move_to_draft pointer mb-2"
                                onClick={() => onClickEdit(item, "View")}
                              >
                                Details
                              </li>
                              {/* <li className='pointer'>Delete</li> */}
                            </ul>
                          </div>
                        )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-block d-md-none data-table-responsive">
          {tableData?.map((item: any) => (
            <div className="px-1 py-3 table-row">
              {props?.TableCols.map((el) => (
                <div className="row">
                  <div className="col-6">
                    <p className="m-0 ps-3 ps-lg-3">{el.title}</p>
                  </div>
                  <div className="col-6">
                    <p
                      className="m-0"
                      style={{
                        cursor: el.isLink ? "pointer" : "",
                        color: el.isLink ? "#F5BE17" : "",
                        fontWeight: el.isLink ? 600 : "",
                        fontStyle: el.isLink ? "normal" : "",
                        fontFamily: el.isLink ? " 'Poppins', sans-serif" : "",
                        overflowWrap:"break-word"
                      }}
                      onClick={() =>
                        onClickLink(
                          item,
                          el.isLink,
                          el.control === "meeting_link" ? "zoomLink" : "link"
                        )
                      }
                    >
                      {item[el.control]}
                    </p>
                    <p className="m-0">
                      {el.title === "Actions" && el.control === "ReportNeeded" && (
                        <button
                          className="large_btn_apply"
                          onClick={() => onReportNeededEdit(item)}
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                      )}
                    </p>
                    {el.title === "Report" && el.control === "ReportNeeded" && (
                      <button
                        className="large_btn_apply"
                        onClick={() => onReportNeededEdit(item)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                    )}
                    {el.title === "Report" && el.control === "Completed" && (
                      <img onClick={() => onActions(item, "complete")} style={{height:"28px", width:"28px"}}
                      src={REPORT_ICON}
                      alt="report icon"
                      className="  pointer"
                    />
                      // <button>
                      //   <i
                      //     className="bi bi-file-earmark-fill"
                      //     onClick={() => onActions(item, "complete")}
                      //   ></i>
                      // </button>
                    )}

                    {el.title === "Availability" &&
                      el.control === "availability_time" && (
                        <>
                          <img
                            src={Calendar_ICON}
                            style={{ float: "right" }}
                            className="pointer me-3 position-relative"
                            alt="calendar"
                            onClick={() => onClickCalender(item)}
                          />
                          {item["availabilities"]?.length > 0 ? (
                            <div>
                              {item["availabilities"]?.map(
                                (data: any, index: number) => {
                                  return (
                                    <span key={index}>
                                      {index < 1 && (
                                        <span
                                          className="me-2"
                                        >
                                          {moment(
                                            data.availability_date
                                          ).format("YYYY-MM-DD")}
                                          ,
                                          <span className="ms-1">
                                            {" "}
                                            {data.time_from}-{data.time_to}
                                          </span>
                                          {/* moment().add(10, 'days').calendar(); */}
                                        </span>
                                      )}
                                    </span>
                                  );
                                }
                              )}
                            </div>
                          ) : (
                            <span className="ms-2">Not Set</span>
                          )}
                        </>
                      )}
                    {el.title === "" && el.control === "delete_method" && (
                      <img
                        src={DELETE_ICON}
                        className={`pointer me-3 position-relative ${item.interview_status === "Interview Scheduled"
                          ? "disabled_button"
                          : ""
                          }`}
                        onClick={() => onClickDelete(item)}
                      />
                    )}
                    {(el.title === 'Availability to join from' && el.control === 'availability_time') &&
                      <>
                        <img src={Calendar_ICON} style={{ float: "right" }}
                          className="pointer me-3 position-relative" alt="calendar" onClick={() => onClickCalender(item)} />
                      </>
                    }


                    {el.title === "Actions" && el.control === "jobReports" && (
                      <button>
                        <i
                          className="bi bi-file-earmark-fill"
                          onClick={() => onActions(item, "ReportView")}
                        ></i>
                      </button>
                    )}

                    {el.title === "Report" && el.control === "jobReports" && (
                      <button>
                        <i
                          className="bi bi-file-earmark-fill"
                          onClick={() => onActions(item, "ReportView")}
                        ></i>
                      </button>
                    )}
                    <p className="m-0">
                      {el.title === "Actions" && el.control === "Request" && (
                        <>
                          <button
                            className="large_btn_apply rounded-3 me-2 mt-2"
                            onClick={() => onActions(item, "accept")}
                          >
                            Accept
                          </button>
                          <button
                            className="large_btn_reject rounded-3 me-2 mt-2"
                            onClick={() => onActions(item, "reject")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* {
            props?.TableCols.map(el => <div className='row'>
              <div className="col-12">
                <p className='m-0'>
                  {el.title}
                </p>
              </div>
            </div>)
          } */}
        </div>
        <div className="d-none d-lg-block">
        {!props?.isHidePagination && (
          <div className="" style={{ height: "50px", paddingTop: "10px" }}>
            {props?.tableData?.length > 0 && (
              <nav className="me-3" style={{ float: "right" }}>
                <ul className="pagination">
                  <li className="page-item">
                    <a
                      className={`page-link prev me-1 ${activePage === 1 ? "disabled" : ""
                        }`}
                      onClick={() => onClickPreviousPage()}
                    >
                      <i className="bi bi-chevron-double-left pagination_icon_width"></i>
                    </a>
                  </li>
                  <li className="page-item">
                    <a
                      className={`page-link prev me-1 ${activePage === 1 ? "disabled" : ""
                        }`}
                      onClick={() => onClickPreviousPage()}
                    >
                      <i className="bi bi-chevron-left pagination_icon_width"></i>
                    </a>
                  </li>
                  {Array.apply(
                    null,
                    Array(
                      Math.ceil(props.pageNumbers / 10) < 1
                        ? 1
                        : Math.ceil(props.pageNumbers / 10)
                    )
                  ).map((exp: any, number: number) => (
                    <li
                      className={
                        activePage === number + 1
                          ? "active page-item"
                          : "page-item"
                      }
                      key={number}
                    >
                      <a
                        className="page-link me-1"
                        onClick={() => onClickPage(number + 1)}
                      >
                        {number + 1}
                      </a>
                    </li>
                  ))}
                  <li className="page-item">
                    <a
                      className={`page-link next me-1 ${activePage === 1 ? "disabled" : ""
                        }`}
                      onClick={() => onClickNextPage()}
                    >
                      <i className="bi bi-chevron-right pagination_icon_width"></i>
                    </a>
                  </li>
                  <li className="page-item">
                    <a
                      className={`page-link next  me-1 ${activePage === Math.ceil(props.pageNumbers / 10)
                        ? "disabled"
                        : ""
                        }`}
                      onClick={() => onClickNextPage()}
                    >
                      <i className="bi bi-chevron-double-right pagination_icon_width"></i>
                    </a>
                  </li>

                  <li className="page-item ms-3">
                    {/* < div className="">
                  <form className="">
                    <label data-target="row-count"></label> */}
                    <select className="form-control" id="row-count">
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                    {/* </form>
                </div> */}
                  </li>
                </ul>
              </nav>
            )}
          </div>
        )}
        </div>
      </>
      <ul className="pagination pt-3 d-flex justify-content-center  d-lg-none pb-3">
        <li className="page-item">
          <a className={`page-link prev me-1 ${activePage === 1 ? 'disabled' : ''}`} onClick={() => onClickPreviousPage()}>
            <i className="bi bi-chevron-left pagination_icon_width"></i>
          </a>
        </li>
        <li className='ms-3 me-3 mt-2 fs_14'>
          {activePage}
        </li>

        <li className="page-item">
          <a className={`page-link next me-1 ${activePage === 1 ? 'disabled' : ''}`} onClick={() => onClickNextPage()}>
            <i className="bi bi-chevron-right pagination_icon_width"></i>
          </a>
        </li>
      </ul>
      {props?.tableData?.length === 0 && (
        <div className="text-center">
          {/* No records found. */}
          <NoData message=""></NoData>
        </div>
      )}

      <Modal
        show={canShowDeletePopup}
        onHide={() => handleDeleteClose()}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <div className="invite_team_heading">Delete</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="border rounded-3 p-3">
            <h5>
              Do you want to delete this{" "}
              {selectedData?.name ? selectedData?.name : ""} record?
            </h5>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-end">
            <button
              className="small_btn rounded fw-light cursor-pointer me-3"
              onClick={() => onDeleteConformation()}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn-secondary cursor-pointer"
              data-dismiss="modal"
              onClick={handleDeleteClose}
            >
              Close
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
