import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CompanyService } from "../../app/service/company.service";
import { LookUpService } from "../../app/service/lookup.service";
import { RolesService } from "../../app/service/roles.service";
import { SmeService } from "../../app/service/sme.service";
import { UsersService } from "../../app/service/users.service";
import { S3Helper } from "../../app/utility/s3-helper";
import LogoImg from "../../assets/images/logo.png";
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

export const RegistrationPage = () => {
  const [principalValidationErrors, setUserValidationErrors] = useState<
    FormControlError[]
  >([]);
  const [userData, setUserData] = useState<any>({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
  let { id, userId } = useParams<{ id: string; userId: string }>();
  const usersId = userId;
  const location = useLocation().pathname.split("/");
  const locationPath = useLocation().pathname;

  const history = useHistory();

  const userFormValidations = [
    new FormField("user_firstname", [FormValidators.REQUIRED]),
    new FormField("user_lastname", [FormValidators.REQUIRED]),
    new FormField("user_email", []),
    new FormField("mobile_no", [FormValidators.REQUIRED]),
    new FormField("password", []),
    new FormField("role", [FormValidators.REQUIRED]),
    new FormField("gender", [FormValidators.REQUIRED]),
    new FormField("location", []),
    new FormField("locked", []),
    new FormField("user_image", []),
    new FormField("user_thumbnail", []),
    new FormField("status", []),
    new FormField("postal_code", []),
    new FormField("state_uuid", []),
    new FormField("city_uuid", []),
  ];

  function onClickBackToLogin() {
    history.push("/");
  }

  useEffect(() => {}, []);

  const handleUserInput = (data: any) => {
    setUserData(data);
    const errors: any = FormValidator(userFormValidations, data.value);
    setUserValidationErrors(errors);
  };

  function createUser() {
    const selectedUserData = userData.value
      ? { ...userData.value }
      : { ...userData };
    setIsFormSubmitted(true);
    const errors: FormControlError[] = FormValidator(
      userFormValidations,
      selectedUserData
    );
    setUserValidationErrors(errors);
    selectedUserData.company_uuid = id;
    selectedUserData.android_device_token = "";
    selectedUserData.ios_device_token = "";
    selectedUserData.user_image = "";
    selectedUserData.city_uuid = "";
    selectedUserData.state_uuid = "";
    SmeService.registerSme(selectedUserData).then((res) => {
      history.push(`/`);
    });
  }

  const getUserInputValid = (control: string) => {
    const value = GetControlIsValid(principalValidationErrors, control);
    return value;
  };

  function uploadLogo(formdata: any, type: string) {
    setImageLoader(true);
  }

  const handleGender = (e: any) => {
    const data = { ...userData.value };
    data.gender = e.target.value;
    if (userData) {
      userData.gender = e.target.value;
    }
  };

  return (
    <div>
      <div className="row">
        <div
          className="col-12 text-center pt-3 pb-2"
          style={{ backgroundColor: "#1D2851" }}
        >
          <p className="login_header_text_style">SiftedX</p>
        </div>
      </div>
      <section className="d-flex justify-content-md-center align-items-center login-block-wraper forgot-password">
        <div>
          <div className="bg-white rounded-16 px-3 shadow-sm registration-block">
            <div className="row justify-content-md-center login-row">
              {loading && (
                <div className="text-center p-5">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}
              {/* <h2 className="login-hd mt-3 mb-1 mb-md-2 text-center">Registration</h2> */}
              <h2 className="Log_text_style">Create A SME Account123</h2>

              {!loading && (
                <div
                  className="col-md-12 login-fileds"
                  style={{ borderLeft: "none" }}
                >
                  <FormBuilder onUpdate={handleUserInput}>
                    <form>
                      <div className="row custom-form p-3">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-4 me-3">
                                {/* <label className="form-label job_dis_form_label job_dis_form_label mb-0">First name</label> */}
                                <input
                                  className="form-control job_dis_form_control px-3 rounded"
                                  placeholder="first name"
                                  type="text"
                                  name="user_firstname"
                                  defaultValue={userData?.user_firstname}
                                />
                                <span
                                  style={{
                                    color: "red",
                                    fontSize: "15px",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  *
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-4 me-3">
                                <label className="form-label job_dis_form_label mb-0">
                                  Last name
                                </label>
                                <span
                                  style={{
                                    color: "red",
                                    fontSize: "15px",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  *
                                </span>
                                <input
                                  className="form-control job_dis_form_control px-3 rounded"
                                  placeholder="last name"
                                  type="text"
                                  name="user_lastname"
                                  defaultValue={userData?.user_lastname}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-4 me-3">
                                <label className="form-label job_dis_form_label mb-2">
                                  Gender
                                </label>
                                <span
                                  style={{
                                    color: "red",
                                    fontSize: "15px",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  *
                                </span>
                                <br />
                                <div className="mt-2">
                                  <input
                                    className="mb-0"
                                    type="radio"
                                    value="male"
                                    name="gender"
                                    checked={userData?.gender === "male"}
                                    onChange={(e) => {
                                      handleGender(e);
                                    }}
                                  />
                                  <span
                                    style={{
                                      paddingRight: "15px",
                                      paddingLeft: "10px",
                                    }}
                                  >
                                    Male
                                  </span>
                                  &nbsp;
                                  <input
                                    className="mb-0"
                                    type="radio"
                                    value="female"
                                    name="gender"
                                    checked={userData?.gender === "female"}
                                    onChange={(e) => {
                                      handleGender(e);
                                    }}
                                  />
                                  <span
                                    style={{
                                      paddingRight: "15px",
                                      paddingLeft: "10px",
                                    }}
                                  >
                                    Female
                                  </span>
                                  {isFormSubmitted &&
                                    !getUserInputValid("gender") && (
                                      <p className="text-danger">
                                        Please select gender
                                      </p>
                                    )}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-4 me-3">
                                <label className="form-label job_dis_form_label mb-0">
                                  Email
                                </label>
                                <span
                                  style={{
                                    color: "red",
                                    fontSize: "15px",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  *
                                </span>
                                <input
                                  className="form-control job_dis_form_control px-3 rounded"
                                  placeholder="Enter email"
                                  type="text"
                                  name="user_email"
                                  defaultValue={userData?.user_email}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-4 me-3">
                                <label className="form-label job_dis_form_label mb-0">
                                  Mobile number
                                </label>
                                <span
                                  style={{
                                    color: "red",
                                    fontSize: "15px",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  *
                                </span>
                                <input
                                  className="form-control job_dis_form_control px-3 rounded"
                                  placeholder="Enter mobile numer"
                                  type="text"
                                  name="mobile_no"
                                  defaultValue={userData?.mobile_no}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-4 me-3">
                                <label className="form-label job_dis_form_label mb-0">
                                  Password
                                </label>
                                <span
                                  style={{
                                    color: "red",
                                    fontSize: "15px",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  *
                                </span>
                                <input
                                  className="form-control job_dis_form_control px-3 rounded"
                                  placeholder="Enter password"
                                  type="text"
                                  name="password"
                                  defaultValue={userData?.password_hash}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-4 me-3">
                                <label className="form-label job_dis_form_label mb-0">
                                  Location
                                </label>
                                <span
                                  style={{
                                    color: "red",
                                    fontSize: "15px",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  *
                                </span>
                                <input
                                  className="form-control job_dis_form_control px-3 rounded"
                                  placeholder="Enter location"
                                  type="text"
                                  name="location"
                                  defaultValue={userData?.location}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="text-center form-footer border-primary py-3 text-end">
                            <a
                              className="small_btn px-5 rounded-12 cursor-pointer"
                              onClick={() => createUser()}
                            >
                              Save
                            </a>
                            <div>
                              <a
                                className="d-inline-block mt-4  f12 forgot-color cursor-pointer"
                                onClick={() => onClickBackToLogin()}
                              >
                                Back to Login
                              </a>
                            </div>
                          </div>
                        </div>
                        {imageLoader && (
                          <div className="text-center col-md-1 p-5">
                            <div className="spinner-border" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </form>
                  </FormBuilder>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
