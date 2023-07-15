import React, { SyntheticEvent, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SmeService } from '../../../../app/service/sme.service';
import { LookUpService } from '../../../../app/service/lookup.service';
import { UsersService } from '../../../../app/service/users.service';
import { S3Helper } from '../../../../app/utility/s3-helper';
import { toast } from 'react-toastify';
import { CLOUDFRONT_URL, linkedInClientId } from '../../../../config/constant';
import { CompanyService } from '../../../../app/service/company.service';
import { AppLoader } from '../../../../components/loader';
import { countryCodeValidations, emialValidations, linkedinValidations, nameValidations, paypalFieldValidations } from '../../../../app/utility/form-validations';
import { connect, useDispatch } from 'react-redux';
import { UserData } from '../../../../redux/actions';
import Profile from "../../../../assets/images/profile.png";
import { Modal } from 'react-bootstrap';
import videoIcon from '../../../../assets/icon_images/Video Icon.png'
import Delete from "../../../../assets/icon_images/delete.svg";
import OpenCV from "../../../../assets/icon_images/Open CV.png";
import AddUpdateSmeSkills from '../../../../components/sme/add-update-skills';
import { PreparedSkill } from '../../../../app/model/skills/prepared-skill';
import { SXSkill } from '../../../../app/model/skills/sx-skill';
import { SXUserSkill } from '../../../../app/model/skills/user-skill';
import { DataTable } from '../../../../components/data-table';
import { SkillDataGridCols } from './data-grid-cols';
import { AddUpdatePersonalInfo } from '../../../../components/sme/add-update-personal-info';
import { NavMenuTabs } from '../../../../components/menus/nav-menu-tabs';
import TimezoneSelect from 'react-timezone-select';
import { useHistory } from 'react-router'
import Pageheader from '../../../../components/page-header';
import UPLOAD_ICON from "./../../../../assets/icon_images/Upload CV.svg";
import ReactTooltip from "react-tooltip";
import { ACCOUNT_STATUS } from '../../../../app/utility/app-codes';

interface Props {
  UserDataReducer: any;
  userData?: (data: any) => void;
}

