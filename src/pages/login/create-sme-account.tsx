import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { NavLink, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { UsersService } from "../../app/service/users.service";
import { ERROR_CODES } from "../../app/utility/app-codes";
import {
  emailCompanyValidations,
  emialValidations,
  nameValidations,
  passwordValidations,
} from "../../app/utility/form-validations";
import LogoImg from "../../assets/images/SiftedX Logo.svg";
import FormBuilder from "../../components/form-builder";
import { SmeService } from "../../app/service/sme.service";
import linkedInImg from "../../assets/images/linked_in.png";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import { Modal } from "react-bootstrap";
import { linkedInClientId } from "../../config/constant";
import { PasswordValidation } from "../../components/password-validation";
import { Terms } from "../../components/terms";
import { PrivacyPolicy } from "../../components/privacyPolicy";
import GoogleImg from "../../assets/icon_images/google_img_icon.svg";
import linkedImgIcon from "../../assets/icon_images/linkedin_img_icon.svg";
import { isExpired, decodeToken } from "react-jwt";
import { GoogleSignInBtn } from "../../components/google-signin-btn";

export const CreateSMEAccount = () => {
  let { id } = useParams<{ id: string }>();
  const [userFormData, setUserFormData] = useState<any>({});
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  // const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  // const [showCreateAccount, setShowCreateAccount] = useState(false);
  const location = useLocation().pathname.split("/")[1];
  const [passwordFieldType, setPasswordFieldType] = useState("password");
  const [conformPasswordFieldType, setConformPasswordFieldType] = useState("password");
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const handleCloseTermsOfService = () => setShowTermsOfService(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const handleClosePrivacyPolicy = () => setShowPrivacyPolicy(false);
  const [showPasswordErrorPopup, setShowPasswordErrorPopup] = useState(false);
  const handleClosePasswordErrorPopup = () => setShowPasswordErrorPopup(false);
  const [passwordError, setPasswordError] = useState<any>({ number: true, upper: true, lower: true, specialChar: true, strLength: true });
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [linkedinErrormsg, setLinkedinErrormsg] = useState("")

  useEffect(() => {
    if (location === "accept") {
      UsersService.getInvitation(id).then((res) => {
        let company = res?.user_email.split("@");
        company = company[1].split(".");
        // setCompanyName(company[0]);
        setUserFormData({ value: { user_email: res?.user_email } });
      });
    }
  }, []);

  const getUserCredentials = (code: any) => {
    setLoading(true);
    UsersService.signUpWithLinkedIn(code).then(
      data => {
        console.log('data ', data.error);
        setLinkedinErrormsg(data.error)
        if (!data.error) {
          history.push(`/verify-email/Linkedin registered email`);
        } else {
          if (data.error?.code === ERROR_CODES.USER_ALREADY_EXIST) {
            // show error
          }
        }
        setLoading(false);
      },
      err => {
        console.log('err ', err);
        setLoading(false);
      }
    )
    // UsersService.getUserCredentials(code).then((data) => {
    //   setUserFormData({
    //     value: {
    //       user_firstname: data?.firstName,
    //       user_lastname: data?.lastName,
    //       user_email: data?.email,
    //     },
    //   });
    // });
  };

  const { linkedInLogin } = useLinkedIn({
    clientId: linkedInClientId,
    redirectUri: `${window.location.origin}/linkedin`,
    onSuccess: (code) => {
      getUserCredentials(code);
    },
    scope: "r_emailaddress r_liteprofile",
    onError: (error) => { },
  });

  const handleSmeInput = (data: any) => {
    setLinkedinErrormsg("")
    data.value = { ...userFormData.value, ...data.value };
    setUserFormData(data);
    setPasswordError({ ...passwordValidations(data.value.password, "password") });
    const isConfirmPwdValid = data.value.confirmPassword === data.value.password;
    setConfirmPasswordError(!isConfirmPwdValid);
  };

  const onClickSmeCreation = () => {
    setIsSubmitClicked(true);
    setLoading(true);
    const smeData = { ...userFormData.value };
    const isConfirmPwdValid = smeData.confirmPassword === smeData.password;


    setConfirmPasswordError(!isConfirmPwdValid);
    if (userFormData.isValid && isConfirmPwdValid) {
      if (location === "accept") {
        smeData.gender = "";
        smeData.mobile_no = "";
        UsersService.acceptInvitation(id, smeData).then((res) => {
          if (res.error) {
            setLoading(false);
            if (ERROR_CODES.USER_ALREADY_EXIST === res.error) {
              toast.error("User already exist");
            } else if (ERROR_CODES.USER_NOT_VERIFIED === res.error) {
              toast.error("User not verified");
            }
          } else {
            setLoading(false);
            history.push("/");
          }
        });
      } else {
        SmeService.registerSme(smeData).then((res) => {
          if (res.error) {
            setLoading(false);
            if (res.error) {
              toast.error(res.error.message);
            }
          } else {
            setLoading(false);
            history.push(`/verify-email/${smeData?.user_email}`);
          }
        });
      }
    } else {
      setLoading(false);
      if (!smeData?.password) {
        setShowPasswordErrorPopup(true);
        setPasswordError({ ...passwordValidations(smeData?.password, "password") });
      }
      if (smeData.password !== smeData.conformPassword) {
        setConfirmPasswordError(true);
      }

    }
  };

  const onChangePasswordType = (type: string) => {
    setPasswordFieldType(type);
  };

  const onChangeConformPasswordType = (type: string) => {
    setConformPasswordFieldType(type)
  }
  const hidePasswordErrorPopup = (event: any) => {
    handleClosePasswordErrorPopup();
  }

  var onSignupWithGoogle = async (response: any) => {
    const tokenVal: any = decodeToken(response.credential);
    setLoading(true);
    console.log('onSignupWithGoogle ', response, tokenVal);
    
    UsersService.signUpWithGoogle(response.credential).then(res => {
      if (res.error) {
        setLoading(false);
        if (res.error) {
          toast.error(res.error.message);
        }
      } else {
        setLoading(false);
        history.push(`/verify-email/${tokenVal?.email}`);
      }
    });
  }
  return (
    <div>
      <div className="container-fluid">
        <div className="row vh-100-all">
          <div className="col-sm-12 col-md-5 bg-black mobile_hide rigth_image d-none d-lg-block">
            <div className="left_side_circle_div">
              <p className="circle_text" style={{ top: "50%" }}>
                Technical screening done at scale, by<br /> expert interviewers.
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-7 sx-bg-page position-relative">
            <div className="d-flex align-items-center justify-content-center h-100 flex-column" style={{
              minHeight: '800px'
            }}>
              <div className="">
                <img
                  src={LogoImg}
                  alt="logo"
                  className="right_side_profile_img"
                />
              </div>
              <div>
                <div className="bg-white p-4 rounded shadow w-350 mb-3">
                  <div>
                    <div className="text-center mb-2 mt-1">
                      <p className="fs_14">Create A SME Account</p>
                    </div>
                    <div className="d-flex flex-column align-items-center mb-3">
                      <div>
                        <div className="mb-2">
                          <GoogleSignInBtn text="signup_with" onSuccess={onSignupWithGoogle}></GoogleSignInBtn>
                        </div>
                        <button
                          onClick={linkedInLogin}
                          className="ps-5 btn form-control  d-flex bg-blue-clr text-white align-items-center justify-content-center position-relative">
                          <img src={linkedImgIcon} alt="loading" className="position-absolute bg-white pt-2 pb-1 px-1 rounded-left" style={{ left: "2px", height: "30px", width: "35px" }} />
                         Sign in with Linkedin
                        </button>
                        {
                          linkedinErrormsg && <small className="text-danger f_12">{linkedinErrormsg}</small>
                        }
                      </div>
                    </div>
                    <div className="middle_text fs_14 mb-3"><span className="px-4">or</span></div>
                    {/* <div className="mb-3">
                      <button
                        onClick={linkedInLogin}
                        className="btn form-control d-flex bg-blue-clr text-white align-items-center justify-content-center position-relative">
                        <img src={linkedInImg} alt="loading" className="position-absolute" style={{ left: 10 }} />
                        Fetch Information from Linkedin
                      </button>
                    </div> */}
                    <FormBuilder onUpdate={handleSmeInput} showValidations={isSubmitClicked}>
                      <form>
                        <div className="mb-4 mb-lg-3 mb-sm-4">
                          <input
                            type="text"
                            className="form-control px-3 rounded"
                            id="FirstName"
                            name="user_firstname"
                            placeholder="First Name *"
                            defaultValue={
                              userFormData?.value?.user_firstname
                            }
                            data-validate-required="Please enter your first name"
                            data-validate-name='Special characters are not allowed'
                          />
                        </div>
                        <div className="mb-4 mb-lg-3 mb-sm-4">
                          <input
                            type="text"
                            className="form-control px-3 rounded"
                            id="LastName"
                            name="user_lastname"
                            placeholder="Last Name *"
                            defaultValue={
                              userFormData?.value?.user_lastname
                            }
                            data-validate-required="Please enter your last name"
                            data-validate-name='Special characters are not allowed'
                          />
                        </div>
                        <div className="mb-4 mb-lg-3 mb-sm-4">
                          <input
                            type="text"
                            className="form-control px-3 rounded"
                            id="WorkEmail"
                            name="user_email"
                            placeholder="Email *"
                            data-validate-required="Please enter your work email"
                            data-validate-email="personal email"
                            defaultValue={userFormData?.value?.user_email}
                            disabled={location === "accept"}
                          />
                        </div>
                        <div className="mb-4 mb-lg-3 mb-sm-4 position-relative">
                          <input
                            type={passwordFieldType}
                            className="form-control px-3 rounded"
                            id="Password"
                            name="password"
                            placeholder="Password *"
                            onFocus={() => setShowPasswordErrorPopup(true)}
                            onBlur={(event) => hidePasswordErrorPopup(event)}
                          />
                          {passwordFieldType === "password" ? (
                            <i
                              className="bi bi-eye-slash-fill input_eye"
                              onClick={() => onChangePasswordType("text")}
                            ></i>
                          ) : (
                            <i
                              className="bi bi-eye-fill input_eye"
                              onClick={() =>
                                onChangePasswordType("password")
                              }
                            ></i>
                          )}
                          <PasswordValidation isShow={showPasswordErrorPopup} errors={passwordError} customClass={'sme_password_modal fs_14 p-4'} />
                          {/* {showPasswordErrorPopup && <i className="arrow right sme_password_arrow"></i>} */}
                          {/* {passwordError && (
                            <p className="text-danger job_dis_form_label">
                              {passwordError}
                            </p>
                          )} */}
                        </div>

                        <div className="mb-4 mb-lg-3 mb-sm-4 position-relative">
                          <input
                            type={conformPasswordFieldType}
                            className="form-control px-3 rounded"
                            id="conformPassword"
                            name="confirmPassword"
                            placeholder="confirm Password *"
                          />
                          {conformPasswordFieldType === "password" ? (
                            <i
                              className="bi bi-eye-slash-fill input_eye"
                              onClick={() => onChangeConformPasswordType("text")}
                            ></i>
                          ) : (
                            <i
                              className="bi bi-eye-fill input_eye"
                              onClick={() =>
                                onChangeConformPasswordType("password")
                              }
                            ></i>
                          )}
                          {confirmPasswordError &&
                            <small className="text-danger f_12">Confirm Password does not matched</small>
                          }
                        </div>

                      </form>
                    </FormBuilder>
                    <p className="f_12">By Clicking Sign Up, you agree to our <span className="fc_yellow pointer" onClick={() => setShowTermsOfService(true)} >Terms of Service</span> and <span className="fc_yellow pointer" onClick={() => setShowPrivacyPolicy(true)}>Privacy Policy</span></p>
                    {loading ? (
                      <div className="text-center">
                        <div className="spinner-border" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="btn sx-bg-primary w-100 mb-3"
                        onClick={onClickSmeCreation}
                      >
                        Sign up
                      </button>
                    )}
                  </div>
                </div>
                <div className="pt-3 text-center" >
                  <span
                    className="fs_14"
                  >
                    Already Have An Account?  <NavLink to={"/"} className="mr-2 btn-login">Login</NavLink>
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-5 text-center position-absolute bottom-0 w-100">
              <p className="copyright ms-3">Copyright © 2022 SiftedX. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showTermsOfService} onHide={handleCloseTermsOfService} aria-labelledby="contained-modal-title-vcenter" size="xl"
        centered>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <Terms />
        </Modal.Body >
        <Modal.Footer></Modal.Footer>
      </Modal>
      <Modal show={showPrivacyPolicy} onHide={handleClosePrivacyPolicy} aria-labelledby="contained-modal-title-vcenter" size="xl"
        centered>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <PrivacyPolicy />
        </Modal.Body >
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div >
  );
};
