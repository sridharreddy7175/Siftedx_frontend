import React from "react";


const SelectPlans = () => {


  return (
    <>
       {" "}
                  <div className="py-4 px-md-5 mx-md-5 mx-sm-3">
                    <div className="row">
                      <div className="col-md-6 col-sm-12">
                        <div
                          className="p-4 border me-md-3 me-sm-0 shadow bg-white mb-3 mb-md-0"
                          style={{ borderRadius: "30px" }}
                        >
                          <div className="top_heading_styles">
                            Individual Plan
                          </div>
                          <div className="top_heading_styles mb-1">Free</div>
                          <div className="" style={{ fontSize: "14px" }}>
                            <div className="border-bottom  py-2">
                              Suitable for recruiters using the platform as
                              individuals, as opposed to company users and team.
                            </div>
                            <div className="border-bottom   py-2">
                              Simple pay for interview modal enables you to
                              start using the platform right away.
                            </div>
                            <div className="border-bottom   py-2">
                              Platform usage is free of charge. Premium features
                              like not available.
                            </div>
                            <div className="border-bottom   py-2">
                              Create Job Requisition with skills and experience
                              required
                            </div>
                            <div className="border-bottom  py-2">
                              {" "}
                              Choose from the list of matching SMEs or SiftedX
                              auto-match{" "}
                            </div>
                            <div className="border-bottom  py-2">
                              Monitor the progress of interviews being scheduled
                              and conducted
                            </div>
                            <div className="  pt-2">
                              Receive detailed evaluation report and video of
                              the interview along with a 2min audio summary by
                              the SME
                            </div>
                          </div>
                          <div className="mt-3 pt-4">
                            <button
                              className="large_btn_apply px-3 py-1"
                              style={{
                                backgroundColor: " #F5BE17",
                                fontSize: "14px",
                              }}
                            >
                              Select Plan
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12 ">
                        <div className="p-4 shadow corporate_plan ms-md-3 ms-sm-0">
                          <div className="top_heading_styles">
                            Corporate Plan
                          </div>
                          <div className="top_heading_styles mb-1">
                            $500.user{" "}
                            <span className="ms-2 fs_12">Per Month *</span>
                          </div>
                          <div className="" style={{ fontSize: "14px" }}>
                            <div className="corporate_bottom py-2">
                              Suitable for recruiter team of all sizes.Below
                              premium features are available on top of
                              everything that individual account providers.
                            </div>
                            <div className="corporate_bottom py-2">
                              Add team members for seamless allocation of jobs
                            </div>
                            <div className="corporate_bottom py-2">
                              Ability to tag hiring managers in the jobs, who
                              can monitor the progress
                            </div>
                            <div className="corporate_bottom py-2">
                              Mark your favorite SMEs for easy selection and
                              share them with your team
                            </div>
                            <div className="corporate_bottom py-2">
                              Company admin user for effective management of
                              roles and access rights
                            </div>
                            <div className="corporate_bottom  py-2">
                              Interview videos are available up to 1 year Access
                              the SiftedX APIs to integrate with your existing
                              Application Tracking and other HR systems
                            </div>
                            <div className=" py-2">
                              USD 500/user/month with minimum 3 users
                            </div>
                          </div>
                          <div className="mt-5">
                            <button
                              className="px-3 py-1 rounded-3"
                              style={{
                                backgroundColor: " #000000 ",
                                color: "#FFFFFF",
                                fontSize: "14px",
                              }}
                            >
                              Select Plan{" "}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
    </>
  );
};

export default SelectPlans;
