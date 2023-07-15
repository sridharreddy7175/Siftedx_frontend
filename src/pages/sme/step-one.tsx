import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { FormControlError, FormField, FormValidators } from '../../components/form-builder/model/form-field';
import { LookUpService } from '../../app/service/lookup.service';
import { FormValidator } from '../../components/form-builder/validations';
import { SmeService } from '../../app/service/sme.service';
import { CompanyService } from '../../app/service/company.service';
import { S3Helper } from '../../app/utility/s3-helper';
import { toast } from 'react-toastify';
import { UsersService } from '../../app/service/users.service';
import { CLOUDFRONT_URL, linkedInClientId } from '../../config/constant';
import { countryCodeValidations, linkedinValidations, mobileNumberValidations, nameValidations } from '../../app/utility/form-validations';
import { AppLoader } from '../../components/loader';
import { useLinkedIn } from "react-linkedin-login-oauth2";
import LogoImg from "../../assets/images/siftedx_home_logo.png";
import { Box, Step, StepButton, Stepper } from '@mui/material';
import { AddUpdatePersonalInfo } from '../../components/sme/add-update-personal-info';
import { Modal } from 'react-bootstrap';



export const StepOne = () => {
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const [countryesData, setCountryesData] = useState<any[] | []>([]);
  const [smeFormData, setSmeFormData] = useState<any>(null);
  let { user } = useParams<{ user: string }>();
  const [companyData, setCompanyData] = useState<any[]>([]);
  const [profilePicUrl, setProfilePicUrl] = useState<any>('');
  const [resumeUrl, setResumeUrl] = useState<any>('');
  const [selectedCountry, setSelectedCountry] = useState<any>({});
  const [selectedTimeZone, setSelectedTimeZone] = useState<any>('');
  const steps = ['Personal', 'Skills', 'Cost'];
  const [activeStep, setActiveStep] = React.useState(0);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [canShowPopup, setCanShowPopup] = useState(false);

  const handleSubmit = () => {
    setCanShowPopup(false);
    history.push("/home");
    localStorage.setItem('rememberMeData', '');
    sessionStorage.clear();
  }



  useEffect(() => {
    getCompanys();
    getCountry('');
  }, []);

  const getCompanys = () => {
    CompanyService.getCompany().then(
      res => {
        setCompanyData(res?.records);
      }
    )
  }

  const getSemProfile = (timeZones: any, countryes: any) => {
    setLoading(true);
    SmeService.getSmeProfileById(user).then(res => {
      if (res?.error) {
        setLoading(false);
      } else {
        setLoading(false);
        setSmeFormData(res);
        if (res.user_image) {
          res.user_image = res?.user_image?.replace(CLOUDFRONT_URL + '/', '');
        }
        if (res.resume_url) {
          res.resume_url = res?.resume_url?.replace(CLOUDFRONT_URL + '/', '');
        }
        setResumeUrl(res?.resume_url);
        setProfilePicUrl(res?.user_image);
        if (res?.time_zone) {
          setSelectedTimeZone(res?.time_zone);
        }
        setSelectedCountry(res?.country_code);
      }
    })
  }

  const getCountry = (timeZone: any) => {
    LookUpService.getCountry().then(
      res => {
        res.forEach((element: any) => {
          element.label = `${element?.name}`
          element.value = element?.code
        });
        setCountryesData(res);
        if (user) {
          getSemProfile(timeZone, res);
        }
      }
    )
  }

  const onSave = (updatedData: any) => {
    const loginsData: any = { ...updatedData };
    setLoading(true);
    loginsData.user_uuid = user;
    loginsData.user_image = profilePicUrl;
    loginsData.resume_url = resumeUrl;
    loginsData.time_zone = loginsData?.time_zone ? loginsData?.time_zone : selectedTimeZone?.value;
    loginsData.country_code = loginsData.country_code ? loginsData.country_code : selectedCountry;
    console.log(loginsData);

    // loginsData.mobile_no = loginsData?.mobile_no && countryCode ? `${countryCode} ${loginsData?.mobile_no}` : '';
    SmeService.smeProfile(loginsData).then(async res => {
      if (res?.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        toast.success('Saved successfully');
        setLoading(false);
        try {
          let loginUserData: any = JSON.parse(sessionStorage.getItem('loginData') || '{}');
          if (loginUserData.profile_setup_status < 1) {
            await UsersService.updateProfileCompleteStatus(1);
          }
        } catch (profile_step_err) {
          console.error('Error while reading profile states ', profile_step_err);

        }
        history.push(`/sme-step-two/${user}`);
      }
    });
  }

  const onUploadProfilePic = async (event: any) => {
    setLoading(true);
    setProfilePicUrl('');
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size >= 1024) {
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
      } else {
        setLoading(false);
      }
    }
  };
  const onUploadResume = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size >= 1024) {
        const fileType = event.target.files[0]?.type;
        const fileTypeSplit= fileType.split('/');
        const extension: string = fileTypeSplit[fileTypeSplit.length-1];
        const validExtensions = [
          {value:'pdf', extension: 'pdf'},
          {value:'doc', extension: 'msword'},
          {value:'docx', extension: 'vnd.openxmlformats-officedocument.wordprocessingml.document'}
        ];
        const detectedExtension = validExtensions.find(el=>el.extension === extension);
        if(!detectedExtension){
          toast.error("Invalid file type");
          return;
        }
  
        setLoading(true);
        setResumeUrl('');
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
      } else {
        setLoading(false);
      }
    }
  };

  const getUserCredentials = (code: any) => {
    setLoading(true);
    UsersService.getUserCredentials(code).then(data => {
      setSmeFormData({ user_firstname: data?.firstName, user_lastname: data?.lastName, user_email: data?.email });
      setProfilePicUrl(data?.profileImageURL);
      setLoading(false);
    });
  }

  const { linkedInLogin } = useLinkedIn({
    clientId: linkedInClientId,
    redirectUri: `${window.location.origin}/linkedin`,
    onSuccess: (code) => {
      getUserCredentials(code)
    },
    scope: "r_emailaddress r_liteprofile",
    onError: (error) => {
    },
  });

  const onClickHome = () => {
    setShow(true);
    // setShowProfile(false)
  }

  return (
    <div>
      {loading &&
        <AppLoader loading={loading}></AppLoader>
      }
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12' style={{ backgroundColor: "#000000", paddingTop: "10px", paddingBottom: "10px" }}>
            <img src={LogoImg} alt="loading-logo" className='create_company_page_siftedx_log ms-3 ms-lg-5' />

            <button className='text-end mt-3 mt-lg-2 me-4 me-lg-5 dashboard_names rounded-3 large_btn_apply' style={{ float: "right" }} onClick={() => { onClickHome() }}>Logout</button>

          </div>
        </div>
        <div className='px-3 mx-3 mx-lg-5 bg-white rounded-3 mt-3 px-lg-5 pb-5 position-relative' style={{ height: 'calc(100vh - 140px)' }}>
          <Stepper activeStep={activeStep} alternativeLabel className='w-50 w-sm-100 m-auto pt-4'>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepButton color="black">
                    {label}
                  </StepButton>
                </Step>
              );
            })}
          </Stepper>
          <div className='mb-3 mt-5 mt-lg-0' style={{ height: 'calc(100% - 150px)', overflow: 'auto' }}>
            <AddUpdatePersonalInfo currentSmeData={smeFormData} onSave={onSave} resumeUrl={resumeUrl} countryesData={countryesData} editTimeZone={true} profilePicUrl={profilePicUrl} onUploadProfilePic={onUploadProfilePic} onUploadResume={onUploadResume} onProfilePicChanged={(url: string) => { setProfilePicUrl(url) }} enableTimezoneWarning={false}></AddUpdatePersonalInfo>
          </div>
        </div>
        <div className="col-md-12 text-end mt-3">
          <p className="copyright mx-5">Copyright © 2022 SiftedX. All Rights Reserved.</p>
        </div>

        <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter"
          className='sx-close w-100'
          size='sm'

          centered >
          <Modal.Header closeButton>
            <Modal.Title>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body >
            <p className='top_para_styles p-0 m-0 text-center mt-3'>Are you sure you want to logout?</p>
            <div className='row'>
              <div className='col-6 px-3 py-3 mt-3'>
                <button type="button" className="rounded text-decoration-none open_cv ps-3 pt-1 pb-1 pe-3 ms-2 ms-lg-0 ms-sm-2 fw-normal bg-transparent" onClick={() => handleClose()}>Cancel</button>

              </div>
              <div className='col-6 text-end px-3 py-3 mt-3'>
                <button type="button" className="rounded text-decoration-none ps-4 pt-1 pb-1 pe-4 fw-normal upload_cv" onClick={handleSubmit}>Yes</button>

              </div>
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}
