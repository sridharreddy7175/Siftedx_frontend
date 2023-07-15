import moment from "moment";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import {
  Modal,
  OverlayTrigger,
  Toast,
  ToastContainer,
  Tooltip,
} from "react-bootstrap";
import { SX_ROLES } from "../../../app/utility/app-codes";
import { JobsService } from "../../../app/service/jobs.service";
import { NavLink, useHistory } from "react-router-dom";
import { SmeService } from "../../../app/service/sme.service";
import { toast } from "react-toastify";
import grayEllipseImg from "../../../assets/images/gray_ellipse.png";
import { AppLoader } from "../../../components/loader";
import { UsersService } from "../../../app/service/users.service";
import { RolesService } from "../../../app/service/roles.service";
import FormBuilder from "../../../components/form-builder";
import ChipInput from "../../../components/chip-input";
import Vector from "../../../assets/images/Vector.png";
import Clock from "../../../assets/images/clock.jpg";
import InterviewOpportunities from "../../../assets/icon_images/Interview Opportunities.svg";
import UpcomingInterviews from "../../../assets/icon_images/Upcoming interviews.svg";
import { connect, useDispatch } from "react-redux";
import { UserData } from "../../../redux/actions";
import RecruiterDashBoard from "../recruiter-dashboard";
import {
  JobListItem,
  JobListContextMenuItem,
} from "../../../components/job/job-list-item";
import { JobDetails } from "../../../components/recruiter/job-details";
import Skills from "../../../components/recruiter/skills";
import { Candidates } from "../../../components/recruiter/candidates";
import { Smes } from "../../../components/recruiter/smes";
import ReactTooltip from "react-tooltip";
import { TablePagination } from "../../../components/data-table/pagination";
import Stepper from "@mui/material/Stepper";
import StepButton from "@mui/material/StepButton";
import Step from "@mui/material/Step";
// import { SXUserSkill } from "../../../../app/model/skills/user-skill";
// import { SXSkill } from "../../../../app/model/skills/sx-skill";
// import { PreparedSkill } from "../../../../app/model/skills/prepared-skill";
import { SXUserSkill } from '../../../app/model/skills/user-skill';
import { SXSkill } from '../../../app/model/skills/sx-skill';
import { PreparedSkill } from '../../../app/model/skills/prepared-skill';
import { LookUpService } from "../../../app/service/lookup.service";




interface Props {
  UserDataReducer: any;
  location?: any;
  userData?: (data: any) => void;
}

