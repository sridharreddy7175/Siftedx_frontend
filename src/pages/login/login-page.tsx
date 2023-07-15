import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginService } from "../../app/service/login.service";
import { ERROR_CODES, SX_ROLES } from "../../app/utility/app-codes";
import LogoImg from "../../assets/images/SiftedX Logo.png";
import LoginBG from "../../assets/icon_images/Login BG.png";
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
import axios from "axios";
import {
  emialValidations,
} from "../../app/utility/form-validations";
import { CompanyService } from "../../app/service/company.service";
import { SmeService } from "../../app/service/sme.service";
import { Alert } from "react-bootstrap";
// import { useJwt } from "react-jwt";
import { isExpired, decodeToken } from "react-jwt";
import GoogleImg from "../../assets/icon_images/google_img_icon.svg";
import linkedImgIcon from "../../assets/icon_images/linkedin_img_icon.svg";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import { linkedInClientId } from "../../config/constant";
import { UsersService } from "../../app/service/users.service";
import { GoogleSignInBtn } from "../../components/google-signin-btn";

export const LoginPage = () => {

  const [loginValidationErrors, setLoginValidationErrors] = useState<
    FormControlError[]
  >([]);
  const [loginData, setLoginData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordFieldType, setPasswordFieldType] = useState("password");
  const [resError, setResError] = useState("");
  const history = useHistory();
  const [rememberMeData, setRememberMeData] = useState<any>({});
  const [isRememberMeChecked, setIsRememberMeChecked] = useState<any>(false);


  const formValidations = [
    new FormField("username", [FormValidators.REQUIRED]),
    new FormField("password", [FormValidators.REQUIRED]),
  ];

  useEffect(() => {
    getUserCredentials(new URLSearchParams(window.location.search).get("code"));
    const rememberMeDataStr = localStorage.getItem('rememberMeData');
    if (rememberMeDataStr) {
      const rememberMeData = JSON.parse(rememberMeDataStr);
      setRememberMeData({ ...rememberMeData });
      setIsRememberMeChecked(rememberMeData?.rememberMeData)
      onClickLogin(rememberMeData);
    }
  }, []);


  const onFailure = (err: any) => {
    console.log('err ', err);

  }

  const onSuccess = (data: any) => {
    console.log('data ', data);

  }
  const getUserCredentials = (code: any) => {
    if (code) {
      setLoading(true);
      LoginService.loginWithLinkedin(code).then(
        res => {
          if (res.error) {
            setLoading(false);
            setResError(res.error?.message);
            // toast.error(res.error?.message);
            if (ERROR_CODES.USER_NOT_VERIFIED === res.error?.code) {
              history.push(`/verify-email/Linkedin registered email`);
            }
          } else {
            sessionStorage.setItem("userRole", res?.role);
            sessionStorage.setItem("token", res?.auth);
            sessionStorage.setItem("userUuid", res?.uuid);
            sessionStorage.setItem("loginData", JSON.stringify(res));
            if (res?.role === SX_ROLES.SME) {
              sessionStorage.setItem("userRole", SX_ROLES.SME);
              sessionStorage.setItem("company_uuid", res.company_uuid);
              getSmeProfile(res.uuid, res?.profile_setup_status);
            }
          }
        },
        err => {

        }
      )
    }
  };

  const handleInput = (data: any) => {
    setLoginData(data);
    const errors: any = FormValidator(formValidations, data.value);
    setLoginValidationErrors(errors);
  };

  const onClickLogin = (rememberMe: any) => {
    const loginsData = rememberMe !== '' ? rememberMe : { ...loginData.value };
    const errors: FormControlError[] = FormValidator(
      formValidations,
      loginsData
    );
    if (loginsData.username && loginsData.password) {
      if (errors.length < 1) {
        setLoading(true);
        LoginService.login(loginsData).then((res) => {
          if (res.error) {
            setLoading(false);
            setResError(res.error?.message);
            // toast.error(res.error?.message);
            if (ERROR_CODES.USER_NOT_VERIFIED === res.error?.code) {
              history.push(`/verify-email/${loginsData?.username}`);
            }
          } else {
            if (isRememberMeChecked) {
              loginsData.rememberMeData = true;
              const data = JSON.stringify(loginsData);
              localStorage.setItem('rememberMeData', data);
            }
            sessionStorage.setItem("userRole", res?.role);
            sessionStorage.setItem("token", res?.auth);
            sessionStorage.setItem("userUuid", res?.uuid);
            sessionStorage.setItem("loginData", JSON.stringify(res));
            if (res?.role === SX_ROLES.SuperAdmin) {
              history.push("/dashboard/home");
            } else if (res?.role === SX_ROLES.CompanyAdmin) {

              const isEmailverified =
                sessionStorage.getItem("isEmailverified") || "";
              sessionStorage.setItem("userRole", SX_ROLES.CompanyAdmin);
              sessionStorage.setItem("company_uuid", res.company_uuid);

              getComapnyDetails(res.company_uuid);
            } else if (res?.role === SX_ROLES.SME) {
              const isEmailverified =
                sessionStorage.getItem("isEmailverified") || "";
              sessionStorage.setItem("userRole", SX_ROLES.SME);
              sessionStorage.setItem("company_uuid", res.company_uuid);
              getSmeProfile(res.uuid, res?.profile_setup_status);
            } else if (res?.role === SX_ROLES.Recruiter) {
              sessionStorage.setItem("userRole", SX_ROLES.Recruiter);
              sessionStorage.setItem("company_uuid", res.company_uuid);
              getComapnyDetails(res.company_uuid);

              history.push("/dashboard/home");
            } else if (res?.role === SX_ROLES.HR_Admin) {
              sessionStorage.setItem("userRole", SX_ROLES.HR_Admin);
              sessionStorage.setItem("company_uuid", res.company_uuid);
              history.push("/dashboard/home");
            }
            // else {
            //     sessionStorage.setItem('userRole', res?.role);
            //     history.push("/dashboard/home");
            // }
          }
        });
      }
    } else {
      if (!loginsData.username) {
        setEmailError(emialValidations(loginsData.username, "email"));
      }
      if (!loginsData.password) {
        setPasswordError('Please enter your password');
      }
    }
  };

  const getSmeProfile = (uuid: string, step: number) => {
    switch (step) {
      case 0:
        history.push(`/sme-step-one/${uuid}`);
        break;
      case 1:
        history.push(`/sme-step-two/${uuid}`);
        break;
      case 2:
        history.push(`/sme-step-three/${uuid}`);
        break;
      default:
        history.push('/dashboard/home');
        break;
    }
    // SmeService.getSmeProfileSteps().then((res) => {
    //   if (res?.isSkillsAdded && res?.isBasicInfoAdded && res?.isPaymentsAdded) {
    //     history.push("/dashboard/home");
    //   } else {
    //     history.push(`${!res?.isBasicInfoAdded ? '/sme-step-one' : !res?.isSkillsAdded ? 'sme-step-two' : '/sme-step-three'}/${companyUuid}`);
    //   }
    // });

  };
  const getInputValid = (control: string) => {
    const value = GetControlIsValid(loginValidationErrors, control);
    return value;
  };
  const getComapnyDetails = (companyUuid: string) => {
    CompanyService.getCompanyById(companyUuid).then((res) => {
      if (res?.error) {
        toast.error(res?.error?.message);
      } else {
        sessionStorage.setItem("companyData", JSON.stringify(res));
        if (res?.profile_setup === 0) {
          history.push("/create-comapny");
        } else {
          history.push("/dashboard/home");
        }
      }
    });
  };

  const onClickForgotPassword = () => {
    history.push(`/forgot-password`);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      onClickLogin('');
    }
  };

  const hanldeChangeEmail = (event: any) => {
    setResError("");
    setEmailError("");
  };

  const handleChangePassword = (event: any) => {
    setResError("");
    setPasswordError("");
  };

  const onChangePasswordType = (type: string) => {
    setPasswordFieldType(type);
  };

  const onChangeRememberMe = (event: any) => {
    const loginsData = { ...loginData.value };
    setIsRememberMeChecked(event.target.checked);
    if (loginsData.username && loginsData.password && event.target.checked) {
      loginsData.rememberMeData = true;
      const data = JSON.stringify(loginsData);
      localStorage.setItem('rememberMeData', data);
    } else {
      localStorage.setItem('rememberMeData', '');
    }
  }

  const { linkedInLogin } = useLinkedIn({
    clientId: linkedInClientId,
    redirectUri: `${window.location.origin}/linkedin`,
    onSuccess: (code) => {
      getUserCredentials(code);
    },
    scope: "r_emailaddress r_liteprofile",
    onError: (error) => { },
    
  });

  var onLoginSigninWithGoogle = (response: any) => {
    const tokenVal: any = decodeToken(response.credential);
    setLoading(true);
    LoginService.loginWithGoogle(response.credential).then((res) => {
      if (res.error) {
        setLoading(false);
        setResError(res.error?.message);
        // toast.error(res.error?.message);
        if (ERROR_CODES.USER_NOT_VERIFIED === res.error?.code) {
          history.push(`/verify-email/${tokenVal?.email}`);
        }
      } else {
        sessionStorage.setItem("userRole", res?.role);
        sessionStorage.setItem("token", res?.auth);
        sessionStorage.setItem("userUuid", res?.uuid);
        sessionStorage.setItem("loginData", JSON.stringify(res));
        if (res?.role === SX_ROLES.SME) {
          sessionStorage.setItem("userRole", SX_ROLES.SME);
          sessionStorage.setItem("company_uuid", res.company_uuid);
          getSmeProfile(res.uuid, res?.profile_setup_status);
        }
      }
    });
  }

  return (
    <div>
      <div className="container-fluid">
        <div className="row vh-100-all">
          <div className="col-sm-12 col-md-5 bg-black mobile_hide rigth_image d-none  d-lg-block">
            <div className="left_side_circle_div">
              <p className="circle_text" style={{ top: "50%" }}>
                Technical screening done at scale, by<br /> expert interviewers.
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-7 sx-bg-page position-relative">
            <div className="d-flex align-items-center justify-content-center h-100 flex-column">
              <div className="">
                <img
                  src={LogoImg}
                  alt="logo"
                  className="right_side_profile_img"
                />
              </div>
              <div className="bg-white p-4 rounded shadow w-350">
                <div className="text-center mb-2 mt-3 mt-lg-1 mt-sm-1">
                  <p className="fs_14">Login To Your Account</p>
                </div>

                <div className="d-flex align-items-center justify-content-center mb-3">
                  <div>
                    <div className="mb-2">
                      <GoogleSignInBtn text="signin_with" onSuccess={onLoginSigninWithGoogle}></GoogleSignInBtn>
                    </div>
                    <div className="d-flex justify-content-center">
                    <button
                          onClick={linkedInLogin}
                          className="ps-5 btn form-control  d-flex bg-blue-clr text-white align-items-center justify-content-center position-relative">
                          <img src={linkedImgIcon} alt="loading" className="position-absolute bg-white pt-2 pb-1 px-1 rounded-left" style={{ left: "2px",height:"30px", width: "35px" }} />
                         Sign in with Linkedin
                        </button>
                    </div>
                  </div>
                </div>
                <div className="middle_text fs_14 mb-3"><span className="px-4">or</span></div>
                {resError && <Alert variant={"danger"}>{resError}</Alert>}
                <FormBuilder onUpdate={handleInput}>
                  <form>
                    <div className="mb-4 mb-lg-3 mb-sm-4">
                      {/* <label className="form-label job_dis_form_label">
                          Email
                        </label> */}
                      <input
                        type="email"
                        className="form-control px-3 rounded"
                        id="FirstName"
                        name="username"
                        placeholder="Email"
                        onChange={(e) => hanldeChangeEmail(e)}
                      />
                      {emailError && (
                        <p className="text-danger job_dis_form_label">
                          {emailError}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 mb-lg-3 mb-sm-4 position-relative">
                      <input
                        type={passwordFieldType}
                        className="form-control px-3 rounded"
                        id="password"
                        name="password"
                        placeholder="Password"
                        onKeyPress={handleKeyPress}
                        onChange={(e) => handleChangePassword(e)}
                      />
                      {passwordFieldType === "password" ? (
                        <i
                          className="bi bi-eye-slash-fill input_eye"
                          onClick={() => onChangePasswordType("text")}
                        ></i>
                      ) : (
                        <i
                          className="bi bi-eye-fill input_eye"
                          onClick={() => onChangePasswordType("password")}
                        ></i>
                      )}
                      {passwordError && (
                        <p className="text-danger job_dis_form_label">
                          {passwordError}
                        </p>
                      )}
                    </div>
                  </form>
                </FormBuilder>
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      className="btn sx-bg-primary form-control rounded mt-1"
                      onClick={() => onClickLogin('')}
                    >
                      Log in
                    </button>
                  </div>
                )}

                <div className="form-check mb-3 mt-3 ms-1">
                  <input
                    className="form-check-input input-remember"
                    type="checkbox"
                    id="flexCheckDefault"
                    checked={isRememberMeChecked}
                    onChange={(e) => onChangeRememberMe(e)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Remember Me
                  </label>
                </div>
                {/* <div>
                  <p
                    className=" login_page_below_content_style pointer ms-1 mb-0"
                    onClick={() => onClickForgotPassword()}
                  >
                    Forgot your password?
                  </p>
                </div> */}
                <small>
                  <NavLink className='ms-1' to={"/forgot-password"}>Forgot your password?</NavLink>
                </small>
              </div>
              {/* <div id="g_id_onload"
                data-client_id="110337863357-a6m0pt8cogliaghr7rejui9capnl9a13.apps.googleusercontent.com"
                data-callback = 'customCallback'
                >
              </div> */}
              {/* <div className="g_id_signin"
                data-type="standard"
                data-size="large"
                data-theme="outline"
                data-text="sign_in_with"
                data-shape="rectangular"
                data-logo_alignment="left">
              </div> */}
              <div className="pt-5 pt-lg-4 pt-sm-5 text-center">
                {/* <span className=" login_page_below_content_style pointer text-decoration-none dont-account text-center">
                  Don't have an account?  <span className="px-2 rounded fw_6"><NavLink to={"/create-company"}>Company</NavLink> | <NavLink to={"/create-sme"}>SME</NavLink></span>
                </span> */}
                <small className="form-check-label">
                  Don't have an account?
                  <NavLink className='ms-1' style={{ fontWeight: "700" }} to={"/create-company"}>Company</NavLink> | <NavLink to={"/create-sme"} style={{ fontWeight: "700" }}>SME</NavLink>
                </small>
              </div>
            </div>
            <div className="mt-5 text-center position-absolute bottom-0 w-100">
              <p className="copyright ms-3">Copyright © 2022 SiftedX. All Rights Reserved.</p>
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
