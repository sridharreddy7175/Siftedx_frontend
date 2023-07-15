import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { NavLink, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { UsersService } from "../../app/service/users.service";
import { ERROR_CODES } from "../../app/utility/app-codes";
import {
  normalPasswordValidations, passwordValidations,
} from "../../app/utility/form-validations";
import LogoImg from "../../assets/images/SiftedX Logo.svg";
import FormBuilder from "../../components/form-builder";
import { Modal } from "react-bootstrap";
import { PasswordValidation } from "../../components/password-validation";
import { Terms } from "../../components/terms";
import { PrivacyPolicy } from "../../components/privacyPolicy";


export const CreateAccount = () => {
  let { id } = useParams<{ id: string }>();
  const [userFormData, setUserFormData] = useState<any>({});
  const [passwordError, setPasswordError] = useState<any>({ number: true, upper: true, lower: true, specialChar: true, strLength: true });
  const [confirmPwdError, setConfirmPwdError] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation().pathname.split("/")[1];
  const [passwordFieldType, setPasswordFieldType] = useState("password");
  const [conformPasswordFieldType, setConformPasswordFieldType] = useState("password");
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const handleCloseTermsOfService = () => setShowTermsOfService(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const handleClosePrivacyPolicy = () => setShowPrivacyPolicy(false);
  const [showPasswordErrorPopup, setShowPasswordErrorPopup] = useState(false);
  const handleClosePasswordErrorPopup = () => setShowPasswordErrorPopup(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);

  useEffect(() => {
    if (location === "accept") {
      UsersService.getInvitation(id).then((res) => {
        let company = res?.user_email.split("@");
        company = company[1].split(".");
        setCompanyName(company[0]);
        setUserFormData({ value: { user_email: res?.user_email } });
      });
    }
  }, []);


  const handleInput = (data: any) => {
    data.value = { ...userFormData.value, ...data.value };
    setUserFormData(data);
    setPasswordError({ ...passwordValidations(data.value.password, "password") });
    const isConfirmPwdValid = data.value.conformPassword === data.value.password;
    setConfirmPwdError(!isConfirmPwdValid);
    console.log(data, isConfirmPwdValid);
  };

  const onClickLogin = () => {
    setLoading(true);
    setIsSubmitClicked(true);
    const userData = { ...userFormData.value };
    const isConfirmPwdValid = userData.conformPassword === userData.password;
    setConfirmPwdError(!isConfirmPwdValid);
    if (userFormData.isValid && isConfirmPwdValid) {
      if (location === "accept") {
        userData.gender = "";
        userData.mobile_no = "";
        UsersService.acceptInvitation(id, userData).then((res) => {
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
        UsersService.addUserCompany(userData).then((res) => {
          if (res.error) {
            setLoading(false);
            if (ERROR_CODES.COMPANY_ALREADY_EXIST === res.error?.code) {
              toast.error("Company already exist");
              history.push(`/company-exist/${userData?.user_email}`);
            } else {
              toast.error(res.error?.message);
            }
          } else {
            setLoading(false);
            history.push(`/verify-email/${userData?.user_email}`);
          }
        });
      }
    } else {
      if (!userData?.password) {
        setShowPasswordErrorPopup(true);
        setPasswordError(normalPasswordValidations(userData?.password, "password"));
      }
      // if (!userData?.password !== conformPassword) {
      //   setConformPasswordError('Confirm Password does not matched')
      // }
      setLoading(false);
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

  return (
    <div>
      <div className="container-fluid">
        <div className="row vh-100-all">
          <div className="col-sm-12 col-md-5 col-12 d-none d-lg-block mobile_hide create_account_bg rigth_image">
            <div className="left_side_circle_div">
              <div className="profile_img_div">
              </div>
              <p className="circle_text">
                Technical screening done at scale, by<br /> expert interviewers.
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-7 sx-bg-page position-relative">
            
            <div className="d-flex align-items-center justify-content-center h-100 flex-column" style={{
              minHeight: '800px'
            }}>
              <div>
                <img
                  src={LogoImg}
                  alt="logo"
                  className="right_side_profile_img"
                />
              </div>

              <>
                <div className="bg-white p-4 rounded shadow w-350 mb-3">
                  <p className="Log_text_style">
                    {location !== "accept"
                      ? "Create a company account"
                      : `Create your account for ${companyName}`}
                  </p>
                  <FormBuilder onUpdate={handleInput} showValidations={isSubmitClicked}>
                    <form>
                      <div className="mb-4 mb-lg-3 mb-sm-4">
                        <input
                          type="text"
                          className="form-control px-3 rounded"
                          id="FirstName"
                          name="user_firstname"
                          placeholder="First name *"
                          data-validate-required="Please enter your first name"
                          data-validate-name='Special characters are not allowed'
                        />
                        {/* {nameError && (
                          <p className="text-danger job_dis_form_label">
                            {nameError}
                          </p>
                        )} */}
                      </div>
                      <div className="mb-4 mb-lg-3 mb-sm-4">
                        <input
                          type="text"
                          className="form-control px-3 rounded"
                          id="LastName"
                          name="user_lastname"
                          placeholder="Last name *"
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
                          data-validate-workemail="work email"
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
                            onClick={() => onChangePasswordType("password")}
                          ></i>
                        )}
                        <PasswordValidation isShow={showPasswordErrorPopup} errors={passwordError} customClass={'sme_password_modal fs_14 p-4'} />
                        {showPasswordErrorPopup && <i className="arrow right sme_password_arrow"></i>}
                      </div>
                      <div className="mb-4 mb-lg-3 mb-sm-4 position-relative">
                        <input
                          type={conformPasswordFieldType}
                          className="form-control px-3 rounded"
                          id="conformPassword"
                          name="conformPassword"
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

                        {confirmPwdError &&
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
                      onClick={onClickLogin}
                    >
                      Sign up
                    </button>
                  )}
                </div>
                <div className="pt-3 text-center" >
                  <span
                    className="fs_14"
                  >
                    Already Have An Account?  <NavLink to={"/"} className="mr-2 btn-login">Login</NavLink>
                  </span>
                </div>
              </>
            </div>
            <p className="copyright position-absolute w-100 text-center bottom-0">
              Copyright © 2022 SiftedX. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
      <Modal show={showTermsOfService} onHide={handleCloseTermsOfService} aria-labelledby="contained-modal-title-vcenter" size="xl"
        centered>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <Terms/>
      </Modal.Body >
        <Modal.Footer></Modal.Footer>
      </Modal>
      <Modal show={showPrivacyPolicy} onHide={handleClosePrivacyPolicy} aria-labelledby="contained-modal-title-vcenter" size="xl"
        centered>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
       <PrivacyPolicy/>
        </Modal.Body >
        <Modal.Footer></Modal.Footer>
      </Modal>
    
    </div >
  );
};
