import React, { useEffect, useState } from 'react'
import FormBuilder from '../../components/form-builder';
import { useHistory, useParams } from 'react-router-dom';
import { FormValidator } from '../../components/form-builder/validations';
import { FormControlError, FormField, FormValidators } from '../../components/form-builder/model/form-field';
import { SmeService } from '../../app/service/sme.service';
import { UsersService } from '../../app/service/users.service';
import { S3Helper } from '../../app/utility/s3-helper';
import { CLOUDFRONT_URL } from '../../config/constant';
import { toast } from 'react-toastify';
import { AppLoader } from '../../components/loader';
import { emialValidations, nameValidations, paypalFieldValidations } from '../../app/utility/form-validations';
import LogoImg from "../../assets/images/siftedx_home_logo.png";
import videoIcon from '../../assets/icon_images/Video Icon.png'
import Delete from "../../assets/icon_images/delete.svg";
import { Box, Step, StepButton, Stepper } from '@mui/material';
import { Modal } from 'react-bootstrap';
import UPLOAD_ICON from "./../../assets/icon_images/Upload CV.svg";
import ReactTooltip from "react-tooltip";

export const StepThree = () => {
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const [formData, setFormData] = useState<any>({});
    const [formValidationErrors, setFormValidationErrors] = useState<FormControlError[]>([]);
    const [videoUrl, setVideoUrl] = useState<any>('');
    const [costPerInterviewError, setCostPerInterviewError] = useState<any>('');
    const [currencyError, setCurrencyError] = useState<any>('');
    const [paymentIdError, setPaymentIdError] = useState<any>('');
    const [videoUrlError, setVideoUrlError] = useState<any>('');
    const [userPaymentData, setUserPaymentData] = useState<any>({});
    const [formError, setFormError] = useState<any>('');
    const [paypalFirstNameError, setPaypalFirstNameError] = useState<any>('');
    const [paypalLastNameError, setPaypalLastNameError] = useState<any>('');
    let { user } = useParams<{ user: string }>();
    const steps = ['Personal', 'Skills', 'Cost'];
    const [activeStep, setActiveStep] = React.useState(2);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const [canShowPopup, setCanShowPopup] = useState(false);
    useEffect(() => {
        ReactTooltip.rebuild();
    }, [videoUrl]);

    const handleSubmit = () => {
        setCanShowPopup(false);
        history.push("/home");
        localStorage.setItem('rememberMeData', '');
        sessionStorage.clear();
    }

    const formValidations = [
        new FormField('cost_per_interview', [FormValidators.REQUIRED]),
        new FormField('currency', [FormValidators.REQUIRED]),
        new FormField('firstname', [FormValidators.REQUIRED]),
        new FormField('lastname', []),
        new FormField('payment_id', []),
        new FormField('video_url', []),
    ];

    useEffect(() => {
        getPaymentMethod();
    }, []);

    const getPaymentMethod = () => {
        SmeService.getPaymentMethod().then(
            res => {
                if (res?.error) {
                    toast.error(res?.error?.message);
                } else {
                    const { payment_firstname, payment_id, payment_lastname, sme_fee, sme_fee_currency } = res[0];
                    setUserPaymentData({ firstname: payment_firstname, lastname: payment_lastname, cost_per_interview: sme_fee, payment_id });
                    if (res[0]?.introduction_video_url) {
                        res[0].introduction_video_url = res[0]?.introduction_video_url.replace(CLOUDFRONT_URL + '/', '');
                    }
                    setVideoUrl(res[0]?.introduction_video_url);
                }
            }
        )
    }

    const handleInput = (data: any) => {
        data.value = { ...formData.value, ...data.value };
        setFormData(data);
        const errors: any = FormValidator(formValidations, data.value);
        setFormValidationErrors(errors);
    }
    const onSubmit = () => {
        setLoading(true);
        const paymentFormData = { ...userPaymentData, ...formData.value };

        paymentFormData.cost_per_interview = Number(paymentFormData.cost_per_interview)
        paymentFormData.video_url = videoUrl;
        if (
            paymentFormData?.cost_per_interview
            // && paymentFormData?.currency
            && !costPerInterviewError
            && paymentFormData?.firstname
            && paymentFormData?.lastname
            && paymentFormData?.payment_id
            && !paymentIdError
            && !paypalFirstNameError
            && !paypalLastNameError
        ) {
            SmeService.paymentMethod(paymentFormData).then(async res => {
                if (res?.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    try {
                        let loginUserData: any = JSON.parse(sessionStorage.getItem('loginData') || '{}');
                        if (loginUserData.profile_setup_status < 3) {
                            await UsersService.updateProfileCompleteStatus(3);
                        }
                    } catch (profile_step_err) {
                        console.error('Error while reading profile states ', profile_step_err);
                    }
                    history.push('/sme-success-page');
                    setLoading(false);
                    toast.success('Saved successfully');
                }
            })
        } else {
            setFormError('Mandatory fields are not filled');
            setTimeout(() => {
                setFormError('');
            }, 2000);
            setLoading(false);
            if (!paymentFormData?.cost_per_interview) {
                setCostPerInterviewError('Please enter rate per interview');
            }
            if (!paymentFormData?.currency) {
                setCurrencyError('Please select currency');
            }
            if (!paymentFormData?.firstname || paypalFirstNameError) {
                setPaypalFirstNameError(paypalFieldValidations(paymentFormData?.firstName, 'paypal account'));
                // setNameError(nameValidations(userData?.user_firstname, "first name"));

            }
            if (!paymentFormData?.lastname || paypalLastNameError) {
                setPaypalLastNameError(paypalFieldValidations(paymentFormData?.firstName, 'paypal account'));
            }
            if (!paymentFormData?.payment_id || paymentIdError) {
                setPaymentIdError('Please enter paypal email');
            }
        }
    }
    const onUploadVideo = async (event: any) => {
        setLoading(true);
        setVideoUrl('');
        setVideoUrlError('');
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
    }

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
        // setFirstNameError('');
        // if (!event.target.value) {
        //     setFirstNameError('Please enter the first name as per your paypal account')
        // }
        setPaypalFirstNameError(paypalFieldValidations(event.target.value, ''))
        if (event.target.value.length > 15) {
            setPaypalFirstNameError("Maximum length allowed is 15 characters")
        }
    }



    const onChangePaypalLastName = (event: any) => {
        // setLastNameError('');
        // if (!event.target.value) {
        //     setLastNameError('Please enter the last name as per your paypal account')
        // }
        setPaypalLastNameError(paypalFieldValidations(event.target.value, ''))
        if (event.target.value.length > 15) {
            setPaypalLastNameError("Maxium length allowed is 15 characters")
        }

    }

    const onChangePaypalId = (event: any) => {
        setPaymentIdError(emialValidations(event.target.value, 'paypal email'))
    }

    const onBack = () => {
        history.push(`/sme-step-two/${user}`);
    }

    const onClickHome = () => {
        setShow(true);
    }


    return (
        <div>
            <ReactTooltip place='bottom' type='light' effect='solid' border={true} borderColor={'#707070'} />
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-12 ' style={{ backgroundColor: "#000000", paddingTop: "10px", paddingBottom: "10px" }}>
                        <img src={LogoImg} alt="loading-logo" className='create_company_page_siftedx_log ms-3 ms-lg-5' />
                        <button className='text-end mt-3 mt-lg-2 me-4 me-lg-5  dashboard_names rounded-3 large_btn_apply' style={{ float: "right" }} onClick={() => { onClickHome() }}>Logout</button>

                    </div>
                </div>
                <div className='px-3 mx-3 mx-lg-5 bg-white rounded-3 mt-3 px-lg-5 pb-5 px-0 position-relative' style={{ height: 'calc(100vh - 140px)' }}>
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
                    <div className='mb-3 mt-5 mt-lg-0 pe-2' style={{ height: 'calc(100% - 150px)', overflow: 'auto' }}>
                        <h4 className='top_heading_styles fw_6 mb-5 mb-lg-0 mb-sm-5'>Rates and Introduction Video</h4>
                        <FormBuilder onUpdate={handleInput}>
                            <form>
                                <div className='row mt-3'>
                                    <div className="col-md-12 col-12 mb-3 position-relative mb_22" >
                                        <label className="input">
                                            <span className='payment_currency'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-dollar" viewBox="0 0 16 16">
                                                    <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z" />
                                                </svg>
                                            </span>
                                            <input type="number" className="form-control job_dis_form_control px-3 rounded manual_profile_padding pl-30 input__field" id="smeRatePerInterview" name="cost_per_interview" placeholder="Rate Per Interview *" onChange={(e) => onChangeRatePerInterview(e)} defaultValue={userPaymentData?.cost_per_interview} />
                                            <span className={`input__label`} style={{ left: "12px" }}>Rate Per Interview<span className='text-danger'>*</span></span>
                                        </label>
                                        {costPerInterviewError && <p className="text-danger job_dis_form_label">{costPerInterviewError}</p>}
                                    </div>
                                    <div className="col-lg-4 col-12 mb-3">
                                        <label className="input">
                                            <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="smePaypalId" name="payment_id" placeholder="Paypal email id *" onChange={(e) => onChangePaypalId(e)} defaultValue={userPaymentData?.payment_id} />
                                            <span className={`input__label`}>Paypal Email ID<span className='text-danger'>*</span></span>
                                        </label>
                                        {paymentIdError && <p className="text-danger job_dis_form_label">{paymentIdError}</p>}
                                    </div>
                                    <div className="col-lg-4 col-12 mb-3 ps-lg-3">
                                        <label className="input">
                                            <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="smePaypalFirstName" name="firstname" placeholder="Paypal first name *" onChange={(e) => onChangePaypalFirstName(e)} defaultValue={userPaymentData?.firstname} />
                                            <span className={`input__label`}>Paypal First Name<span className='text-danger'>*</span></span>
                                        </label>
                                        {paypalFirstNameError && <p className="text-danger job_dis_form_label">{paypalFirstNameError}</p>}
                                    </div>
                                    <div className="col-lg-4 col-12 mb-3 ps-lg-3">
                                        <label className="input">
                                            <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="smePaypalLastName" name="lastname" placeholder="Paypal last name *" onChange={(e) => onChangePaypalLastName(e)} defaultValue={userPaymentData?.lastname} />
                                            <span className={`input__label`}>Paypal Last Name<span className='text-danger'>*</span></span>
                                        </label>
                                        {paypalLastNameError && <p className="text-danger job_dis_form_label">{paypalLastNameError}</p>}
                                    </div>
                                    <hr />
                                    <div className="col-12 mb-3">
                                        <label className="form-label job_dis_form_label top_heading_styles fw_6">
                                            Upload an Introduction Video
                                        </label>
                                        <div className='mb-2'>
                                            <div className='m-0' style={{ fontSize: '12px' }}>
                                                Video should cover details like name, technology experience, expertise, passion and past experience around

                                            </div>
                                            <div style={{ fontSize: '12px' }}>
                                                interviewing and hiring technology resources. You can also mention what is unique about yourself, i.e. your USP
                                            </div>
                                        </div>
                                        <div className={`profile_picture_main_div_video text-center position-relative m-0 ${videoUrl && 'p-0'}`}>
                                            {videoUrl ? <video src={`${CLOUDFRONT_URL}/${videoUrl}`} width="300" height="240" controls></video>
                                                : <div> <input
                                                    id="upload_file1"
                                                    type="file"
                                                    name="cover_photo"
                                                    className={`upload_file_input_field`}
                                                    accept="video/mp4"
                                                    onChange={(e) => onUploadVideo(e)}
                                                />
                                                    <div className='row'>
                                                        <div className='col-md-6 col-6 text-start'>
                                                            <ul className='list-inline mt-4 mt-sm-4 mt-lg-4'>
                                                                <li className='upload_img' itemType='file' style={{ color: "#1E1E1E" }}>Upload a file from your device</li>
                                                                <li className='upload_img'><small>Supported formats : mov, mp4</small></li>
                                                                <li className='upload_img'><small>maximum size : 100mb</small></li>
                                                                <li className='upload_img'><small>maximum duration : 1minute</small></li>
                                                            </ul>
                                                        </div>
                                                        <div className='col-md-6 col-6 text-end pe-5 mt-5'>
                                                            <img src={videoIcon} alt="videoIcon" />
                                                            {/* <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M4.66683 9H0.333496V39.3333C0.333496 41.7167 2.2835 43.6667 4.66683 43.6667H35.0002V39.3333H4.66683V9ZM39.3335 0.333336H13.3335C10.9502 0.333336 9.00016 2.28334 9.00016 4.66667V30.6667C9.00016 33.05 10.9502 35 13.3335 35H39.3335C41.7168 35 43.6668 33.05 43.6668 30.6667V4.66667C43.6668 2.28334 41.7168 0.333336 39.3335 0.333336ZM22.0002 27.4167V7.91667L35.0002 17.6667L22.0002 27.4167Z" fill="#777F8A" />
                                                                    </svg> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            {videoUrl && <div className='position-absolute d-flex top-0 end-0 me-2 mt-2'>
                                                        <img data-tip="Remove video" src={Delete} alt="Delete" className='pointer' onClick={() => setVideoUrl('')} />
                                                      <label htmlFor="upload_file1_videoupload" className='ms-2'><img data-tip="Upload new video" src={UPLOAD_ICON} alt="Delete" className='pointer sx-text-primary'/>
                                                        <input
                                                          // disabled={isRateFormEdit}
                                                          id="upload_file1_videoupload"
                                                          type="file"
                                                          name="cover_photo"
                                                          className='d-none'
                                                          accept="video/mp4"
                                                          onChange={(e) => onUploadVideo(e)}
                                                        />
                                                      </label>
                                                    </div>
                                            }
                                        </div>
                                        {videoUrlError && <p className="text-danger job_dis_form_label">{videoUrlError}</p>}
                                    </div>
                                </div>
                            </form>
                        </FormBuilder>
                        <div className={`row position-absolute  px-3 px-lg-5`} style={{ bottom: '30px', width: '100%', left: 0 }}>
                            <div className='col-md-6 col-6  mt-5 mt-lg-0 mt-sm-4'>
                                <button className='btn-signup rounded' onClick={onBack}>Previous</button>
                            </div>
                            <div className='col-md-6 col-6 text-end mt-5 mt-lg-0 mt-sm-4'>
                                <button className='small_btn rounded me-2' onClick={onSubmit}>Submit Your Profile</button>
                                {formError && <span className="text-danger job_dis_form_label ms-3 ">{formError}</span>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 text-end mt-4">
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
