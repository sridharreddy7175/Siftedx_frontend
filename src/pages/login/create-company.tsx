import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { LookUpService } from "../../app/service/lookup.service";
import FormBuilder from "../../components/form-builder";
import {
  FormControlError,
  FormField,
  FormValidators,
} from "../../components/form-builder/model/form-field";
import {
  FormValidator,
  GetControlIsValid,
} from "../../components/form-builder/validations";
import { Form, Modal } from "react-bootstrap";
import individual from "../../assets/images/individual.png";
import corporate from "../../assets/images/corporate.png";
import { CompanyService } from "../../app/service/company.service";
import ShiftedxLogoImg from "../../assets/images/Shifted.png";
import { toast } from "react-toastify";
import {
  allCountryMobileNumberValidations,
  cardExpValidations,
  countryCodeValidations,
  normalPasswordValidations,
  titleValidations,
} from "../../app/utility/form-validations";
import { UsersService } from "../../app/service/users.service";
import { CLOUDFRONT_URL } from "../../config/constant";
import Select from "react-select";
import { NotificationsService } from "../../app/service/notifications.service";
import { AppLoader } from "../../components/loader";
import PhoneInput from "react-phone-input-2";
import SelectPlans from "../../components/create-company/selectplans";
import Stepper from "@mui/material/Stepper";
import StepButton from "@mui/material/StepButton";
import Step from "@mui/material/Step";
import LogoImg from "../../assets/images/siftedx_home_logo.png";
import Companydetails from "../../components/create-company/companydetails";

