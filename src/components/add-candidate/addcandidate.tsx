import React, { useEffect, useState, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import UploadCV from "../../assets/icon_images/Upload CV.png";
import OpenCV from "../../assets/icon_images/Open CV.png";
import { CLOUDFRONT_URL } from "../../config/constant";
import {
  countryCodeValidations,
  emialValidations,
  linkedinValidations,
  mobileNumberValidations,
  nameValidations,
} from "../../app/utility/form-validations";
import FormBuilder, { FormBuilderData } from "../../components/form-builder";
import ADD_ICON from "../../assets/icon_images/Add.svg";
import DELETE_ICON from "../../assets/icon_images/delete.svg";
import { LookUpService } from "../../app/service/lookup.service";
import ChipInput from "../../components/chip-input";
import INFO_ICON from "../../assets/icon_images/info icon.svg";
import moment from "moment";


interface Props {
  // countryData: any;
  // skills: any;
  onUploadResume: any;
  resumeUrl: any;
  onSave: (data: any) => void;
}

const Addcandidate: React.FC<Props> = (props: Props) => {
  const [isCandidateSubmitted, setIsCandidateSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [skillError, setSkillError] = useState("");
  const [madatorySkills, setMadatorySkills] = useState<any[] | []>([
    { skill: "", experience: "", proficiency: "" },
  ]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experienceList, setExperienceList] = useState<any[]>([]);
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [mobileNumberCountryCodeError, setMobileNumberCountryCodeError] =
    useState("");
  const [selectedJoiningAvailability, setSelectedJoiningAvailability] =
    useState(3);
  const [countryData, setCountryData] = useState<any[] | []>([]);
  const [tagsData, setTagsData] = useState<any[]>([]);

  const [candidateFormData, setCandidateFormData] = useState<FormBuilderData>({
    errors: [],
    isValid: false,
    value: {},
  });

  const [showAvailabilityNotifications, setShowAvailabilityNotifications] = useState(false);
  const notificationref = useRef<any>(null);

  useEffect(() => {
    const experience = [];
    for (let index = 0; index <= 30; index++) {
      experience.push(index);
      setExperienceList([...experience]);
    }
    loadJobskills();
    loadCountries();
  }, []);

  const loadJobskills = () => {
    LookUpService.getAllSkills().then((res) => {
      setSkills(res);
    });
  };

  const loadCountries = () => {
    LookUpService.getCountry().then((res) => {
      // setCountryesData(res);
      setCountryData(res);
    });
  };

  const onChangeMobileNumber = (event: any) => {
    setMobileNumberError(mobileNumberValidations(event, "mobile number"));
  };

  const onChangeMobileNumberCountryCode = (event: any) => {
    setMobileNumberCountryCodeError(
      countryCodeValidations(event.target.value, "country code")
    );
  };

  const onAddSkills = () => {
    const data: any = madatorySkills;
    data.push({ skill: "", experience: "", proficiency: "" });
    setMadatorySkills([...data]);
  };

  const onChanegMandatorySkill = (e: any, index: number) => {
    const data: any = madatorySkills;
    data[index].skill = e.target.value;
    setMadatorySkills([...data]);
  };

  const onChanegMandatorySkillExperie = (e: any, index: number) => {
    const data: any = madatorySkills;
    data[index].experience = e.target.value;
    setMadatorySkills([...data]);
  };

  const onSelectProficiency = (event: any, index: number) => {
    if (event.target.value) {
      const data = madatorySkills;
      data[index].proficiency = event.target.value;
      setMadatorySkills([...data]);
    }
  };
  const onDeleteSkill = (index: number) => {
    const data = madatorySkills;
    data.splice(index, 1);
    setMadatorySkills([...data]);
  };

  const handleCandidate=()=>{
    
  }


  const createCandidate = () => {
    setIsCandidateSubmitted(true);
    if (!candidateFormData.isValid) {
      setFormError("Mandatory fields are not filled");
      return;
    }
    if (madatorySkills.length <= 0) {
      setFormError("Mandatory fields are not filled");
      setSkillError("Please select skills");
      return;
    }
    const skills_codes = madatorySkills.map((el) => el.skill).toString();
    const skills_exp = madatorySkills.map((el) => el.experience).toString();
    const skills_proficiency = madatorySkills
      .map((el) => el.proficiency)
      .toString();
      const tags = tagsData.length > 0 ? tagsData.toString() : "";

  const preparedData = {
      ...candidateFormData.value,
      skills_codes,
      skills_exp,
      skills_proficiency,
      tags,
    };
    console.log("prepareData", preparedData);
    props.onSave(preparedData);
  };

  const onChipData = (data: any) => {
    setTagsData(data);
  };

  const onShowAvailabilityNotification = () => {
    setShowAvailabilityNotifications(!showAvailabilityNotifications);
    
}

  return (
    <>
      <FormBuilder
        onUpdate={setCandidateFormData}
        showValidations={isCandidateSubmitted}
      >
        <form>
          <form>
            <div className="row">
              <div className="col-12 col-md-6 px-2">
                <div className="mb-4">
                  <label className="input">
                    <input
                      type="text"
                      className="form-control job_dis_form_control rounded manual_profile_padding input__field"
                      placeholder="Name"
                      name="user_firstname"
                      data-validate-required="Please enter your first name"
                      data-validate-name="Special characters are not allowed"
                    />
                    <span className={`input__label`}>
                      First Name
                      <span
                        style={{
                          color: "red",
                          fontSize: "15px",
                          paddingLeft: "5px",
                        }}
                      >
                        *
                      </span>
                    </span>
                  </label>
                </div>
              </div>
              <div className="col-12 col-md-6 px-2">
                <div className="mb-4">
                  <label className="input">
                    <input
                      className="form-control job_dis_form_control rounded manual_profile_padding input__field"
                      placeholder="Name"
                      type="text"
                      name="user_lastname"
                      data-validate-required="Please enter your last name"
                      data-validate-name="Special characters are not allowed"
                    />
                    <span className={`input__label`}>
                      Last Name
                      <span
                        style={{
                          color: "red",
                          fontSize: "15px",
                          paddingLeft: "5px",
                        }}
                      >
                        *
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="col-12 col-md-6 px-2">
                <div className="mb-4">
                  <label className="input">
                    <PhoneInput
                      country={"us"}
                      enableSearch={true}
                      value={""}
                      onChange={(event) => onChangeMobileNumber(event)}
                      inputProps={{
                        name: "mobile_no",
                        placeholder: " ",
                      }}
                    />
                    <span className="custom_label">
                      Phone Number<span className="text-danger">*</span>
                    </span>
                  </label>
                  {mobileNumberError && (
                    <p className="text-danger job_dis_form_label">
                      {mobileNumberError}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-12 col-md-6 px-2">
                <div className="mb-4">
                  <label className="input">
                    <input
                      className="form-control job_dis_form_control rounded manual_profile_padding input__field"
                      placeholder="Email"
                      type="text"
                      name="user_email"
                      data-validate-required="Please enter your email"
                      data-validate-email="email"
                    />
                    <span className={`input__label`}>
                      Email
                      <span
                        style={{
                          color: "red",
                          fontSize: "15px",
                          paddingLeft: "5px",
                        }}
                      >
                        *
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="col-12 col-md-6 px-2">
                <div className="mb-4">
                  <label className="input">
                    <input
                      className="form-control job_dis_form_control rounded manual_profile_padding input__field"
                      placeholder=" "
                      type="text"
                      name="linkedin_url"
                      data-validate-required="Please enter linkedin address"
                      data-validate-linkedin="linkedin"
                    />
                    <span className={`input__label`}>
                      LinkedIn
                      <span
                        style={{
                          color: "red",
                          fontSize: "15px",
                          paddingLeft: "5px",
                        }}
                      >
                        *
                      </span>
                    </span>
                  </label>
                </div>
              </div>
              <div className="col-md-6 px-2">
                <label className="input">
                  <input
                    type="date"
                    className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field"
                    min={moment().add(1, "day").format("YYYY-MM-DD")}
                    id="Availability"
                    name="availability_time"
                    placeholder="Availability"
                    data-validate-required="Please enter availability"
                  />

                  <span className={`input__label input__label_disabled`}>
                  Availability To Join From
                  </span>
                </label>
              </div>

              <div className="col-md-12 col-12 px-2">
                <div className="mb-4">
                  <div className="row">
                    <div className="col-12">
                      {madatorySkills.map((data: any, index: number) => {
                        return (
                          <div className="row mt-2" key={index}>
                            <div className="col-6 pe-2">
                              <label className="input">
                                <select
                                  className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field"
                                  aria-label="Default select example"
                                  onChange={(e) =>
                                    onChanegMandatorySkill(e, index)
                                  }
                                >
                                  <option value="">Select</option>
                                  {skills.map((data: any, index: number) => {
                                    return (
                                      <option key={index} value={data.skill}>
                                        {data.skill}
                                      </option>
                                    );
                                  })}
                                </select>
                                <span className={`input__label`}>
                                  Skill set
                                  <span
                                    style={{
                                      color: "red",
                                      fontSize: "15px",
                                      paddingLeft: "5px",
                                    }}
                                  >
                                    *
                                  </span>
                                </span>
                              </label>
                            </div>
                            <div className="col-2 pe-3 ps-2">
                              <label className="input">
                                <select
                                  className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field"
                                  value={data?.experience}
                                  aria-label="Default select example"
                                  onChange={(e) =>
                                    onChanegMandatorySkillExperie(e, index)
                                  }
                                >
                                  <option value="">Select</option>
                                  {experienceList.map(
                                    (data: any, index: number) => {
                                      return (
                                        <option key={index} value={data}>
                                          {data}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                                <span className={`input__label`}>
                                  Select
                                  <span
                                    style={{
                                      color: "red",
                                      fontSize: "15px",
                                      paddingLeft: "5px",
                                    }}
                                  >
                                    *
                                  </span>
                                </span>
                              </label>
                            </div>
                            <div className="col-2 pe-3">
                              <label className="input">
                                <select
                                  className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field"
                                  value={data?.proficiency}
                                  aria-label="Default select example"
                                  onChange={(e) =>
                                    onSelectProficiency(e, index)
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="Basic">Basic</option>
                                  <option value="Advanced">Advanced</option>
                                  <option value="Expert">Expert</option>
                                </select>
                                <span className={`input__label`}>
                                  Select
                                  <span
                                    style={{
                                      color: "red",
                                      fontSize: "15px",
                                      paddingLeft: "5px",
                                    }}
                                  >
                                    *
                                  </span>
                                </span>
                              </label>
                            </div>
                            <div className="col-2">
                              {index === 0 && (
                                <>
                                  <img
                                    src={ADD_ICON}
                                    alt="add"
                                    className="pointer ms-2 mt-2"
                                    onClick={onAddSkills}
                                  />
                                  <img
                                    src={INFO_ICON}
                                    alt="info icon"
                                    className="ms-3 mt-2 mobile_info"
                                  />
                                </>
                              )}
                              {index > 0 && (
                                <img
                                  src={DELETE_ICON}
                                  alt="delete"
                                  className="pointer ms-3"
                                  onClick={() => onDeleteSkill(index)}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {skillError && (
                    <p className="text-danger job_dis_form_label">
                      {skillError}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-md-12 col-12 px-2">
                <div className="mb-4">
                  <div className="mb-5 mb-lg-4 mb-sm-4 mt-2">
                    <a
                      className="ps-3 pt-1 pb-1 pe-3  upload_cv position-relative"
                      target="_blank"
                    >
                      Upload CV
                      <input
                        id="upload_file1"
                        type="file"
                        name="cover_photo"
                        accept="application/pdf"
                        className={`upload_file_input_field `}
                        onChange={(e) => props.onUploadResume(e)}
                      />
                      <img src={UploadCV} className="ps-3 pb-1" alt="opencv" />
                    </a>
                  </div>
                  <div className="mb-4 mb-lg-0 mb-sm-4">
                    {props.resumeUrl && (
                      <a
                        href={`${CLOUDFRONT_URL}/${props.resumeUrl}`}
                        className="ps-3 pt-1 pb-1 pe-3 open_cv"
                        target="_blank"
                      >
                        Open CV{" "}
                        <img src={OpenCV} className="ps-4 pb-1" alt="opencv" />{" "}
                      </a>
                    )}
                  </div>
                </div>
              </div>
               <div className="row">
              <div className="col-md-11 col-10 px-2">
                <div className="mb-4">
                  <ChipInput
                    type={"text"}
                    placeholder="Add Custom Tags *"
                    items={candidateFormData.value.tags}
                    isOutside={true}
                    outSideText={""}
                    getChipsFieldData={(data) => onChipData(data)}
                    isAdd={true}
                  ></ChipInput>
                </div>
              </div>
              <div className="col-2 col-md-1 text-end pe-0 pe-lg-3">
              <span className=" sx-text-primary pointer  position-relative" onClick={() => onShowAvailabilityNotification()} onMouseLeave={() => setShowAvailabilityNotifications(false)} onMouseEnter={onShowAvailabilityNotification}> <img
                      src={INFO_ICON}
                      alt="info icon"
                      className=" mt-lg-1 pt-1 mt-2 mobile_info "
                    /></span>

              </div>
              <div className='position-relative'>
                                                {showAvailabilityNotifications && <div onMouseEnter={onShowAvailabilityNotification} className='rounded-3 availability_modal ' ref={notificationref} onMouseLeave={() => setShowAvailabilityNotifications(false)} style={{
                                            zIndex: 999, top:"-23px"
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
          </form>
        </form>
      </FormBuilder>
      <div className="text-end pb-4 px-2">
     {/* <div className="position-absolute px-3 px-lg-5 bottom-30 bottom-sm-20 text-end"> */}
        {/* style={{ width: "100%", left: 0 }} */}
        <button
          className="large_btn_apply  rounded-3"
          onClick={() => createCandidate()}
        >
          Save Candidate
        </button>
        {formError && (
          <p className="text-danger job_dis_form_label">{formError}</p>
        )}
      </div>
    </>
  );
};

export default Addcandidate;