const SmeProfile = (props: Props) => {
  const loginUserId = sessionStorage.getItem('userUuid') || '';
  const [companyData, setCompanyData] = useState<any[]>([]);
  const [timeZones, setTimeZones] = useState<any[]>([]);
  const [currentSmeData, setcurrentSmeData] = useState<any>(null);
  const [jobSkills, setJobSkills] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  // const [smeFormData, setSmeFormData] = useState<any>({});
  const [countryesData, setCountryesData] = useState<any[] | []>([]);
  const [profilePicUrl, setProfilePicUrl] = useState<any>('');
  const [resumeUrl, setResumeUrl] = useState<any>('');
  const [experienceList, setExperienceList] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState<any>('');
  const [selectedCountry, setSelectedCountry] = useState<any>('');
  const [selectedTimeZone, setSelectedTimeZone] = useState<any>({});
  const [selectedTitle, setSelectedTitle] = useState<any>('');
  const [selectedCompany, setSelectedCompany] = useState<any>('');
  const [userPaymentData, setUserPaymentData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [isProfileFormEdit, setIsProfileFormEdit] = useState<any>(true);
  const [isSkillFormEdit, setIsSkillFormEdit] = useState<any>(true);
  const [isRateFormEdit, setIsRateFormEdit] = useState<any>(true);
  const loginUserUuid = sessionStorage.getItem('userUuid') || '';
  const [enteredCategory, setEnteredCategory] = useState("");
  const [showAcceptPopup, setShowAcceptPopup] = useState(false);
  const [isCategoryAdd, setIsCategoryAdd] = useState(false);
  const [addAnotherCategory, setAddAnotherCategory] = useState<any>([{
    category: '',
    skills: [],
    candidateSkills: [
      {
        skill: '',
        experience: '',
        proficiency: ''
      }
    ]
  }]);
  const [videoUrlError, setVideoUrlError] = useState<any>('');
  const [costPerInterviewError, setCostPerInterviewError] = useState<any>('');
  const [paypalFirstNameError, setPaypalFirstNameError] = useState<any>('');
  const [paypalLastNameError, setPaypalLastNameError] = useState<any>('');
  const [paymentIdError, setPaymentIdError] = useState<any>('');
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<any>("");
  const [sxSkills, setSxSkills] = useState<SXSkill[]>([]);
  const [expertSkills, setExpertSkills] = useState<SXUserSkill[]>([]);
  const [advancedSkills, setAdvancedSkills] = useState<SXUserSkill[]>([]);
  const [basicSkills, setBasicSkills] = useState<SXUserSkill[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [hasAvailability, setHasAvailability] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const history = useHistory();

  const tabs = [
    {
      label: 'Basic Details',
      path: 0
    },
    {
      label: 'Skills',
      path: 1
    },
    {
      label: 'Payment Settings & Introduction Video',
      path: 2
    }
  ]
  useEffect(() => {
    const experience = [];
    for (let index = 1; index <= 30; index++) {
      experience.push(index);
      setExperienceList([...experience])
    }
    getCountry();
    getCompanys();
    getCategories();
    getSMESkills();
    getPaymentMethod();
    getAllSkills();
    getAvailability();
  }, []);

  useEffect(() => {

    if (showAcceptPopup && activeStep === 2) {
      // renderPaypalButton();
    }
  }, [activeStep, showAcceptPopup]);

  const getAvailability = () => {
    SmeService.getAvailability().then(
      res => {
        setHasAvailability(res.length > 0);
      }
    )
  }

  // const getAllSkills = async () => {
  //   const result = await LookUpService.getAllSkills();
  //   setSxSkills(result);
  // };

  const getAllSkills = async () => {
    // setSxSkills(result);
    LookUpService.getAllSkills()
      .then(
        res => {
          res.forEach((element: any) => {
            element.label = `${element?.skill}`;
            element.value = element.skill
          });
          setSxSkills([...res])
        }
      )
  };
  const getCountry = () => {
    LookUpService.getCountry().then(
      res => {
        // setCountryesData(res);
        // if (loginUserId) {
        //   getSemProfile(res);
        // }
        res.forEach((element: any) => {
          element.label = `${element?.name}`;
          element.value = element?.code;
        });
        setCountryesData([...res]);
        if (loginUserId) {
          getSemProfile(res);
        }
      }
    )
  }



  const getSemProfile = (countryesDataList: any) => {
    setcurrentSmeData({});
    setLoading(true);
    SmeService.getSmeProfileById(loginUserId).then(res => {
      if (res.error) {
        toast.error(res?.error?.message);
        setLoading(false);
      } else {
        setcurrentSmeData({ ...res });
        if (res.user_image) {
          res.user_image = res.user_image.replace(CLOUDFRONT_URL + '/', '');
        }
        if (res.resume_url) {
          res.resume_url = res.resume_url.replace(CLOUDFRONT_URL + '/', '');
        }
        setResumeUrl(res?.resume_url);

        setProfilePicUrl(res?.user_image)
        const country = countryesDataList.find((data: any) => data?.code === res?.country_code);
        if (country) {
          setSelectedCountry(country);
        }
        setSelectedTimeZone({ value: res?.time_zone });
        setSelectedTitle(res?.expert_title);
        setSelectedCompany(res?.current_company);
        setLoading(false);
        if (props.userData) {
          dispatch(props.userData(res));
        }
      }
    })
  }

  const editButtonClick = (): void => {
    setShowAcceptPopup(true);

  }
  const getSMESkills = () => {
    setJobSkills([]);
    setLoading(true);
    const data: any = [];
    SmeService.getSmeSkillsById(loginUserId).then(res => {
      if (res.error) {
        toast.error(res?.error?.message);
        setLoading(false);
      } else {
        if (res.length > 0) {
          res.forEach((element: any) => {
            element.experienceDisplay = `${Number(element?.experience)} yrs`
          });
          const basicSkills = res.filter((el: any) => el.proficiency === 'Basic');
          const advancedSkills = res.filter((el: any) => el.proficiency === 'Advanced');
          const expertSkills = res.filter((el: any) => el.proficiency === 'Expert');

          setBasicSkills(basicSkills);
          setAdvancedSkills(advancedSkills);
          setExpertSkills(expertSkills);
        } else {
          setBasicSkills([]);
          setAdvancedSkills([]);
          setExpertSkills([]);
        }
        setLoading(false);
      }
    })
  }
  const getCategories = () => {
    const skillsData = addAnotherCategory;
    LookUpService.jobcategories().then(
      res => {
        let data: any[] = [];
        res.push('{Add Category}');
        res.forEach((element: any) => {
          data.push({
            value: element,
            label: element
          })
        });
        setCategories([...data]);
        if (isCategoryAdd) {
          skillsData[selectedCategoryIndex].categorysList = { label: enteredCategory, value: enteredCategory };
          skillsData[selectedCategoryIndex].category = enteredCategory;
          setAddAnotherCategory([...skillsData])
        }
      }
    )
  }

  const onUploadProfilePic = async (event: any) => {
    setLoading(true);
    if (event.target.files && event.target.files[0]) {
      UsersService.profilePic({
        type: event.target.files[0]?.type.split('/')[1]
      }).then(async res => {
        if (res?.error) {
          setLoading(false);
          toast.error(res?.error?.message);
        } else {
          const result = await S3Helper.uploadFilesToS3BySigned(res.presignedUrl,
            event.target.files[0],
            event.target.files[0]?.type
          );
          setProfilePicUrl(`${res.fileUrl}`);
          setLoading(false);
          toast.success("Uploaded Successfully");
        }
      })
    }
  }

  const onSave = (smeFormData: any, resetAvailabilityStep?: number) => {
    setLoading(true);
    const loginsData = { ...currentSmeData, ...smeFormData, };
    loginsData.user_uuid = currentSmeData?.user_uuid;
    loginsData.user_image = profilePicUrl;
    loginsData.resume_url = resumeUrl;
    loginsData.user_uuid = loginUserUuid;
    // loginsData.time_zone = selectedTimeZone ? selectedTimeZone?.value : '';
    delete loginsData[''];
    // loginsData.mobile_no = loginsData?.mobile_no ? `${countryCode} ${loginsData?.mobile_no}` : '';
    SmeService.smeProfile(loginsData).then(res => {
      if (res.error) {
        toast.error(res?.error);
        setLoading(false);
      } else {
        getSemProfile(timeZones);
        // setLoading(false);
        getSMESkills();
        setIsProfileFormEdit(true);
        toast.success('Saved successfully');
        switch (resetAvailabilityStep) {
          case 1:
          case 2:
            history.push(`/dashboard/availability?step=${resetAvailabilityStep}`);
            break;
          default:
            setActiveStep(1);
            break;
        }
      }
    });
  }

  const onUploadResume = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const fileType = event.target.files[0]?.type;
      const fileTypeSplit = fileType.split('/');
      const extension: string = fileTypeSplit[fileTypeSplit.length - 1];
      const validExtensions = [
        { value: 'pdf', extension: 'pdf' },
        { value: 'doc', extension: 'msword' },
        { value: 'docx', extension: 'vnd.openxmlformats-officedocument.wordprocessingml.document' }
      ];
      const detectedExtension = validExtensions.find(el => el.extension === extension);
      if (!detectedExtension) {
        toast.error("Invalid file type");
        return;
      }
      setLoading(true);
      UsersService.resumeuploadurl(detectedExtension.value).then(async res => {
        if (res?.error) {
          setLoading(false);
          toast.error(res?.error?.message);
        } else {
          const result = await S3Helper.uploadFilesToS3BySigned(res.presignedUrl,
            event.target.files[0],
            fileType
          );
          setResumeUrl(`${res.fileUrl}`);
          setLoading(false);
          toast.success("Uploaded Successfully");
        }
      })
    }
  };

  const handleCategory = () => {
    const data = addAnotherCategory;
    data.push({
      category: '',
      skills: [],
      candidateSkills: [
        {
          skill: '',
          experience: '',
          proficiency: ''
        }
      ]
    })
    setAddAnotherCategory([...data]);
  }

  const saveSmeSkills = (data: PreparedSkill[]) => {
    setLoading(true)
    const newSkills: SXSkill[] = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const isAlreadyExist = sxSkills.find(el => el.skill === element.skill);
      if (!isAlreadyExist) {
        newSkills.push({
          uuid: '',
          skill: element.skill,
          category: '',
          id: 0,
          created_at: new Date(),
          updated_dt: '',
          created_by: ''
        });
      }
    }

    SmeService.addSmeSkills(data).then(
      res => {
        if (res.error) {
          toast.error(res?.error?.message);
          setLoading(false);
        } else {
          getPaymentMethod();
          getSMESkills();
          toast.success('Saved successfully');
          setActiveStep(2)
          setIsSkillFormEdit(true);
          setLoading(false);
        }
      }
    )
  }
  const getPaymentMethod = () => {
    SmeService.getPaymentMethod().then(
      res => {
        if (res?.error) {
          toast.error(res?.error?.message);
        } else {
          setUserPaymentData({ ...res[0] });
          if (res[0]?.introduction_video_url) {
            res[0].introduction_video_url = res[0]?.introduction_video_url.replace(CLOUDFRONT_URL + '/', '');
          }
          setVideoUrl(res[0]?.introduction_video_url);
        }
      }
    )
  }

  const getCompanys = () => {
    CompanyService.getCompany().then(
      res => {
        setCompanyData(res?.records);
      }
    )
  }

  const onUploadVideo = async (event: any) => {
    setLoading(true);
    setVideoUrl('');
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size >= 102400) {
        const data = {
          type: "mp4"
        }
        UsersService.profileVideoUrl(data).then(async res => {
          if (res?.error) {
            setLoading(false);
            toast.error(res?.error?.message);
          } else {
            const result = await S3Helper.uploadFilesToS3BySigned(res.presignedUrl,
              event.target.files[0],
              event.target.files[0]?.type
            );
            setVideoUrl(`${res.fileUrl}`);
            setLoading(false);
            toast.success("Uploaded Successfully");
          }
        })
      } else {
        setLoading(false);
        setVideoUrlError('Video size must be less than 100mb');
      }
    }
  };

  const onSubmit = () => {
    setLoading(true);
    // const paymentFormData = { ...userPaymentData, ...smeFormData };
    // setActiveStep(0)
    const paymentFormData = { ...userPaymentData };
    paymentFormData.cost_per_interview = Number(paymentFormData.sme_fee)
    paymentFormData.video_url = videoUrl;
    paymentFormData.firstname = paymentFormData?.payment_firstname;
    paymentFormData.lastname = paymentFormData?.payment_lastname;
    if (
      paymentFormData?.cost_per_interview
      && !costPerInterviewError
      // && paymentFormData?.currency
      && paymentFormData?.firstname
      && paymentFormData?.lastname
      && paymentFormData?.payment_id
      && !paymentIdError
      && !paypalFirstNameError
      && !paypalLastNameError
    ) {
      SmeService.paymentMethod(paymentFormData).then(res => {
        if (res.error) {
          setLoading(false);
          toast.error(res?.error?.message)
        } else {
          setLoading(false);
          toast.success("Saved Successfully");
          setIsRateFormEdit(true);
          setShowAcceptPopup(false)
          // history.push('/dashboard/home');
        }
      })
    } else {
      setLoading(false);
      if (!paymentFormData?.cost_per_interview) {
        setCostPerInterviewError('Please enter rate per interview');
      }
      if (!paymentFormData?.firstname) {
        // setPaypalFirstNameError('Please enter the first name as per your paypal account')
        setPaypalFirstNameError(paypalFieldValidations(paymentFormData?.firstName, 'paypal account'));

      }
      if (!paymentFormData?.lastname) {
        // setPaypalLastNameError('Please enter the last name as per your paypal account')
        setPaypalLastNameError(paypalFieldValidations(paymentFormData?.firstName, 'paypal account'));

      }
      if (!paymentFormData?.payment_id || paymentIdError) {
        setPaymentIdError('Please enter paypal email')
      }

    }
  }

  const steps = ['Personal', 'Skills', 'Cost'];

  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleStep = (step: number) => () => {
    setIsProfileFormEdit(true);
    setIsSkillFormEdit(true);
    setIsRateFormEdit(true);
    setActiveStep(step);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const onChangeRatePerInterview = (event: any) => {
    const data = userPaymentData;
    setCostPerInterviewError('');
    if (!event.target.value) {
      setCostPerInterviewError('Please enter rate per interview');
    } else if (event.target.value >= 1001) {
      setCostPerInterviewError('Rate can not be more than $1000');
    } else {
      data.sme_fee = event.target.value;
    }
    setUserPaymentData({ ...data });
  }

  const onChangePaypalFirstName = (event: any) => {
    const data = userPaymentData;
    setPaypalFirstNameError('');
    // if (!event.target.value) {
    //   setPaypalFirstNameError('Please enter the first name as per your paypal account')
    // }
    setPaypalFirstNameError(paypalFieldValidations(event.target.value, ''))

    if (data.payment_firstname.length > 15) {
      setPaypalFirstNameError("Maximum length allowed is 15 characters")
    }

    data.payment_firstname = event.target.value;
    setUserPaymentData({ ...data });
  }

  const onChangePaypalLastName = (event: any) => {
    const data = userPaymentData;
    setPaypalLastNameError('');
    // if (!event.target.value) {
    //   setPaypalLastNameError('Please enter the last name as per your paypal account')
    // }
    setPaypalLastNameError(paypalFieldValidations(event.target.value, ''))

    if (data.payment_lastname.length > 15) {
      setPaypalLastNameError("Maximum length allowed is 15 characters")
    }

    data.payment_lastname = event.target.value;
    setUserPaymentData({ ...data });
  }

  const onChangePaypalId = (event: any) => {
    const data = userPaymentData;
    setPaymentIdError(emialValidations(event.target.value, 'paypal email'))
    data.payment_id = event.target.value;
    setUserPaymentData({ ...data });
  }

  const onSelectTab = (type: number) => {
    setIsProfileFormEdit(true);
    setIsSkillFormEdit(true);
    setIsRateFormEdit(true);
    setActiveStep(type);

  }

  const preventDefaultActions = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const onPageChange = (data: any) => {
    setActivePage(data);
  }

  const renderPaypalButton = () => {
    const paypal = (window as any).paypal;

    paypal.use(['login'], (login: any) => {
      login.render({
        "appid": "AeYmYnBmj2EEwiymi2kA1wubH-rDT6Ik_hUYumTp9NSlhOEpyto1ZpXyUP6Svtb75H15ZVw9VcrSdsgT",
        "scopes": "profile email",
        "containerid": "id_login_with_paypal_btn",
        "responseType": "code",
        "locale": "en-us",
        "buttonType": "CWP",
        "buttonShape": "pill",
        "buttonSize": "lg",
        "fullPage": "true",
        "returnurl": "http://127.0.0.1:3000/dashboard/sme/profile"
      });
    });
  }


  return (
    <div>
      {loading &&
        <AppLoader loading={loading}></AppLoader>
      }
      <div className='container-fluid'>
        <Pageheader title='Profile' subTitle='Tell us about yourself' buttonName='Edit' editButtonClick={editButtonClick} />
        {/* <div className='row ps-3 pe-3 mt-5 mt-3 pe-lg-5 ms-3'>
          <div className='col-8 col-lg-8  mb-2'>
            <h5 className='top_heading_styles'>Profile</h5>
            <p className='top_para_styles'>Tell us about yourself</p>
          </div>
          <div className='col-4 col-lg-4 text-end mt-4'>
            <button className={`${isSkillFormEdit ? 'large_btn_apply' : 'large_btn_reject'} rounded`} onClick={() => editButtonClick()}>{isSkillFormEdit ? 'Edit' : 'Cancel'}</button>
          </div>
        </div> */}
        <div className='row  d-md-none mt-3 d-block'>
          <div className="col-12">
            <NavMenuTabs menuItems={tabs} activeTab={activeStep} onChangeTab={(tab: number | string) => onSelectTab(tab as number)}></NavMenuTabs>
          </div>
        </div>
        <div className='row ps-3 pe-3 pe-lg-5'>
          <div className='col-12 d-none d-md-block'>
            <div className="row">
              <div className='col-md-8'>
                <ul className="nav ms-3">
                  {tabs.map((data: any, index: number) => {
                    return <li key={index} className={`nav-item tab ${data?.path === activeStep ? 'active' : ''}`}>
                      <span className="nav-link text-white all_members_nav_link_font_size nav-hover pointer" onClick={() => onSelectTab(data?.path)}>{data?.label} {data?.count ? (data?.count) : ''}</span>
                    </li>
                  })}
                </ul>
              </div>
              <div className='col-md-4 text-end'>
                {/* <button className={`${isSkillFormEdit ? 'large_btn_apply' : 'large_btn_reject'} rounded`} onClick={() => editButtonClick()}>{isSkillFormEdit ? 'Edit' : 'Cancel'}</button> */}
              </div>
            </div>
          </div>
          <div className='col-md-12'>
            <div className='row rounded-3 bg-white' style={{ minHeight: "430px" }}>
              {activeStep === 0 &&
                <div>
                  <div className='px-4 pb-4'>
                    <div>
                      {/* <FormBuilder onUpdate={handleInput}> */}
                      <form className={`${isProfileFormEdit ? 'form-read-only' : ''} row flex-column-reverse flex-lg-row`} onSubmit={preventDefaultActions}>
                        <div className='col-md-9 mt-5'>
                          <div className='row me-5'>
                            <div className="col-md-6 col-12 padding_rm">
                              <div className="first_name_container">
                                <span className="first_name_title">First Name</span>
                                <p className="first_name_value">{currentSmeData?.user_firstname}</p>
                              </div>
                            </div>
                            <div className="col-md-6 col-12 padding_lm">
                              <div className="first_name_container">
                                <span className="first_name_title">Last Name</span>
                                <p className="first_name_value">{currentSmeData?.user_lastname}</p>
                              </div>
                            </div>
                            <div className="col-md-6 padding_rm">
                              <div className='row'>
                                <div className="first_name_container">
                                  <span className="first_name_title">Phone Number</span>
                                  <p className="first_name_value">{currentSmeData?.mobile_no}</p>
                                </div>
                              </div>
                            </div>

                            <div className="col-md-6 col-12 padding_lm">
                              <div className="first_name_container">
                                <span className="first_name_title">Country</span>
                                <p className="first_name_value">{selectedCountry?.name}</p>
                              </div>
                            </div>
                            <div className="col-md-6 col-12 padding_rm">
                              <div className="first_name_container">
                                <span className="first_name_title">Email</span>
                                <p className="first_name_value">{currentSmeData?.user_email}</p>
                              </div>
                            </div>

                            <div className="col-md-6 col-12 padding_lm">
                              <div className="first_name_container">
                                <span className="first_name_title">LinkedIn URL</span>
                                <p className="first_name_value">{currentSmeData?.linkedin_url}</p>
                              </div>
                            </div>
                            <div className="col-md-6 col-12 padding_rm">
                              <div className="first_name_container">
                                <span className="first_name_title">TimeZone</span>
                                <p className="time_zone_margin">
                                  <TimezoneSelect
                                    value={selectedTimeZone}
                                    isDisabled={true}
                                    className="first_name_value"
                                  /></p>
                              </div>
                            </div>

                            <div className="col-md-6 col-12 padding_lm">
                              <div className="first_name_container">
                                <span className="first_name_title">Current Title</span>
                                <p className="first_name_value">{currentSmeData?.expert_title}</p>
                              </div>
                            </div>
                            <div className="col-md-12 ">
                              <div className="first_name_container">
                                <span className="first_name_title">Current company</span>
                                <p className="first_name_value">{currentSmeData?.current_company || '--Not specified--'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-md-3 text-lg-center'>
                          <div className='row  ms-lg-5 mt-2'>
                            <div className="col-12 mb-3 profile_pic_container">
                              <img src={profilePicUrl ? (profilePicUrl.includes('profile-pics') ? `${CLOUDFRONT_URL}/${profilePicUrl}` : profilePicUrl) : Profile} className='sme_profile' />
                              {!isProfileFormEdit && <div className='position-relative'>
                                <div className="cursor-pointer upload-btn-wrapper mt-2">
                                  <button type="button" className="cursor-pointer upload_btn large_btn_apply me-2">Upload</button>
                                  <input type="file" style={{
                                    border: isProfileFormEdit ? "none" : ""
                                  }} name="myfile" accept="image/png, image/jpeg" onChange={(e) => onUploadProfilePic(e)} />
                                </div>
                              </div>}
                            </div>
                            <div className="col-12 mb-4">
                              <div className='profile_picture_main_div text-center position-relative'>
                                <input
                                  disabled={isProfileFormEdit}
                                  style={{
                                    border: isProfileFormEdit ? "none" : ""
                                  }}
                                  id="upload_file1"
                                  type="file"
                                  name="cover_photo"
                                  accept="application/pdf"
                                  className={`upload_file_input_field ${isProfileFormEdit && 'cursor_default'}`}
                                  onChange={(e) => onUploadResume(e)}
                                />
                              </div>
                              <div>
                                <span className='d-block d-lg-none mb-4 ms-2'>
                                  <div className={`d-flex p-1 align-items-center  border-radius-30 w-25 ${props?.UserDataReducer?.status === ACCOUNT_STATUS.ACTIVE ? 'border_green' : props?.UserDataReducer?.status === ACCOUNT_STATUS.UNDER_VERIFICATION ? 'border_gray' : 'border_dark_gray'}`}>
                                    <div className={`sme_status_dot me-1 ${props?.UserDataReducer?.status === ACCOUNT_STATUS.ACTIVE ? 'bg_green' : props?.UserDataReducer?.status === ACCOUNT_STATUS.UNDER_VERIFICATION ? 'bg_gray' : 'bg_dark_gray'}`}></div>
                                    <div className='notifications_left_line m-0 d-inline-flex pt-0' style={{ color: "white" }}>
                                      {props?.UserDataReducer?.status === ACCOUNT_STATUS.ACTIVE && <span className='color_green'>Active</span>} {props?.UserDataReducer?.status === ACCOUNT_STATUS.UNDER_VERIFICATION && <span className='color_dark_gray mx-sm-w70 text-ellipsis'>Under Verification</span>}{props?.UserDataReducer?.status === ACCOUNT_STATUS.DISABLED && <span className='color_gray'>Disabled</span>}
                                    </div>
                                  </div>
                                </span>
                              </div>
                              {resumeUrl && <a href={`${CLOUDFRONT_URL}/${resumeUrl}`} className="open_cv ps-3 pt-1 pb-1 pe-3 ms-2 ms-lg-0 ms-sm-2" target="_blank">Open CV <img src={OpenCV} className="ps-3 pb-1" alt="opencv" /> </a>}
                            </div>
                          </div>
                        </div>
                      </form>
                      {/* </FormBuilder> */}
                      {/* <div className='row'>
                      <div className='col-md-6'>
                        {!isProfileFormEdit && <button className='large_btn_apply rounded' disabled={isProfileFormEdit} onClick={onSave}>Save</button>}
                        {!isProfileFormEdit && <button className='large_btn_reject rounded ms-3' onClickCapture={() => setIsProfileFormEdit(true)} >Cancel</button>}
                      </div>
                    </div> */}
                    </div>
                  </div>
                </div >
              }
              {activeStep === 1 &&
                <div className='mt-5 px-4 pb-4'>
                  <div>
                    {!isSkillFormEdit && <button type='button' className='link pointer large_btn_apply ' onClick={() => handleCategory()}>Add Another Category</button>}
                  </div>
                  <div className={`row ${!isSkillFormEdit && 'mt-3'}`}>
                    <div className="col-lg-4 col-12">
                      <h5 className="top_heading_styles px-lg-3 mb-3">Expert Skills</h5>
                      <div className='border-end border-end-sm-none'>
                        {expertSkills.length > 0 ?
                          <DataTable TableCols={SkillDataGridCols} tableData={expertSkills} activePageNumber={activePage} pageNumber={onPageChange} isHidePagination={true} ></DataTable>
                          : <p className='px-3 f_12'>No expert skills</p>}
                      </div>
                    </div>
                    <div className="border-bottom my-4 d-block d-md-none"></div>
                    <div className="col-lg-4 col-12">
                      <h5 className="top_heading_styles px-lg-3 mb-3">Advance Skills</h5>
                      <div className='border-end border-end-sm-none'>
                        {advancedSkills.length > 0 ?
                          <DataTable TableCols={SkillDataGridCols} tableData={advancedSkills} activePageNumber={activePage} pageNumber={onPageChange} isHidePagination={true}></DataTable>
                          : <p className='px-3 f_12'>No advance skills</p>}
                      </div>
                    </div>
                    <div className="border-bottom my-4 d-block d-md-none"></div>

                    <div className="col-lg-4 col-12">
                      <h5 className="top_heading_styles px-lg-3 mb-3">Basic Skills</h5>
                      {basicSkills.length > 0 ?
                        <DataTable TableCols={SkillDataGridCols} tableData={basicSkills} activePageNumber={activePage} pageNumber={onPageChange} isHidePagination={true}></DataTable>
                        : <p className='px-3 f_12'>No basic skills</p>}
                    </div>
                  </div>
                </div>
              }
              {activeStep === 2 &&
                <div className='row'>
                  <div className='col-12'>
                    <div className=''>
                      <div className='px-4 pb-lg-4 pb-5 pb-sm-5'>
                        {/* <FormBuilder onUpdate={handleInput}> */}
                        <form className={`${isRateFormEdit ? 'form-read-only' : ''}  mt-5 `}>
                          <div className='row'>
                            <div className="col-md-12 col-12 position-relative" >
                              <div className="first_name_container">
                                <span className="first_name_title">Rate Per Interview</span>
                                <p className="first_name_value">
                                  <span className='dollar_icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-dollar" viewBox="0 0 16 16">
                                      <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z" />
                                    </svg>
                                  </span>
                                  <span className="ms-4">{userPaymentData?.sme_fee}</span>
                                </p>
                              </div>
                            </div>
                            <div className="col-md-4 col-12 ">
                              <div className="first_name_container">
                                <span className="first_name_title">Paypal Email ID</span>
                                <p className="first_name_value">{userPaymentData?.payment_id}</p>
                              </div>
                              {paymentIdError && <p className="text-danger job_dis_form_label">{paymentIdError}</p>}
                            </div>
                            <div className="col-md-4 col-12 ps-lg-2">
                              <div className="first_name_container">
                                <span className="first_name_title">Paypal First Name</span>
                                <p className="first_name_value">{userPaymentData?.payment_firstname}</p>
                              </div>
                            </div>
                            <div className="col-md-4 col-12 ps-lg-2">
                              <div className="first_name_container">
                                <span className="first_name_title">Paypal Last Name</span>
                                <p className="first_name_value">{userPaymentData?.payment_lastname}</p>
                              </div>
                            </div>
                            <div className="my-3 border-bottom "></div>
                            <div className="col-12 mb-3 mt-2">
                              <div>
                                {
                                  videoUrl ?
                                    <video className="recorded_video" controls >
                                      <source src={`${CLOUDFRONT_URL}/${videoUrl}`} type="video/mp4" />
                                    </video> : <small>Intro video not uploaded</small>
                                }

                              </div>
                            </div>
                          </div>
                        </form>
                        {/* </FormBuilder> */}
                        <div className='row'>
                          <div className='col-6'>
                            {!isRateFormEdit && <button disabled={isRateFormEdit} className='large_btn_apply rounded' onClick={onSubmit}>Save</button>}
                            {!isRateFormEdit && <button className='large_btn_reject rounded ms-3' onClickCapture={() => setIsRateFormEdit(true)}>Cancel</button>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showAcceptPopup}
        onHide={() => setShowAcceptPopup(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className='content-size-xl sx-close'
      >
        <Modal.Header closeButton className='p-0'>
          <Modal.Title id="contained-modal-title-vcenter">

          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='p-0'>
          <div className='my-2 px-lg-5 pb-5 px-3' style={{ height: '80vh', overflow: 'hidden', position: 'relative' }}>

            <Stepper nonLinear alternativeLabel activeStep={activeStep} className={`w-50 w-sm-100 m-auto mt-3`}>
              {steps.map((label, index) => (
                <Step key={label} completed={completed[index]}>
                  <StepButton color="inherit" onClick={handleStep(index)}>
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <div className='mb-3 mt-5 mt-lg-0 pe-2' style={{ height: 'calc(100% - 140px)', overflow: 'auto' }}>
              {allStepsCompleted() ? (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleReset}>Reset</Button>
                  </Box>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {activeStep === 0 && <AddUpdatePersonalInfo editTimeZone={false} currentSmeData={currentSmeData} onSave={onSave} resumeUrl={resumeUrl} countryesData={countryesData} profilePicUrl={profilePicUrl} onUploadProfilePic={onUploadProfilePic} onUploadResume={onUploadResume} onProfilePicChanged={(url: string) => { setProfilePicUrl(url) }} enableTimezoneWarning={hasAvailability}></AddUpdatePersonalInfo>}

                  {activeStep === 1 &&
                    <AddUpdateSmeSkills onClose={() => setActiveStep(0)} basicSkills={basicSkills} advancedSkills={advancedSkills} expertSkills={expertSkills} onSave={saveSmeSkills} experienceList={experienceList} allSkills={sxSkills}></AddUpdateSmeSkills>}
                  {activeStep === 2 &&
                    <div className=''>
                      <ReactTooltip place='bottom' type='light' effect='solid' border={true} borderColor={'#707070'} />
                      <p className='top_heading_styles'>Rates and introduction video</p>
                      {/* <span id='id_login_with_paypal_btn'></span> */}
                      <form className={`${isRateFormEdit ? 'form-read-only' : ''} mt-4`}>
                        <div className='row'>
                          <div className="col-md-12 col-12 mb-3 position-relative" >
                            <label className="input">
                              <span className='payment_currency'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-dollar" viewBox="0 0 16 16">
                                  <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z" />
                                </svg>
                              </span>
                              <input type="number" className="form-control job_dis_form_control px-3 rounded manual_profile_padding pl-30 input__field" id="smeRatePerInterview" name="cost_per_interview" placeholder="Rate Per Interview *" onChange={(e) => onChangeRatePerInterview(e)} defaultValue={userPaymentData?.sme_fee} />
                              <span className={`input__label ${isRateFormEdit && 'input__label_disabled'}`} style={{ left: "12px" }}>Rate Per Interview<span className='text-danger'>*</span></span>
                            </label>
                            {costPerInterviewError && <p className="text-danger job_dis_form_label">{costPerInterviewError}</p>}
                          </div>
                          <div className="col-lg-4 col-12 my-3">
                            <label className="input">
                              <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="smePaypalId" name="payment_id" placeholder="Paypal email id *" onChange={(e) => onChangePaypalId(e)} defaultValue={userPaymentData?.payment_id} />
                              <span className={`input__label ${isRateFormEdit && 'input__label_disabled'}`}>Paypal Email ID<span className='text-danger'>*</span></span>
                            </label>
                            {paymentIdError && <p className="text-danger job_dis_form_label">{paymentIdError}</p>}
                          </div>
                          <div className="col-lg-4 col-12 my-3 ps-lg-2">
                            <label className="input">
                              <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="smePaypalFirstName" name="firstname" placeholder="Paypal first name *" onChange={(e) => onChangePaypalFirstName(e)} defaultValue={userPaymentData?.payment_firstname} />
                              <span className={`input__label ${isRateFormEdit && 'input__label_disabled'}`}>Paypal First Name<span className='text-danger'>*</span></span>
                            </label>
                            {paypalFirstNameError && <p className="text-danger job_dis_form_label">{paypalFirstNameError}</p>}
                          </div>
                          <div className="col-lg-4 col-12 my-3 ps-lg-2">
                            <label className="input">
                              <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="smePaypalLastName" name="lastname" placeholder="Paypal last name *" onChange={(e) => onChangePaypalLastName(e)} defaultValue={userPaymentData?.payment_lastname} />
                              <span className={`input__label ${isRateFormEdit && 'input__label_disabled'}`}>Paypal Last Name<span className='text-danger'>*</span></span>
                            </label>
                            {paypalLastNameError && <p className="text-danger job_dis_form_label">{paypalLastNameError}</p>}
                          </div>
                          <div className="my-3 border-bottom "></div>
                          <div className="col-12 mb-3 mt-2">
                            <div className='mb-2'>
                              <p className='top_heading_styles'>
                                Upload an Introduction Video
                              </p>
                            </div>
                            <p style={{ lineHeight: 1.3 }} className='top_para_styles'>
                              Video should cover details like name, technology experience, expertise, passion and past experience around <br />
                              interviewing and hiring technology resources. You can also mention what is unique about yourself, i.e. your USP
                            </p>
                            <div className={`profile_picture_main_div_video text-center position-relative ${videoUrl && 'p-0'}`}>
                              {videoUrl ? <video src={`${CLOUDFRONT_URL}/${videoUrl}`} width="300" height="240" controls></video>
                                : <div> <input
                                  id="upload_file1"
                                  type="file"
                                  name="cover_photo"
                                  // className={`upload_file_input_field ${isRateFormEdit ? 'cursor-not-allowed' : 'cursor_default'}`}
                                  className="cursor_default upload_file_input_field"
                                  accept="video/mp4"
                                  onChange={(e) => onUploadVideo(e)}
                                />
                                  <div className='row'>
                                    <div className='col-md-6 col-6 text-start'>
                                      <ul className='list-inline' style={{ marginTop: "17px" }}>
                                        <li className='upload_img' itemType='file' style={{ fontWeight: "700" }}>Upload a file from your device</li>
                                        <li className='upload_img'>Click here to change the file</li>

                                      </ul>
                                    </div>
                                    <div className='col-md-6 col-6 pe-3 mt-4  mt-lg-4 pe-lg-0 '>
                                      <img src={videoIcon} alt="videoIcon" />
                                    </div>
                                  </div>
                                </div>
                              }
                              {videoUrl && <div className='position-absolute d-flex top-0 end-0 me-2 mt-2'>
                                {isRateFormEdit &&
                                  <img data-tip="Remove video" src={Delete} alt="Delete" className='pointer' onClick={() => setVideoUrl('')} />
                                }
                                {isRateFormEdit && <label htmlFor="upload_file1_videoupload" className='ms-2'><img data-tip="Upload new video" src={UPLOAD_ICON} alt="Delete" className='pointer sx-text-primary' />
                                  <input
                                    // disabled={isRateFormEdit}
                                    id="upload_file1_videoupload"
                                    type="file"
                                    name="cover_photo"
                                    className='d-none'
                                    accept="video/mp4"
                                    onChange={(e) => onUploadVideo(e)}
                                  />
                                </label>}
                              </div>
                              }
                            </div>
                            {videoUrlError && <p className="text-danger job_dis_form_label">{videoUrlError}</p>}
                          </div>
                        </div>
                      </form>
                      {/* </FormBuilder> */}
                      <div className={`row position-absolute px-3 px-lg-5 bottom-30 bottom-sm-20`} style={{ width: '100%', left: 0 }}>
                        <div className='col-6 mt-4 mt-lg-3 mt-sm-4'>
                          <button className='btn-signup rounded' type="button" onClick={() => setActiveStep(1)}>Previous</button>
                        </div>
                        <div className='col-6 text-end mt-4 mt-lg-3 mt-sm-4 pe-2'>
                          <button className='large_btn_apply rounded me-2' type="button" onClick={onSubmit}>Save</button>
                        </div>
                      </div>
                    </div>
                  }
                </React.Fragment>
              )}
            </div>
          </div>
        </Modal.Body>

      </Modal>
    </div >
  )
}

const mapStateToProps = (state: any) => {
  return {
    UserDataReducer: state.UserDataReducer,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    userData: (data: any) => dispatch(UserData(data)),
  }
}

const connectedNavBar = connect(mapStateToProps, mapDispatchToProps)(SmeProfile);
export { connectedNavBar as SmeProfile };
