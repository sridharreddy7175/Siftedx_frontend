import React, { useEffect, useRef, useState } from "react";
import Stepper from "@mui/material/Stepper";
import StepButton from "@mui/material/StepButton";
import Step from "@mui/material/Step";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { JobsService } from "../../../../app/service/jobs.service";
import { AppLoader } from "../../../../components/loader";
import NoData from "../../../../components/no-data";
import Pageheader from "../../../../components/page-header";
import { SXUserSkill } from "../../../../app/model/skills/user-skill";
import { SXSkill } from "../../../../app/model/skills/sx-skill";
import { PreparedSkill } from "../../../../app/model/skills/prepared-skill";
import Tabs from "../../../../components/tabs";
import { Switch, Route, Redirect } from "react-router";
import {
  JobListContextMenuItem,
  JobListItem,
} from "../../../../components/job/job-list-item";
import { TablePagination } from "../../../../components/data-table/pagination";
import { JobDetails } from "../../../../components/recruiter/job-details";
import Skills from "../../../../components/recruiter/skills";
import { Candidates } from "../../../../components/recruiter/candidates";
import { Smes } from "../../../../components/recruiter/smes";
import { SmeService } from "../../../../app/service/sme.service";
import { LookUpService } from "../../../../app/service/lookup.service";
import { NavMenuTabs } from "../../../../components/menus/nav-menu-tabs";
import ReactTooltip from 'react-tooltip';
import { CandidatesService } from "../../../../app/service/candidates.service";
import INFO_ICON from "../../../../assets/icon_images/info icon.svg";
import Delete from "../../../../assets/icon_images/delete.png";




