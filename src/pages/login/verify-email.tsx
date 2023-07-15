import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { UsersService } from "../../app/service/users.service";
import LogoImg from "../../assets/images/SiftedX Logo.svg";

export const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  let { email } = useParams<{ email: string }>();

  const onClickLogin = () => {
    setLoading(true);
    UsersService.sendEmailVerification(email ? email : "").then((res) => {
      if (res.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        setLoading(false);
        toast.success("Email as sent to your account");
      }
    });
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row vh-100-all">
          <div className="col-sm-12 col-md-5 bg-black mobile_hide rigth_image d-none d-lg-block">
            <div className="left_side_circle_div">
              <p className="circle_text" style={{ top: "50%" }}>
                Technical screening done at scale, by
                <br /> expert interviewers.
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
              <div className="bg-white p-4 rounded shadow w-350 text-center fs_14">
                <p className="Log_text_style">Verify your email</p>
                <p className="m-4 mb-4 m-lg-2 m-sm-4">
                  We have sent an email to{" "}
                </p>
                <p className="m-4 mb-4 m-lg-2 m-sm-4">
                  <span className="fw-bold">{email}</span>
                </p>
                <p className="m-4 mb-4 m-lg-2 m-sm-4">
                  {" "}
                  Click on the link in the email to validate it and start using
                  SiftedX.
                </p>
                <p className="m-4 mb-4 m-lg-2 m-sm-4">
                  Check the spam folder if you can’t find the email in your
                  inbox.
                </p>
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center mt-3 mb-2  mb-lg-0 mb-sm-2">
                    <button
                      className="small_btn rounded w-100"
                      onClick={onClickLogin}
                    >
                      Resend Email
                    </button>
                  </div>
                )}
              </div>
              <div className="d-flex justify-content-between pt-2 mt-4">
                <p className="top_para_styles mb-0">Wrong email?</p>
                <NavLink
                  to={"/create-company"}
                  className="login_page_below_content_style pointer ms-1"
                  style={{ fontWeight: "700" }}
                >
                  {" "}
                  Create an account again
                </NavLink>
              </div>
              <div className="pt-3 text-center">
                <span className="fs_14">
                  Already Have An Account?{" "}
                  <NavLink to={"/"} className="mr-2 btn-login">
                    Login
                  </NavLink>
                </span>
              </div>
            </div>
            <div className="mt-5 text-center position-absolute bottom-0 w-100">
              <p className="copyright ms-3">
                Copyright © 2022 SiftedX. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className='container-fluid'>
                <div className='row'>
                    <div className='col-sm-6 col-12 bg_blue mobile_hide rigth_image'>
                        <div className='left_side_circle_div'>
                            <p className='circle_text'>Technical screening done at scale, by expert interviewers.</p>
                        </div>
                    </div>
                    <div className='col-sm-6 col-12'>
                        <div className='row'>
                            <div className='col-sm-6 col-12 verify_email_form_main_div'>
                                <div className='logo_div text-center'>
                                    <img src={LogoImg} alt="logo" className="right_side_profile_img" />
                                </div>
                                <div className='log_page_border p-4'>
                                    <p className='Log_text_style'>Verify your email</p>
                                    <p className='m-2 f12'>We have sent an email to <span className='fw-bold'>{email}</span></p>
                                    <p className='m-2 f12'> Click on the link in the mail to validate it and start using SiftedX.</p>
                                    <p className='m-2 f12'>Check the spam folder if you can’t find the mail in your inbox.</p>
                                    {loading ?
                                        <div className='text-center'>
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div> :
                                        <div className='text-center'>
                                            <button className='small_btn rounded' onClick={onClickLogin}>Resend Email</button>
                                        </div>
                                    }
                                </div>
                                <div className='d-flex justify-content-between pt-2 mt-4'>
                                    <NavLink to={'/create-company'} className='login_page_below_content_style pointer' style={{ marginLeft: '34%' }}>Wrong email? Create an account again</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
    </div>
  );
};