export const CreateCompany = () => {
  const [loginValidationErrors, setLoginValidationErrors] = useState<
    FormControlError[]
  >([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loginData, setLoginData] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [countryesData, setCountryesData] = useState<any[] | []>([]);
  const [companyData, setCompanyData] = useState<any>({});
  const [selectedCountry, setSelectedCountry] = useState<any>("");
  const location = useLocation();
  const companyUuid = sessionStorage.getItem("company_uuid") || "";
  const history = useHistory();
  const userId = sessionStorage.getItem("userUuid") || "";
  const [selectedPlan, setSelectedPlan] = useState<any>("Individual");
  const [modalShow, setModalShow] = React.useState(false);
  const [accountName, setAccountName] = useState<any>("");
  const [accountNumber, setAccountNumber] = useState<any>("");
  const [expiryMonthYear, setExpiryMonthYear] = useState<any>("");
  const [cardType, setCardType] = useState<any>("");
  const [accountNameError, setAccountNameError] = useState<any>("");
  const [accountNumberError, setAccountNumberError] = useState<any>("");
  const [expiryMonthYearError, setExpiryMonthYearError] = useState<any>("");
  const [accountAccountCardError, setAccountCardError] = useState<any>("");
  const loginUserId = sessionStorage.getItem("userUuid") || "";
  const [userData, setUserData] = useState<any>({});
  const [mobileNumberCountryCodeError, setMobileNumberCountryCodeError] =
    useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [
    userMobileNumberCountryCodeError,
    setUserMobileNumberCountryCodeError,
  ] = useState("");
  const [userMobileNumberError, setUserMobileNumberError] = useState("");
  const [userCountryCode, setUserCountryCode] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [notificationsSttingsCodes, setNotificationsSttingsCodes] = useState<
    any[]
  >([]);
  const [emailNotificationsSttingsCodes, setEmailNotificationsSttingsCodes] =
    useState<any[]>([]);
  const [mobileNotificationsSttingsCodes, setMobileNotificationsSttingsCodes] =
    useState<any[]>([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [optSent, setOptSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  let loginUserData: any = sessionStorage.getItem("loginData") || "";
  loginUserData = loginUserData ? JSON.parse(loginUserData) : {};
  const [passwordFieldType, setPasswordFieldType] = useState("password");
  const [newPasswordFieldType, setNewPasswordFieldType] = useState("password");
  const [confirmPasswordFieldType, setConfirmPasswordFieldType] =
    useState("password");
  const [otpSentDeleteAccount, setOptSentDeleteAccount] = useState(false);
  const [accountOtp, setAccountOtp] = useState("");
  const [accountOtpError, setAccountOtpError] = useState("");
  const [selectedNotificationData, setSelectedNotificationData] = useState<any>(
    []
  );
  const steps = ["Select Plan", "Company Details"];
  const [activesteps, setActiveSteps] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  const handleStep = (step: number) => () => {
    setActiveSteps(step);
  };



  const formValidations = [
    new FormField("company_name", [FormValidators.REQUIRED]),
    new FormField("contact_person", [FormValidators.REQUIRED]),
    new FormField("contact_number", [FormValidators.REQUIRED]),
    new FormField("contact_number", [FormValidators.REQUIRED]),
    new FormField("address_line_1", [FormValidators.REQUIRED]),
    new FormField("address_line_2", []),
    new FormField("city_uuid", [FormValidators.REQUIRED]),
    new FormField("state_uuid", [FormValidators.REQUIRED]),
    new FormField("postal_code", [FormValidators.REQUIRED]),
    new FormField("display_name", [FormValidators.REQUIRED]),
    new FormField("category_code", [FormValidators.REQUIRED]),
    new FormField("country_uuid", [FormValidators.REQUIRED]),
  ];

  useEffect(() => {
    getCountry();
    getLoginUserData();
    if (location.pathname.includes("account-settings")) {
      getNotificationSettingCodes();
    }
  }, []);

  const getLoginUserData = () => {
    setLoading(true);
    UsersService.getUserByUuid(loginUserId).then((res) => {
      if (res.user_image) {
        res.user_image = res.user_image.replace(CLOUDFRONT_URL + "/", "");
      }
      setUserData(res);
      setLoading(false);
    });
  };

  const getCountry = () => {
    LookUpService.getCountry().then((res) => {
      res.forEach((element: any) => {
        element.label = `${element?.name}`;
        element.value = element?.code;
      });
      CompanyService.getCompanyById(companyUuid).then((companyRes) => {
        setCompanyData(companyRes);
        const data = res.find(
          (country: any) => country.value === companyRes?.country_uuid
        );
        if (data) {
          setSelectedCountry(data);
        }
      });
      setCountryesData(res);
    });
  };

  const handleInput = (data: any) => {
    setLoginData(data);
    setFormData({ ...data.value });
    const errors: any = FormValidator(formValidations, data.value);
    setLoginValidationErrors(errors);
  };

  const onClickLogin = () => {
    setLoading(true);
    setIsFormSubmitted(true);
    const updateCompanyData = { ...companyData, ...loginData.value };
    const errors: FormControlError[] = FormValidator(
      formValidations,
      updateCompanyData
    );
    setLoginValidationErrors(errors);
    updateCompanyData.uuid = companyData?.uuid;
    updateCompanyData.category_code = selectedCountry
      ? selectedCountry?.code
      : "";
    if (
      !mobileNumberCountryCodeError &&
      !mobileNumberError &&
      updateCompanyData?.category_code &&
      updateCompanyData?.company_name
    ) {
      // updateCompanyData.contact_number = phoneNumber && countryCode ? `${countryCode} ${phoneNumber}` : '';
      CompanyService.updateCompany(updateCompanyData).then((res: any) => {
        if (res?.error) {
          setLoading(false);
          toast.error(res?.error?.message);
        } else {
          if (!location.pathname.includes("account-settings")) {
            const data = {
              id: companyUuid,
              plan: selectedPlan === "Individual" ? 1 : 2,
            };
            CompanyService.getCompanyPlan(data).then((res: any) => {
              if (res?.error) {
                setLoading(false);
                toast.error(res?.error?.message);
              } else {
                toast.success("Saved succssfully");
                setLoading(false);
                setModalShow(true);
              }
            });
          } else {
            toast.success("Saved succssfully");
            setLoading(false);
          }
        }
      });
    } else {
      setLoading(false);
      if (!updateCompanyData?.category_code) {
        setCountryError("Please select the country");
      }
      if (!updateCompanyData?.company_name) {
        setCompanyNameError("Please enter company name");
      }
      if (!countryCode && mobileNumberCountryCodeError) {
        setMobileNumberCountryCodeError("Please enter the country code");
      }
      if (!phoneNumber && mobileNumberError) {
        setMobileNumberError("Please enter your phone number");
      }
    }
  };

  const onChangeCardName = (e: any) => {
    setAccountName(e.target.value);
  };

  const onChangeCardNumber = (e: any) => {
    setAccountNumber(e.target.value);
  };

  const onChangeCardExpiry = (e: any) => {
    setExpiryMonthYearError(cardExpValidations(e.target.value, "expiry date"));
    setExpiryMonthYear(e.target.value);
  };

  const onChangeCardType = (e: any) => {
    setCardType("");
    setAccountCardError("");
    if (e.target.value) {
      setCardType(e.target.value);
    } else {
      setAccountCardError("Please select card type");
    }
  };

  const onSelectCountry = (e: any) => {
    setCountryError("");
    setSelectedCountry(e);
  };

  const onChangePlan = (planType: string) => {
    setSelectedPlan(planType);
  };

  const onSavePaymentMethod = () => {
    setLoading(true);
    const paymentData = {
      company_uuid: companyUuid,
      account_name: accountName,
      account_number: accountNumber,
      payment_type: "credit_card",
      expiry_month_year: expiryMonthYear,
      account_type: cardType,
    };
    if (accountName && accountNumber && expiryMonthYear) {
      CompanyService.creatreCompanyPaymentMethod(paymentData).then(
        (res: any) => {
          if (res?.error) {
            setLoading(false);
            toast.error(res?.error?.message);
          } else {
            toast.success("Saved succssfully");
            setLoading(false);
            history.push("/dashboard/overview");
          }
        }
      );
    } else {
      setLoading(false);
      if (!accountName) {
        setAccountNameError("Please enter card holder name");
      }
      if (!accountNumber) {
        setAccountNumberError("Please enter card number");
      }
      if (!expiryMonthYear) {
        setExpiryMonthYearError("Please select expiry month year");
      }
    }
  };

  const onChangeMobileNumberCountryCode = (event: any) => {
    setCountryCode(event.target.value);
    if (event.target.value) {
      setMobileNumberCountryCodeError(
        countryCodeValidations(event.target.value, "country code")
      );
    } else {
      setMobileNumberCountryCodeError("");
    }
  };

  const onChangeUserMobileNumber = (event: any) => {
    // setPhoneNumber(event);
    // if (event) {
    // 	setUserMobileNumberError(allCountryMobileNumberValidations(event.target.value, 'phone number'));
    // } else {
    // 	setUserMobileNumberError('')
    // }
  };

  const onUserChangeMobileNumberCountryCode = (event: any) => {
    setCountryCode(event.target.value);
    if (event.target.value) {
      setUserMobileNumberCountryCodeError(
        countryCodeValidations(event.target.value, "country code")
      );
    } else {
      setUserMobileNumberCountryCodeError("");
    }
  };

  const onChangeMobileNumber = (event: any) => {
    setPhoneNumber(event);
    if (event) {
      setMobileNumberError(
        allCountryMobileNumberValidations(event.target.value, "phone number")
      );
    } else {
      setMobileNumberError("");
    }
  };

  const onChangeCompanyName = (event: any) => {
    setCompanyNameError(titleValidations(event.target.value, "company name"));
  };

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
    });
  };

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
            let is_enabled =
              emialNotifications.findIndex(
                (_el) => _el.setting_code === el.code && _el.is_enabled
              ) > -1;
            return { ...el, is_enabled };
          });
          const mobileFilteredCodes = notificationsCodes.map((el: any) => {
            let is_enabled =
              mobileNotifications.findIndex(
                (_el) => _el.setting_code === el.code && _el.is_enabled
              ) > -1;
            return { ...el, is_enabled };
          });
          setEmailNotificationsSttingsCodes([...emailFilteredCodes]);
          setMobileNotificationsSttingsCodes([...mobileFilteredCodes]);
        } else {
          setEmailNotificationsSttingsCodes([...notificationsCodes]);
          setMobileNotificationsSttingsCodes([...notificationsCodes]);
        }
        setSelectedNotificationData([...res]);
        setLoading(false);
      }
    });
  };

  const onEmailNotifationSettings = (e: any, index: number) => {
    const data = emailNotificationsSttingsCodes;
    data[index].is_enabled = e.target.checked;
    setEmailNotificationsSttingsCodes([...data]);
  };

  const onMobileNotifationSettings = (e: any, index: number) => {
    const data = mobileNotificationsSttingsCodes;
    data[index].is_enabled = e.target.checked;
    setMobileNotificationsSttingsCodes([...data]);
  };

  const onSaveEmailNotificationsSettings = () => {
    setLoading(true);
    const data: any = [];
    emailNotificationsSttingsCodes.forEach((element: any) => {
      data.push({
        type: 1,
        setting_code: element?.code,
        is_enabled: element?.is_enabled ? element?.is_enabled : false,
      });
    });
    mobileNotificationsSttingsCodes.forEach((element: any) => {
      data.push({
        type: 2,
        setting_code: element?.code,
        is_enabled: element?.is_enabled,
      });
    });
    onSaveNotificationsSettings(data);
  };

  const onSaveNotificationsSettings = (data: any) => {
    setLoading(true);
    NotificationsService.notificationSettingCodes(data).then((res: any) => {
      if (res?.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        setLoading(false);
        getNotificationsSettings(notificationsSttingsCodes);
      }
    });
  };

  const onSaveMobileNotifications = () => {
    setLoading(true);
    const data: any = [];
    mobileNotificationsSttingsCodes.forEach((element: any) => {
      data.push({
        type: 2,
        setting_code: element?.code,
        is_enabled: element?.is_enabled ? element?.is_enabled : false,
      });
    });
    emailNotificationsSttingsCodes.forEach((element: any) => {
      data.push({
        type: 1,
        setting_code: element?.code,
        is_enabled: element?.is_enabled,
      });
    });
    onSaveNotificationsSettings(data);
  };

  const onSavePasswordChange = () => {
    setLoading(true);
    if (
      currentPassword &&
      newPassword &&
      confirmPassword &&
      newPassword === confirmPassword
    ) {
      UsersService.userPasswordChangeOtp(loginUserData?.user_email).then(
        (res: any) => {
          if (res?.error) {
            setLoading(false);
            toast.error(res?.error?.message);
          } else {
            setLoading(false);
            setOptSent(true);
            toast.success("OTP sent to your email");
          }
        }
      );
    } else {
      setLoading(false);
      if (!currentPassword) {
        setCurrentPasswordError(
          normalPasswordValidations(currentPassword, "current password")
        );
      }
      if (!newPassword) {
        setNewPasswordError(normalPasswordValidations(newPassword, "new password"));
      }
      if (!confirmPassword) {
        setConfirmPasswordError(
          normalPasswordValidations(confirmPassword, "confirm password")
        );
      }
      if (newPassword !== confirmPassword) {
        setConfirmPasswordError(
          "Confirm password not matched with new password"
        );
      }
    }
  };

  const onCurrentPassword = (event: any) => {
    setCurrentPasswordError(
      normalPasswordValidations(event.target.value, "current password")
    );
    setCurrentPassword(event.target.value);
  };

  const onNewPassword = (event: any) => {
    setNewPasswordError(
      normalPasswordValidations(event.target.value, "new password")
    );
    setNewPassword(event.target.value);
  };

  const onConfirmPassword = (event: any) => {
    setConfirmPasswordError(
      normalPasswordValidations(event.target.value, "confirm password")
    );
    setConfirmPassword(event.target.value);
  };

  const onChangeOpt = (event: any) => {
    if (!event.target.value) {
      setOtpError("Please enter opt");
    }
    setOtp(event.target.value);
  };
  const onVerifyOtp = () => {
    setLoading(true);
    const data = {
      user_email: loginUserData?.user_email,
      new_password: newPassword,
      old_password: currentPassword,
      otp: otp,
    };
    if (otp) {
      UsersService.userPasswordChange(data).then((res: any) => {
        if (res?.error) {
          setLoading(false);
          toast.error(res?.error?.message);
        } else {
          setLoading(false);
          setOptSent(false);
          toast.success("Password changed successfully");
        }
      });
    } else {
      setLoading(false);
      if (!otp) {
        setOtpError("Please enter opt");
      }
    }
  };

  const onDeleteYourAccount = () => {
    setLoading(true);
    if (accountOtp) {
      const data = {
        uuid: loginUserData?.uuid,
        otp: accountOtp,
      };
      UsersService.userDeleteAccount(accountOtp).then((res: any) => {
        if (res?.error) {
          setLoading(false);
          toast.error(res?.error?.message);
        } else {
          setLoading(false);
          setOptSentDeleteAccount(true);
          toast.success("Your account deleted Successfully");
          history.push("/");
        }
      });
    } else {
      setLoading(false);
      if (!accountOtp) {
        setAccountOtpError("Please enter opt");
      }
    }
  };

  const onDeleteYourAccountOtp = () => {
    UsersService.userDeleteOtp(loginUserData?.user_email).then((res: any) => {
      if (res?.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        setLoading(false);
        setOptSentDeleteAccount(true);
        toast.success("OTP sent to your email");
      }
    });
  };

  const onChangeAccountOpt = (event: any) => {
    setAccountOtp(event.target.value);
    if (!event.target.value) {
      setAccountOtpError("Please enter opt");
    }
  };

  const createCompany = (data: any) => {
    CompanyService.updateCompany(data)
      .then((res) => {
        if (res.error) {
          setLoading(false);
          toast.error(res?.error?.message);
        }
        else {
          setLoading(false);
          toast.success("Saved succssfully");

        }
      })


  }

  return (
    <div>
      {loading && <AppLoader loading={loading}></AppLoader>}
      {location.pathname.includes("account-settings") ? (
        <div className="mx-4 organization_name_heading_div">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="account_setting_left_side_content ">
                  <h4 className="top_heading_styles">Account Settings</h4>
                  <p className="top_para_styles">
                    Manage your account from here
                  </p>
                </div>
              </div>
            </div>
            {/* <div className='col-9'>
						<div className="row">
							<div className="col-12">
								<div className="your_rates_and_payment_info">
									<h5 className="account-setting_sub_heading_styles">Personal Details</h5>
									<p className="top_para_styles">All your personal details update here</p>
									<FormBuilder onUpdate={handleInput}>
										<form>
											<div className='row'>
												<div className="mb-3 col-6">
													<div className='me-2'>
														<label className="form-label job_dis_form_label">First Name
															<span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
														</label>
														<input type="text" className="form-control job_dis_form_control px-3 rounded" id="firstName" name="company_name" defaultValue={userData?.user_firstname} placeholder="Enter first name" />
													</div>
												</div>
												<div className="mb-3 col-6">
													<div className='ms-2'>
														<label className="form-label job_dis_form_label">Last Name
															<span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
														</label>
														<input type="text" className="form-control job_dis_form_control px-3 rounded" id="lastName" name="company_name" defaultValue={userData?.user_lastname} placeholder="Enter last name" />
													</div>
												</div>
											</div>
											<div className="mb-3">
												<label className="form-label job_dis_form_label">Email address
													<span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
												</label>
												<input type="text" className="form-control job_dis_form_control px-3 rounded" id="emailAddress" name="website" placeholder="Enter email address" defaultValue={userData?.user_email} />
											</div>
											<div className="mb-3">
												<div className='row'>
													<PhoneInput
														country={"us"}
														enableSearch={true}
														value={userData?.mobile_no}
														onChange={(phone: any) => onChangeUserMobileNumber(phone)}
													/>
													{userMobileNumberError && <p className="text-danger job_dis_form_label">{userMobileNumberError}</p>}
												
												</div>
											</div>
										</form>
									</FormBuilder>
									<button className='small_btn rounded me-3'>Save</button>
								</div>
							</div>
						</div>
						<div className="row mt-2">
							<div className="col-12">
								<div className="your_rates_and_payment_info">
									<h5 className="account-setting_sub_heading_styles">Company Details</h5>
									<p className="top_para_styles">All your company details update here</p>
									<FormBuilder onUpdate={handleInput}>
										<form>
											<div className="mb-3">
												<label className="form-label job_dis_form_label">Company Name
													<span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
												</label>
												<input type="text" className="form-control job_dis_form_control px-3 rounded" id="companyName" name="company_name" placeholder="Enter company name" defaultValue={companyData?.company_name} />
											</div>
											<div className="mb-3">
												<label className="form-label job_dis_form_label">Country
													<span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
												</label>
												<Select
													onChange={(e) => onSelectCountry(e)}
													options={countryesData}
													placeholder="Select Country"
													name="category_code"
													value={selectedCountry}
												/>
											</div>
											<div className="mb-3">
												<label className="form-label job_dis_form_label">Company Website</label>
												<input type="text" className="form-control job_dis_form_control px-3 rounded" id="companyWebsite" name="website" placeholder="Enter company website" defaultValue={companyData?.website} />
											</div>
											<div className="mb-3">
												<div className='row'>
													<div className="col-md-3">
														<div className="mb-4 pe-3">
															<label className="form-label job_dis_form_label mb-0">Country Code</label>
															<input className="form-control job_dis_form_control" placeholder="Country code" type="text" name="country_code" defaultValue={userData?.country_code} onChange={(event) => onChangeMobileNumberCountryCode(event)} />
															{mobileNumberCountryCodeError && <p className="text-danger job_dis_form_label">{mobileNumberCountryCodeError}</p>}
														</div>
													</div>
													<div className="col-md-9">
														<label className="form-label job_dis_form_label">Phone Number
														</label>
														<div className='d-flex'>
															<input type="text" className="form-control job_dis_form_control px-3 rounded" id="companyPhoneNumber" name="contact_number" placeholder="Phone number" defaultValue={userData?.mobile_no} onChange={(event) => onChangeMobileNumber(event)} />
														</div>
														{mobileNumberError && <p className="text-danger job_dis_form_label">{mobileNumberError}</p>}
													</div>
												</div>
											</div>
										</form>
									</FormBuilder>
									<button className='small_btn rounded me-3' onClick={() => onClickLogin()}>Save</button>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<div className="email_notification_section">
									<h5 className="account-setting_sub_heading_styles">Email Notifications</h5>
									<ul className="email_notification_list ps-0">
										{emailNotificationsSttingsCodes.map((data: any, index: number) => {
											return <li key={index} className="top_para_styles">
												<Form.Check
													type="checkbox" className="me-2"
													id={`defaultcheckbox`}
													label={data?.setting_text}
													checked={data?.is_enabled}
													onChange={(e) => onEmailNotifationSettings(e, index)}
												/>
											</li>
										})}
									</ul>
									<button className='small_btn rounded me-3' onClick={onSaveEmailNotificationsSettings}>Save</button>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<div className="mobile_notification_section">
									<h5 className="account-setting_sub_heading_styles">Mobile Notifications</h5>
									<ul className="mobile_notification_list ps-0">
										{mobileNotificationsSttingsCodes.map((data: any, index: number) => {
											return <li key={index} className="top_para_styles">
												<Form.Check
													type="checkbox" className="me-2"
													id={`defaultcheckbox`}
													label={data?.setting_text}
													checked={data?.is_enabled}
													onChange={(e) => onMobileNotifationSettings(e, index)}
												/>
											</li>
										})}
									</ul>
									<button className='small_btn rounded me-3' onClick={onSaveMobileNotifications}>Save</button>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<div className="change_password_section">
									<h5 className="account-setting_sub_heading_styles">Change Password</h5>
									<p className="top_para_styles">If you wish to change password, please request an email for the same </p>
									<div className="col-4 mb-2 position-relative">
										<label className="form-label para_style">Current Password <span className="text-danger">*</span></label>
										<input type={passwordFieldType} className="form-control job_dis_form_control px-3 rounded manual_profile_padding" id="currentPassowrd" name="current_password" placeholder="Current password" onChange={(e) => onCurrentPassword(e)} />
										{currentPasswordError && <p className="text-danger job_dis_form_label">{currentPasswordError}</p>}
										{passwordFieldType === 'password' ? <i className="bi bi-eye-slash-fill input_eye pt-1" onClick={() => setPasswordFieldType('text')}></i> : <i className="bi bi-eye-fill input_eye pt-1" onClick={() => setPasswordFieldType('password')}></i>}
									</div>
									<div className="col-4 mb-2 position-relative">
										<label className="form-label para_style">New Password <span className="text-danger">*</span></label>
										<input type={newPasswordFieldType} className="form-control job_dis_form_control px-3 rounded manual_profile_padding" id="newPassword" name="new_password" placeholder="New password" onChange={(e) => onNewPassword(e)} />
										{newPasswordError && <p className="text-danger job_dis_form_label">{newPasswordError}</p>}
										{newPasswordFieldType === 'password' ? <i className="bi bi-eye-slash-fill input_eye pt-1" onClick={() => setNewPasswordFieldType('text')}></i> : <i className="bi bi-eye-fill input_eye pt-1" onClick={() => setNewPasswordFieldType('password')}></i>}
									</div>
									<div className="col-4 mb-2 position-relative">
										<label className="form-label para_style">Confirm Password<span className="text-danger">*</span></label>
										<input type={confirmPasswordFieldType} className="form-control job_dis_form_control px-3 rounded manual_profile_padding" id="confirmPassword" name="confirm_password" placeholder="Confirm password" onChange={(e) => onConfirmPassword(e)} />
										{confirmPasswordError && <p className="text-danger job_dis_form_label">{confirmPasswordError}</p>}
										{confirmPasswordFieldType === 'password' ? <i className="bi bi-eye-slash-fill input_eye pt-1" onClick={() => setConfirmPasswordFieldType('text')}></i> : <i className="bi bi-eye-fill input_eye pt-1" onClick={() => setConfirmPasswordFieldType('password')}></i>}
									</div>
									<div className="mt-4">
										<button disabled={optSent} className="large_btn rounded-3" onClick={onSavePasswordChange}>Save</button>
									</div>
									{optSent && <>
										<div className="col-4 mb-2 mt-2">
											<label className="form-label para_style">OTP<span className="text-danger">*</span></label>
											<input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding" id="confirmPassword" name="otp" placeholder="Enter otp" onChange={(e) => onChangeOpt(e)} />
											{otpError && <p className="text-danger job_dis_form_label">{otpError}</p>}
										</div>
										<div className="mt-4">
											<button className="large_btn rounded-3" onClick={onVerifyOtp}>Verify Otp</button>
										</div>
									</>}
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<div className="delete_account_section">
									<h5 className="account-setting_sub_heading_styles">Delete Account</h5>
									<p className="top_para_styles">If you no longer wish to be a part of SiftedX and close your account</p>
									<button disabled={otpSentDeleteAccount} className="btn btn-danger" onClick={onDeleteYourAccountOtp}>Delete Account via email confirmation</button>
									{otpSentDeleteAccount && <>
										<div className="col-4 mb-2 mt-2">
											<label className="form-label para_style">OTP<span className="text-danger">*</span></label>
											<input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding" id="confirmPassword" name="otp" placeholder="Enter otp" onChange={(e) => onChangeAccountOpt(e)} />
											{accountOtpError && <p className="text-danger job_dis_form_label">{accountOtpError}</p>}
										</div>
										<div className="mt-4">
											<button className="large_btn rounded-3" onClick={onDeleteYourAccount}>Verify Otp</button>
										</div>
									</>}
								</div>
							</div>
						</div>
					</div> */}

            <div className="row">
              <div className="col-md-6">
                <div className="rounded-3 bg-white  me-5 pt-3 pb-2">
                  <div className="ms-3 mb-3">
                    <h5 className="account-setting_sub_heading_styles">
                      Change Password
                    </h5>
                    <p className="top_para_styles">
                      If you wish to change password, please request an email
                      for the same{" "}
                    </p>
                    <div className="position-relative">
                      <label className="input" style={{ width: "95%" }}>
                        <input
                          type={passwordFieldType}
                          className="form-control job_dis_form_control rounded manual_profile_padding input__field"
                          id="currentPassowrd"
                          name="current_password"
                          placeholder="Current password"
                          onChange={(e) => onCurrentPassword(e)}
                        />
                        <span className={`input__label`}>
                          Current Password
                          <span
                            style={{ fontSize: "15px", paddingLeft: "5px" }}
                          >
                            *
                          </span>
                        </span>
                      </label>
                      {currentPasswordError && (
                        <p className="text-danger job_dis_form_label">
                          {currentPasswordError}
                        </p>
                      )}
                      {passwordFieldType === "password" ? (
                        <i
                          className="bi bi-eye-slash-fill input_change_password pt-1"
                          onClick={() => setPasswordFieldType("text")}
                        ></i>
                      ) : (
                        <i
                          className="bi bi-eye-fill input_change_password pt-1"
                          onClick={() => setPasswordFieldType("password")}
                        ></i>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="position-relative mt-3">
                          <label className="input" style={{ width: "90%" }}>
                            <input
                              type={newPasswordFieldType}
                              className="form-control job_dis_form_control rounded manual_profile_padding input__field"
                              id="newPassword"
                              name="new_password"
                              placeholder="New password"
                              onChange={(e) => onNewPassword(e)}
                            />
                            <span className={`input__label`}>
                              New Password
                              <span
                                style={{ fontSize: "15px", paddingLeft: "5px" }}
                              >
                                *
                              </span>
                            </span>
                          </label>
                          {newPasswordError && (
                            <p className="text-danger job_dis_form_label">
                              {newPasswordError}
                            </p>
                          )}
                          {newPasswordFieldType === "password" ? (
                            <i
                              className="bi bi-eye-slash-fill input_change_password pt-1"
                              onClick={() => setNewPasswordFieldType("text")}
                            ></i>
                          ) : (
                            <i
                              className="bi bi-eye-fill input_change_password pt-1"
                              onClick={() =>
                                setNewPasswordFieldType("password")
                              }
                            ></i>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="position-relative mt-3">
                          <label className="input" style={{ width: "90%" }}>
                            <input
                              type={confirmPasswordFieldType}
                              className="form-control job_dis_form_control rounded manual_profile_padding input__field"
                              id="confirmPassword"
                              name="confirm_password"
                              placeholder="Confirm password"
                              onChange={(e) => onConfirmPassword(e)}
                            />
                            <span className={`input__label`}>
                              Confirm Password
                              <span
                                style={{ fontSize: "15px", paddingLeft: "5px" }}
                              >
                                *
                              </span>
                            </span>
                          </label>
                          {confirmPasswordError && (
                            <p className="text-danger job_dis_form_label">
                              {confirmPasswordError}
                            </p>
                          )}
                          {confirmPasswordFieldType === "password" ? (
                            <i
                              className="bi bi-eye-slash-fill input_change_password pt-1"
                              onClick={() =>
                                setConfirmPasswordFieldType("text")
                              }
                            ></i>
                          ) : (
                            <i
                              className="bi bi-eye-fill input_change_password pt-1"
                              onClick={() =>
                                setConfirmPasswordFieldType("password")
                              }
                            ></i>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 ms-3 mb-2">
                    <div className="d-flex justify-content-end me-3">
                      <button
                        disabled={optSent}
                        className="large_btn_apply rounded-3"
                        onClick={onSavePasswordChange}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  {optSent && (
                    <>
                      <div className="mb-2 mt-3 ms-3">
                        <label className="input" style={{ width: "95%" }}>
                          <input
                            type={confirmPasswordFieldType}
                            className="form-control job_dis_form_control rounded manual_profile_padding input__field"
                            id="confirmPassword"
                            name="otp"
                            placeholder=" "
                            onChange={(e) => onChangeOpt(e)}
                          />
                          <span className={`input__label`}>
                            OTP
                            <span
                              style={{ fontSize: "15px", paddingLeft: "5px" }}
                            >
                              *
                            </span>
                          </span>
                        </label>
                        {otpError && (
                          <p className="text-danger job_dis_form_label">
                            {otpError}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 ms-3 mb-2">
                        <button
                          className="large_btn_apply rounded-3"
                          onClick={onVerifyOtp}
                        >
                          Verify Otp
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="rounded-3 bg-white  me-5 pt-3 pb-2">
                  <div className="ms-3 mb-3">
                    <h5 className="account-setting_sub_heading_styles">
                      Delete Account
                    </h5>
                    <p className="top_para_styles">
                      If you no longer wish to be a part of SiftedX and close
                      your account
                    </p>
                    {/* <button disabled={otpSentDeleteAccount} className="btn btn-danger" onClick={onDeleteYourAccountOtp}>Delete Account via email confirmation</button> */}
                    <button
                      disabled={otpSentDeleteAccount}
                      className="large_btn_reject"
                      onClick={onDeleteYourAccountOtp}
                    >
                      Delete Account via email confirmation
                    </button>

                    {otpSentDeleteAccount && (
                      <>
                        <div className="mb-2 mt-3">
                          {/* <label className="form-label para_style">OTP<span className="text-danger">*</span></label>
											<input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding" id="confirmPassword" name="otp" placeholder="Enter otp" onChange={(e) => onChangeAccountOpt(e)} /> */}
                          <label className="input" style={{ width: "95%" }}>
                            <input
                              type={confirmPasswordFieldType}
                              className="form-control job_dis_form_control rounded manual_profile_padding input__field"
                              id="confirmPassword"
                              name="otp"
                              placeholder=" "
                              onChange={(e) => onChangeAccountOpt(e)}
                            />
                            <span className={`input__label`}>
                              OTP
                              <span
                                style={{ fontSize: "15px", paddingLeft: "5px" }}
                              >
                                *
                              </span>
                            </span>
                          </label>
                          {accountOtpError && (
                            <p className="text-danger job_dis_form_label">
                              {accountOtpError}
                            </p>
                          )}
                        </div>
                        <div className="mt-4">
                          <button
                            className="large_btn_apply rounded-3"
                            onClick={onDeleteYourAccount}
                          >
                            Verify Otp
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-4 me-5">
              {/* <div className='bg-white'> */}
              {/* <div className="rounded-3 bg-white pt-3 pb-2"> */}
              {/* <div className="ms-3 mb-3"> */}

              <div className="col-md-6">
                <div className="rounded-3 bg-white pt-1 me-22">
                  <div className="row p-3">
                    <div className="col-md-7 me-3">
                      <h5 className="account-setting_sub_heading_styles mb-3">
                        Notifications
                      </h5>
                      <ul className="email_notification_list ps-0">
                        {emailNotificationsSttingsCodes.map(
                          (data: any, index: number) => {
                            return (
                              <li key={index} className="top_para_styles">
                                {/* type="checkbox" className="me-2" */}
                                {/* id={`defaultcheckbox`} */}
                                {data?.setting_text}
                                {/* checked={data?.is_enabled} */}
                                {/* onChange={(e) => onEmailNotifationSettings(e, index)} */}
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>
                    <div className="col-md-1 me-4 ms-5">
                      <h5 className="account-setting_sub_heading_styles mb-3">
                        Email
                      </h5>
                      <ul className="email_notification_list ps-0">
                        {emailNotificationsSttingsCodes.map(
                          (data: any, index: number) => {
                            return (
                              <li key={index} className="top_para_styles ps-3">
                                <Form.Check
                                  type="checkbox"
                                  className="me-2"
                                  id={`defaultcheckbox`}
                                  // label={data?.setting_text}
                                  checked={data?.is_enabled}
                                  onChange={(e) =>
                                    onEmailNotifationSettings(e, index)
                                  }
                                />
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>
                    <div className="col-md-1 ms-4">
                      <h5 className="account-setting_sub_heading_styles mb-3">
                        Mobile
                      </h5>
                      <ul className="mobile_notification_list ps-0">
                        {mobileNotificationsSttingsCodes.map(
                          (data: any, index: number) => {
                            return (
                              <li key={index} className="top_para_styles ps-3">
                                <Form.Check
                                  type="checkbox"
                                  className="me-2"
                                  id={`defaultcheckbox`}
                                  // label={data?.setting_text}
                                  checked={data?.is_enabled}
                                  onChange={(e) =>
                                    onMobileNotifationSettings(e, index)
                                  }
                                />
                              </li>
                            );
                          }
                        )}
                      </ul>
                      <div className="d-flex justify-content-end">
                        <button
                          className="large_btn_apply rounded ms-5  mt-4"
                          onClick={() => { onSaveEmailNotificationsSettings(); onSaveMobileNotifications(); }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* </div> */}
              {/* </div> */}
            </div>

            {/* <div className="row mt-4">
              <div className="col-md-6">
                <div className="rounded-3 bg-white  me-5 pt-3 pb-2">
                  <div className="ms-3 mb-3">
                    <h5 className="account-setting_sub_heading_styles mb-3">
                      Email Notifications
                    </h5>
                    <ul className="email_notification_list ps-0">
                      {emailNotificationsSttingsCodes.map(
                        (data: any, index: number) => {
                          return (
                            <li key={index} className="top_para_styles">
                              <Form.Check
                                type="checkbox"
                                className="me-2"
                                id={`defaultcheckbox`}
                                label={data?.setting_text}
                                checked={data?.is_enabled}
                                onChange={(e) =>
                                  onEmailNotifationSettings(e, index)
                                }
                              />
                            </li>
                          );
                        }
                      )}
                    </ul>
                    <div className="d-flex justify-content-end">
                      <button
                        className="large_btn_apply rounded me-3"
                        onClick={onSaveEmailNotificationsSettings}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="rounded-3 bg-white  me-5 pt-3 pb-2">
                  <div className="ms-3 mb-3">
                    <h5 className="account-setting_sub_heading_styles mb-3">
                      Mobile Notifications
                    </h5>
                    <ul className="mobile_notification_list ps-0">
                      {mobileNotificationsSttingsCodes.map(
                        (data: any, index: number) => {
                          return (
                            <li key={index} className="top_para_styles">
                              <Form.Check
                                type="checkbox"
                                className="me-2"
                                id={`defaultcheckbox`}
                                label={data?.setting_text}
                                checked={data?.is_enabled}
                                onChange={(e) =>
                                  onMobileNotifationSettings(e, index)
                                }
                              />
                            </li>
                          );
                        }
                      )}
                    </ul>
                    <div className="d-flex justify-content-end">
                      <button
                        className="large_btn_apply rounded me-3"
                        onClick={onSaveMobileNotifications}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      ) : (
        // <div className="container-fluid">
        //   <div className="row">
        //     {!location.pathname.includes("account-settings") && (
        //       <div
        //         className="col-12 text-center pt-3 pb-2"
        //         style={{ backgroundColor: "#1D2851" }}
        //       >
        //         <img
        //           src={ShiftedxLogoImg}
        //           alt="loading-logo"
        //           className="create_company_page_siftedx_log"
        //         />
        //       </div>
        //     )}
        //   </div>
        //   <div className="row">
        //     <div className="col-4 create_your_company">
        //       <div className="log_page_border p-4">
        //         <p className="Log_text_style">
        //           {!location.pathname.includes("account-settings")
        //             ? "Create Your Company"
        //             : "Update Your Company"}
        //         </p>
        //         <FormBuilder onUpdate={handleInput}>
        //           <form>
        //             <div className="mb-3">
        //               <label className="form-label job_dis_form_label">
        //                 Company Name
        //                 <span
        //                   style={{
        //                     color: "red",
        //                     fontSize: "15px",
        //                     paddingLeft: "5px",
        //                   }}
        //                 >
        //                   *
        //                 </span>
        //               </label>
        //               <input
        //                 type="text"
        //                 className="form-control job_dis_form_control px-3 rounded"
        //                 id="companyName"
        //                 name="company_name"
        //                 placeholder="Enter company name"
        //                 defaultValue={companyData?.company_name}
        //                 onChange={(e) => onChangeCompanyName(e)}
        //               />
        //               {companyNameError && (
        //                 <p className="text-danger job_dis_form_label">
        //                   {companyNameError}
        //                 </p>
        //               )}
        //             </div>
        //             <div className="mb-3">
        //               <label className="form-label job_dis_form_label">
        //                 Country
        //                 <span
        //                   style={{
        //                     color: "red",
        //                     fontSize: "15px",
        //                     paddingLeft: "5px",
        //                   }}
        //                 >
        //                   *
        //                 </span>
        //               </label>
        //               <Select
        //                 onChange={(e) => onSelectCountry(e)}
        //                 options={countryesData}
        //                 placeholder="Select Country"
        //                 value={selectedCountry}
        //                 name="category_code"
        //               />
        //               {countryError && (
        //                 <p className="text-danger job_dis_form_label">
        //                   {countryError}
        //                 </p>
        //               )}

        //             </div>
        //             <div className="mb-3">
        //               <label className="form-label job_dis_form_label">
        //                 Company Website
        //               </label>
        //               <input
        //                 type="text"
        //                 className="form-control job_dis_form_control px-3 rounded"
        //                 id="companyweb"
        //                 name="website"
        //                 placeholder="Enter company website"
        //                 defaultValue={companyData?.website}
        //               />
        //             </div>
        //             <div className="mb-3">
        //               <div className="row">
        //                 <div className="col-md-5">
        //                   <div className="mb-4 pe-2">
        //                     <label className="form-label job_dis_form_label mb-0">
        //                       Country Code
        //                     </label>
        //                     <input
        //                       className="form-control job_dis_form_control"
        //                       placeholder="Country code"
        //                       type="text"
        //                       name="country_code"
        //                       defaultValue={userData?.country_code}
        //                       onChange={(event) =>
        //                         onChangeMobileNumberCountryCode(event)
        //                       }
        //                     />
        //                     {mobileNumberCountryCodeError && (
        //                       <p className="text-danger job_dis_form_label">
        //                         {mobileNumberCountryCodeError}
        //                       </p>
        //                     )}
        //                   </div>
        //                 </div>
        //                 <div className="col-md-7">
        //                   <label className="form-label job_dis_form_label">
        //                     Phone Number
        //                   </label>
        //                   <div className="d-flex">
        //                     <input
        //                       type="text"
        //                       className="form-control job_dis_form_control px-3 rounded"
        //                       id="phone_number"
        //                       name="contact_number"
        //                       placeholder="Phone number"
        //                       defaultValue={companyData?.contact_number}
        //                       onChange={(event) => onChangeMobileNumber(event)}
        //                     />
        //                   </div>
        //                   {mobileNumberError && (
        //                     <p className="text-danger job_dis_form_label">
        //                       {mobileNumberError}
        //                     </p>
        //                   )}
        //                 </div>
        //               </div>
        //             </div>
        //           </form>
        //         </FormBuilder>
        //         {loading ? (
        //           <div className="text-center">
        //             <div className="spinner-border" role="status">
        //               <span className="sr-only">Loading...</span>
        //             </div>
        //           </div>
        //         ) : (
        //           <div>
        //             <button
        //               className="small_btn rounded"
        //               onClick={onClickLogin}
        //             >
        //               Save
        //             </button>
        //           </div>
        //         )}
        //       </div>
        //     </div>
        //   </div>
        //   {!location.pathname.includes("account-settings") && (
        //     <div className="row">
        //       <div className="col-md-4 col-12 text-center mx-auto">
        //         <div className="login_page_below_content_style">
        //           Don’t worry, you can change this later
        //         </div>
        //       </div>
        //     </div>
        //   )}
        //   <div className="row">
        //     <div className="col-4 plans_main_div">
        //       <div className="log_page_border">
        //         <div className="row">
        //           <div className="col-md-12 col-12 p-3">
        //             <h5 style={{ textAlign: "left" }}>Plans</h5>
        //           </div>{" "}
        //         </div>
        //         <div className="row p-3">
        //           <div className="col-2  mx-auto">
        //             <img src={individual} alt="icon" />
        //           </div>
        //           <div className="col-1"></div>
        //           <div className="col-7 mx-auto">
        //             <label>
        //               <p>
        //                 <strong>Individual</strong>
        //                 <br />
        //                 Suitable for recruiters using the platform as
        //                 individuals, as opposed to company users and teams.
        //                 <br />
        //                 Simple pay per interview model enables you to start
        //                 using the platform right away.
        //                 <br />
        //                 Platform usage is free of charge. Premium features like
        //                 not available.
        //               </p>
        //               <small>
        //                 <ul style={{ color: "#616D78" }}>
        //                   <li>
        //                     Create Job Requisition with skills and experience
        //                     required
        //                   </li>
        //                   <li>
        //                     Choose from the list of matching SMEs or let SiftedX
        //                     auto-match
        //                   </li>
        //                   <li>
        //                     Monitor the progress of interviews being scheduled
        //                     and conducted
        //                   </li>
        //                   <li>
        //                     Receive detailed evaluation report and video of the
        //                     interview along with a 2min audio summary by the SME
        //                   </li>
        //                 </ul>
        //               </small>
        //             </label>
        //           </div>
        //           <div className="col-1"></div>
        //           <div className="col-1">
        //             <Form.Check
        //               type="radio"
        //               onChange={() => onChangePlan("Individual")}
        //               checked={selectedPlan === "Individual" ? true : false}
        //               name="group1"
        //             />
        //           </div>
        //         </div>
        //         <hr />
        //         <div className="row p-3">
        //           <div className="col-2">
        //             <img src={corporate} alt="icon" />
        //           </div>
        //           <div className="col-1"></div>
        //           <div className="col-7 mx-0">
        //             <label>
        //               <p>
        //                 <strong>Corporate</strong>
        //                 <br />
        //                 Suitable for recruitment teams of all sizes.
        //                 <br />
        //                 Below premium features are  available on top of
        //                 everything that Individual account provides.
        //               </p>
        //               <small style={{ color: "#616D78" }}>
        //                 <ul>
        //                   <li>
        //                     Add team members for seamless allocation of jobs
        //                   </li>
        //                   <li>
        //                     Ability to tag hiring managers in the jobs, who can
        //                     monitor the progress
        //                   </li>
        //                   <li>
        //                     Mark your favorite SMEs for easy selection and share
        //                     them with your team
        //                   </li>
        //                   <li>
        //                     Company admin user for effective management of roles
        //                     and access rights{" "}
        //                   </li>
        //                   <li>Interview videos are available upto 1year</li>
        //                   <li>
        //                     Access the SiftedX APIs to integrate with your
        //                     existing Application Tracking and other HR systems
        //                     USD 500/user/month with minimum 3 users 
        //                   </li>
        //                 </ul>
        //               </small>
        //             </label>{" "}
        //           </div>
        //           <div className="col-1"></div>
        //           <div className="col-1">
        //             <Form.Check
        //               type="radio"
        //               name="group1"
        //               onChange={() => onChangePlan("Corporate")}
        //               checked={selectedPlan === "Corporate" ? true : false}
        //             />
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>


        // <SelectPlans/>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className='organization_logo navbar navbar-dark flex-md-nowrap px-3 p-lg-0"'>
                <img src={LogoImg} alt="loading" className="ms-4" />
              </div>
            </div>
          </div>
          <div className="bg-white ms-lg-5 me-lg-5 rounded-3 ">
            <Stepper
              nonLinear
              alternativeLabel
              activeStep={activesteps}
              className={`w-50 w-sm-100 m-auto mt-3 pt-4 `}
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
              >
                {activesteps === 0 && (
                  <>
                    <SelectPlans />
                  </>
                )}
                {activesteps === 1 && <Companydetails onSave={createCompany} />}
              </div>
            </>
          </div>
        </div>
      )}

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <div className="invite_team_heading">Add Payment Method</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 px-2">
              <div className="mb-4">
                <label className="form-label job_dis_form_label mb-0">
                  Card Holder Name
                </label>
                <input
                  className="form-control job_dis_form_control"
                  placeholder="Card Holder Name"
                  type="text"
                  name="account_name"
                  onChange={(e) => onChangeCardName(e)}
                />
                {accountNameError && (
                  <p className="text-danger job_dis_form_label">
                    {accountNameError}
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-12 px-2">
              <div className="mb-4">
                <label className="form-label job_dis_form_label mb-0">
                  Card Number
                </label>
                <input
                  className="form-control job_dis_form_control"
                  placeholder="Card Number"
                  type="text"
                  name="account_number"
                  onChange={(e) => onChangeCardNumber(e)}
                />
                {accountNumberError && (
                  <p className="text-danger job_dis_form_label">
                    {accountNumberError}
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-12 px-2">
              <div className="mb-4">
                <label className="form-label job_dis_form_label mb-0">
                  Card Type
                </label>
                <select
                  className="form-select job_dis_form_control"
                  onChange={(e) => onChangeCardType(e)}
                >
                  <option value="" selected>
                    Select Card Type
                  </option>
                  <option value="1">AMERICAN EXPRESS</option>
                  <option value="2">MasterCard</option>
                  <option value="3">VISA</option>
                  <option value="4">VISA Electron</option>
                  <option value="5">Maestro</option>
                  <option value="6">SOLO</option>
                </select>
                {accountAccountCardError && (
                  <p className="text-danger job_dis_form_label">
                    {accountAccountCardError}
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-12 px-2">
              <div className="mb-4">
                <label className="form-label job_dis_form_label mb-0">
                  Expiry Date
                </label>
                <input
                  className="form-control job_dis_form_control"
                  placeholder="Expiry Date"
                  type="text"
                  name="expiry_month_year"
                  onChange={(e) => onChangeCardExpiry(e)}
                />
                {expiryMonthYearError && (
                  <p className="text-danger job_dis_form_label">
                    {expiryMonthYearError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-center">
            <button
              className="small_btn rounded me-3"
              onClick={() => onSavePaymentMethod()}
            >
              Save
            </button>
            <button
              className="small_btn rounded"
              onClick={() => setModalShow(false)}
            >
              Close
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
