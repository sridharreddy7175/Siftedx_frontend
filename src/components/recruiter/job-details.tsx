import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import FormBuilder, { FormBuilderData } from "../../components/form-builder";
import ChipInput from "../chip-input";
import { FormValidator } from "../../components/form-builder/validations";
import INFO_ICON from "../../assets/icon_images/info icon.svg";
import ADD_ICON from "../../assets/icon_images/Add.svg";
import moment from "moment";
import Select from "react-select";
import { JobsService } from "../../app/service/jobs.service";
import { toast } from "react-toastify";
import { UsersService } from "../../app/service/users.service";
import { AppLoader } from "../loader";

interface Props {
  onSave: (data: any) => void;
  jobId: string;
  getChipsFieldData?: (data: any) => void;
}

export const JobDetails: React.FC<Props> = (props: Props) => {
  const [isJobDetails, setIsJobDetails] = useState(false);
  const [selectedTeamMeber, setSelectedTeamMeber] = useState<any>([]);
  const [selectedTeamMeberList, setSelectedTeamMeberList] = useState<any>([]);
  const [selectedHiringManager, setSelectedHiringManager] = useState<any>([]);
  const companyUuid = sessionStorage.getItem("company_uuid") || "";
  const [selectedHiringManagerList, setSelectedHiringManagerList] =
    useState<any>([]);
  const [jobDetailsFormData, setJobDetailsFormData] = useState<FormBuilderData>(
    {
      errors: [],
      isValid: false,
      value: {},
    }
  );
  let { id, userId } = useParams<{ id: string; userId: string }>();
  const [selectedJobId, setSelectedJobId] = useState<any>(userId);
  const [currentJobData, setCurrentJobData] = useState<any>({});
  const [formError, setFormError] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [allMembers, setAllMembers] = useState<any[] | []>([]);
  const loginUserId = sessionStorage.getItem("userUuid") || "";
  const [seniorityError, setSeniorityError] = useState("");
  //   const [descriptionError, setDescriptionError] = useState("");
  //   const [customTagError, setCustomTagError] = useState("");
  //   const [smeInstructionsError, setSmeInstructionsError] = useState("");
  const [seniority, setSeniority] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [Instructions, setInstructions] = useState("");
  const [tagsData, setTagsData] = useState<any[]>([]);
  const [statusError, setStatusError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [managersDatas, setManagersDatas] = useState<any[]>([]);
  const [showAvailabilityNotifications, setShowAvailabilityNotifications] = useState(false);
  const notificationref = useRef<any>(null);

  // console.log("props",props.isAdd.data.uuid)

  // console.log("id----->",selectedJobId,userId,companyUuid)

  const handleInput = (data: any) => {
    data.value = { ...currentJobData, ...data.value };
    setCurrentJobData(data.value);
    setFormError(false);
  };

  const onChangeSeniority = (event: any) => {
    setFormError("");
    setSeniority(event.target.value);
  };

  const onChipData = (data: any) => {
    setFormError("");
    setTagsData(data);
  };

  const onchangeHiringManagers = (data: any) => {
    setManagersDatas(data);
  };

  const onChangeDescription = (e: any) => {
    setFormError("");
    // setDescriptionError("");
    setJobDescription(e.target.value);
    // if (!e.target.value) {
    //   setDescriptionError("Please enter description");
    // }
  };
  const onChangeInstructions = (e: any) => {
    setFormError("");
    setInstructions(e.target.value);
  };

  useEffect(() => {
    getJobsTeamMember();
    allUsers();
  }, []);

  useEffect(() => {
    if (props.jobId) {
      getJobDetailsId();
      setJobDetailsFormData({
        errors: [],
        isValid: true,
        value: {},
      });
    }
  }, []);

  const getJobDetailsId = () => {
    JobsService.getJobsByUuid(props?.jobId).then((res) => {
      if (res?.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        res.job_due_dt = moment(res?.job_due_dt).format("YYYY-MM-DD");
        setCurrentJobData({ ...res });
        // setJobDescription(res?.job_description);
        // setInstructions(res?.instructions_to_sme);
      }
    });
  };

  const getJobsTeamMember = () => {
    JobsService.getJobsTeamMembers(selectedJobId).then((res) => {
      if (res.error) {
        toast.error(res?.error?.message);
      } else {
        res.forEach((element: any) => {
          element.fullName = `${element?.user_firstname} ${element?.user_lastname} `;
        });
        const team = res?.filter((data: any) => data?.type === 1);
        const hr = res?.filter((data: any) => data?.type === 2);
        const teamMembers: any = [];
        const hrMembers: any = [];
        team.forEach((element: any) => {
          teamMembers.push(element?.user_uuid);
        });
        hr.forEach((element: any) => {
          hrMembers.push(element?.user_uuid);
        });
        setSelectedTeamMeber([...teamMembers]);
        setSelectedHiringManager([...hrMembers]);
        setSelectedTeamMeberList([...team]);
        setSelectedHiringManagerList([...hr]);
      }
    });
  };

  const allUsers = () => {
    setLoading(true);
    UsersService.getUsers(companyUuid, "").then((res) => {
      if (res.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        setLoading(false);
        res.forEach((element: any) => {
          element.fullName = `${element?.user_firstname} ${element?.user_lastname} `;
          element.label = `${element?.user_firstname} ${element?.user_lastname}`;
          element.value = element?.uuid;
        });
        const data = res.filter((data: any) => loginUserId !== data?.uuid);
        setAllMembers([...data]);
      }
    });
  };

  const onSelectTeamMember = (selectedList: any) => {
    const teamMembers: any = selectedTeamMeber;
    selectedList.map((teamMember: any) => {
      teamMembers.push(teamMember?.uuid);
    });
    setSelectedTeamMeberList([...selectedList]);
    setSelectedTeamMeber([...teamMembers]);
  };

  const onRemoveTeamMember = (selectedList: any, removedItem: any) => {
    const teamMembers: any = [];
    selectedList.map((teamMember: any) => {
      teamMembers.push(teamMember?.uuid);
    });
    setSelectedTeamMeberList([...selectedList]);
    setSelectedTeamMeber([...teamMembers]);
  };

  const onSelectHiringManager = (selectedList: any) => {
    setSelectedHiringManager([...selectedList]);
  };

  const onRemoveHiringManager = (selectedList: any, removedItem: any) => {
    const hrManagers: any = [];
    selectedList.map((hrManager: any) => {
      hrManagers.push(hrManager?.uuid);
    });
    setSelectedHiringManagerList([...selectedList]);
    setSelectedHiringManager([...hrManagers]);
  };

  const onChangeStatus = (event: any) => {
    setSelectedStatus(event.target.value);
    setFormError("");
  };

  const createJob = () => {
    setIsJobDetails(true);
    if (!jobDetailsFormData.isValid) {
      setFormError("Mandatory fields are not filled");
      return;
    }

    if (props.jobId) {
      const tags = tagsData.length > 0 ? tagsData.toString() : "";
      let addingData: any = {};
      console.log("currentJobData", currentJobData);

      addingData = { ...currentJobData, ...jobDetailsFormData.value };
      const preparedData = { ...addingData, tags };
      preparedData.team_members = selectedTeamMeber;
      preparedData.hr_managers = selectedHiringManager;
      preparedData.status = preparedData.status ? preparedData.status : "draft";
      preparedData.positions = Number(preparedData.positions);
      props.onSave(preparedData);
    } else {
      const tags = tagsData.length > 0 ? tagsData.toString() : "";
      const preparedData = { ...jobDetailsFormData.value, tags };
      preparedData.team_members = selectedTeamMeber;
      preparedData.hr_managers = selectedHiringManager;
      preparedData.positions = Number(preparedData.positions);
      preparedData.status = preparedData.status ? preparedData.status : "draft";
      props.onSave(preparedData);
    }
  };

  const onShowAvailabilityNotification = () => {
    setShowAvailabilityNotifications(!showAvailabilityNotifications);
    // setShowNotifications(true);
    // setShowProfile(false);
}

  return (
    <>
      {loading && <AppLoader loading={loading}></AppLoader>}
      <FormBuilder
        onUpdate={setJobDetailsFormData}
        showValidations={isJobDetails}
      >
        <form>
          <div className="container-fluid">
            <div className="row mt-5">
              <div className="col-md-6 mb_22 pe-lg-5">
                <label className="input">
                  <input
                    type="text"
                    className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field"
                    id="jobTitle"
                    name="job_title"
                    placeholder="Job Title *"
                    data-validate-required="Please enter job title"
                    defaultValue={currentJobData?.job_title}
                  />
                  <span className={`input__label input__label_disabled`}>
                    Job Title<span className="text-danger">*</span>
                  </span>
                </label>
              </div>
              <div className="col-md-6 mb_22 ps-lg-3">
                <label className="input">
                  <select
                    className="form-select job_dis_form_control px-3 rounded manual_profile_padding down_arrow_bg_img input__field"
                    // aria-label="Default select example"
                    name="status"
                    value={currentJobData?.status}
                    onChange={(event) => onChangeStatus(event)}
                    // onBlur={() =>
                    //   autoSaveJob(
                    //     currentJobData?.status
                    //       ? currentJobData?.status
                    //       : "draft"
                    //   )
                    // }
                  >
                    <option value="draft" selected>
                      Draft
                    </option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                  <span className="input__label">
                    Status <span className="text-danger">*</span>
                  </span>
                </label>
              </div>
              <div className="col-md-6 mb_22 pe-lg-5">
                <label className="input">
                  <input
                    type="number"
                    className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field"
                    id="positions"
                    name="positions"
                    placeholder="Positions *"
                    data-validate-required="Please enter positions"
                    defaultValue={currentJobData?.positions}
                  />
                  <span className={`input__label input__label_disabled`}>
                    Positions<span className="text-danger">*</span>
                  </span>
                </label>
              </div>
              <div className="col-md-6 mb_22 ps-lg-3">
                <label className="input">
                  <input
                    type="text"
                    className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field"
                    id="location"
                    name="location"
                    placeholder="Location *"
                    data-validate-required="Please enter location"
                    defaultValue={currentJobData?.location}
                  />
                  <span className={`input__label input__label_disabled`}>
                    Location<span className="text-danger">*</span>
                  </span>
                </label>
              </div>

              <div className="col-md-6 col-12 mb_22 pe-lg-5">
                <label className="input">
                  <select
                    className="form-select job_dis_form_control px-3 rounded manual_profile_padding down_arrow_bg_img input__field"
                    name="seniority_code"
                    onChange={(event) => onChangeSeniority(event)}
                    value={currentJobData.seniority_code}
                  >
                    <option value={""} selected>
                      Select Seniority level
                    </option>
                    <option value={"Trainee"}>Trainee</option>
                    <option value={"Junior"}>Junior</option>
                    <option value={"Middle"}>Middle</option>
                    <option value={"Senior"}>Senior</option>
                  </select>
                  <span className={`input__label input__label_disabled`}>
                    Seniority<span className="text-danger">*</span>
                  </span>
                </label>
              </div>
              <div className="col-md-6 mb_22 ps-lg-3">
                <label className="input">
                  <input
                    type="date"
                    className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field"
                    min={moment().add(1, "day").format("YYYY-MM-DD")}
                    id="dueDate"
                    name="job_due_dt"
                    placeholder="Due Date *"
                    data-validate-required="Please enter due date"
                    defaultValue={currentJobData?.job_due_dt}
                  />

                  <span className={`input__label input__label_disabled`}>
                    Due Date<span className="text-danger">*</span>
                  </span>
                </label>
              </div>
              <div className="col-md-6 mb_22 pe-lg-5">
                <label className="input">
                  <textarea
                    className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field"
                    id="description"
                    name="job_description"
                    placeholder="Description *"
                    style={{ paddingTop: "15px" }}
                    defaultValue={currentJobData.job_description}
                    onChange={(e) => onChangeDescription(e)}
                  ></textarea>
                  <span className={`input__label input__label_disabled`}>
                    Description<span className="text-danger">*</span>
                  </span>
                </label>
              </div>
              <div className="col-md-6 mb_22 ps-lg-3">
                <div className="row">
                  <div className="col-md-10 col-9">
                    {/* <ChipInput
                      type={"text"}
                      placeholder="Add Custom Tags *"
                      isOutside={true}
                      outSideText={""}
                      getChipsFieldData={(data) => onChipData(data)}
                    ></ChipInput> */}
                    {currentJobData?.tags && (
                      <ChipInput
                        type={"text"}
                        placeholder="Add Custom Tags"
                        items={currentJobData?.tags}
                        isOutside={true}
                        outSideText={""}
                        getChipsFieldData={(data) => onChipData(data)}
                      ></ChipInput>
                    )}
                    {!currentJobData?.tags && (
                      <ChipInput
                        type={"text"}
                        placeholder="Add Custom Tags"
                        items={currentJobData?.tags}
                        isOutside={true}
                        outSideText={""}
                        getChipsFieldData={(data) => onChipData(data)}
                        isAdd={true}
                      ></ChipInput>
                    )}
                  </div>
                  <div className="col-md-2 mt-2 mt-lg-1 col-3 text-end pe-3 pe-lg-4">
              
                    {/* <img
                      src={ADD_ICON}
                      alt="info icon"
                      className="ps-lg-3 ps-4" 
                    /> */}
                    
                    <span className=" sx-text-primary pointer mobile_info position-relative" onClick={() => onShowAvailabilityNotification()} onMouseLeave={() => setShowAvailabilityNotifications(false)} onMouseEnter={onShowAvailabilityNotification}><img
                      src={INFO_ICON}
                      alt="info icon"
                      className=" mobile_info  pt-1 "
                    /></span>
                  </div>
                  <div className='position-relative'>
                                                {showAvailabilityNotifications && <div onMouseEnter={onShowAvailabilityNotification} className='rounded-3 availability_modal ' ref={notificationref} onMouseLeave={() => setShowAvailabilityNotifications(false)} style={{
                                            zIndex: 999, top:"-7px"
                                        }}>
                                                    <div className='row '>
                                                        <div className='col-md-12 top_para_styles mt-2 mb-2 pt-3 ps-4 px-lg-3'>
                                                            <p className='availability_tooltip_fontsize'> You can add custom tags to jobs to be able to identify them easily and filter jobs based on the tags. E.g. Particular team in a client company, Partner name who referred the job etc.</p>
                                                        </div>
                                                    </div>


                                                </div>}

                                            </div>
                  
                </div>
              </div>
              {/* {customTagError && (
                <p className="text-danger job_dis_form_label">
                  {customTagError}
                </p>
              )} */}
              <div className="col-md-12 mb_22">
                <label className="input">
                  <textarea
                    className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field"
                    // style={{ boxShadow: "none", height: "99px" }}
                    id="InstructionstoSMEs"
                    name="instructions_to_sme"
                    placeholder="Instructions to SMEs *"
                    style={{ paddingTop: "15px" }}
                    defaultValue={currentJobData?.instructions_to_sme}
                    onChange={(e) => onChangeInstructions(e)}
                  ></textarea>
                  <span className={`input__label input__label_disabled`}>
                    Instructions to SMEs<span className="text-danger">*</span>
                  </span>
                </label>
                {/* {smeInstructionsError && (
                  <p className="text-danger job_dis_form_label">
                    {smeInstructionsError}
                  </p>
                )} */}
              </div>

              <div className="col-md-6 col-12 mb_22 pe-lg-5">
                <Select
                  isMulti={true}
                  value={selectedTeamMeberList}
                  placeholder=" Add team members to this project"
                  onChange={(e) => onSelectTeamMember(e)}
                  options={allMembers}
                  className="search_dropdown"
                />
              </div>

              <div className="col-md-6 col-12  mb_22 ps-lg-3">
                {/* <Select
                  isMulti={true}
                  //   value={selectedTeamMeberList}
                  placeholder="  Add Hiring Manager To This Project"
                  //   onChange={(e) => onSelectHiringManager(e)}
                  //   options={allMembers}
                  className="search_dropdown"
                /> */}

                <ChipInput
                  type={"email"}
                  placeholder="Add Hiring Manager To This Project"
                  // items={currentJobData?.managersDatas}
                  // isOutside={true}
                  // outSideText={""}
                  getChipsFieldData={(data) => onchangeHiringManagers(data)}
                ></ChipInput>
              </div>
            </div>
          </div>
        </form>
      </FormBuilder>
      {/* <div className="row">
        <div className="col-md-12 mb_22">
          <div className="text-end mt-4">
            <button
              className="large_btn_apply rounded"
              type="button"
              onClick={() => createJob()}
            >
              Save & Next
            </button>
            {formError && (
              <p className="text-danger job_dis_form_label">{formError}</p>
            )}
          </div>
        </div>
      </div> */}
      <div
        className="position-absolute px-3 px-lg-5 bottom-30 bottom-sm-20"
        style={{ width: "100%", left: 0 }}
      >
        <div className="text-end mt-5 mt-lg-0 mt-sm-4 pe-2">
          {formError && (
            <small className="text-danger me-3">
              Mandatory fields are not filled
            </small>
          )}
          <button
            className="large_btn_apply rounded me-2"
            type="button"
            onClick={() => createJob()}
          >
            Save & Next
          </button>
        </div>
      </div>
    </>
  );
};
