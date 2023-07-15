import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { JobsService } from "../../../../app/service/jobs.service";
import { AppLoader } from "../../../../components/loader";
// import INFO_ICON from '../../assets/icon_images/info icon.svg';
import INFO_ICON from "../../../../assets/icon_images/info icon.svg";

export const SmeJobDescriptionList = () => {
  let { jobId } = useParams<{ jobId: string }>();
  const [selectedJob, setSelectedJob] = useState<any>([]);
  const [jobSkills, setJobSkills] = useState<any>([]);
  const [optionalSkills, setOptionalSkills] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [jobTags, setJobTags] = useState<any>([]);

  let history = useHistory();

  useEffect(() => {
    setLoading(true);
    JobsService.getJobsByUuid(jobId).then((res) => {
      if (res?.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        setSelectedJob({ ...res });
        const skills = res?.job_mandatory_skills
          ? res?.job_mandatory_skills.split(",")
          : [];
        const optSkills = res?.job_optional_skills
          ? res?.job_optional_skills.split(",")
          : [];
        const tags = res?.tags ? res?.tags.split(",") : [];
        setJobTags([...tags]);
        setJobSkills([...skills]);
        setOptionalSkills([...optSkills]);
        setLoading(false);
      }
    });
  }, []);

  

  return (
    <div className="">
      {loading && <AppLoader loading={loading}></AppLoader>}
      <div className="rounded-3 bg-white p-3">
        {/* <div className="row">
          <div className="col-12 text-end">
            <b className="sx-text-primary pointer">
              <img src={INFO_ICON} alt="info icon" className="me-2" />{" "}
              Instructions to add skills
            </b>
          </div>
        </div> */}

        <div className="row ms-2 mt-3 mb-4">
          <div className="col-4 border-end">
            <h6 className="top_side_heading_styles m-0">Skills</h6>
            <div className="mt-1 ">
              {jobSkills.map((data: any, index: number) => {
                return (
                  <span
                    key={index}
                    className="fs_14 rounded-3  me-1 d-inline-block"
                  >
                    {data},
                  </span>
                );
              })}

              {optionalSkills.map((data: any, index: number) => {
                return (
                  <span
                    key={index}
                    className="fs_14 rounded-3  me-1 d-inline-block"
                  >
                    {" "}
                    {data}
                  </span>
                );
              })}
            </div>
            <div>
              <h6 className="top_side_heading_styles  m-0 pt-2">
                Seniority and Experience
              </h6>
              <span className="top_para_styles rounded-3 mt-1">
                {" "}
                {selectedJob?.experience} years,
              </span>
              {selectedJob?.seniority_code && (
                <span className="top_para_styles rounded-3 mt-1">
                  {selectedJob?.seniority_code}
                </span>
              )}
            </div>

            <div className="mt-3">
              <h6 className="top_side_heading_styles  m-0">Tags</h6>
              {jobTags.length > 0 ? (
                jobTags.map((data: any, index: number) => {
                  return (
                    <span
                      key={index}
                      className="text-black fs_14  me-1 d-inline-block mb-1"
                      style={{ borderRadius: "10px" }}
                    >
                      {data},
                    </span>
                  );
                })
              ) : (
                <span className="top_para_styles">No Tags</span>
              )}
            </div>

            <button
              className="large_btn_apply rounded-3 btn-outline-primary me-3 mt-5 mb-1"
              onClick={() =>
                history.push("/dashboard/home")
              }
            >
              Back
            </button>
          </div>

          <div className="col-8 ps-4">
            <h6 className="top_side_heading_styles  m-0">
              Job Responsibilities
            </h6>
            {selectedJob?.job_description ? (
              <div
                className="mt-4"
                dangerouslySetInnerHTML={{
                  __html: selectedJob?.job_description,
                }}
              ></div>
            ) : (
              <p className="top_para_styles mt-4">No Job description</p>
            )}
          </div>

          {/* <div className='col-md-3  col-12'>
                        <h6 className='first_heading_font'>Skills</h6>
                        {jobSkills.map((data: any, index: number) => {
                            return <span key={index} className='skills_border_style  px-3 py-1 rounded-3'>{data}</span>
                        })}
                    </div>
                    <div className='col-md-3 col-12'>
                        <h6 className='first_heading_font'>Seniority and Experience</h6>
                        <span className='skills_border_style mx-1 px-3 py-1 rounded-3'>{selectedJob?.experience} years</span>
                        {selectedJob?.seniority_code && <span className='skills_border_style px-3 py-1 rounded-3'>{selectedJob?.seniority_code}</span>}
                    </div>
                    <div className='col-md-3 col-12'>
                        <h6 className='first_heading_font'>Tags</h6>

                    </div> */}
        </div>
        {/* <div className='mt-5 ms-3' dangerouslySetInnerHTML={{ __html: selectedJob?.job_description }}>
                </div> */}
      </div>
    </div>
  );
};
