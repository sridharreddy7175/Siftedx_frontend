import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useLinkedIn } from "react-linkedin-login-oauth2";
import PhoneInput from 'react-phone-input-2';
import TimezoneSelect from 'react-timezone-select';
import { UsersService } from '../../app/service/users.service';
import { allCountryMobileNumberValidations, emialValidations, linkedinValidations, nameValidations } from '../../app/utility/form-validations';
import { CLOUDFRONT_URL, linkedInClientId } from '../../config/constant';
import FormBuilder from '../form-builder';
import CAMERA_ICON from './../../assets/icon_images/camara_icon.svg';
import Profile from "./../../assets/images/profile.png";
import UploadCV from "./../../assets/icon_images/Upload CV.png";
import OpenCV from "./../../assets/icon_images/Open CV.png";
import INFO_ICON from '../../assets/icon_images/info icon.svg';
import { Modal } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import Select from "react-select";




interface Props {
    countryesData: any[];
    profilePicUrl: string;
    onUploadProfilePic: (e: any) => void;
    onUploadResume: (e: any) => void;
    resumeUrl: string;
    onSave: (data: any, resetAvailability?: number) => void;
    currentSmeData: any;
    onProfilePicChanged: (url: string) => void;
    editTimeZone: boolean;
    enableTimezoneWarning: boolean;
}

