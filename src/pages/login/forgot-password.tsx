import React, { useState,SyntheticEvent } from "react";
import { useHistory } from "react-router";
import FormBuilder from "../../components/form-builder";
import {
  FormControlError,
  FormField,
  FormValidators,
} from "../../components/form-builder/model/form-field";
import { FormValidator } from "../../components/form-builder/validations";
import ShiftedxLogoImg from "../../assets/images/Shifted.png";
import { Link } from "react-router-dom";
import { emialValidations } from "../../app/utility/form-validations";
import { toast } from "react-toastify";
import { UsersService } from "../../app/service/users.service";
import LogoImg from "../../assets/images/SiftedX Logo.png";


export const ForgotPasswordPage = () => {
  const [loginValidationErrors, setLoginValidationErrors] = useState<
    FormControlError[]
  >([]);
  const [loginData, setLoginData] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isShowSuccessMessage, setIsShowSuccessMessage] = useState(false);

  const formValidations = [
    new FormField("user_name", [FormValidators.REQUIRED]),
    new FormField("new_password", [FormValidators.REQUIRED]),
    new FormField("confirm_password", [FormValidators.REQUIRED]),
  ];

  const handleInput = (data: any) => {
    setLoginData(data);
    setFormData({ ...data.value });
    const errors: any = FormValidator(formValidations, data.value);
    setLoginValidationErrors(errors);
  };


  const preventDefaultActions = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
}
  const onClickSubmit=()=> {
    setLoading(true);
    const loginsData = { ...loginData.value };
    if (!emailError && loginsData.email) {
      // history.push("/reset-password");
      UsersService.forgotPassword(loginsData.email).then((res) => {
        if (res.error) {
          setLoading(false);
          setEmailError(res?.error?.message);
        } else {
          setLoading(false);
          toast.success(" Reset password email sent successfully");
          setIsShowSuccessMessage(true);
        }
      });
    } else {
      setLoading(false);
      if (!loginsData.email) {
        setEmailError(emialValidations(loginsData.email, "email Id"));
      }
    }
  }

  const handleChangeEmail = (event: any) => {
    setEmailError(emialValidations(event.target.value, "email Id"));
  };

  return (
    <div>
      <div className="container-fluid">

        <div className="row vh-100-all">
          <div className="col-sm-12 col-md-5 bg_blue mobile_hide rigth_image d-none d-lg-block">
            <div className="left_side_circle_div">
              <p className="circle_text" style={{ top: "50%" }}>
                Technical screening done at scale, by<br /> expert interviewers.
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-7 sx-bg-page position-relative ">
            <div className="d-flex align-items-center justify-content-center flex-column h-100">
              <div>
                <img
                  src={LogoImg}
                  alt="logo"
                  className="right_side_profile_img"
                />
              </div>
              {isShowSuccessMessage ? <div className="bg-white p-4 rounded shadow w-350">
                <p className="text-center mb-0 fs_14"> Email sent with instructions to reset the password, please check your email.</p>
                {/* <p className="text-center mb-0 fs_14"> Reset password email sent successfully, please check your email.</p> */}

              </div> :
                <div className="bg-white p-4 rounded shadow w-350 fs_14">
                  <p className="mb-4 mt-2 text-center fs_14">Forgot Your Password</p>
                  <p className="mt-2 text-center Log_text_style">
                    Enter Your Email And We'll Send <br />
                    You Instructions To Reset Your Password
                  </p>
                  <FormBuilder onUpdate={handleInput}>
                    <form onSubmit={preventDefaultActions}>
                      <div className="mb-4 mb-lg-3 mb-sm-4">
                        <input
                          type="emial"
                          className="form-control px-3 rounded"
                          id="emailAddress"
                          name="email"
                          placeholder="Email"
                          onChange={(event) => handleChangeEmail(event)}
                        />
                        {emailError && (
                          <p className="text-danger job_dis_form_label">
                            {emailError}
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
                    <div className="text-center mb-3">
                      <button className="btn sx-bg-primary w-100 rounded mt-1" onClick={onClickSubmit}>
                        Submit
                      </button>
                    </div>
                  )}
                </div>}

              <div className="pt-3 text-center">
                <small>
                  <Link to="/" className="text-black text-decoration-none">
                    Back To <strong className="ms-1 sx-text-primary" style={{ fontWeight: "700" }}>Login</strong>
                  </Link>
                </small>
              </div>
            </div>
            {/* </div> */}
            <p className="copyright position-absolute w-100 text-center bottom-0">
              Copyright © 2022 SiftedX. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
