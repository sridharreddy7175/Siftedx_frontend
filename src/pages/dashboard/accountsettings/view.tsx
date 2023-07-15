import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import Calendar from 'react-calendar';
import { connect, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { NotificationsService } from "../../../app/service/notifications.service";
import { SmeService } from "../../../app/service/sme.service";
import { UsersService } from "../../../app/service/users.service";
import { ERROR_CODES } from "../../../app/utility/app-codes";
import { normalPasswordValidations, passwordValidations } from "../../../app/utility/form-validations";
import ValidationErrorMsgs from "../../../app/utility/validation-error-msgs";
import { AppLoader } from "../../../components/loader";
import { PasswordValidation } from "../../../components/password-validation";
import { UserData } from "../../../redux/actions";

interface Props {
    UserDataReducer: any;
    userData?: (data: any) => void;
}

const AccountSettings = (props: Props) => {
    const [tuesdayTimes, setTuesdayTimes] = useState<any[]>([]);
    const [show, setShow] = useState(false);
    const [value, onChange] = useState(new Date());
    const [userPaymentData, setUserPaymentData] = useState<any>({});
    const [notificationsSttingsCodes, setNotificationsSttingsCodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const handleClose = () => setShow(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPasswordError, setCurrentPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState<any>({ number: true, upper: true, lower: true, specialChar: true, strLength: true });
    const [confirmPasswordError, setConfirmPasswordError] = useState<any>({ number: true, upper: true, lower: true, specialChar: true, strLength: true });
    const [optSent, setOptSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    let loginUserData: any = sessionStorage.getItem('loginData') || '';
    loginUserData = loginUserData ? JSON.parse(loginUserData) : {};
    const [passwordFieldType, setPasswordFieldType] = useState("password");
    const [newPasswordFieldType, setNewPasswordFieldType] = useState("password");
    const [confirmPasswordFieldType, setConfirmPasswordFieldType] = useState("password");
    const [emailNotificationsSttingsCodes, setEmailNotificationsSttingsCodes] = useState<any[]>([]);
    const [mobileNotificationsSttingsCodes, setMobileNotificationsSttingsCodes] = useState<any[]>([]);
    const [selectedNotificationData, setSelectedNotificationData] = useState<any>([]);
    const [costPerInterviewError, setCostPerInterviewError] = useState<any>('');
    const [paymentIdError, setPaymentIdError] = useState<any>('');
    const [accountStatus, setAccountStatus] = useState<any>();
    const loginUserId = sessionStorage.getItem('userUuid') || '';
    const dispatch = useDispatch();
    const history = useHistory();
    const [showPasswordErrorPopup, setShowPasswordErrorPopup] = useState(false);
    const handleClosePasswordErrorPopup = () => setShowPasswordErrorPopup(false);
    const [showConfirmPasswordErrorPopup, setShowConfirmPasswordErrorPopup] = useState(false);
    const handleCloseConfirmPasswordErrorPopup = () => setShowConfirmPasswordErrorPopup(false);
    const [confirmError, setConfirmError] = useState("");
    const [currentPasswordValueErr, setCurrentPasswordValueErr] = useState('');
    const [isSubmitClicked, setIsSubmitClicked] = useState(false);

    useEffect(() => {
        getPaymentMethod();
        getNotificationSettingCodes();
        getLoginUserData();
    }, []);

    const getPaymentMethod = () => {
        SmeService.getPaymentMethod().then(
            res => {
                setUserPaymentData({ ...res[0] });
            }
        )
    }

    const getLoginUserData = () => {
        UsersService.getUserByUuid(loginUserId).then(res => {
            setAccountStatus(res?.status);
            // if (props.userData) {
            //     dispatch(props.userData({...props.userData, ...res}));
            // }
        });
    }

    const handleonTuesday = () => {
        const times: any = tuesdayTimes;
        times.push({ start: '', end: '' })
        setTuesdayTimes([...times])
    }
    const handleDelete = (item: any, index: number) => {
    }


    const resendOTP = () => {
        setLoading(true);
        UsersService.userPasswordChangeOtpAndValidate(currentPassword).then((res: any) => {
            if (res?.error) {
                if (res.error.code === ERROR_CODES.INVALID_CREDENTIALS) {
                    setCurrentPasswordValueErr(ValidationErrorMsgs.PASSWORD_INVALID);
                }
                setLoading(false);
                toast.error(res?.error?.message);
            } else {
                setLoading(false);
                setOptSent(true);
                toast.success('OTP sent to your email');
            }
        })
    }

    const validatePwd = (): boolean => {
        if (currentPassword && newPassword && confirmPassword && (newPassword === confirmPassword)) {
            return true;
        } else {
            setLoading(false);
            if (!currentPassword) {
                setCurrentPasswordValueErr(ValidationErrorMsgs.PASSWORD_REQUIRED);
                setCurrentPasswordError(passwordValidations(currentPassword, 'current password'));
            } else {
                setCurrentPasswordValueErr('');
            }
            if (!newPassword) {
                setNewPasswordError(passwordValidations(newPassword, 'new password'));
                setShowPasswordErrorPopup(true);
            }
            if (!confirmPassword) {
                setConfirmPasswordError(passwordValidations(confirmPassword, 'confirm password'));
                setShowConfirmPasswordErrorPopup(true);
            }
            if ((newPassword !== confirmPassword)) {
                setConfirmPasswordError('Confirm password not matched with new password');
                setConfirmError("Confirm password not matched with new password")
            }
        }
        return false;
    }

    const onSavePasswordChange = () => {
        setIsSubmitClicked(true);
        setLoading(true);
        if (validatePwd()) {
            setCurrentPasswordValueErr('');
            UsersService.userPasswordChangeOtpAndValidate(currentPassword).then((res: any) => {
                if (res?.error) {
                    if (res.error.code === ERROR_CODES.INVALID_CREDENTIALS) {
                        setCurrentPasswordValueErr(ValidationErrorMsgs.PASSWORD_INVALID);
                    }

                    setLoading(false);
                    toast.error(res?.error?.message);
                } else {
                    setLoading(false);
                    setOptSent(true);
                    toast.success('OTP sent to your email');
                }
            })
        }

    }

    const onCurrentPassword = (event: any) => {
        setCurrentPasswordValueErr(event.target.value ? '' : ValidationErrorMsgs.PASSWORD_REQUIRED);
        setConfirmError("");
        setCurrentPasswordError(normalPasswordValidations(event.target.value, 'current password'));
        setCurrentPassword(event.target.value);
    }

    const onNewPassword = (event: any) => {
        setConfirmError("")
        setNewPasswordError(passwordValidations(event.target.value, 'new password'));
        setNewPassword(event.target.value);
        const error: any = passwordValidations(event.target.value, "new password");
        if (!error?.number && !error?.upper && !error?.lower && !error?.specialChar && !error?.strLength) {
            handleClosePasswordErrorPopup();
        } else {
            setShowPasswordErrorPopup(true);
        }
    }

    const onConfirmPassword = (event: any) => {
        setConfirmError("")
        setConfirmPasswordError(passwordValidations(event.target.value, 'confirm password'));
        setConfirmPassword(event.target.value);
        const error: any = passwordValidations(event.target.value, "confirm password");
        if (!error?.number && !error?.upper && !error?.lower && !error?.specialChar && !error?.strLength) {
            handleCloseConfirmPasswordErrorPopup();
        } else {
            setShowConfirmPasswordErrorPopup(true);
        }
    }

    const onChangeOpt = (event: any) => {
        setOtpError(event.target.value ? '' : ValidationErrorMsgs.PASSWORD_OTP_REQUIRED);
        setOtp(event.target.value);
    }
    const onVerifyOtp = () => {
        if (validatePwd()) {

            setLoading(true);
            const data = {
                user_email: loginUserData?.user_email,
                new_password: newPassword,
                old_password: currentPassword,
                otp: otp
            }
            if (otp) {
                UsersService.userPasswordChange(data).then((res: any) => {
                    if (res?.error) {
                        if (res.error.code === ERROR_CODES.INVALID_CREDENTIALS || res.error.code === ERROR_CODES.RECORD_NOT_FOUND) {
                            if (res.error.message === 'Invalid OTP') {
                                setOtpError(ValidationErrorMsgs.PASSWORD_OTP_INVALID);
                            } else {
                                setCurrentPasswordValueErr(ValidationErrorMsgs.PASSWORD_INVALID);
                            }
                        }
                        setLoading(false);
                        toast.error(res?.error?.message);
                    } else {
                        setLoading(false);
                        setOptSent(false);
                        toast.success('Password changed successfully, your redirecting to login.');
                        setTimeout(() => {
                            history.push('/');
                        }, 2000);
                    }
                })
            } else {
                setLoading(false);
                if (!otp) {
                    setOtpError(ValidationErrorMsgs.PASSWORD_OTP_REQUIRED);
                }
            }
        }
    }

    const getNotificationSettingCodes = () => {
        setLoading(true);
        NotificationsService.getNotificationSettingCodes().then((res: any) => {
            if (res?.error) {
                setLoading(false);
                toast.error(res?.error?.message);
            } else {
                setNotificationsSttingsCodes([...res]);
                getNotificationsSettings(res);
                setLoading(false);
            }
        })
    }

    const getNotificationsSettings = (notificationsCodes: any) => {
        setLoading(true);
        NotificationsService.getNotificationSettings().then((res: any) => {
            if (res?.error) {
                setLoading(false);
                toast.error(res?.error?.message);
            } else {
                if (res.length > 0) {
                    const emialNotifications: any[] = [];
                    const mobileNotifications: any[] = [];
                    res.forEach((element: any) => {
                        if (element.type === 1) {
                            emialNotifications.push(element);
                        }
                        if (element.type === 2) {
                            mobileNotifications.push(element);
                        }
                    });
                    const emailFilteredCodes = notificationsCodes.map((el: any) => {
                        let is_enabled = emialNotifications.findIndex(_el => _el.setting_code === el.code && _el.is_enabled) > -1;
                        return { ...el, is_enabled }
                    });
                    const mobileFilteredCodes = notificationsCodes.map((el: any) => {
                        let is_enabled = mobileNotifications.findIndex(_el => _el.setting_code === el.code && _el.is_enabled) > -1;
                        return { ...el, is_enabled }
                    });
                    setEmailNotificationsSttingsCodes([...emailFilteredCodes]);
                    setMobileNotificationsSttingsCodes([...mobileFilteredCodes]);
                } else {
                    const emailFilteredCodes = notificationsCodes.map((el: any) => {
                        return { ...el, is_enabled: true }
                    });
                    const mobileFilteredCodes = notificationsCodes.map((el: any) => {
                        return { ...el, is_enabled: true }
                    });
                    setEmailNotificationsSttingsCodes([...emailFilteredCodes]);
                    setMobileNotificationsSttingsCodes([...mobileFilteredCodes]);
                }
                setSelectedNotificationData([...res]);
                setLoading(false);
            }
        });
    }

    const onEmailNotifationSettings = (e: any, index: number) => {
        const data = emailNotificationsSttingsCodes;
        data[index].is_enabled = e.target.checked;
        setEmailNotificationsSttingsCodes([...data]);
    }

    const onMobileNotifationSettings = (e: any, index: number) => {
        const data = mobileNotificationsSttingsCodes;
        data[index].is_enabled = e.target.checked;
        setMobileNotificationsSttingsCodes([...data]);
    }

    const onSaveEmailNotificationsSettings = () => {
        setLoading(true);
        const data: any = [];
        emailNotificationsSttingsCodes.forEach((element: any) => {
            data.push({
                type: 1,
                setting_code: element?.code,
                is_enabled: element?.is_enabled ? element?.is_enabled : false
            });
        });
        mobileNotificationsSttingsCodes.forEach((element: any) => {
            data.push({
                type: 2,
                setting_code: element?.code,
                is_enabled: element?.is_enabled
            });
        });
        onSaveNotificationsSettings(data);
    }

    const onSaveNotificationsSettings = (data: any) => {
        setLoading(true);
        NotificationsService.notificationSettingCodes(data).then((res: any) => {
            if (res?.error) {
                setLoading(false);
                toast.error(res?.error?.message);
            } else {
                setLoading(false);
                toast.success('Saved successfully');
                getNotificationsSettings(notificationsSttingsCodes);
            }
        })
    }

    const getIsItemChecked = (code: string, type: number): boolean => {
        const retVal = true;

        if (type === 1) {
            const setting = emailNotificationsSttingsCodes.find((el: any) => el.code === code);
            if (setting) {
                return setting.is_enabled;
            }

        } else if (type === 2) {
            const setting = mobileNotificationsSttingsCodes.find((el: any) => el.code === code);

            if (setting) {
                return setting.is_enabled;
            }
        }
        return retVal;
    }

    return (
        <div>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }
            <div className="account_settings ms-lg-2 mt-lg-3 me-lg-2">
                <div className="contianer-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="mobile_manage mt-4 mt-lg-0 mt-sm-4 ms-3 ms-sm-4 ms-lg-2  mt-xl-4 mt-lg-3 me-lg-3">
                                <div className="ms-4 ms-lg-4">
                                    <h5 className='top_heading_styles'>Account Settings</h5>
                                    <p className='top_para_styles'>Manage your account from here</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mobile_bal'>
                        <div className="row">
                            <div className="col-lg-6 mb-5 mb-lg-0">
                                <div className="rounded-3 bg-white position-relative h-100  pt-4 pb-4 pt-lg-3 pb-lg-2 pt-sm-4 pb-sm-4  mx-4  me-lg-4  ms-lg-3 mt-lg-0 me-lg-3">
                                    <div className="ms-3 mb-3 pb-5">
                                        <h5 className='top_heading_styles'>Change Password</h5>
                                        <p className='top_para_styles pt-2 pb-2 pt-lg-none pb-lg-none'>Change your password</p>
                                        <div>
                                            <label className="input pe-3 pe-lg-3">
                                                <input type={passwordFieldType} className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="currentPassowrd" name="current_password" placeholder="Current Password *" onChange={(e) => onCurrentPassword(e)} />
                                                <span className="input__label">Current Password<span className='text-danger'>*</span></span>
                                                {passwordFieldType === 'password' ? <i className="bi bi-eye-slash-fill input_eye pt-1  input_eye_new_pass" onClick={() => setPasswordFieldType('text')}></i> : <i className="bi bi-eye-fill input_eye input_eye_new_pass pt-1" onClick={() => setPasswordFieldType('password')}></i>}
                                            </label>
                                            {currentPasswordValueErr && <small className="text-danger job_dis_form_label">{currentPasswordValueErr}</small>}
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 col-12 position-relative">
                                                <div>
                                                    <label className="input mt-4 pe-3 pe-lg-3">
                                                        <input type={newPasswordFieldType} className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="newPassword" name="new_password" placeholder="New Password *" onChange={(e) => onNewPassword(e)} onFocus={() => setShowPasswordErrorPopup(true)}
                                                            onBlur={() => handleClosePasswordErrorPopup()} />
                                                        <span className="input__label">New Password<span className='text-danger'>*</span></span>
                                                        {newPasswordFieldType === 'password' ? <i className="bi bi-eye-slash-fill input_eye input_eye_new_pass pt-1" onClick={() => setNewPasswordFieldType('text')}></i> : <i className="bi bi-eye-fill input_eye input_eye_new_pass pt-1" onClick={() => setNewPasswordFieldType('password')}></i>}
                                                        <PasswordValidation isShow={showPasswordErrorPopup} errors={newPasswordError} customClass={'sme_password_modal fs_14 p-4'} />
                                                    </label>
                                                    {/* {newPasswordError && <p className="text-danger job_dis_form_label">{newPasswordError}</p>} */}
                                                </div>
                                                {/*  */}

                                            </div>
                                            <div className="col-md-6 col-12 position-relative">
                                                <div>
                                                    <label className="input mt-4 pe-3 pe-lg-3">
                                                        <input type={confirmPasswordFieldType} className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="confirmPassword" name="confirm_password" placeholder="Confirm Password *" onChange={(e) => onConfirmPassword(e)} onFocus={() => setShowConfirmPasswordErrorPopup(true)}
                                                            onBlur={() => handleCloseConfirmPasswordErrorPopup()} />
                                                        <span className="input__label">Confirm Password<span className='text-danger'>*</span></span>
                                                        {confirmPasswordFieldType === 'password' ? <i className="bi bi-eye-slash-fill input_eye input_eye_new_conform_pass pt-1" onClick={() => setConfirmPasswordFieldType('text')}></i> : <i className="bi bi-eye-fill input_eye input_eye_new_conform_pass pt-1" onClick={() => setConfirmPasswordFieldType('password')}></i>}
                                                    </label>
                                                    {/* <PasswordValidation isShow={showConfirmPasswordErrorPopup} errors={confirmPasswordError} customClass={'sme_password_modal fs_14 p-4'} /> */}
                                                    {/* {confirmPasswordError && <p className="text-danger job_dis_form_label">{confirmPasswordError}</p>} */}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {/* {confirmPasswordError && <p className="text-danger job_dis_form_label">{confirmPasswordError}</p>} */}

                                        </div>
                                        <div>
                                            {confirmError && <p className="text-danger job_dis_form_label">{confirmError}</p>}
                                        </div>
                                        {!optSent && <button className="position-absolute large_btn_apply rounded-3 me-3" onClick={onSavePasswordChange} style={{ bottom: '20px', right: 0 }}>Send OTP</button>}
                                        {/* {!optSent && <div className="mt-4 d-flex justify-content-end me-3">

                                        </div>} */}
                                        {optSent && <>
                                            <div className="col-12 mb-2 mt-2">
                                                <label className="input mt-4 pe-3 pe-lg-3">
                                                    <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="confirmPassword" name="otp" placeholder=" " onChange={(e) => onChangeOpt(e)} />
                                                    <span className="input__label">OTP<span className='text-danger'>*</span></span>
                                                    {otpError && <small className="text-danger job_dis_form_label">{otpError}</small>}
                                                </label>
                                            </div>
                                            <div className="mt-4 d-flex justify-content-between px-3 position-absolute w-100" style={{ left: 0 }}>
                                                <button className="large_btn_apply btn-outline-primary" onClick={resendOTP}>Resend OTP</button>
                                                <button className="large_btn_apply rounded-3" onClick={onVerifyOtp}>Verify OTP</button>
                                            </div>
                                        </>}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className={`${!optSent && 'h-100'} rounded-3 bg-white pt-4 pb-4 pt-lg-3 pt-sm-4 pb-sm-4  mx-4 ms-lg-0 me-lg-4 ms-sm-4 me-sm-4 position-relative pb-5`} >
                                    <div className="row px-3">
                                        <h5 className="col-8 top_heading_styles">Notifications</h5>
                                        <h5 className="col-2 top_heading_styles text-center">Email</h5>
                                        <h5 className="col-2 top_heading_styles text-center">Mobile</h5>
                                    </div>
                                    <div className="row px-3 pt-1">
                                        <div className="col-12 me-3">
                                            <ul className="email_notification_list ps-0 pb-1">
                                                {emailNotificationsSttingsCodes.map(
                                                    (data: any, index: number) => {
                                                        return (
                                                            <li key={index} className="top_para_styles row">
                                                                <div className="col-8">{data?.setting_text}</div>
                                                                <div className="col-2 text-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="me-2 form-check-input"
                                                                        // label={data?.setting_text}
                                                                        checked={getIsItemChecked(data.code, 1)}
                                                                        onChange={(e) =>
                                                                            onEmailNotifationSettings(e, index)
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="col-2 text-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="me-2 form-check-input"
                                                                        // label={data?.setting_text}
                                                                        // defaultChecked={getIsItemChecked(data.code, 2)}
                                                                        checked={getIsItemChecked(data.code, 2)}
                                                                        onChange={(e) =>
                                                                            onMobileNotifationSettings(e, index)
                                                                        }
                                                                    />
                                                                </div>

                                                            </li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    <button
                                        className="position-absolute large_btn_apply rounded-3 me-3"
                                        onClick={() => { onSaveEmailNotificationsSettings() }}
                                        style={{ bottom: '20px', right: 0 }}
                                    >
                                        Save
                                    </button>
                                    {/* <div className="row pb-3 px-3">
                                        <div className="col-8"></div>
                                        <div className="col-2"></div>
                                        <div className="col-2 text-end">
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div>
                <Modal show={show} onHide={handleClose} >
                    <Modal.Header closeButton>
                        <Modal.Title className=''>
                            <h5 className='schedule_interview_modal_heading p-0 m-0'>Select a data and add hours</h5>
                            <p className='schedule_interview_modal_para'>You will be notified if opportunities </p>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body >

                        <div>
                            <Calendar minDate={new Date()} calendarType="US" onChange={onChange} value={value} className="w-75 border-0" />
                        </div>
                        <div className="my-4">
                            <p className='invite_team_content'>What hours are you available on this date?</p>
                            <div className="row week-availabity border-0">
                                {tuesdayTimes.length > 0 ? <div className="col-md-10">
                                    {tuesdayTimes.map((data: any, index: number) => {
                                        return <div key={index} className="row mt-2">
                                            <div className="col-md-4">
                                                <input type="text" className="form-control" defaultValue={data?.start} />
                                            </div>
                                            <div className="col-md-2 px-4 mt-1">
                                                To
                                            </div>
                                            <div className="col-md-4">
                                                <input type="text" className="form-control" defaultValue={data?.end} />
                                            </div>
                                            <div className="col-md-2 px-2">
                                                <button className="btn btn-outline-secondary py-1" onClick={() => handleDelete(data, index)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    })}
                                </div> :
                                    <div className="col-md-10">
                                        Not available
                                    </div>
                                }
                                <div className="col-md-2">
                                    <i className="bi bi-plus plus-icon" onClick={handleonTuesday}></i>
                                </div>
                            </div>
                            <div className='mt-4'>
                                <button className='large_btn rounded-3'>Save</button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
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

const connectedNavBar = connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
export { connectedNavBar as AccountSettings };