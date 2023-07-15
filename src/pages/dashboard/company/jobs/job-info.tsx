import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useHistory } from "react-router-dom";
import { JobsService } from "../../../../app/service/jobs.service";
import Tabs from "../../../../components/tabs";
import JobsInfoRouts from "../../../../routes/jobs-info";
import PageHeaderOne from "../../../../components/page-header/pageHeaderOne";
import { NavMenuTabs } from "../../../../components/menus/nav-menu-tabs";


export const JobsInfo = () => {
  let { id, jobId } = useParams<{ id: string; jobId: string }>();
  const companyId = id;
  const locationPath = useLocation().pathname;
  const selectedJobId = locationPath.split("/")[7];
  const selectedJobIdCandidateType = locationPath.split("/")[8];
  const [selectedJob, setSelectedJob] = useState<any>([]);
  const history = useHistory()
  useEffect(() => {
    JobsService.getJobsByUuid(selectedJobId).then((res) => {
      setSelectedJob({ ...res });
    });
  }, []);
  const tabsData = [
    {
      path: `/dashboard/companies/info/${companyId}/jobs/info/${selectedJobId}/description`,
      label: "Job Description",
      count: "",
    },
    {
      path: `/dashboard/companies/info/${companyId}/jobs/info/${selectedJobId}/skills`,
      label: "Skills",
      count: "",
    },
    {
      path: `/dashboard/companies/info/${companyId}/jobs/info/${selectedJobId}/candidates/candidates`,
      label: "Candidates",
      count: "",
    },
    {
      path: `/dashboard/companies/info/${companyId}/jobs/info/${selectedJobId}/sme`,
      label: "SMEs",
      count: "",
    },
    // {
    //   path: `/dashboard/companies/info/${companyId}/jobs/info/${selectedJobId}/instructions`,
    //   label: "Instructions",
    //   count: "",
    // },
    {
      path: `/dashboard/companies/info/${companyId}/jobs/info/${selectedJobId}/interviews`,
      label: "Interviews",
      count: "",
    },
    {
      path: `/dashboard/companies/info/${companyId}/jobs/info/${selectedJobId}/reports`,
      label: "Reports",
      count: "",
    },
  ];
  const back = (): void => {
    history.goBack()
  }
  return (
    <div className="container-fluid">
      <PageHeaderOne
        title={selectedJob?.job_title}
        subTitle={`${selectedJob?.location},${selectedJob?.job_mandatory_skills}`}
        buttonName="Back"
        // editButtonClick={() => {}}
        editButtonClick={back}
      // hideButton={true}
      />
      <div className="row ps-3 pe-3 pe-lg-5">
        <div className="col-12">
          <div className="row">
            <div className="col-12">
              <div className="mt-2 ms-2 nav_tabs  justify-content-between over_flow_div d-none d-lg-block">
                <Tabs tabsData={tabsData} active={locationPath}></Tabs>
              </div>

              <div className=" d-lg-none mt-3 d-block">
                <NavMenuTabs type="path" activeUrl={locationPath} menuItems={tabsData} activeTab={0} onChangeTab={() => { }}></NavMenuTabs>
              </div>
              <div className="col-12">
                <div className="bg-white rounded-3">
                  <div className="px-3 pb-4 pt-3">
                    <JobsInfoRouts></JobsInfoRouts>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};