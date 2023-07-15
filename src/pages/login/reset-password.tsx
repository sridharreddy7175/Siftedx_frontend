import React, { useEffect, useState } from "react";
import FormBuilder from "../../components/form-builder";
import ShiftedxLogoImg from "../../assets/images/Shifted.png";
import { Link, useHistory, useParams } from "react-router-dom";
import { FormValidator } from "../../components/form-builder/validations";
import {
  FormControlError,
  FormField,
  FormValidators,
} from "../../components/form-builder/model/form-field";
import { normalPasswordValidations, passwordValidations } from "../../app/utility/form-validations";
import { UsersService } from "../../app/service/users.service";
import { toast } from "react-toastify";
import LogoImg from "../../assets/images/SiftedX Logo.png";
import { PasswordValidation } from "../../components/password-validation";

export const ResetPassword = () => {
  const [loginValidationErrors, setLoginValidationErrors] = useState<
    FormControlError[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [passwordError, setPasswordError] = useState<any>({ number: true, upper: true, lower: true, specialChar: true, strLength: true });
  const [conformpasswordError, setConformPasswordError] = useState<any>({ number: true, upper: true, lower: true, specialChar: true, strLength: true });
  const [matchPasswordError, setMatchPasswordError] = useState("");
  let { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [passwordFieldType, setPasswordFieldType] = useState("password");
  const [passwordconfirmationFieldType, setPasswordconfirmationFieldType] = useState("password");
  const formValidations = [
    new FormField("new_password", [FormValidators.REQUIRED]),
    new FormField("confirm_password", [FormValidators.REQUIRED]),
  ];
  const [showPasswordErrorPopup, setShowPasswordErrorPopup] = useState(false);
  const handleClosePasswordErrorPopup = () => setShowPasswordErrorPopup(false);
  const [showConfirmPasswordErrorPopup, setShowConfirmPasswordErrorPopup] = useState(false);
  const handleCloseConfirmPasswordErrorPopup = () => setShowConfirmPasswordErrorPopup(false);
  const [statusData, setStatusData] = useState<any>('')
  const [statusError, setStatusError] = useState<any>('')
  const onClickLogin = () => {
    const newPasswordData = { ...passwordData.value };
    setLoading(true);
    if (
      passwordError &&
      conformpasswordError &&
      newPasswordData.password &&
      newPasswordData.confirm_password &&
      newPasswordData.password === newPasswordData.confirm_password
    ) {
      const data = {
        uuid: id,
        new_password: newPasswordData.confirm_password,
      };
      // console.log("data",data)
      UsersService.resetPassword(data).then((res) => {
        if (res.error) {
          setLoading(false);
          toast.error(res?.error?.message);
        } else {
          setLoading(false);
          toast.success("Your password successfully reset");
          history.push("/");

        }
      });
    } else {
      setLoading(false);
      if (!newPasswordData.password) {
        setShowPasswordErrorPopup(true);
        setPasswordError({ ...passwordValidations(newPasswordData?.password, "password") });
      }
      if (!newPasswordData.confirm_password) {
        setShowConfirmPasswordErrorPopup(true);
        setConformPasswordError({ ...passwordValidations(newPasswordData.confirm_password, "password") });
      }
      if (newPasswordData.password !== newPasswordData.confirm_password) {
        setMatchPasswordError(normalPasswordValidations("", "same Password"));
      }
    }
  };
  const handleInput = (data: any) => {
    setPasswordData(data);
    setFormData({ ...data.value });
    const errors: any = FormValidator(formValidations, data.value);
    setLoginValidationErrors(errors);
  };
  const handlePassword = (event: any) => {
    setMatchPasswordError("");
    setPasswordError({ ...passwordValidations(event.target.value, "password") });
    const error: any = passwordValidations(event.target.value, "password");
    if (!error?.number && !error?.upper && !error?.lower && !error?.specialChar && !error?.strLength) {
      handleClosePasswordErrorPopup();
    } else {
      setShowPasswordErrorPopup(true);
    }
  };
  const handleReEnterPassword = (event: any) => {
    setMatchPasswordError("");
    setConformPasswordError(
      normalPasswordValidations(event.target.value, "Password")
    );

    setConformPasswordError({ ...passwordValidations(event.target.value, "password") });
    const error: any = passwordValidations(event.target.value, "password");
    if (!error?.number && !error?.upper && !error?.lower && !error?.specialChar && !error?.strLength) {
      handleCloseConfirmPasswordErrorPopup();
    } else {
      setShowConfirmPasswordErrorPopup(true);
    }
  };

  const onChangePasswordType = (type: string) => {
    setPasswordFieldType(type);
  };

  const onChangeConfirmationPasswordType = (type: string) => {
    setPasswordconfirmationFieldType(type);
  };

  const hidePasswordErrorPopup = (event: any) => {
    handleClosePasswordErrorPopup();
  }

  const hideConfirmPasswordErrorPopup = (event: any) => {
    handleCloseConfirmPasswordErrorPopup();
  }

  useEffect(() => {
    userPasswordLink()
  }, [])

  const userPasswordLink = () => {
    // setLoading(true)
    UsersService.userPasswordResetLink(id)
      .then((res) => {
        if (res.error) {
          toast.error(res?.error?.message);
          setLoading(false);
          setStatusError(res?.error?.message)
        }
        else {

          setStatusData(res.status)
          setLoading(false);

        }
      })
  }

  return (
    <div>
      <div className="container-fluid">
        <div className="row  vh-100-all">
          <div className="col-sm-12 col-md-5 bg_blue mobile_hide rigth_image d-none d-lg-block">
            <div className="left_side_circle_div">
              <p className="circle_text" style={{ top: "50%" }}>
                Technical screening done at scale, by<br /> expert interviewers.
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-7 sx-bg-page position-relative">
            <div className="d-flex align-items-center justify-content-center h-100 flex-column">
              <div>
                <img
                  src={LogoImg}
                  alt="logo"
                  className="right_side_profile_img"
                />
              </div>

              {/* {
                statusData === 1 && */}
                <div className="bg-white p-4 rounded shadow w-350 mb-3">

                  <p className="Log_text_style fs_14">Reset Password</p>

                  <FormBuilder onUpdate={handleInput}>
                    <form>
                      <div className="mb-4 mb-lg-3 mb-sm-4 position-relative">
                        <input
                          type={passwordFieldType}
                          className="form-control px-3 rounded"
                          id="password"
                          name="password"
                          placeholder="New Password"
                          onChange={(e) => handlePassword(e)}
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
                        {/* {passwordError && (
                        <p className="text-danger job_dis_form_label">
                          {passwordError}
                        </p>
                      )} */}
                        <PasswordValidation isShow={showPasswordErrorPopup} errors={passwordError} customClass={'reset_new_password_modal'} />

                      </div>
                      <div className="mb-4 mb-lg-3 mb-sm-4 position-relative">
                        <input
                          type={passwordconfirmationFieldType}
                          className="form-control px-3 rounded"
                          id="confiremPassword"
                          name="confirm_password"
                          placeholder="Confirm Password"
                          onChange={(e) => handleReEnterPassword(e)}
                          onFocus={() => setShowConfirmPasswordErrorPopup(true)}
                          onBlur={(event) => hideConfirmPasswordErrorPopup(event)}
                        />
                        {passwordconfirmationFieldType === "password" ? (
                          <i
                            className="bi bi-eye-slash-fill input_eye"
                            onClick={() => onChangeConfirmationPasswordType("text")}
                          ></i>
                        ) : (
                          <i
                            className="bi bi-eye-fill input_eye"
                            onClick={() =>
                              onChangeConfirmationPasswordType("password")
                            }
                          ></i>
                        )}
                        {/* {conformpasswordError && (
                        <p className="text-danger job_dis_form_label">
                          {conformpasswordError}
                        </p>
                      )} */}
                        {matchPasswordError && (
                          <p className="text-danger job_dis_form_label">
                            {matchPasswordError}
                          </p>
                        )}
                        <PasswordValidation isShow={showConfirmPasswordErrorPopup} errors={conformpasswordError} customClass={'reset_confirm_password_modal'} />

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
                      <button className="btn sx-bg-primary w-100 rounded mt-3" onClick={onClickLogin}>
                        Reset Password
                      </button>
                    </div>
                  )}
                </div>
              {/* } */}
              {statusError === "Reset link not found" &&
                <div className="bg-white p-2 rounded shadow w-350 mb-3">
                  <p className="text-center text-danger fs_14 mt-3">Reset password link has expried</p>
                </div>
              }




              <div className="pt-3 text-center">
           
                  <small>

                    <Link to="/" className="text-black text-decoration-none">
                      Back To <strong className="ms-1 sx-text-primary" style={{ fontWeight: "700" }}>Login</strong>
                    </Link>
                  </small>
           
                {statusError === "Reset link not found" &&
                  <small>

                    <Link to="/forgot-password" className="text-black text-decoration-none">
                      Back To <strong className="ms-1 sx-text-primary" style={{ fontWeight: "700" }}>Forgot password</strong>
                    </Link>
                  </small>

                }

              </div>
            </div>
            {/* <p className="copyright position-absolute w-100 text-center bottom-0">Copyright © 2022 SiftedX. All Rights Reserved.</p> */}
            <div className="mt-5 text-center position-absolute bottom-0 w-100">
              <p className="copyright ms-3">Copyright © 2022 SiftedX. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