const DashBoardPage = (props: Props) => {
  const role = sessionStorage.getItem("userRole");
  const companyId = sessionStorage.getItem("company_uuid") || "";
  const [jobsList, setjobsList] = useState<any>([]);
  const [upCommingInterviews, setUpCommingInterviews] = useState<any>([]);
  const history = useHistory();
  const [showAcceptPopup, setShowAcceptPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSmeAvailability, setShowSmeAvailability] = useState(false);
  const [loading, setLoading] = useState(false);
  const userdData = sessionStorage.getItem("loginData") || "";
  const [loginUserdata, setLoginUserdata] = useState(
    userdData ? JSON.parse(userdData) : {}
  );
  const [showAdminAddMember, setShowAdminAddMember] = useState(false);
  const [roles, setRoles] = useState<any[] | []>([]);
  const [emails, setEmails] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState<any>({});
  const [showA, setShowA] = useState(false);
  const toggleShowA = () => setShowA(!showA);
  const [modalShow, setModalShow] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");
  const [roleError, setRoleError] = React.useState("");
  const userId = sessionStorage.getItem("userUuid") || "";
  const [selectedJob, setSelectedJob] = React.useState<any>({});
  const [showLinksDiv, setShowLinkDiv] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dateInterviews, setDateInterviews] = useState<any>([]);
  const [showMoveToDraft, setShowMoveToDraft] = useState(false);
  const companyUuid = sessionStorage.getItem("company_uuid") || "";
  const dispatch = useDispatch();
  const [smeData, setSmeData] = React.useState<any>({});
  const [activeStep, setActiveStep] = React.useState("active");
  const [totalOpeningJobs, setTotalOpeningJobs] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(0);
  const [search, setSearch] = useState("");
  const loginUserId = sessionStorage.getItem("userUuid") || "";
  const [showInstructionsPopup, setShowInstructionsPopup] = useState(false);
  const [fromDate, setFromDate] = useState<any>("");
  const [toDate, setToDate] = useState<any>("");
  const [interviews, setInterviews] = useState<any>([]);
  const [activesteps, setActiveSteps] = React.useState(0);
  const steps = ["Job Details", "Skills", "Candidates", "SMEs"];
  const [selectedjobId, setSelectedjobId] = useState<any>('');
  const [basicSkills, setBasicSkills] = useState<SXUserSkill[]>([]);
  const [sxSkills, setSxSkills] = useState<SXSkill[]>([]);
  const [expertSkills, setExpertSkills] = useState<SXUserSkill[]>([]);
  const [advancedSkills, setAdvancedSkills] = useState<SXUserSkill[]>([]);
  const [experienceList, setExperienceList] = useState<any[]>([]);
  const [isCloneJob, setIsCloneJob] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const company = sessionStorage.getItem('company_uuid') || '';
  const [companyUpcomingInterview,setCompanyUpcomingInterview]=useState<any>('')
  const [isapiloaded, setisapiloaded] = useState<any>(false);




  const tabs = [
    {
      label: "Open Interviews",
      path: 0,
    },
    {
      label: "Upcoming Interviews",
      path: 1,
    },
  ];

  useEffect(() => {
    getInterviews(1, "");
  }, []);

  useEffect(() => {
    const experience = [];
    for (let index = 1; index <= 30; index++) {
      experience.push(index);
      setExperienceList([...experience]);
    }
  }, []);

  useEffect(() => {
    getAllSkills();
  }, []);

  const getAllSkills = async () => {
    const result = await LookUpService.getAllSkills();
    setSxSkills(result);
  };

  const getInterviews = (activePage: any, search: string) => {
    setLoading(true);
    const data = {
      search: search,
      start: activePage * 10 - 10,
      count: 10,
      from_date: fromDate,
      to_date: toDate,
    };
    JobsService.smeInterviewOpportunities(userId, data).then((res) => {
      if (res.error) {
        toast.error(res?.error?.message);
        setLoading(false);
      } else {
        setLoading(false);

        // Prepare candidate full name from candidate firstname and lastname
        const filteredInterviews = res.records.map((el: any) => {
          const fullName = `${el.candidate_firstname} ${el.candidate_lastname}`;
          el.candidate_fullname = fullName;
          el.skills = el?.job_mandatory_skills?.split(",");
          return el;
        });
        setInterviews([...filteredInterviews]);
      }
    });
  };




  useEffect(() => {
    setLoading(true);
    if (role === SX_ROLES.SME) {
      getSmeAccessToOverView();
      getSmeJobs();
      SmeService.getSmeProfileById(userId).then((res) => {
        if (res.error) {
          toast.error(res?.error?.message);
          setLoading(false);
        } else {
          setLoading(false);
          setSmeData({ ...res });
          // if (props.userData) {
          //   dispatch(props.userData(res));
          // }
        }
      });
    } else if (role === SX_ROLES.CompanyAdmin || role === SX_ROLES.Recruiter) {
      // getJobsByStatus();
      getJobsData(activeStep, search);
      getAccessToOverview();
      getRoles();
    }
  }, []);

  const contextMenu_company_admin: JobListContextMenuItem[] = [
    { label: "Edit", value: "edit" },
    { label: "Hold", value: "hold" },
    { label: "Clone", value: "clone" },
    { label: "Close", value: "close" },
  ];

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
        onClose(data, "close");
        break;
      default:
        break;
    }
  };

  const onChangeJobStatus = (data: any, isType: any) => {
    const datas = {
      uuid: data?.uuid,
      status: isType,
    };
    JobsService.changeJobStatus(datas).then((res) => {
      getJobsData(activeStep, search);
    });
  };

  const onClose = (data: any, isType: string) => {
    const datas = {
      uuid: data?.uuid,
      status: isType,
    };
    JobsService.changeJobStatus(datas).then((res) => {
      getJobsData(activeStep, search);
    });
  };

  const onClone = (data: any, isType: string) => {
    setSelectedjobId(data.uuid)
    setShowInstructionsPopup(true);
    setActiveSteps(0)
    setIsCloneJob(true);

  };

  useEffect(() => {
    // if (role === SX_ROLES.Recruiter) {
    //   // getJobsByStatus();
    //   getJobsData(activeStep, search)
    // }
    if (role === SX_ROLES.Recruiter || role === SX_ROLES.CompanyAdmin) {
      getJobsData(activeStep, "");
    }
  }, [activePage, rowsPerPage]);

  const onSelectTab = (type: number) => {
    setActivePage(type);
    if (type === 0) {
      getInterviews(1, "");
    } else if (type === 1) {
      getSmeJobs();
    }
  };

  const getAccessToOverview = () => {
    UsersService.getCompanyStrenth(companyId).then((res) => {
      if (res?.count <= 1) {
        setShowAdminAddMember(true);
        // setShowAdminAddMember(false);
      } else {
        setShowAdminAddMember(false);
        // setShowAdminAddMember(true);
      }
    });
  };


  const getJobsData = (activeStep: string, searchStr: string) => {
    setLoading(true);
    const startFrom = activePage * rowsPerPage;
    JobsService.getJobsByStatus(
      companyId,
      activeStep,
      searchStr,
      startFrom,
      rowsPerPage
    ).then((res) => {
      setisapiloaded(true);
      if (res.error) {
        toast.error(res?.error?.message);
        setLoading(false);
      } else {
        setjobsList(res.records);
        setTotalOpeningJobs(res.totalRows);
        setLoading(false);
        setUpCommingInterviews(res?.records);
        // getDateAllInterviews(moment(), res?.records);
      }
    });
  };

  const getSmeJobs = () => {
    setLoading(true);
    JobsService.smeInterviewOpportunitiesForDahsboard(
      userId,
      moment().add(1, "days").format("YYYY-MM-DD")
    ).then((res) => {
      if (res.error) {
        toast.error(res?.error?.message);
        setLoading(false);
      } else {
        setLoading(false);
        res.records.forEach((element: any) => {
          element.skills = element?.job_mandatory_skills?.split(",");
        });
        setjobsList(res?.records);
      }
    });
    SmeService.getUpcomingInterviewsDahsboard().then((res) => {
      if (res.error) {
        toast.error(res?.error?.message);
        setLoading(false);
      } else {
        setLoading(false);
        res?.records?.forEach((element: any) => {
          element.skills = element?.job_mandatory_skills?.split(",");
        });
        setUpCommingInterviews(res?.records);
        getDateInterviews(moment(), res?.records);
      }
    });
  };
  const getDateInterviews = (date: any, interviews: any) => {
    const data = interviews.filter(
      (interview: any) =>
        moment(interview?.interview_schedule).format("YYYY-MM-DD") ===
        moment(date).format("YYYY-MM-DD")
    );
    setDateInterviews([...data]);
  };

  useEffect(()=>{
    getInterviewsDate(1, '', '', '', '')
  }, []);

  const getInterviewsDate =(activePage: any, search: string, fromDate: string, toDate: string, date: any) => {
    // setLoading(true);
    const data = {
      status: 'interview_scheduled',
      search: search,
      start: '',
      count: '',
      category: '',
      skill: '',
      from_date: fromDate,
      to_date: toDate
    }
    SmeService.getCommingInterviews(company, data).then(res => {
      // setLoading(false);
      if (res.error) {
        toast.error(res?.error?.message);
        // setLoading(false);
      } else {
        // setLoading(false);
        const result = res.records.filter((interview: any) => {
          return (
            moment(interview?.interview_schedule).format("YYYY-MM-DD") ===
            moment(date).format("YYYY-MM-DD")
          )
        })

        setDateInterviews([...result]);
        setCompanyUpcomingInterview(res.totalRows)

      }
    })
  }

  const getSmeAccessToOverView = () => {
    setLoading(true);
    SmeService.getAvailability().then((res) => {
      if (res.error) {
        toast.error(res?.error?.message);
        setLoading(false);
      } else {
        setLoading(false);
        if (res.length > 0) {
          setShowSmeAvailability(false);
        } else {
          setShowSmeAvailability(true);
        }
      }
    });
  };

  const onClickOpne = (data: any) => {
    sessionStorage.setItem("selectedJob", data.uuid);
    history.push(
      `/dashboard/companies/info/${companyId}/jobs/info/${data?.uuid}/description`
    );
  };
  const handleAcceptPopup = (data: any) => {
    setSelectedJob(data);
    setShowAcceptPopup(true);
    getInterviews(1, "");
  };
  const handleCancelPopup = (data: any) => {
    setSelectedJob(data);
    setShowCancelPopup(true);
    getInterviews(1, "");
  };

  const getRoles = () => {
    RolesService.getRoles().then((res) => {
      // const roles = res.records?.filter((role: any) => role.code !== 'Candidate' && role.code !== 'SME' && role.code !== 'ASSIGN_CANDIDATE');
      setRoles([...res]);
    });
  };

  const onAddTeamMember = () => {
    setLoading(true);
    const invitationData = {
      user_emails: emails,
      company_uuid: companyId,
      role: selectedRoles?.uuid,
    };
    if (emails.length > 0 && selectedRoles?.uuid) {
      UsersService.invitation(invitationData).then((res) => {
        if (res?.error) {
          setLoading(false);
          toast.error(res?.error?.message);
        } else {
          setLoading(false);
          toggleShowA();
          setModalShow(false);
        }
      });
    } else {
      setLoading(false);
      if (!(emails.length > 0)) {
        setEmailError("Please enter email id`s");
      }
      if (!selectedRoles?.uuid) {
        setRoleError("Please select role");
      }
    }
  };
  const onSelectRole = (event: any) => {
    setRoleError("");
    const selectedRole = roles.find(
      (data: any, index: number) => data.uuid === event.target.value
    );
    if (selectedRole) {
      setSelectedRoles(selectedRole);
    }
  };
  const handleInput = () => { };

  const onChipData = (data: any) => {
    setEmailError("");
    setEmails(data);
  };

  const handlePage = () => {
    history.push(`/dashboard/jobs/${companyUuid}/form/0`);
  };

  const showAddMember = () => {
    toggleShowA();
    setModalShow(true);
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
        // getSmeJobs();
        getInterviews(1, "");
        toast.success("Rejected successfully");
      }
    });
  };

  const onCloseJobDetailPopup = () => {
    setShowInstructionsPopup(false);
    getJobsData(activeStep, '');
  }

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

  const onAcceptJob = () => {
    setLoading(true);
    JobsService.smeAcceptInterview(selectedJob?.uuid).then((res) => {
      if (res?.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        setShowAcceptPopup(false);
        setLoading(false);
        // getSmeJobs();
        getInterviews(1, "");
        toast.success("Accepted successfully");
      }
    });
  };

  const onSelectInterview = (data: any) => {
    sessionStorage.setItem("selectedInterviewCompany", data?.company_uuid);
    history.push(
      `/dashboard/interviewview/description/${data?.job_uuid}/${data?.uuid}`
    );
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
      }
    });
    setjobsList([...data]);
  };

  const handleMouseEnterDivLink = (e: any, index: number) => {
    setShowLinkDiv(true);
  };
  const handleMouseLeaveDivLink = (e: any) => {
    setShowLinkDiv(false);
  };
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

  const onEdit = (data: any, isType: string) => {
    setSelectedjobId(data.uuid)
    setShowInstructionsPopup(true);
    setActiveSteps(0)
  };

  const handleMouseEnter = (e: any, index: number) => {
    setShowLinkDiv(true);
    setSelectedIndex(index);
  };
  const handleMouseLeave = (e: any) => {
    // setShowLinkDiv(true);
    setShowLinkDiv(false);
  };

  const handleShowPopup = (data: any, type: string) => {
    setShowMoveToDraft(true);
    setSelectedJob(data);
  };

  const onDeleteJob = () => {
    setLoading(true);
    JobsService.deleteJob(selectedJob?.uuid).then((res) => {
      if (res?.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        // getJobsByStatus();
        getJobsData(activeStep, search);
        setLoading(false);
        setShowMoveToDraft(false);
        toast.success("Deleted successfully");
      }
    });
  };

  const handleStep = (step: number) => () => {
    setActiveSteps(step);
  };

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [jobsList]);

  const onChangePagination = (page: number, count: number) => {
    setActivePage(page);
    setRowsPerPage(count);
  };

  const calenderView = () => {
    history.push(`/dashboard/interviews/calendar-view`);
  };
  return (
    <>
      <ReactTooltip
        place="bottom"
        type="light"
        effect="solid"
        border={true}
        borderColor={"#707070"}
      />
      <div className="dashboard_happy_monday mt-5">
        {loading && <AppLoader loading={loading}></AppLoader>}
        <div className="container-fluid">
          {!showSmeAvailability && !showAdminAddMember && (
            <div className="row">
              <div
                className={`${role === SX_ROLES.SME
                  ? "col-md-12 col-12"
                  : "col-md-12 col-12"
                  }`}
              >
                <div className="row px-4">
                  <div
                    className={`${role === SX_ROLES.SME
                      ? "col-lg-12 col-md-12 col-12 "
                      : "col-md-12"
                      } mx-auto`}
                  >
                    {role !== SX_ROLES.CompanyAdmin &&
                      role !== SX_ROLES.Recruiter &&
                      role !== SX_ROLES.SuperAdmin && (
                        <div className="row">
                          <div className="col-12 col-lg-8 ">
                            <div className="row bg-white rounded-3 me-0 me-lg-3 p-4">
                              <div className="col-lg-6  col-12">
                                <div>
                                  <h5 className="top_heading_styles">
                                    Happy {moment().format("dddd")},{" "}
                                    {loginUserdata?.user_firstname}{" "}
                                    {loginUserdata?.user_lastname}
                                    {/* {role === SX_ROLES.SME && <button className="small_btn rounded-3 py-1 pull-right" onClick={() => calenderView()}>Calender View</button>} */}
                                  </h5>
                                  <p className="top_para_styles">
                                    Welcome to your dashboard{" "}
                                  </p>
                                  <p className="top_para_styles">
                                    Thanks for being a part of our journey and
                                    earn
                                    <br />
                                    up to ${smeData?.sme_fee} per interview
                                    along the way.
                                  </p>
                                </div>
                              </div>
                              <div className="col-12 col-lg-6">
                                <div className="row h-100">
                                  <div className="col-6">
                                    {/* <div className=""> */}
                                    <div className="rounded-3 py-3 px-2 bg-interview h-100 me-lg-3 me-1">
                                      {/* <h6 className="text-white p-0 m-0 lh-1"> */}
                                      <div className="d-flex align-items-center justify-content-between px-2 text-white">
                                        <h2 className="text-heading-2">
                                          {interviews.length> 0  ? interviews.length: 0}
                                        </h2>
                                        <img
                                          src={InterviewOpportunities}
                                          alt="Interview Requests"
                                          className=""
                                        />
                                      </div>
                                      <div className="mt-3 text-white">
                                        Interview Requests
                                      </div>
                                      {/* </h6> */}
                                    </div>
                                    {/* </div> */}
                                  </div>
                                  <div className="col-6">
                                    <div className="rounded-3 py-3 px-2 bg-upcoming-interview h-100 ms-lg-3 ms-1">
                                      {/* <h6 className="text-white p-0 m-0 lh-1"> */}
                                      <div className="d-flex align-items-center justify-content-between text-white px-3">
                                        <h2 className="text-heading-2">
                                          {upCommingInterviews.length > 0
                                            ? upCommingInterviews.length
                                            : 0}
                                        </h2>
                                        <img
                                          src={UpcomingInterviews}
                                          alt="Upcoming Interviews"
                                          className=""
                                        />
                                        {/* <i className="bi bi-calendar3 dashboard_box_ionc"></i> */}
                                      </div>
                                      <div className="mt-3 text-white">
                                        Upcoming Interviews
                                      </div>
                                      {/* </h6> */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {role === SX_ROLES.SME && !showSmeAvailability && (
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="ms-3 mt-5">
                                    <ul className="nav">
                                      {tabs.map((data: any, index: number) => {
                                        return (
                                          <li
                                            key={index}
                                            className={`nav-item tab ${data?.path === activePage
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

                                  <div className="row  me-0 me-lg-3">
                                    {activePage === 0 && (
                                      <div className="me-3 ">
                                        {interviews.length > 0 ? (
                                          <div className="rounded-3 bg-white p-4 mb-3 ">
                                            {interviews.map(
                                              (data: any, index: number) => {
                                                return (
                                                  <div
                                                    key={index}
                                                  // className=" mb-4"
                                                  >
                                                    <div>
                                                      <div className="d-flex justify-content-between">
                                                        <div className="dashboard_happy_monday_fourth_line">
                                                          <h5
                                                            className="side_heading pointer"
                                                            onClick={() =>
                                                              onSelectInterview(
                                                                data
                                                              )
                                                            }
                                                          >
                                                            {data?.company_name}
                                                            -{data?.job_title}
                                                          </h5>
                                                        </div>
                                                        <div className="top_para_styles m-0 d-flex justify-content-end">
                                                          $ {data?.sme_fee} for
                                                          evaluation
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="row">
                                                      <div className="col-md-8">
                                                        {data.skills.map(
                                                          (
                                                            skill: any,
                                                            skillIndex: number
                                                          ) => {
                                                            return (
                                                              <>
                                                                {(skillIndex < 3) && (
                                                                  <span
                                                                    className="technologies"
                                                                    key={
                                                                      skillIndex
                                                                    }
                                                                  >
                                                                    {skill}

                                                                  </span>
                                                                )}
                                                              </>
                                                            );
                                                          }
                                                        )}
                                                        <span className="fs_14 ms-2">
                                                          -Skills to test
                                                        </span>
                                                        {/* <span className="skill_test ms-3">
                                            -skills to test
                                          </span> */}
                                                      </div>
                                                      <div className="col-md-4 text-end">
                                                        <button
                                                          // className="large_btn_reject rounded"
                                                          className="large_btn_apply rounded-3 btn-outline-primary me-3"
                                                          onClick={() =>
                                                            handleCancelPopup(
                                                              data
                                                            )
                                                          }
                                                        >
                                                          Reject
                                                        </button>
                                                        <button
                                                          className="large_btn_apply rounded-3"
                                                          onClick={() =>
                                                            handleAcceptPopup(
                                                              data
                                                            )
                                                          }
                                                        >
                                                          Accept
                                                        </button>
                                                      </div>
                                                      <div className="col-md-12 mt-2 top_para_styles m-0">
                                                        {moment(
                                                          data?.interview_schedule
                                                        ).format("ddd DD MMM")}
                                                        ,{" "}
                                                        {moment(
                                                          data?.interview_schedule
                                                        ).format("HH:mm")}-{
                                                          moment(data?.interview_schedule).add(1, "h").format("HH:mm")
                                                        }
                                                      </div>
                                                    </div>
                                                    {interviews.length - 1 !==
                                                      index && <hr />}
                                                    {/* <hr /> */}
                                                  </div>
                                                );
                                              }
                                            )}
                                          </div>
                                        ) : (
                                          <div className="bg-white d-flex justify-content-between p-4 rounded-top mb-4">
                                            <p className="mb-0 top_para_styles">
                                              No new requests
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    {activePage === 1 && (
                                      <div className="me-3">
                                        {upCommingInterviews.length > 0 ? (
                                          <div className="rounded-3 bg-white p-4 mb-3 ">
                                            {upCommingInterviews.map(
                                              (data: any, index: number) => {
                                                return (
                                                  <div
                                                    key={index}
                                                  // className=" mb-4"
                                                  >
                                                    <div>
                                                      <div className="d-flex justify-content-between">
                                                        <div className="dashboard_happy_monday_fourth_line">
                                                          <h5
                                                            className="side_heading pointer"
                                                            onClick={() =>
                                                              onSelectInterview(
                                                                data
                                                              )
                                                            }
                                                          >
                                                            {data?.company_name}
                                                            -{data?.job_title}
                                                          </h5>
                                                        </div>
                                                        <div className="top_para_styles m-0 d-flex justify-content-end">
                                                          $ {data?.sme_fee} for
                                                          evaluation
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="row">
                                                      <div className="col-md-8">
                                                        <span>
                                                          {data?.skills?.map(
                                                            (
                                                              skill: any,
                                                              skillIndex: number
                                                            ) => {
                                                              return (
                                                                <>
                                                                  {skillIndex <
                                                                    3 && (
                                                                      <span
                                                                        key={
                                                                          skillIndex
                                                                        }
                                                                        className="technologies"
                                                                      >
                                                                        {skill}
                                                                      </span>
                                                                    )}
                                                                </>
                                                              );
                                                            }
                                                          )}
                                                        </span>
                                                      </div>
                                                      {/* <div className="col-md-4 text-end">
                                                       <button
                                                           className="large_btn_apply rounded-3 btn-outline-primary me-3"
                                                           onClick={() =>
                                                             handleCancelPopup(
                                                               data
                                                             )
                                                           }
                                                         >
                                                           Reject
                                                         </button>
                                                         <button
                                                           className="large_btn_apply rounded-3"
                                                           onClick={() =>
                                                             handleAcceptPopup(
                                                               data
                                                             )
                                                           }
                                                         >
                                                           Accept
                                                         </button>
                                                       
                                                       </div> */}
                                                      <div className="col-md-12 mt-2 top_para_styles m-0">
                                                        {moment(
                                                          data?.interview_schedule
                                                        ).format("ddd DD MMM")}
                                                        ,{" "}
                                                        {moment(
                                                          data?.interview_schedule
                                                        ).format("HH:mm")}-{
                                                          moment(data?.interview_schedule).add(1, "h").format("HH:mm")
                                                        }
                                                      </div>
                                                    </div>
                                                    {upCommingInterviews.length -
                                                      1 !==
                                                      index && <hr />}
                                                    {/* <hr /> */}
                                                  </div>
                                                );
                                              }
                                            )}
                                          </div>
                                        ) : (
                                          <div className="bg-white d-flex justify-content-between p-4 rounded-top mb-4">
                                            <p className="mb-0 top_para_styles">
                                              No upcoming interviews
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="col-12  col-lg-4">
                            <div className="mb-4">
                              {/* <h6 className="dashboard_happy_monday_third_line upcoming_nterviews">
                                {" "}
                                Schedule
                              </h6> */}
                              <Calendar
                                minDate={new Date()}
                                calendarType="US"
                                onChange={(event: any) =>
                                  getDateInterviews(event, upCommingInterviews)
                                }
                                className="w-100 pt-3"
                              />
                            </div>
                            <div>
                              {dateInterviews?.length > 0 ? (
                                <div className={`rounded-3 bg-white px-3 py-3`}>
                                  {dateInterviews.map(
                                    (data: any, index: number) => {
                                      return (
                                        <div className="row mb-4" key={index}>
                                          <div className="col-md-4">
                                            <span className="interview_data opacity_6">
                                              {moment(
                                                data?.interview_schedule
                                              ).format("DD MMM")}
                                            </span>
                                            <br />
                                            <span
                                              className="interview_data"
                                              style={{ fontWeight: "400" }}
                                            >
                                              {moment(
                                                data?.interview_schedule
                                              ).format("ddd")}
                                            </span>
                                          </div>
                                          <div className="col-md-8">
                                            <div
                                              className="pointer"
                                              onClick={() =>
                                                onSelectInterview(data)
                                              }
                                            >
                                              <div className="candidate_name opacity_6 pointer">
                                                {data?.candidate_firstname}{" "}
                                                {data?.candidate_lastname}
                                              </div>
                                              <div className="candidate_name opacity_6">
                                                {data?.job_title}
                                              </div>
                                            </div>
                                            <div className="total_timing">
                                              {moment(
                                                data?.interview_schedule
                                              ).format("ddd DD MMM")}
                                              ,{" "}
                                              {moment(
                                                data?.interview_schedule
                                              ).format("HH:mm")}-{
                                                moment(data?.interview_schedule).add(1, "h").format("HH:mm")
                                              }
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              ) : (
                                <div
                                  className={`rounded-3 bg-white px-3 py-3 top_para_styles `}
                                >
                                  No interviews scheduled for selected date
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    {(role === SX_ROLES.CompanyAdmin ||
                      role === SX_ROLES.Recruiter) && (
                        <div className="row">
                          <div className="col-md-7 col-xl-8 ">
                            {
                              role === SX_ROLES.Recruiter ? (
                                <RecruiterDashBoard jobsList={totalOpeningJobs} companyUpcomingInterview={companyUpcomingInterview} />
                              ) : (
                                <RecruiterDashBoard jobsList={totalOpeningJobs} companyUpcomingInterview={companyUpcomingInterview} />
                              )
                             
                            }
                            {role === SX_ROLES.Recruiter && (
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="me-md-3 mt-3 mb-4">
                                    <h6 className="dashboard_happy_monday_third_line  ms-2">
                                      Open Job Positions
                                    </h6>

                                    {jobsList.length > 0 ? (
                                      <div className="rounded-3  bg-white">
                                        <div className="px-4 py-4">
                                          {jobsList.map(
                                            (data: any, index: number) => (
                                              <JobListItem
                                                onOpenJob={() =>
                                                  onClickOpne(data)
                                                }
                                                actions={
                                                  // (data.user_uuid == loginUserId || SX_ROLES.Recruiter === "Recruiter") &&
                                                  contextMenu_company_admin
                                                }
                                                data={data}
                                                onAction={(action) => {
                                                  onContextAction(action, data);
                                                }}
                                                onSelectRow={() => { }}
                                                onChangeReopen={() => { }}
                                                openArchive={false}
                                              ></JobListItem>
                                            )
                                          )}
                                          <TablePagination
                                            rowsPerPage={rowsPerPage}
                                            totalRows={totalOpeningJobs}
                                            activePage={activePage}
                                            onChangePage={onChangePagination}
                                            currentPage={currentPage}
                                          ></TablePagination>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="rounded-3  bg-white">
                                            {
                                               isapiloaded &&
                                        <div className="py-4 px-4 ms-2">
                                          {/* <p className='top_para_styles m-0'>No open jobs. <span className="sx-text-primary side_heading pointer">Create a job recreation</span></p> */}
                                          <div className="row">
                                            <div className="col-md-6 col-sm-12 ">
                                              <div className="border rounded-3 p-3 me-4 mb-3 mb-md-0">
                                                <div className="side_heading mb-2">
                                                  Create the team
                                                </div>
                                                <div className="fs_14 mb-4">
                                                  It is always better when your
                                                  team is here, start creating
                                                  your team{" "}
                                                </div>
                                                <div>
                                                  <button className="large_btn_apply">
                                                    Add First Team Member
                                                  </button>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="col-md-6 col-sm-12">
                                              <div className="border rounded-3 p-3 me-lg-2 me-4 me-md-2">
                                                <div className="side_heading mb-2">
                                                  Upload Job Description
                                                </div>
                                                <div className="fs_14 mb-4">
                                                  Create your first job
                                                  description and start to see the
                                                  SME's best suited for the same{" "}
                                                </div>
                                                <div>
                                                  <button className="large_btn_apply">
                                                    Add First Team Member
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {role === SX_ROLES.CompanyAdmin && (
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="me-md-3 mt-3 mb-4">
                                    <h6 className="dashboard_happy_monday_third_line  ms-2">
                                      Open Job Positions
                                    </h6>

                                    {jobsList.length > 0 ? (
                                      <div className="rounded-3  bg-white">
                                        <div className="px-4 py-4">
                                          {jobsList.map(
                                            (data: any, index: number) => (
                                              <JobListItem
                                                onOpenJob={() =>
                                                  onClickOpne(data)
                                                }
                                                actions={
                                                  //  data.user_uuid===loginUserId &&
                                                  contextMenu_company_admin
                                                }
                                                // actions={data.user_uuid && data.uuid && contextMenu}
                                                data={data}
                                                onAction={(action) => {
                                                  onContextAction(action, data);
                                                }}
                                                onChangeReopen={() => { }}
                                                onSelectRow={() => { }}
                                                openArchive={false}
                                              ></JobListItem>
                                            )
                                          )}
                                          <TablePagination
                                            rowsPerPage={rowsPerPage}
                                            totalRows={totalOpeningJobs}
                                            activePage={activePage}
                                            onChangePage={onChangePagination}
                                            currentPage={currentPage}
                                          ></TablePagination>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="rounded-3  bg-white">
                                          {
                                              isapiloaded &&
                                        <div className="py-4 px-4 ms-2">
                                          {/* <p className='top_para_styles m-0'>No open jobs. <span className="sx-text-primary side_heading pointer">Create a job recreation</span></p> */}
                                          <div className="row">
                                            <div className="col-md-6 col-sm-12 ">
                                              <div className="border rounded-3 p-3 me-4 mb-3 mb-md-0">
                                                <div className="side_heading mb-2">
                                                  Create the team
                                                </div>
                                                <div className="fs_14 mb-4">
                                                  It is always better when your
                                                  team is here, start creating
                                                  your team{" "}
                                                </div>
                                                <div>
                                                  <button className="large_btn_apply">
                                                    Add First Team Member
                                                  </button>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="col-md-6 col-sm-12">
                                              <div className="border rounded-3 p-3 me-lg-2 me-4 me-md-2">
                                                <div className="side_heading mb-2">
                                                  Upload Job Description
                                                </div>
                                                <div className="fs_14 mb-4">
                                                  Create your first job
                                                  description and start to see the
                                                  SME's best suited for the same{" "}
                                                </div>
                                                <div>
                                                  <button className="large_btn_apply">
                                                    Add First Team Member
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                    }
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="col-md-5  col-xl-4">
                            <div className="mb-4">
                              <Calendar
                                minDate={new Date()}
                                calendarType="US"
                                onChange={(date: any) => getInterviewsDate(1, '', '', '', date)}

                                className="w-100 pt-3"
                              />
                            </div>
                            <div>
                              {dateInterviews?.length > 0 ? (
                                <div className={`rounded-3 bg-white px-3 py-3`}>
                                  {dateInterviews.map(
                                    (data: any, index: number) => {
                                      return (
                                        <div className="row mb-4" key={index}>
                                          <div className="col-md-4">
                                            <span className="interview_data opacity_6">
                                              {moment(
                                                data?.interview_schedule
                                              ).format("DD MMM")}
                                            </span>
                                            <br />
                                            <span
                                              className="interview_data"
                                              style={{ fontWeight: "400" }}
                                            >
                                              {moment(
                                                data?.interview_schedule
                                              ).format("ddd")}
                                            </span>
                                          </div>
                                          <div className="col-md-8">

                                            <div className="candidate_name opacity_6 pointer">
                                              {data?.candidate_firstname}{" "}
                                              {data?.candidate_lastname}
                                            </div>
                                            <div className="candidate_name opacity_6">
                                              {data?.job_title}
                                            </div>
                                            <div className="total_timing">
                                              {moment(
                                                data?.interview_schedule
                                              ).format("ddd DD MMM")}
                                              ,{" "}
                                              {moment(
                                                data?.interview_schedule
                                              ).format("HH:mm")}-{
                                                moment(data?.interview_schedule).add(1, "h").format("HH:mm")
                                              }
                                            </div>
                                          </div>

                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              ) : (
                                <div
                                  className={`rounded-3 bg-white px-3 py-3 top_para_styles `}
                                >
                                  No interviews scheduled for selected date
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        // <div className="row bg-white rounded-3 me-3 me-sm-0 me-lg-3 p-4">

                        //   <div className="row h-100">
                        //     <div className="col-md-4">
                        //       <div className="rounded-3 py-3 px-2 bg-interview h-100 me-lg-2 me-1">
                        //         <div className="d-flex align-items-center justify-content-between px-2 text-white">
                        //           <h2 className="text-heading-2">
                        //             {jobsList.length}
                        //           </h2>
                        //           <img
                        //             src={InterviewOpportunities}
                        //             alt="Interview Requests"
                        //             className=""
                        //           />
                        //         </div>
                        //         <div className="mt-3 text-white">Interview Requests</div>
                        //       </div>
                        //     </div>
                        //     <div className="col-md-4">
                        //       <div className="rounded-3 py-3 px-2 bg-upcoming-interview h-100 ms-lg-3 ms-1 me-3">
                        //         <div className="d-flex align-items-center justify-content-between text-white px-3">
                        //           <h2 className="text-heading-2">
                        //             {upCommingInterviews.length > 0
                        //               ? upCommingInterviews.length
                        //               : 0}
                        //           </h2>
                        //           <img
                        //             src={UpcomingInterviews}
                        //             alt="Upcoming Interviews"
                        //             className=""
                        //           />
                        //         </div>
                        //         <div className="mt-3 text-white">Upcoming Interviews</div>
                        //       </div>
                        //     </div>
                        //     <div className="col-md-4 ">
                        //       <div className="rounded-3 pb-3 px-3 bg-assessment-reports">
                        //         <h6 className="text-black p-0 m-0 lh-1">
                        //           <div style={{ height: "60px" }}>
                        //             <span className="bg-interview_card_heading">
                        //               0
                        //             </span>

                        //           </div>
                        //           <div >New assessment reports</div>
                        //         </h6>
                        //       </div>
                        //     </div>
                        //   </div>
                        // </div>

                        // </div>

                        // <div className="row gy-4">
                        //   <div className="col-lg-4 col-12 mx-auto">
                        //     <div className="me-lg-3">
                        //       <div className="bg-white rounded-3 py-lg-3 py-4 px-lg-2 px-md-3 px-3">
                        //         <h6 className="dashboard_happy_monday_card_heading">
                        //           <span className="fs-4 text_color">
                        //             {jobsList.length > 0 ? jobsList.length : 0}
                        //           </span>{" "}
                        //           Open jobs
                        //         </h6>
                        //       </div>
                        //     </div>
                        //   </div>
                        //   <div className="col-lg-4 col-12 mx-auto">
                        //     <div className="me-lg-3">
                        //       <div className="bg-white rounded-3 py-lg-3 py-4 px-lg-2 px-md-3 px-3">
                        //         <h6 className="dashboard_happy_monday_card_heading">
                        //           <span className="fs-4 text_color">0</span>{" "}
                        //           Upcoming interviews
                        //         </h6>
                        //       </div>
                        //     </div>
                        //   </div>
                        //   <div className="col-lg-4 col-12 mx-auto">
                        //     <div className="me-lg-3">
                        //       <div className="bg-white rounded-3 py-lg-3 py-4 px-lg-2 px-md-3 px-3">
                        //         <h6 className="dashboard_happy_monday_card_heading">
                        //           <span className="fs-4 text_color">0</span> New
                        //           assessment reports
                        //         </h6>
                        //       </div>
                        //     </div>
                        //   </div>
                        // </div>
                        // <div className="row bg-white rounded-3 py_25_px_24 me-3 me-sm-0 me-lg-3 mt-3">
                        //   <div className="col-lg-4 col-md-4 col-12 ">
                        //     <div className="me-md-3">
                        //       <div className="rounded-3 pb-3 px-3 bg-interview">
                        //         <h6 className="text-white p-0 m-0 lh-1">
                        //           <div style={{ height: "60px" }}>
                        //             <span className="bg-interview_card_heading">
                        //               {jobsList.length > 0 ? jobsList.length : 0}
                        //             </span>{" "}
                        //             <img
                        //               src={InterviewOpportunities}
                        //               alt="Interview Opportunities"
                        //               className="dashboard_box_ionc"
                        //             />
                        //           </div>
                        //           <div>Open jobs</div>
                        //         </h6>
                        //       </div>
                        //     </div>
                        //   </div>
                        //   <div className="col-lg-4 col-md-4 col-12">
                        //     <div className="me-md-3">
                        //       <div className="rounded-3 pb-3 px-3 bg-upcoming-interview">
                        //         <h6 className="text-white p-0 m-0 lh-1">
                        //           <div style={{ height: "60px" }}>
                        //             <span className="bg-interview_card_heading">
                        //               {upCommingInterviews.length > 0
                        //                 ? upCommingInterviews.length
                        //                 : 0}
                        //             </span>
                        //             <img
                        //               src={UpcomingInterviews}
                        //               alt="Upcoming Interviews"
                        //               className="dashboard_box_ionc"
                        //             />
                        //           </div>
                        //           <div>Upcoming Interviews</div>
                        //         </h6>
                        //       </div>
                        //     </div>
                        //   </div>

                        //   <div className="col-lg-4 col-md-4 col-12">
                        //     <div className="rounded-3 pb-3 px-3 bg-assessment-reports">
                        //       <h6 className="text-black p-0 m-0 lh-1">
                        //         <div style={{ height: "60px" }}>
                        //           <span className="bg-interview_card_heading">
                        //             0
                        //           </span>

                        //         </div>
                        //         <div>New assessment reports</div>
                        //       </h6>
                        //     </div>
                        //   </div>
                        // </div>
                      )}

                    {role === SX_ROLES.SuperAdmin && (
                      <div className="row gy-4">
                        <div className="col-lg-4 col-md-4 col-12 mx-auto">
                          <div className="me-lg-3">
                            <div className="border_color bg-white rounded-3 py-4 px-3">
                              <h6 className="dashboard_happy_monday_card_heading">
                                Total Companies{" "}
                                <span className="fs-4 text_color">0</span>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-12 mx-auto">
                          <div className="me-lg-3">
                            <div className="border_color bg-white rounded-3 py-4 px-3">
                              <h6 className="dashboard_happy_monday_card_heading">
                                Total SMEs{" "}
                                <span className="fs-4 text_color">0</span>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-12 mx-auto">
                          <div className="me-lg-3">
                            <div className="border_color bg-white rounded-3 py-4 px-3">
                              <h6 className="dashboard_happy_monday_card_heading">
                                Total Candidates{" "}
                                <span className="fs-4 text_color">0</span>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-12 mx-auto">
                          <div className="me-lg-3">
                            <div className="border_color bg-white rounded-3 py-4 px-3">
                              <h6 className="dashboard_happy_monday_card_heading">
                                Last Week Interviews{" "}
                                <span className="fs-4 text_color">0</span>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-12 mx-auto">
                          <div className="me-lg-3">
                            <div className="border_color bg-white rounded-3 py-4 px-3">
                              <h6 className="dashboard_happy_monday_card_heading">
                                Last Month Interviews{" "}
                                <span className="fs-4 text_color">0</span>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-12 mx-auto">
                          <div className="me-lg-3">
                            <div className="border_color bg-white rounded-3 py-4 px-3">
                              <h6 className="dashboard_happy_monday_card_heading">
                                Rejected Interviews{" "}
                                <span className="fs-4 text_color">0</span>
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {role === SX_ROLES.SuperAdmin && (
                      // role === SX_ROLES.CompanyAdmin ||
                      // role === SX_ROLES.Recruiter
                      <div className="row">
                        <div className="col-md-8">
                          <div className="me-lg-3">
                            <h6 className="dashboard_happy_monday_third_line mt-5">
                              Open Job Positions
                            </h6>
                            {jobsList.length > 0 ? (
                              <div>
                                {jobsList.map((data: any, index: number) => {
                                  return (
                                    <div
                                      key={index}
                                      className="rounded-3 mb-4"
                                      style={{ position: "relative" }}
                                    >
                                      <div
                                        className="bg-white d-flex justify-content-between px-md-3 px-2 py-md-3 py-1 rounded-top"
                                        style={{
                                          borderBottom: "1px solid #BBBBBB",
                                        }}
                                      >
                                        <ul className="list-inline my-auto">
                                          <li className="dashboard_happy_monday_fourth_line">
                                            {data?.job_title}
                                          </li>
                                          <li className="dashboard_happy_monday_fourth_line">
                                            {data?.location}.{" "}
                                            {data?.category_code}
                                          </li>
                                        </ul>
                                        <ul className="d-flex list-inline my-auto">
                                          <li className="start">
                                            {!data?.is_favourite && (
                                              <svg
                                                className="pointer"
                                                onClick={() =>
                                                  onJobFav(index, true)
                                                }
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
                                                onClick={() =>
                                                  onJobFav(index, false)
                                                }
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
                                          <li className="mx-2">
                                            <button
                                              className="small_btn rounded"
                                              onClick={() => onClickOpne(data)}
                                            >
                                              Open
                                            </button>
                                          </li>
                                          <li>
                                            <button
                                              className="small_btn rounded"
                                              onMouseEnter={(e) =>
                                                handleMouseEnter(e, index)
                                              }
                                              onMouseLeave={(e) =>
                                                handleMouseLeave(e)
                                              }
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
                                          </li>
                                        </ul>
                                        {showLinksDiv &&
                                          selectedIndex === index && (
                                            <div
                                              className="three_douts_link_div"
                                              onMouseEnter={(e) =>
                                                handleMouseEnterDivLink(
                                                  e,
                                                  index
                                                )
                                              }
                                              onMouseLeave={(e) =>
                                                handleMouseLeaveDivLink(e)
                                              }
                                            >
                                              <ul className="list-inline mb-0">
                                                <li
                                                  className="move_to_draft mb-2"
                                                  style={{ cursor: "pointer" }}
                                                  onClick={() =>
                                                    onEdit(data, "edit")
                                                  }
                                                >
                                                  Edit
                                                </li>
                                                <li
                                                  className="move_to_draft"
                                                  style={{ cursor: "pointer" }}
                                                  onClick={() =>
                                                    handleShowPopup(
                                                      data,
                                                      "delete"
                                                    )
                                                  }
                                                >
                                                  Delete Permanently
                                                </li>
                                              </ul>
                                            </div>
                                          )}
                                      </div>
                                      <div className="bg_white d-flex justify-content-between px-md-3 px-2 py-md-3 pt-2 rounded-bottom ">
                                        <h6 className="dashboard_happy_monday_candidates_text">
                                          <span>{data?.total_candidates}</span>{" "}
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
                                              <li className="mx-md-3 mx-sm-2 mx-1 dashboard_happy_monday_number">
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
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                              overlay={
                                                <Tooltip id="tooltip-disabled">
                                                  Scheduled
                                                </Tooltip>
                                              }
                                            >
                                              <li className="mx-md-3 mx-sm-2 mx-1 dashboard_happy_monday_number">
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
                                                {
                                                  data?.total_candidates_scheduled
                                                }
                                              </li>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                              overlay={
                                                <Tooltip id="tooltip-disabled">
                                                  To be re-scheduled
                                                </Tooltip>
                                              }
                                            >
                                              <li className="mx-md-3 mx-sm-2 mx-1 dashboard_happy_monday_number">
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
                                                {
                                                  data?.total_candidates_rescheduled
                                                }
                                              </li>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                              overlay={
                                                <Tooltip id="tooltip-disabled">
                                                  Screened
                                                </Tooltip>
                                              }
                                            >
                                              <li className="mx-md-3 mx-sm-2 mx-1 dashboard_happy_monday_number">
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
                                                {
                                                  data?.total_candidates_completed
                                                }
                                              </li>
                                            </OverlayTrigger>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p>No Jobs</p>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4 mx-auto mt-5">
                          {role !== SX_ROLES.SuperAdmin && (
                            <div className="w-100 rounded-3 mt_30">
                              <Calendar
                                minDate={new Date()}
                                calendarType="US"
                                onChange={(event: any) =>
                                  getDateInterviews(event, upCommingInterviews)
                                }
                                className="w-100"
                              />
                              <div>
                                {dateInterviews?.length > 0 ? (
                                  <div
                                    className={`border_color rounded-3 bg-white px-3 py-3`}
                                  >
                                    {dateInterviews.map(
                                      (data: any, index: number) => {
                                        return (
                                          <div className="row mt-4" key={index}>
                                            <div className="col-md-3">
                                              <span className="interview_data">
                                                {moment(
                                                  data?.interview_schedule
                                                ).format("DD MMM")}
                                              </span>
                                              <br />
                                              <span
                                                className="interview_data"
                                                style={{ fontWeight: "400" }}
                                              >
                                                {moment(
                                                  data?.interview_schedule
                                                ).format("ddd")}
                                              </span>
                                            </div>
                                            <div className="col-md-7">
                                              <div className="candidate_name">
                                                {data?.candidate_firstname}{" "}
                                                {data?.candidate_lastname},
                                              </div>
                                              <div className="candidate_name">
                                                {data?.job_title}
                                              </div>
                                              <div className="total_timing">
                                                {moment(
                                                  data?.interview_schedule
                                                ).format("ddd DD MMM")}
                                                ,{" "}
                                                {moment(
                                                  data?.interview_schedule
                                                ).format("HH:MM")}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                ) : (
                                  <div
                                    className={`border_color rounded-3 bg-white px-3 py-3 mt-3`}
                                  >
                                    No new notifications
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          {role === SX_ROLES.SuperAdmin && (
                            <div
                              className={`border_color rounded-3 bg-white px-3 py-4`}
                            >
                              <div className="notifications d-flex justify-content-between">
                                <p className="notifications_left_line">
                                  3 New Notifications
                                </p>
                                <p className="notifications_right_line">
                                  Mark all as read
                                </p>
                              </div>
                              <div className="notifications_list">
                                <ul className="d-flex list-inline">
                                  <li className="">
                                    <svg
                                      width="32"
                                      height="32"
                                      viewBox="0 0 32 32"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <circle
                                        cx="16"
                                        cy="16"
                                        r="16"
                                        fill="#F4F4F4"
                                      />
                                    </svg>
                                  </li>
                                  <li className="ms-2 w-100">
                                    <ul className="list-inline">
                                      <li className="notifications_third_line">
                                        <span className="fw-bold">
                                          Company 1
                                        </span>{" "}
                                        has posted one new job
                                      </li>
                                      <li className="d-flex justify-content-between notifications_fourth_line">
                                        A few seconds ago
                                        <span className="text-end">
                                          <svg
                                            width="10"
                                            height="10"
                                            viewBox="0 0 10 10"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <circle
                                              cx="5"
                                              cy="5"
                                              r="5"
                                              fill="#6DC02A"
                                            />
                                          </svg>
                                        </span>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </div>
                              <div className="notifications_list">
                                <ul className="d-flex list-inline">
                                  <li className="">
                                    <svg
                                      width="32"
                                      height="32"
                                      viewBox="0 0 32 32"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <circle
                                        cx="16"
                                        cy="16"
                                        r="16"
                                        fill="#F4F4F4"
                                      />
                                    </svg>
                                  </li>
                                  <li className="ms-2 w-100">
                                    <ul className="list-inline">
                                      <li className="notifications_third_line">
                                        <span className="fw-bold">
                                          Company 2
                                        </span>{" "}
                                        has paid subscription
                                      </li>
                                      <li className="d-flex justify-content-between notifications_fourth_line">
                                        A few seconds ago{" "}
                                        <span className="text-end">
                                          <svg
                                            width="10"
                                            height="10"
                                            viewBox="0 0 10 10"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <circle
                                              cx="5"
                                              cy="5"
                                              r="5"
                                              fill="#6DC02A"
                                            />
                                          </svg>
                                        </span>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </div>
                              <div className="notifications_list">
                                <ul className="d-flex list-inline">
                                  <li className="">
                                    <svg
                                      width="32"
                                      height="32"
                                      viewBox="0 0 32 32"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <circle
                                        cx="16"
                                        cy="16"
                                        r="16"
                                        fill="#F4F4F4"
                                      />
                                    </svg>
                                  </li>
                                  <li className="ms-2 w-100">
                                    <ul className="list-inline">
                                      <li className="notifications_third_line">
                                        <span className="fw-bold">
                                          Company 3
                                        </span>{" "}
                                        has cancled the subscription
                                      </li>
                                      <li className="d-flex justify-content-between notifications_fourth_line">
                                        A few seconds ago{" "}
                                        <span className="text-end">
                                          <svg
                                            width="10"
                                            height="10"
                                            viewBox="0 0 10 10"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <circle
                                              cx="5"
                                              cy="5"
                                              r="5"
                                              fill="#6DC02A"
                                            />
                                          </svg>
                                        </span>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {role === SX_ROLES.SME && !showSmeAvailability && (
                      <div className="row"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {showAdminAddMember && !loading && (
            <div className="row">
              {role === SX_ROLES.CompanyAdmin && !loading && (
                <div className="col-12">
                  <div className="billing_heading px-md-5 px-3 mb-3 ms-2">
                    <h5 className="top_heading_styles">
                      Welcome to a faster hiring experience!
                    </h5>
                    <p className="top_para_styles p-0 m-0">
                      Choose one of the below options and start to streamline
                      your tech screening process
                    </p>
                  </div>
                  <div className="rounded-3  bg-white col-8 ms-4">
                    <div className="py-4 px-4 ms-2">
                      {/* <p className='top_para_styles m-0'>No open jobs. <span className="sx-text-primary side_heading pointer">Create a job recreation</span></p> */}
                      <div className="row">
                        <div className="col-md-6 col-sm-12 ">
                          <div className="border rounded-3 p-3 me-4 mb-3 mb-md-0">
                            <div className="side_heading mb-2">
                              Create the team
                            </div>
                            <div className="fs_14 mb-4">
                              It is always better when your team is here, start
                              creating your team{" "}
                            </div>
                            <div>
                              <button
                                className="large_btn_apply"
                                onClick={() => setModalShow(true)}
                              >
                                Add First Team Member
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6 col-sm-12">
                          <div className="border rounded-3 p-3 me-lg-2 me-4 me-md-2">
                            <div className="side_heading mb-2">
                              Upload Job Description
                            </div>
                            <div className="fs_14 mb-4">
                              Create your first job description and start to see
                              the SME's best suited for the same{" "}
                            </div>
                            <div>
                              <button
                                className="large_btn_apply"
                                onClick={() => history.push("/dashboard/jobs")}
                              >
                                Add First Team Member
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="row px-md-5 px-3">
                    <div className="col-md-9 col-12">
                      <div className="row mb-sm-5">
                        <div className="col-md-5 col-12">
                          <div className="border_color bg-white">
                            <div className="text-center">
                              <div className="overview_circle">
                                <img src={grayEllipseImg} alt="loading" />
                              </div>
                            </div>
                            <div className="text-center create_the_team_box_content">
                              <p className="hiring_experience_heading p-0 m-0">
                                Create the team
                              </p>
                              <p className="hiring_experience_text">
                                It is always better when your team is here,
                                start creating your team.
                              </p>
                              <p>
                                <button
                                  className="large_btn_apply rounded"
                                  onClick={() => setModalShow(true)}
                                >
                                  Add first team member
                                </button>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-5 col-12 upload_job_description">
                          <div className="border_color bg-white">
                            <div className="text-center">
                              <div className="overview_circle">
                                <img src={grayEllipseImg} alt="loading" />
                              </div>
                            </div>
                            <div className="text-center upload_job_description_content">
                              <p className="hiring_experience_heading p-0 m-0">
                                Upload Job Description
                              </p>
                              <p className="hiring_experience_text">
                                Create your first job description and start to
                                see the SME's best suited for the same.
                              </p>
                              <p>
                                <button
                                  className="large_btn_apply rounded"
                                  onClick={() => handlePage()}
                                >
                                  Upload job description
                                </button>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>
              )}

              <ToastContainer className="p-3" position={"bottom-end"}>
                {/* autohide */}
                <Toast
                  show={showA}
                  delay={5000}
                  onClose={toggleShowA}
                  style={{ borderTop: "5px #79E524 solid" }}
                >
                  <Toast.Header>
                    <img
                      src="holder.js/20x20?text=%20"
                      className="rounded me-2"
                      alt=""
                    />
                    <strong className="me-auto">Team members invited</strong>
                  </Toast.Header>
                  <Toast.Body>
                    An invite request email has been sent to their email address
                  </Toast.Body>
                  <div className="d-flex w-100 px-3 py-2">
                    <div className="w-50">
                      <button
                        className="extra_large_btn rounded"
                        onClick={() => showAddMember()}
                      >
                        Add member
                      </button>
                    </div>
                    <div className="text-end w-50">
                      <button
                        className="extra_large_btn rounded"
                        onClick={toggleShowA}
                      >
                        Okay
                      </button>
                    </div>
                  </div>
                </Toast>
              </ToastContainer>

              <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="sx-close w-100"
              >
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">
                    <div className="invite_team_heading">
                      Invite team members
                    </div>
                    <p className="invite_team_content">
                      An invite request email will be sent to their email
                      address
                    </p>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div>
                    <FormBuilder onUpdate={handleInput}>
                      <form>
                        <div className="mb-3">
                          <label className="form-label job_dis_form_label">
                            Enter email addresses to invite
                          </label>
                          <ChipInput
                            type={"email"}
                            placeholder="Enter email addresses"
                            getChipsFieldData={(data) => onChipData(data)}
                          ></ChipInput>
                          {emailError && (
                            <p className="text-danger job_dis_form_label">
                              {emailError}
                            </p>
                          )}
                        </div>
                        <div className="mb-3">
                          <label className="form-label job_dis_form_label">
                            Role
                          </label>
                          <select
                            className="form-control job_dis_form_control px-3 rounded"
                            name="role"
                            onChange={(event) => onSelectRole(event)}
                          >
                            <option value="">Select role</option>
                            {roles.map((role: any, index: number) => {
                              return (
                                <option key={index} value={role.uuid}>
                                  {role.name}
                                </option>
                              );
                            })}
                          </select>
                          {roleError && (
                            <p className="text-danger job_dis_form_label">
                              {roleError}
                            </p>
                          )}
                        </div>
                        {selectedRoles?.description && (
                          <div className="mb-3">
                            <p className="f12">
                              {" "}
                              <img src={Vector} alt="" />{" "}
                              {selectedRoles?.description}
                            </p>
                          </div>
                        )}
                      </form>
                    </FormBuilder>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <div className="d-flex pb-3 mx-3 justify-content-between">
                    <div className="text-start">
                      <button className="large_btn_filter px-2">Cancel</button>
                    </div>
                    <div className="text-end ">
                      <button
                        className="large_btn_apply  "
                        onClick={onAddTeamMember}
                      >
                        Send Invite
                      </button>
                    </div>
                    <div className="text-end ">
                      <button
                        className="small_btn rounded-3"
                        onClick={onAddTeamMember}
                      >
                        Send Invite
                      </button>
                    </div>
                  </div>
                </Modal.Footer>
              </Modal>
            </div>
          )}
          {role === SX_ROLES.SME && showSmeAvailability && !loading && (
            <div className="col-12">
              <div className="px-md-5 px-3 ms-3 ms-lg-0">
                <h5 className="top_heading_styles">
                  Welcome to your Dashboard
                </h5>
                <p className="top_para_styles">
                  Set your availability to get interview requests
                </p>
              </div>
              <div className="row px-md-5 px-3">
                <div className="col-md-9 col-12">
                  <div className="row mb-sm-5">
                    <div className="col-md-5 col-12 create_the_team_box">
                      <div className="rounded-3 p-3 bg-white  ms-3 ms-lg-0 me-3 me-lg-0 ms-md-0 me-md-0">
                        <div className="text-center">
                          <div className="overview_circle">
                            <img
                              src={Clock}
                              alt="loading"
                              style={{ height: "100px" }}
                            />
                          </div>
                        </div>
                        <div className="text-center create_the_team_box_content">
                          <p className="hiring_experience_text mb-0">
                            Please let us know when you are available
                          </p>
                          <p className="hiring_experience_text">
                            to interview the candidates
                          </p>

                          <p className="my-4">
                            <NavLink
                              className="large_btn_apply rounded-3 text-decoration-none clolr_black"
                              to={"/dashboard/availability"}
                            >
                              Set Availability
                            </NavLink>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                  <div className="invite_team_heading">
                    Are you sure you want to Accept
                  </div>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="border rounded-3">
                <div className="py-3">
                  <ul className="list-inline d-flex my-auto">
                    <li className="my-auto">
                      <ul className="list-inline">
                        <li
                          className="text-black p-2"
                          style={{ fontSize: "16px" }}
                        >
                          {selectedJob?.job_title}
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="text-end my-3 pe-2">
                <button
                  className="large_btn_apply rounded me-3"
                  onClick={onAcceptJob}
                >
                  Yes
                </button>
                <button
                  className="btn-signup rounded"
                  onClick={() => setShowAcceptPopup(false)}
                >
                  No
                </button>
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
                  <div className="invite_team_heading">
                    Are you sure you want to Reject
                  </div>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="border rounded-3">
                <div className="py-3">
                  <ul className="list-inline d-flex my-auto">
                    <li className="my-auto">
                      <ul className="list-inline">
                        <li
                          className="text-black p-2"
                          style={{ fontSize: "16px" }}
                        >
                          {selectedJob?.job_title}
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="text-end my-3 pe-2">
                <button
                  className="large_btn_apply rounded  me-3"
                  onClick={onRejectJob}
                >
                  Yes
                </button>
                <button
                  className="btn-signup rounded"
                  onClick={() => setShowCancelPopup(false)}
                >
                  No
                </button>
              </div>
            </Modal.Footer>
          </Modal> */}

          <Modal
            show={showMoveToDraft}
            onHide={() => setShowMoveToDraft(false)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                <div className="invite_team_heading">
                  The following job will be deleted from job list
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="border rounded-3">
                <div className="border-bottom py-3">
                  <ul className="list-inline d-flex my-auto">
                    <li className="my-auto">
                      <ul className="list-inline">
                        <li
                          className="text-black px-3"
                          style={{ fontSize: "16px" }}
                        >
                          {selectedJob?.job_title}
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="text-end my-3 pe-2">
                <button
                  className="large_btn_apply rounded me-3"
                  onClick={() => onDeleteJob()}
                >
                  Delete
                </button>
                <button
                  className="btn-signup rounded"
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
                    <Step key={label}>
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
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    UserDataReducer: state.UserDataReducer,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    userData: (data: any) => dispatch(UserData(data)),
  };
};

const connectedNavBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashBoardPage);
export { connectedNavBar as DashBoardPage };