export const JobsdatasList = (props: any) => {
  const [loading, setLoading] = useState(false);
  let { id } = useParams<{ id: string; companyCode: string }>();
  const [showDraftData, setShowDraftData] = useState(false);
  const [showArchivedData, setShowArchivedData] = useState(false);
  const [showLinksDiv, setShowLinkDiv] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const loginUserId = sessionStorage.getItem("userUuid") || "";
  const [showMoveToDraft, setShowMoveToDraft] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>({});
  const [selectedType, setSelectedType] = useState<any>("");
  const [jobsList, setjobsList] = useState<any>([]);
  const [basicSkills, setBasicSkills] = useState<SXUserSkill[]>([]);
  const [sxSkills, setSxSkills] = useState<SXSkill[]>([]);
  const [expertSkills, setExpertSkills] = useState<SXUserSkill[]>([]);
  const [advancedSkills, setAdvancedSkills] = useState<SXUserSkill[]>([]);
  const [experienceList, setExperienceList] = useState<any[]>([]);
  const location = useLocation().pathname;
  const history = useHistory();
  const [selectedFilterType, setSelectedFilterType] = useState<any>("active");
  const companyId = sessionStorage.getItem("company_uuid") || "";
  const [search, setSearch] = useState("");
  let userData = sessionStorage.getItem("userRole");
  const locationPath = useLocation().pathname;
  // const [activePage, setActivePage] = useState(1);
  const [activeStep, setActiveStep] = React.useState("active");
  const [totalOpeningJobs, setTotalOpeningJobs] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(0);
  const [showInstructionsPopup, setShowInstructionsPopup] = useState(false);
  const steps = ["Job Details", "Skills", "Candidates", "SMEs"];
  const [activesteps, setActiveSteps] = React.useState(0);
  const [openArchive, setOpenArchive] = useState(false)
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const [isCheckedRow, setIsCheckedRow] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  // const [isAddForm, setIsAddForm] = useState<any>('');
  const [selectedjobId, setSelectedjobId] = useState<any>('');
  const [smeError, setSmeError] = useState<any>('');
  const [isCloneJob, setIsCloneJob] = useState(false);
  const [openPopup, setOpenPopUp] = useState<any>(false);
  const [showAvailabilityNotifications, setShowAvailabilityNotifications] =
    useState(false);
  const notificationref = useRef<any>(null);
  const [isapiloaded, setisapiloaded] = useState<any>(false);
  const [currentPage, setCurrentPage] = useState(1);


  const onSelectRow = (event: any, index: number) => {
    jobsList[index].checked = event.target.checked;
    setjobsList([...jobsList]);
    isChecked(jobsList);
  }

  const onSelectAll = (event: any) => {
    jobsList.map((data: any, index: number) => {
      data.checked = event.target.checked;
    })
    isChecked(jobsList);
    setjobsList([...jobsList])
  }
  const isChecked = (jobsListData: any) => {
    // const selectedData = jobsList.find((data: any) =>
    //   data.checked);

    const selectedData = jobsListData.find((data: any) => {
      return !data.checked
    })

    if (!selectedData) {
      setIsCheckedRow(true);
      setIsDisabled(true)
    } else {
      setIsCheckedRow(false);
      setIsDisabled(false)
    }
  };


  const onMultiDelete = () => {
    setLoading(true);
    jobsList.forEach((element: any) => {
      if (element.checked) {
        JobsService.deleteJob(element.uuid).then(
          res => {
            if (res?.error) {
              setLoading(false);
              toast.error(res?.error?.message);
            } else {
              getJobsData("archived", "");
              setLoading(false);
              toast.success('Deleted successfully');
              setOpenPopUp(false);

            }
          }
        );
      }
      else {
        setLoading(false);

      }

    });


  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };
  useEffect(() => {
    ReactTooltip.rebuild();
  }, [jobsList]);
  // const isLastStep = () => {
  //   return activeStep === totalSteps() - 1;
  // };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleStep = (step: number) => () => {
    //   setIsProfileFormEdit(true);
    //   setIsSkillFormEdit(true);
    //   setIsRateFormEdit(true);
    setActiveSteps(step);
  };

  const handleReset = () => {
    //   setActiveStep(0);
    setCompleted({});
  };



  const tabs = [
    {
      label: "Open Jobs",
      path: "active",
    },
    {
      label: "On Hold",
      path: "draft",
    },
    {
      label: "Closed Jobs",
      path: "close",
    },
    {
      label: "Archived",
      path: "archived",
    },
  ];
  const contextMenu: JobListContextMenuItem[] = [
    { label: "Edit", value: "edit" },
    { label: "Hold", value: "hold" },
    { label: "Clone", value: "clone" },
    { label: "Close", value: "close" },
  ];

  const contextMenu_Drafts: JobListContextMenuItem[] = [
    { label: "Reopen", value: "reopen" },
    { label: "Clone", value: "clone" },
    { label: "Close", value: "close" },
  ];

  const contextMenu_Close: JobListContextMenuItem[] = [
    { label: "Reopen", value: "reopen" },
    { label: "Clone", value: "clone" },
    { label: "Archive", value: "archived" },
  ];

  const contextMenu_company_admin: JobListContextMenuItem[] = [
    { label: "Edit", value: "edit" },
    { label: "Archieve", value: "archieve" },
    { label: "Clone", value: "clone" },
    { label: "Close", value: "close" },
  ];



  const buttonData = {
    name: "Create New Job",
    path:
      location === "/dashboard/jobs"
        ? `/dashboard/jobs/${companyId}/form/0`
        : `/dashboard/companies/info/${companyId}/jobsform/0`,
  };
  const optionsref = useRef<any>(null);

  const handleClickOutside = (event: any) => {
    if (optionsref.current && !optionsref.current.contains(event.target)) {
      setShowLinkDiv(false);
    }
  };
  useEffect(() => {
    sessionStorage.setItem("isFromJobForm", "");
    getJobsData("active", "");
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    const experience = [];
    for (let index = 1; index <= 30; index++) {
      experience.push(index);
      setExperienceList([...experience]);
    }
  }, []);

  useEffect(() => {
    getJobsData(activeStep, "");
  }, [activePage, rowsPerPage]);

  const onSelectTab = (type: string) => {

    if (type === "active") {
      setActiveStep(type);
      // getJobs()
      getJobsData("active", "");
      setOpenArchive(false)
      setIsCheckedRow(false);


    } else if (type === "draft") {
      setActiveStep(type);
      // getJobs()
      getJobsData("draft", "");
      setOpenArchive(false)
      setIsCheckedRow(false);


    } else if (type === "close") {
      setActiveStep(type);
      getJobsData("close", "");
      setOpenArchive(false)
      setIsCheckedRow(false);


    } else if (type === "archived") {
      setActiveStep(type);
      getJobsData("archived", "");
      setOpenArchive(true)
      setIsCheckedRow(false);

    }

  };

  const getJobsData = (activeStep: string, searchStr: string) => {
    setLoading(true);
    const startFrom = activePage * rowsPerPage;
    JobsService.getJobsByStatus(companyId, activeStep, searchStr, startFrom, rowsPerPage).then(
      (res) => {
        setisapiloaded(true)
        if (res.error) {
          toast.error(res?.error?.message);
          setLoading(false);
        } else {
          setjobsList(res.records);
          setTotalOpeningJobs(res.totalRows);
          setLoading(false);
        }
      }
    );
  };

  // const getJobs = () => {
  //   setLoading(true);
  //   const offset = activePage * rowsPerPage;
  //   JobsService.getJobsByUser(offset, rowsPerPage).then((res) => {
  //     if (res.error) {
  //       toast.error(res?.error?.message);
  //       setLoading(false);
  //     } else {
  //       setLoading(false);
  //       setTotalOpeningJobs(res.totalRows);
  //       setjobsList(res.records);
  //     }
  //   });
  // };

  const onClickOpne = (data: any) => {
    sessionStorage.setItem("selectedJob", data.uuid);
    history.push(
      `/dashboard/companies/info/${companyId}/jobs/info/${data?.uuid}/description`
    );
  };

  const handleMouseEnter = (e: any, index: number) => {
    setShowLinkDiv(true);
    setSelectedIndex(index);
  };

  const handleMouseLeave = (e: any) => {
    setShowLinkDiv(true);
  };

  const handleMouseEnterDivLink = (e: any, index: number) => {
    setShowLinkDiv(true);
  };

  const handleMouseLeaveDivLink = (e: any) => {
    setShowLinkDiv(false);
  };
  const onChangePagination = (page: number, count: number) => {
    setActivePage(page);
    setRowsPerPage(count);
  };

  const handleShowPopup = (data: any, type: string) => {
    setSelectedType(type);
    setShowMoveToDraft(true);
    setSelectedJob(data);
  };





  const onJobFav = (index: number, isFav: boolean) => {
    setLoading(true);
    const data = jobsList;
    jobsList[index].is_favourite = isFav;
    const selectedJob = { uuid: jobsList[index].uuid, status: isFav };
    JobsService.jobFavourite(selectedJob).then((res) => {
      if (res?.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        setLoading(false);
        getJobsData(activeStep, search);
      }
    });
  };

  const onSearchText = (event: any) => {
    if (event.key === "Enter") {
      getJobsData(activeStep, search);
    }
  };

  const onSearchTextEmpty = (event: any) => {
    setSearch(event.target.value);
    if (!event.target.value) {
      getJobsData(activeStep, event.target.value);
    }
  };

  const openJob = (): void => {
    setSelectedjobId('')
    // history.push(`/dashboard/companies/info/${companyId}/jobsform/0`)
    setShowInstructionsPopup(true);
    setActiveSteps(0)
    setSmeError('')

  };

  // const onClickNextPage = () => {
  //     props.pageNumber(activePage + 1);
  //     setActivePage(activePage);
  //   }

  //   const onClickPreviousPage = () => {
  //     props.pageNumber(activePage - 1);
  //     setActivePage(activePage);
  //   }

  //   const onClickPage = (number: number) => {
  //     props.pageNumber(number);
  //     setActivePage(number);
  //   }
  const onContextAction = (el: JobListContextMenuItem, data: any) => {
    switch (el.value) {
      case "edit":
        onEdit(data, "");
        break;
      case "hold":
        onChangeJobStatus(data, "draft");
        break;
      case "clone":
        onClone(data, "");
        break;
      case "close":
        onChangeJobStatus(data, "close");
        break;
      case "reopen":
        onChangeReopen(data, "active")
        break;
      case "archived":
        onChangeArchieve(data, "archived")
        break;
      default:
        break;
    }
  };

  const onEdit = (data: any, isType: string) => {
    setSelectedjobId(data.uuid)
    setShowInstructionsPopup(true);
    setActiveSteps(0)
    setSmeError('')
  };


  const onChangeArchieve = (data: any, isType: any) => {
    const datas = {
      uuid: data?.uuid,
      status: isType
    };
    JobsService.changeJobStatus(datas).then((res) => {
      getJobsData(activeStep, search);
    });
  }

  const onChangeJobStatus = (data: any, isType: any) => {
    const datas = {
      uuid: data?.uuid,
      status: isType
    };
    JobsService.changeJobStatus(datas).then((res) => {
      getJobsData(activeStep, search);
    });
  };

  const onChangeReopen = (data: any, isType: any) => {
    const datas = {
      uuid: data?.uuid,
      status: isType
    };
    JobsService.changeJobStatus(datas).then((res) => {
      getJobsData(activeStep, search);
    });
  };

  const onChangeArchivedReopen = (data: any, isType: any) => {
    const datas = {
      uuid: data?.uuid,
      status: isType
    };
    JobsService.changeJobStatus(datas).then((res) => {
      getJobsData(activeStep, search);
    });
  }



  const onClose = (data: any, isType: string) => { };

  const onClone = (data: any, isType: string) => {
    setIsCloneJob(true);
    setSelectedjobId(data.uuid)
    setShowInstructionsPopup(true);
    setActiveSteps(0)
    setSmeError('')
  };

  const onDeleteJob = () => {
    setLoading(true);
    JobsService.deleteJob(selectedJob?.uuid).then((res) => {
      if (res?.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        getJobsData(activeStep, search);
        setLoading(false);
        setShowMoveToDraft(false);
        toast.success("Deleted successfully");
      }
    });
  };



  useEffect(() => {
    // getSMESkills();
    getAllSkills();
  }, []);

  const getAllSkills = async () => {
    const result = await LookUpService.getAllSkills();
    setSxSkills(result);
  };

  const saveJobSkills = (data: PreparedSkill[]) => {
    setLoading(true);
    const jobSkills: any = {}
    const mandatorySkills: any = [];
    const experienceMandatory: any = [];
    const proficiencyMandatory: any = [];
    const optionalSkills: any = [];
    const experienceOptional: any = [];
    const proficiencyOptional: any = [];

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (element.proficiency === "Mandatory") {
        mandatorySkills.push(element.skill)
        experienceMandatory.push(element.experience)
        proficiencyMandatory.push(element.proficiency)
      }
      else if (element.proficiency === "Optional") {
        optionalSkills.push(element.skill)
        experienceOptional.push(element.experience)
        proficiencyOptional.push(element.proficiency)
      }
      jobSkills.job_mandatory_skills = mandatorySkills.toString();
      jobSkills.job_mandatory_skills_exp = experienceMandatory.toString();
      jobSkills.job_mandatory_skills_proficiency = proficiencyMandatory.toString();
      jobSkills.job_optional_skills = optionalSkills.toString();
      jobSkills.job_optional_skills_exp = experienceOptional.toString();
      jobSkills.job_optional_skills_proficiency = proficiencyOptional.toString();

    }
    JobsService.updateJob(selectedjobId, jobSkills)
      .then((res) => {
        if (res.error) {
          toast.error(res?.error?.message);
          setLoading(false);
        }
        else {
          toast.success("Saved successfully");
          setActiveSteps(2);
          setLoading(false);
        }
      })
  };

  const saveCandidate = (): void => {
    setActiveSteps(3);
  };

  const createCandidate = (candidate: any) => {
    setLoading(true)
   

  }

  const createJob = (jobsData: any): void => {
    setLoading(true);
    jobsData.company_uuid = companyId;
    if (selectedjobId && !isCloneJob) {
      JobsService.updateJob(jobsData.uuid, jobsData).then((res) => {
        if (res.error) {
          toast.error(res?.error?.message);
          setLoading(false);
        } else {
          toast.success("Saved Successfully");
          setActiveSteps(1);
          setLoading(false);

        }
      });

    }
    else {
      setIsCloneJob(false);
      setLoading(false);
      JobsService.addJobs(jobsData).then((res) => {
        if (res.error) {
          toast.error(res?.error?.message);
          setLoading(false);
        } else {
          setSelectedjobId(res.uuid)
          toast.success("Saved Successfully");
          setActiveSteps(1);
          setLoading(false);

        }
      });
    }
  };

  const submitSme = (data: any) => {

    setLoading(true)
    SmeService.scheduleInterviews(data).then((res) => {
      if (res.length < 1) {
        setSmeError('Sme time not available')
        setLoading(false)

      }
      else {
        if (res.error) {
          setLoading(false);
          toast.error(res?.error?.message);
        } else {
          toast.success("Successfully");
          setLoading(false);
          history.push(`/dashboard/companies/info/${companyId}/jobs/info/${selectedjobId}/interviews`)

        }
      }


    });
    setSmeError('')
  }

  const onCloseJobDetailPopup = () => {
    setShowInstructionsPopup(false);
    getJobsData(activeStep, '');
  }




  const openDeleteInstructions = () => {
    setOpenPopUp(true);
  };

  const onShowAvailabilityNotification = () => {
    setShowAvailabilityNotifications(true);
  };

  return (
    <div>
      {loading && <AppLoader loading={loading}></AppLoader>}
      <ReactTooltip place='bottom' type='light' effect='solid' border={true} borderColor={'#707070'} />

      {userData === "Recruiter" || userData === "CompanyAdmin" ? (
        <div>
          <div className="container-fluid">
            {/* <div className='nav_tabs'> */}

            <Pageheader
              title="Manage Jobs"
              subTitle="Create jobs, add candidates and manage the jobs till the screening is complete"

              buttonName="Create Job"
              editButtonClick={openJob}
            />

            <div className="row ps-3 pe-3 pe-lg-5">
              <div className="col-md-12">
                <div className="row">
                  <div
                    className="col-md-6 d-none d-lg-block "
                    // className="col-md-12"
                    style={{ fontSize: "14px" }}
                  >
                    <div className="ms-3 mt-2">
                      <ul className="nav">
                        {tabs.map((data: any, index: number) => {
                          return (
                            <li
                              key={index}
                              className={`nav-item tab ${data?.path === activeStep ? "active" : ""
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
                

                  <div
                    className="col-md-6 d-block d-lg-none"
                    style={{ fontSize: "14px" }}
                  >
                    <NavMenuTabs  activeUrl={activeStep} menuItems={tabs} activeTab={0} onChangeTab={(data:number | string) => onSelectTab(data as string)}></NavMenuTabs>
                  </div>
                </div>
              </div>
              <div className="col-md-12">

                {jobsList.length > 0 ? (
                  <div className="rounded-3  bg-white">
                    <div className="px-4 py-4 jobs_scrolling_mobile" >
                      <>
                        {openArchive === true && (
                          <>
                            <div className="row">
                              <div className="col-md-6 mb-2">
                                <input
                                  className="form-check-input me-2"
                                  type="checkbox"
                                  id="flexCheckDefault"
                                  checked={isCheckedRow}
                                  onChange={(e) => onSelectAll(e)}
                                />
                                <label
                                  className="form-check-label text-black"
                                  style={{ fontSize: "13px" }}
                                >
                                  Select All
                                </label>
                                {/* {isCheckedRow && (
                                  <img src={Delete} alt="Delete" className="pointer ms-3"
                                    onClick={() => onMultiDelete()}
                                  />
                                )} */}
                              </div>
                              <div className="col-md-6 mb-2 text-end">

                                <button
                                  className="large_btn_apply sx-text-secondary btn-outline-primary rounded me-2"
                                  disabled={isDisabled}
                                  onClick={openDeleteInstructions}

                                >
                                  Delete Permanently{" "}
                                </button>


                                <span
                                  className=" sx-text-primary pointer ps-1 position-relative"
                                  onClick={() => onShowAvailabilityNotification()}
                                  onMouseLeave={() => setShowAvailabilityNotifications(false)}
                                  onMouseEnter={onShowAvailabilityNotification}
                                >
                                  <img src={INFO_ICON} alt="info icon" className="" />
                                </span>

                                <div className="position-relative">
                                  {showAvailabilityNotifications && (
                                    <div
                                      onMouseEnter={onShowAvailabilityNotification}
                                      className="rounded-3 availability_modal  mt-2"
                                      ref={notificationref}
                                      onMouseLeave={() =>
                                        setShowAvailabilityNotifications(false)
                                      }
                                    >
                                      <div className="row">
                                        <div className="col-md-12 fs_14 mt-2 pt-2  px-lg-3 ">
                                          <p className="fs_14">
                                            This will delete the job permanently and can't be
                                            recovered
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <Modal
                              show={openPopup}
                              onHide={() => setOpenPopUp(false)}
                              size="lg"
                              aria-labelledby="contained-modal-title-vcenter"
                              className="sx-close w-100"
                              centered
                            >
                              <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <div className="">
                                  <p className="fs_14 text-center">
                                    This will delete the job permanently and can't be recovered
                                  </p>
                                  <div className="row my-3">
                                    <div className="col-md-6 col-6 text-start ">
                                      <button className="large_btn_filter px-2 ms-3" onClick={() => setOpenPopUp(false)}>Cancel</button>
                                    </div>
                                    <div className="col-md-6 col-6 text-end">
                                      <button className="large_btn_apply me-3" onClick={() => onMultiDelete()}>Yes Delete</button>
                                    </div>
                                  </div>
                                </div>
                              </Modal.Body>
                            </Modal>
                          </>
                        )}
                      </>
                      {jobsList.map((data: any, index: number) => (
                        <JobListItem
                          onOpenJob={() => onClickOpne(data)}
                          actions={
                            (data.user_uuid == loginUserId || userData === "CompanyAdmin" || userData === "Recruiter") &&
                              activeStep === "active"
                              ? contextMenu
                              : activeStep === "draft"
                                ? contextMenu_Drafts
                                : activeStep === "close"
                                  ? contextMenu_Close
                                  : []
                          }
                          data={data}
                          onAction={(action) => {
                            onContextAction(action, data);
                          }}
                          onSelectRow={(e: any) => onSelectRow(e, index)}
                          openArchive={openArchive}
                          onChangeReopen={() => onChangeArchivedReopen(data, "active")}
                        ></JobListItem>
                      ))}
                    </div>
                    <TablePagination
                      rowsPerPage={rowsPerPage}
                      totalRows={totalOpeningJobs}
                      activePage={activePage}
                      onChangePage={onChangePagination}
                      currentPage={currentPage}
                    ></TablePagination>
                  </div>
                ) : (
                  <div className="rounded-3  bg-white ">
                    {
                      isapiloaded&&
                      <div className="py-4 px-4 ms-2">
                      <p className="top_para_styles m-0">
                        Currently there are no open jobs. Click create job to
                        create new jobs
                      </p>
                    </div>
                    }
                    
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`${location === "/dashboard/jobs" ? "job_description_padding" : ""
            }`}
        >
          <div className="row">
            <div className="col-xl-3 col-12 job_col_xl_4_width">
              <div className="my-auto">
                <h5 className="top_heading_styles mb-0">
                  Job Description and Details
                </h5>
                <p className="top_para_styles">
                  Here's where you can add and edit the general information for
                  this job
                </p>
              </div>
            </div>
            <div className="col-12 col-xl-9 mb-3">
              <div className="d-flex justify-content-end">
                <div
                  className="input-group candidate_search_bar_border w-25"
                  style={{ height: "34px" }}
                >
                  <input
                    type="text"
                    className="form-control form_control_border"
                    placeholder="Search"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    onKeyPress={(e) => onSearchText(e)}
                    onInput={(e) => onSearchTextEmpty(e)}
                  />
                  <span
                    className="input-group-text input_group_text"
                    id="basic-addon1"
                  >
                    <i
                      className="fa fa-search pointer"
                      aria-hidden="true"
                      onClick={() => getJobsData(activeStep, search)}
                    ></i>
                  </span>
                </div>
                <div>

                  {jobsList.length > 0 && (
                    <>
                      {location === "/dashboard/jobs" ? (
                        <Link
                          to={`/dashboard/jobs/${companyId}/form/0`}
                          className="large_btn rounded-3  create_new_job_btn text-black"
                        >
                          Create New Job
                        </Link>
                      ) : (
                        <Link
                          to={`/dashboard/companies/info/${companyId}/jobsform/0`}
                          className="large_btn rounded-3"
                        >
                          Create New Job
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {jobsList.length > 0 ? (
            <div className="row">
              <div className="col-md-8 col-12">
                {jobsList.map((data: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="border_color rounded-3 mb-4 job_details_main_div"
                    >
                      <div
                        className="bg-white d-flex justify-content-between px-3 py-3 rounded-top"
                        style={{ borderBottom: "1px solid #BBBBBB" }}
                      >
                        <ul className="list-inline my-auto">
                          <li className="dashboard_happy_monday_fourth_line">
                            {data?.job_title}
                          </li>
                          <li className="dashboard_happy_monday_fifth_line">
                            {data?.location}. {data?.category_code}
                          </li>
                        </ul>
                        <ul className="d-flex list-inline my-auto">
                          <li className="start me-md-0 me-2">
                            {!data?.is_favourite && (
                              <svg
                                className="pointer"
                                onClick={() => onJobFav(index, true)}
                                width="16"
                                height="15"
                                viewBox="0 0 16 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.99958 12.0232L3.05515 15L4.39935 9.44444L0 5.72968L5.77467 5.27363L7.99958 0L10.2245 5.27363L16 5.72968L11.5998 9.44444L12.944 15L7.99958 12.0232Z"
                                  fill="#A9A9A9"
                                />
                              </svg>
                            )}
                            {data?.is_favourite && (
                              <svg
                                className="pointer"
                                onClick={() => onJobFav(index, false)}
                                width="16"
                                height="15"
                                viewBox="0 0 16 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.99958 12.0232L3.05515 15L4.39935 9.44444L0 5.72968L5.77467 5.27363L7.99958 0L10.2245 5.27363L16 5.72968L11.5998 9.44444L12.944 15L7.99958 12.0232Z"
                                  fill="#FFA800"
                                />
                              </svg>
                            )}
                          </li>
                          <li className="mx-2 d-md-block">
                            <button
                              onClick={() => onClickOpne(data)}
                              className="small_btn rounded"
                            >
                              Open
                            </button>
                          </li>
                          <li
                            onMouseEnter={(e) => handleMouseEnter(e, index)}
                            onMouseLeave={(e) => handleMouseLeave(e)}
                          >
                            <button className="small_btn rounded">
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
                          </li>
                        </ul>
                      </div>
                      <div className="bg_white d-flex justify-content-between px-3 py-3 rounded-bottom ">
                        <h6 className="dashboard_happy_monday_candidates_text">
                          <span className="cadidates_no">
                            {data?.total_candidates}
                          </span>{" "}
                          Candidates
                        </h6>
                        <div>
                          <ul className="d-flex list-inline">
                            <OverlayTrigger
                              overlay={
                                <Tooltip id="tooltip-disabled">
                                  Not Scheduled
                                </Tooltip>
                              }
                            >
                              <span className="d-inline-block">
                                <li className="mx-md-3 mx-1 dashboard_happy_monday_number">
                                  <span className="me-1">
                                    <svg
                                      width="18"
                                      height="18"
                                      viewBox="0 0 18 18"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M16 0H1.99C0.88 0 0.00999999 0.9 0.00999999 2L0 16C0 17.1 0.88 18 1.99 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM16 12H12C12 13.66 10.65 15 9 15C7.35 15 6 13.66 6 12H1.99V2H16V12ZM13 7H11V4H7V7H5L9 11L13 7Z"
                                        fill="#757575"
                                      />
                                    </svg>
                                  </span>{" "}
                                  {data?.total_candidates_pending}
                                </li>
                              </span>
                            </OverlayTrigger>
                            <OverlayTrigger
                              overlay={
                                <Tooltip id="tooltip-disabled">
                                  Scheduled
                                </Tooltip>
                              }
                            >
                              <span className="d-inline-block">
                                <li className="mx-md-3 mx-1 dashboard_happy_monday_number">
                                  <span className="me-1">
                                    <svg
                                      width="18"
                                      height="20"
                                      viewBox="0 0 18 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M16 2H15V0H13V2H5V0H3V2H2C0.89 2 0 2.9 0 4V18C0 19.1 0.89 20 2 20H16C17.1 20 18 19.1 18 18V4C18 2.9 17.1 2 16 2ZM9 5C10.66 5 12 6.34 12 8C12 9.66 10.66 11 9 11C7.34 11 6 9.66 6 8C6 6.34 7.34 5 9 5ZM15 17H3V16C3 14 7 12.9 9 12.9C11 12.9 15 14 15 16V17Z"
                                        fill="#757575"
                                      />
                                    </svg>
                                  </span>{" "}
                                  {data?.total_candidates_scheduled}
                                </li>
                              </span>
                            </OverlayTrigger>
                            <OverlayTrigger
                              overlay={
                                <Tooltip id="tooltip-disabled">
                                  To be re-scheduled
                                </Tooltip>
                              }
                            >
                              <span className="d-inline-block">
                                <li
                                  title="To be re-scheduled"
                                  className="mx-md-3 mx-1 dashboard_happy_monday_number"
                                >
                                  <span className="me-1">
                                    <svg
                                      width="20"
                                      height="20"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
                                        fill="#757575"
                                      />
                                    </svg>
                                  </span>{" "}
                                  {data?.total_candidates_rescheduled}
                                </li>
                              </span>
                            </OverlayTrigger>
                            <OverlayTrigger
                              overlay={
                                <Tooltip id="tooltip-disabled">
                                  Screened
                                </Tooltip>
                              }
                            >
                              <span className="d-inline-block">
                                <li
                                  title="Screened"
                                  className="mx-md-3 mx-1 dashboard_happy_monday_number"
                                >
                                  <span className="me-1">
                                    <svg
                                      width="15"
                                      height="17"
                                      viewBox="0 0 15 17"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M9.4 2L9 0H0V17H2V10H7.6L8 12H15V2H9.4Z"
                                        fill="#757575"
                                      />
                                    </svg>
                                  </span>{" "}
                                  {data?.total_candidates_completed}
                                </li>
                              </span>
                            </OverlayTrigger>
                          </ul>
                        </div>
                      </div>
                      {showLinksDiv && selectedIndex === index && (
                        <div
                          className="three_douts_link_div"
                          ref={optionsref}
                          onMouseEnter={(e) =>
                            handleMouseEnterDivLink(e, index)
                          }
                          onMouseLeave={(e) => handleMouseLeaveDivLink(e)}
                        >
                          <ul className="list-inline mb-0">
                            <li
                              className="move_to_draft mb-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => onEdit(data, "edit")}
                            >
                              Edit
                            </li>
                            {/* {selectedFilterType !== 'draft' && <li className='move_to_draft mb-2' style={{ cursor: 'pointer' }} onClick={() => handleShowPopup(data, 'draft')}>Move to Draft</li>}
                                                        {selectedFilterType !== 'archived' && <li className='move_to_draft mb-2' style={{ cursor: 'pointer' }} onClick={() => handleShowPopup(data, 'archived')}>Move to Archives</li>} */}
                            <li
                              className="move_to_draft"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleShowPopup(data, "delete")}
                            >
                              Delete Permanently
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="col-4"></div>
            </div>
          ) : (
            "No data found"
          )}
        </div>
      )}

      <Modal
        show={showMoveToDraft}
        onHide={() => setShowMoveToDraft(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {selectedType === "draft" && (
              <div>
                <div className="invite_team_heading">
                  The following job will be moved to draft
                </div>
              </div>
            )}
            {selectedType === "archived" && (
              <div>
                <div className="invite_team_heading">
                  The following job will be moved to archived
                </div>
              </div>
            )}
            {selectedType === "delete" && (
              <div>
                <div className="invite_team_heading">
                  The following job will be deleted from job list
                </div>
              </div>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="border rounded-3">
            <div className="border-bottom py-3 ps-3">
              <ul className="list-inline d-flex my-auto">
                <li className="my-auto">
                  <ul className="list-inline">
                    <li className="text-black" style={{ fontSize: "16px" }}>
                      {selectedJob?.job_title}
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-end py-3 pe-2">
            {/* <button className='large_btn rounded me-3' onClick={() => setShowMoveToDraft(false)}>Cancel</button> */}
            {selectedType === "draft" && (
              <button
                className="large_btn_apply rounded me-3"
              // onClick={() => onChangeJobStatus()}
              >
                Move to Draft
              </button>
            )}
            {selectedType === "archived" && (
              <button
                className="large_btn_apply rounded me-3"
              // onClick={() => onChangeJobStatus()}
              >
                Move to Archives
              </button>
            )}
            {selectedType === "delete" && (
              <button
                className="large_btn_apply rounded me-3"
                onClick={() => onDeleteJob()}
              >
                Delete
              </button>
            )}
            <button
              className="large_btn_filter  rounded"
              style={{ paddingLeft: "10px" }}
              onClick={() => setShowMoveToDraft(false)}
            >
              Cancel
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showInstructionsPopup}
        onHide={() => onCloseJobDetailPopup()}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="content-size-xl sx-close"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div
            className="my-2 px-lg-5 pb-3 px-3"
            style={{ height: "80vh", overflow: "hidden", position: "relative" }}
          >
            <Stepper
              nonLinear
              alternativeLabel
              activeStep={activesteps}
              className={`w-50 w-sm-100 m-auto mt-3`}
            >
              {steps.map((label, index) => (
                <Step key={label} completed={completed[index]}>
                  <StepButton color="inherit" onClick={handleStep(index)}>
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>

            <>
              <div
                className="mb-3 mt-5 mt-lg-0 pe-2"
                style={{ height: "calc(100% - 140px)", overflow: "auto" }}
              >
                {activesteps === 0 && <JobDetails onSave={createJob} jobId={selectedjobId} />}
                {activesteps === 1 && (
                  <Skills
                    onClose={() => setActiveSteps(0)}
                    basicSkills={basicSkills}
                    advancedSkills={advancedSkills}
                    expertSkills={expertSkills}
                    onSave={saveJobSkills}
                    experienceList={experienceList}
                    allSkills={sxSkills}
                    jobId={selectedjobId}
                  />
                )}
                {activesteps === 2 && (
                  <Candidates
                    onClose={() => setActiveSteps(1)}
                    saveCandidate={() => setActiveSteps(3)}
                    jobId={selectedjobId}
                    isbutton={false}
                  />
                )}
                {activesteps === 3 && <Smes jobId={selectedjobId} onClose={() => setActiveSteps(2)}
                  // onSave={submitSme}
                  isbutton={false}
                  // smeError={smeError}
                />}
              </div>
            </>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