export const AddUpdatePersonalInfo: React.FC<Props> = (props: Props) => {
    const [smeFormData, setSmeFormData] = useState<any>(props?.currentSmeData);
    const [firstNameError, setFirstNameError] = useState<any>('');
    const [lastNameError, setLastNameError] = useState<any>('');
    const [countryError, setCountryError] = useState<any>('Please select the country');
    const [timeZoneError, setTimeZoneError] = useState<any>('Please select the time zone');
    const [linkedInURLError, setLinkedInURLError] = useState<any>('Please enter the link for your linkedIn profile');
    const [phoneNumberError, setPhoneNumberError] = useState<any>('');
    const [currentTitleError, setCurrentTitleError] = useState<any>('Please enter your expert title');
    const [currentcompanyError, setCurrentcompanyError] = useState<any>('');
    const [emailError, setEmailError] = useState("");
    const [selectedCountry, setSelectedCountry] = useState<any>('');
    const [selectedTimeZone, setSelectedTimeZone] = useState<any>({});
    const profilePicFileInput = useRef(null);
    // const [ResumeError, setResumeError] = useState<any>('Please upload your latest resume');
    const [formError, setFormError] = useState<boolean>(false);
    const [isSubmitClicked, setIsSubmitClicked] = useState(false);
    const [showAvailabilityNotifications, setShowAvailabilityNotifications] = useState(false);
    const notificationref = useRef<any>(null);
    const [canshowTimzonePopup, setCanshowTimzonePopup] = useState(false);

   




    useEffect(() => {
        setSmeFormData(props.currentSmeData);
        if (props.currentSmeData) {
            let data=props.countryesData.find((element:any)=>element.code===props.currentSmeData.country_code);
            setSelectedTimeZone(props.currentSmeData.time_zone || '');
            if(data){
                setSelectedCountry({value:data.code,label:data.name});
            }
        }
        setSmeFormData({ ...props.currentSmeData });
    }, [props.currentSmeData]);

    useEffect(() => {
        if (props.resumeUrl) {
            setSmeFormData({ ...smeFormData, resume_url: props.resumeUrl });
        }
    }, [props.resumeUrl]);


    const handleInput = (data: any) => {
        data.value = { ...smeFormData, ...data?.value, }
        setSmeFormData({ ...data.value });
        setFormError(false);
    }

    const getUserCredentials = (code: any) => {
        UsersService.getUserCredentials(code).then(data => {
            const linkedIn: any = { user_firstname: data?.firstName, user_lastname: data?.lastName, user_image: data?.profileImageURL };
            const preparedData = { ...smeFormData, ...linkedIn };
            if (data?.profileImageURL) {
                props.onProfilePicChanged(data.profileImageURL);
            }
            setSmeFormData(preparedData);
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

    const dummyLinkedIn = () => {
        const data = { "firstName": "sanjeev", "lastName": "Bolishetti", "profileImageURL": "https://media-exp2.licdn.com/dms/image/C5603AQGlYnFkHjKnig/profile-displayphoto-shrink_100_100/0/1517286314961?e=1663804800&v=beta&t=rHgPZABXJzuBcXtlkz1zw4001UC2yg8iGdJw9uGDH3c", "email": "sanju8889@gmail.com" };
        const linkedIn: any = { user_firstname: data?.firstName, user_lastname: data?.lastName, user_image: data?.profileImageURL };
        const preparedData = { ...smeFormData, ...linkedIn };
        if (data?.profileImageURL) {
            props.onProfilePicChanged(data.profileImageURL);
        }
        setSmeFormData(preparedData);
    }
    const onMobileNumber = (event: any) => {
        setPhoneNumberError('');
        const smeData = smeFormData
        smeData.mobile_no = event;
        setSmeFormData({ ...smeData });
        if (!event) {
            setPhoneNumberError('Please enter your phone number');
        }
    }

    const onChangeFirstName = (event: any) => {
        setFirstNameError(nameValidations(event.target.value, 'first name'));
        const smeData = smeFormData
        if (smeData.user_firstname.length > 15) {
            setFirstNameError("Maximum length allowed is 15 characters")
        }
        smeData.user_firstname = event.target.value;
        setSmeFormData({ ...smeData });
    }

    const onChangeLastName = (event: any) => {
        setLastNameError(nameValidations(event.target.value, 'last name'));
        const smeData = smeFormData
        if (smeData.user_lastName.length > 15) {
            setFirstNameError("Maximum length allowed is 15 characters")
        }
        smeData.user_lastname = event.target.value;
        setSmeFormData({ ...smeData });
    }

    // const onSelectCountry = (event: any) => {
    //     setCountryError('');
    //     setSelectedCountry(event.target.value);
    //     const smeData = smeFormData
    //     smeData.country_code = event.target.value;
    //     setSmeFormData({ ...smeData });
    //     if (!event.target.value) {
    //         setCountryError('Please select the country');
    //     }
    // }

    const onSelectTimeZone = (event: any) => {
        setTimeZoneError('');
        if (!event) {
            setTimeZoneError('Please select the time zone');
        } else {
            setSelectedTimeZone(event);
        }
        const smeData = smeFormData
        smeData.time_zone = event.value;
        setSmeFormData({ ...smeData });
    }

    const onLinkedIn = (event: any) => {
        setLinkedInURLError(linkedinValidations(event.target.value, 'linkedIn'));
        const smeData = smeFormData
        smeData.linkedin_url = event.target.value;
        setSmeFormData({ ...smeData });
    }

    const onExpertTitle = (event: any) => {
        setCurrentTitleError(nameValidations(event.target.value, 'expert title'))
        const smeData = smeFormData
        smeData.expert_title = event.target.value;
        setSmeFormData({ ...smeData });
    }
    const preventDefaultActions = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }
    const clickProfilepicInput = () => {
        const target: any = profilePicFileInput.current;
        if (target) {
            target.click();
        }
    }


    const onShowAvailabilityNotification = () => {
        setShowAvailabilityNotifications(true)
        // setShowNotifications(true);
        // setShowProfile(false);
    }

    const onClickSave = () => {
        setIsSubmitClicked(true);
        if (smeFormData?.user_firstname
            && smeFormData?.user_lastname
            && smeFormData?.country_code
            && smeFormData?.linkedin_url
            && smeFormData?.expert_title
            && smeFormData?.mobile_no &&
            !firstNameError &&
            !lastNameError
        ) {
            if (smeFormData.time_zone !== props.currentSmeData.time_zone && props.enableTimezoneWarning) {
                setCanshowTimzonePopup(true);
            } else {
                props.onSave(smeFormData);
            }
        } else {
            setFormError(true);
        }

    }

    const onSelectCountry = (selectedList: any) => {
        setCountryError('');
        setSelectedCountry(selectedList)
        const smeData = smeFormData
        smeData.country_code = selectedList.code;
        setSmeFormData({ ...smeData });
     if (!selectedList.code) {
            setCountryError('Please select the country');
        }
        
      };

    const goToAvailability = (resetStep: number): void => {
        props.onSave(smeFormData, resetStep);
    }

    useEffect(() => {
        ReactTooltip.rebuild();
    }, []);

    const isClearable=()=>{
        setSelectedCountry('')
    }

   

    return (
        <>
            <ReactTooltip place='bottom' type='light' effect='solid' border={true} borderColor={'#707070'} />
            <div className=''>
                <h6 className='top_heading_styles'>Tell us about yourself</h6>
                <div>
                    <button onClick={linkedInLogin} className="connect_linkedin_btn_profile me-3">Fetch Information from LinkedIn</button>
                    <span data-tip="We will fetch first name, last name and profile picture." className=" h-100 sx-text-primary pointer ps-0 position-relative"><img src={INFO_ICON} alt="info icon" className="ps-1 mobile_info" /></span>
                </div>
            </div>

            <FormBuilder onUpdate={handleInput}>
                <form className={`form-read-only row flex-column-reverse flex-lg-row`} onSubmit={preventDefaultActions}>
                    <div className='col-lg-9 mt-4'>
                        <div className='row me-lg-5'>
                            <div className="col-lg-6 col-12 mb_22 pe-lg-5">
                                <label className="input">
                                    <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="smeFirstName" name="user_firstname" placeholder="First Name *" value={smeFormData?.user_firstname} onInput={(e) => onChangeFirstName(e)} />
                                    <span className={`input__label input__label_disabled`}>First Name<span className='text-danger'>*</span></span>
                                </label>
                                {isSubmitClicked && firstNameError && <small className="text-danger job_dis_form_label">{firstNameError}</small>}
                            </div>
                            <div className="col-lg-6 col-12 mb_22 ps-lg-3">
                                <label className="input">
                                    <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="smeLastName" name="user_lastname" placeholder="Last Name *" value={smeFormData?.user_lastname} onInput={(e) => onChangeLastName(e)} />
                                    <span className={`input__label input__label_disabled`}>Last Name<span className='text-danger'>*</span></span>
                                </label>
                                {isSubmitClicked && lastNameError && <small className="text-danger job_dis_form_label">{lastNameError}</small>}
                            </div>
                            <div className="col-lg-6 mb_22 pe-lg-5">
                                <div className='row'>
                                    <label className="input">
                                        <PhoneInput
                                            country={"us"}
                                            enableSearch={true}
                                            value={smeFormData?.mobile_no}
                                            onChange={(phone: any) => onMobileNumber(phone)}
                                            inputProps={{
                                                name: 'mobile_no',
                                                placeholder: ' '
                                            }}
                                        />
                                        <span className='custom_label'>Phone Number<span className='text-danger'>*</span></span>
                                    </label>
                                    {/* {isSubmitClicked && (!smeFormData.mobile_no || phoneNumberError) && <small className="text-danger job_dis_form_label">{phoneNumberError || 'Please enter your phone number'}</small>} */}
                                    {isSubmitClicked && (!smeFormData.mobile_no || phoneNumberError) && <small className="text-danger job_dis_form_label">{phoneNumberError}</small>}

                                </div>
                            </div>

                            <div className="col-lg-6 col-12 mb_22 ps-lg-3">
                                <label className="input">
                           
                                    <Select
                                        value={selectedCountry}
                                        placeholder="Select Country"
                                        onChange={(e) => onSelectCountry(e)}
                                        options={props.countryesData}
                                        className="input__field"
                                        isClearable={true}
                                    />
                                    <span className={`input__label input__label_disabled`}>Country<span className='text-danger'>*</span></span>
                                </label>
                                {isSubmitClicked && !smeFormData.country_code && <small className="text-danger job_dis_form_label">{countryError}</small>}
                            </div>
                            <div className="col-lg-6 col-12 mb_22 pe-lg-5">
                                <label className="input">
                                    <input type="text" className="form-control job_dis_form_control px-3 rounded input__field" id="WorkEmail" placeholder="Enter email *" value={smeFormData?.user_email} disabled />
                                    <span className={`input__label input__label_disabled`}>Email<span className='text-danger'>*</span></span>
                                </label>
                                {isSubmitClicked && (!smeFormData.user_email || emailError) && <small className="text-danger job_dis_form_label">{emailError}</small>}

                            </div>

                            <div className="col-lg-6 col-12 mb_22 ps-lg-3">
                                <label className="input disabled-input">
                                    <TimezoneSelect
                                        value={selectedTimeZone}
                                        onChange={(e) => onSelectTimeZone(e)}

                                        // isDisabled={props.editTimeZone}
                                        className="input__field"
                                    />
                                    <span className={`input__label input__label_disabled`}>Time Zone<span className='text-danger'>*</span></span>
                                </label>
                                {isSubmitClicked && !smeFormData.time_zone && <small className="text-danger job_dis_form_label">{timeZoneError}</small>}
                            </div>
                            <div className="col-lg-6 col-12 mb_22 pe-lg-5">
                                <label className="input">
                                    <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="linkedin_url" name="linkedin_url" placeholder="LinkedIn URL *" value={smeFormData?.linkedin_url} onInput={(e) => onLinkedIn(e)} />
                                    <span className={`input__label input__label_disabled`}>LinkedIn URL<span className='text-danger'>*</span></span>
                                </label>
                                {isSubmitClicked && (!smeFormData.linkedin_url) && <small className="text-danger job_dis_form_label">{linkedInURLError}</small>}

                                {/* {isSubmitClicked && (!smeFormData.linkedin_url || linkedInURLError) && <small className="text-danger job_dis_form_label">{linkedInURLError || 'Enter linkedin url'}</small>} */}
                            </div>
                            <div className="col-12 col-lg-6 ps-lg-3 mb_22">
                                <label className="input">
                                    <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="expert_title" name="expert_title" placeholder="Current title *" value={smeFormData?.expert_title} onInput={(e) => onExpertTitle(e)} />
                                    <span className={`input__label input__label_disabled`}>Current Title<span className='text-danger'>*</span></span>
                                </label>
                                {isSubmitClicked && (!smeFormData.expert_title) && <small className="text-danger job_dis_form_label">{currentTitleError}</small>}

                                {/* {isSubmitClicked && (!smeFormData.expert_title || currentTitleError) && <small className="text-danger job_dis_form_label">{currentTitleError || 'Please enter expert title'}</small>} */}

                            </div>
                            <div className="col-12 mb_22">
                                <label className="input">
                                    <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="current_company" name="current_company" placeholder="Company name" value={smeFormData?.current_company} />
                                    <span className={`input__label input__label_disabled`}>Current company</span>
                                </label>
                                {currentcompanyError && <small className="text-danger job_dis_form_label">{currentcompanyError}</small>}
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3 text-lg-center'>
                        <div className='ms-lg-5 mt-4'>
                            <div className='profile_picture_main_div d-lg-flex justify-content-lg-center w-100'>
                                <div className='d-flex align-items-end justify-content-center' style={{
                                    backgroundImage: `url(${props.profilePicUrl ? (props.profilePicUrl.includes('http') ? props.profilePicUrl : `${CLOUDFRONT_URL}/${props.profilePicUrl}`) : Profile})`,
                                    width: `160px`,
                                    height: `160px`,
                                    backgroundSize: 'cover',
                                    borderRadius: '50%'
                                }}>
                                    <img src={CAMERA_ICON} alt="profile" className="pointer pb-1" title='Upload New Image' onClick={clickProfilepicInput} />
                                    <input ref={profilePicFileInput} type="file" name="myfile" accept="image/png, image/jpeg" className="d-none" onChange={(e) => props.onUploadProfilePic(e)} />
                                </div>
                                <div>
                                    {/* <i className="bi bi-camera bi_camera_position">
                            </i> */}
                                </div>
                            </div>
                            <div className="col-12 mt-5">
                                <div className='mb-5 mb-lg-4 mb-sm-4'>
                                    <a className="ps-3 pt-1 pb-1 pe-3  upload_cv position-relative" target="_blank">Upload CV
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
                                    {/* {isSubmitClicked && !props.resumeUrl && <div><small className="text-danger job_dis_form_label">{ResumeError}</small></div>} */}

                                </div>
                                <div className='mb-4 mb-lg-0 mb-sm-4'>
                                    {props.resumeUrl && <a href={`${CLOUDFRONT_URL}/${props.resumeUrl}`} className="ps-3 pt-1 pb-1 pe-3 open_cv" target="_blank">Open CV <img src={OpenCV} className="ps-4 pb-1" alt="opencv" /> </a>}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </FormBuilder>

            <div className="position-absolute px-3 px-lg-5 bottom-30 bottom-sm-20" style={{ width: '100%', left: 0 }}>
                <div className='text-end mt-5 mt-lg-0 mt-sm-4 pe-2'>
                    {formError && <small className='text-danger me-3'>Mandatory fields are not filled</small>}
                    <button className='large_btn_apply rounded me-2' type="button" onClick={onClickSave}>Save & Next</button>
                </div>
            </div>

            <Modal
                show={canshowTimzonePopup}
                onHide={() => setCanshowTimzonePopup(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className='corner-near sx-close w-100'
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <div className='top_heading_styles'>Do you want to change the timezone?</div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='top_para_styles'>
                    <p className=''>Would you like to keep your existing availability slots or add new slots in the new time zone selected?</p>
                    <p className='sx-text-primary'>Note: existing time slots will not be adjusted automatically to new time zone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <div className='text-center pb-2'>
                        <button className="large_btn_apply rounded me-3 btn-outline-primary" onClick={() => { goToAvailability(1) }}>Keep the existing slots</button>
                        <button className="large_btn_apply rounded" onClick={() => { goToAvailability(2) }}>Add new slots</button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}
