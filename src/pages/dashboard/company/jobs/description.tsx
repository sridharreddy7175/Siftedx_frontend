import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { JobsService } from "../../../../app/service/jobs.service";
import { AppLoader } from "../../../../components/loader";

export const JobsDscription = () => {
  let { id, jobId } = useParams<{ id: string; jobId: string }>();
  const [selectedJob, setSelectedJob] = useState<any>({});
  const [jobSkills, setJobSkills] = useState<any>([]);
  const [jobTags, setJobTags] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState<any>([]);
  const [jobLocation, setJobLocation] = useState<any>([]);

  const history = useHistory();
  const companyId = id || sessionStorage.getItem("company_uuid") || "";

  useEffect(() => {
    setLoading(true);
    JobsService.getJobsByUuid(jobId).then((res) => {
      if (res.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        console.log("res", res);
        setSelectedJob({ ...res });
        const skills = res?.job_mandatory_skills
          ? res?.job_mandatory_skills.split(",")
          : [];
        const tags = res?.tags ? res?.tags.split(",") : [];
        const title = res?.job_title ? res?.job_title : [];
        const location = res?.location ? res?.location : [];
        setJobTitle([...title]);
        setJobLocation([...location]);
        setJobTags([...tags]);
        setJobSkills([...skills]);
        setLoading(false);
      }
    });
  }, []);

  const onCandidates = () => {
    sessionStorage.setItem("isFromJobForm", "yes");
    const job = sessionStorage.getItem("selectedJob");
    history.push(
      `/dashboard/companies/info/${companyId}/jobs/info/${job}/candidates/candidates`
    );
  };
  return (
    <div>
      {loading && <AppLoader loading={loading}></AppLoader>}

      <div className="row ms-2 mt-4 mb-2">
        {/* <div className='col-12 text-end'>
                    <button className='all_members_add_members_btn px-4 py-2 rounded-2' onClick={onCandidates}>Add Candidates</button>

                </div> */}

        <div className="col-4 border-end ">
          <h6 className="side_heading">{jobTitle}</h6>
          <span className="top_para_styles rounded-3">{jobLocation}</span>

          {/* <div className='mt-1 d-flex'>
                        {jobSkills.map((data: any, index: number) => {
                            return <span key={index} className='top_para_styles rounded-3'>{data}</span>
                        })}
                    </div> */}

          <div className="mt-2">
            <h6 className="side_heading">Seniority and Experience</h6>
            <span className="top_para_styles rounded-3">
              {selectedJob?.experience} years ,
            </span>
            {selectedJob?.seniority_code && (
              <span className="top_para_styles rounded-3">
                {selectedJob?.seniority_code}
              </span>
            )}
          </div>

          <div className="mt-3 ">
            <div className="side_heading mb-2">Tags</div>
            {jobTags.length > 0 ? (
              jobTags.map((data: any, index: number) => {
                return (
                  <span
                    key={index}
                    className="sx-bg-color text-black fs_14 px-2 me-1 d-inline-block mb-1"
                    style={{ borderRadius: "10px" }}
                  >
                    {data.split("")}
                  </span>
                );
              })
            ) : (
              <span className="top_para_styles">No Tags</span>
            )}
          </div>
        </div>
        <div className="col-8 ps-4">
          <div className="side_heading m-0">Job Responsibilities</div>
          <div
            className="mt-4 top_para_styles"
            dangerouslySetInnerHTML={{ __html: selectedJob?.job_description }}
          ></div>
        </div>
      </div>
    </div>
  );
};
