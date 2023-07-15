import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Switch, Route, Redirect, useLocation } from "react-router";
import { NavLink, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { JobsService } from "../../../app/service/jobs.service";
import { SmeService } from "../../../app/service/sme.service";
import Tabs from "../../../components/tabs";
import { AcceptedList } from "../interviews/Accepted/list";
import { SmeJobCandidateInfo } from "./candidate-info";
import { SmeJobDescriptionList } from "./description";
import { SmeJobInstructions } from "./instructions";
import { NavMenuTabs } from "../../../components/menus/nav-menu-tabs";
import Pageheader from "../../../components/page-header";
import moment from "moment";

interface Props {
  match?: any;
}
const SmeJobViewRoutes = (props: Props) => {
  let url: string | undefined = props.match?.url;
  if (url?.endsWith("/")) {
    url = url.substr(0, url.length - 1);
  }
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  const locationPath = useLocation().pathname;
  const [selectedJob, setSelectedJob] = React.useState<any>({});
  const [jobSkills, setJobSkills] = useState<any>([]);

  const [showAcceptPopup, setShowAcceptPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  // const [meetingLink,setMeetingLink]=useState<any>('')

  const tabsData = [
    {
      path: `/dashboard/interviewview/description/${splitLocation[4]}/${splitLocation[5]}`,
      label: "Job Description",
    },
    {
      path: `/dashboard/interviewview/candidate-info/${splitLocation[4]}/${splitLocation[5]}`,
      label: "Candidate Info",
    },
    // {
    //     path: `/dashboard/interviewview/instructions/${splitLocation[4]}/${splitLocation[5]}`,
    //     label: 'Instructions',
    // }
  ];

  useEffect(() => {
    getSmeJobs();
  }, []);

  const getSmeJobs = () => {
    JobsService.getInterviewById(splitLocation[5]).then((res) => {
      if (res.error) {
        toast.error(res?.error?.message);
        setLoading(false);
      } else {
        setLoading(false);
        console.log(res, "routes");
        const skills = res[0]?.job_mandatory_skills
          ? res[0]?.job_mandatory_skills.split(",")
          : [];
        // res[0].meeting_link='link'
        setJobSkills(skills);
        setSelectedJob({ ...res[0] });


        // element.meeting_link = 'link'
      }
    });
  };


  const handleAcceptPopup = () => {
    setShowAcceptPopup(true);
  };
  const handleCancelPopup = () => {
    setShowCancelPopup(true);
  };

  const onRejectJob = () => {
    setLoading(true);
    JobsService.smeRejectInterview(selectedJob?.uuid).then((res) => {
      if (res?.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        setShowCancelPopup(false);
        setLoading(false);
        getSmeJobs();
        toast.success("Rejected successfully");
      }
    });
  };

  const onAcceptJob = () => {
    setLoading(true);
    JobsService.smeAcceptInterview(selectedJob?.uuid).then((res) => {
      console.log("res----->", res)

      if (res?.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        setShowAcceptPopup(false);
        setLoading(false);
        getSmeJobs();
        toast.success("Accepted successfully");
      }
    });
  };

  const onBack = (): void => {
    history.goBack();
  };

  const handleJoin = () => {
    if (selectedJob.meeting_link) {
      history.push(`/video/${selectedJob.meeting_id}/${selectedJob?.uuid}`)
    }

    // history.push(`/video/${data?.item?.meeting_id}/${data?.item?.uuid}`)
  }

  return (
    <div>
      <div className="row px-4">
        <div className="nav_tabs">
          <div className="mt-5 ms-2">
            <div className="row ">
              <div className=" col-6  ">
                <h5 className="top_heading_styles ms-3">
                  {selectedJob?.job_title}
                </h5>
                <p className="top_para_styles ms-2">
                  <span className="mx-1"> {selectedJob?.location}</span>
                  <span className="me-1">
                    {jobSkills.map((data: any, index: number) => {
                      return (
                        index < 5 && (
                          <span
                            key={index}
                            className="fs_14 rounded-3  me-1 d-inline-block"
                          >
                            {data}
                            {index < 4 && <span>,</span>}
                          </span>
                        )
                      );
                    })}
                  </span>
                  <span className="ms-2 d-inline-block">
                    {moment(selectedJob?.interview_schedule).format("HH:mm")}-
                    {moment(selectedJob?.interview_schedule)
                      .add(1, "h")
                      .format("HH:mm")}
                  </span>
                </p>
              </div>
              <div className=" col-6 text-end">
                {
                  selectedJob.meeting_id &&
                  <>
                    <button className="large_btn_apply btn-outline-primary  me-4 px-2">
                      Cancel
                    </button>
                    <button className="large_btn_apply rounded mx-2" onClick={() => handleJoin()}>Join</button>

                  </>

                }
              </div>
              {/* <div className="col-md-6 text-end d-block d-lg-none col-6">
                                <div className="me-3">
                                    {selectedJob?.status === 'WAITING_FOR_SME_ACCEPT' && <>
                                        <button className='small_btn rounded me-3' onClick={() => handleAcceptPopup()}>Accept</button>
                                        <button className='small_btn rounded me-3' onClick={() => handleCancelPopup()}>
                                            Reject
                                        </button>
                                    </>}
                                    <button className='large_btn_apply  rounded me-3' onClick={() => onBack()}>Back</button>
                                </div>

                            </div> */}
            </div>
          </div>

          {/* <Pageheader title={selectedJob?.job_title}
                            subTitle={selectedJob?.job_mandatory_skills}
                            buttonName="Back"
                            editButtonClick={onBack}
                            /> */}
          <div className="col-md-12">
            <div className="row">
              <div
                className="col-md-6 d-none d-md-block ms-3"
                style={{ fontSize: "14px" }}
              >
                <Tabs tabsData={tabsData} active={locationPath}></Tabs>
              </div>

              <div
                className="col-md-6 d-block d-md-none"
                style={{ fontSize: "14px" }}
              >
                <NavMenuTabs
                  type="path"
                  activeUrl={locationPath}
                  menuItems={tabsData}
                  activeTab={0}
                  onChangeTab={() => { }}
                ></NavMenuTabs>
              </div>
              {/* <div className="col-md-6 text-end d-none d-lg-block">
                                <div className="me-3">
                                    {selectedJob?.status === 'WAITING_FOR_SME_ACCEPT' && <>
                                        <button className='small_btn rounded me-3' onClick={() => handleAcceptPopup()}>Accept</button>
                                        <button className='small_btn rounded me-3' onClick={() => handleCancelPopup()}>
                                            Reject
                                        </button>
                                    </>}
                                    <button className='large_btn_apply  rounded me-3' onClick={() => onBack()}>Back</button>
                                </div>
                            </div> */}
            </div>
          </div>
        </div>
        <Switch>
          <Route exact path={`${url}/description/:jobId/:interview`}>
            <SmeJobDescriptionList></SmeJobDescriptionList>
          </Route>
          <Route exact path={`${url}/instructions/:jobId/:interview`}>
            <SmeJobInstructions></SmeJobInstructions>
          </Route>
          <Route exact path={`${url}/candidate-info/:jobId/:interview`}>
            <SmeJobCandidateInfo></SmeJobCandidateInfo>
          </Route>
        </Switch>
      </div>

      <Modal
        show={showAcceptPopup}
        onHide={() => setShowAcceptPopup(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <div>
              <div className="invite_team_heading">Accept Job</div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="border rounded-3">
            <div className="border-bottom py-3">
              <ul className="list-inline d-flex my-auto">
                <li className="my-auto">
                  <ul className="list-inline">
                    <li className="text-black p-2" style={{ fontSize: "16px" }}>
                      {selectedJob?.job_title}
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-end">
            <button
              className="large_btn rounded me-3"
              onClick={() => setShowAcceptPopup(false)}
            >
              Cancel
            </button>
            <button className="large_btn rounded" onClick={onAcceptJob}>
              Accept
            </button>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showCancelPopup}
        onHide={() => setShowCancelPopup(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <div>
              <div className="invite_team_heading">Cancel Job</div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="border rounded-3">
            <div className="border-bottom py-3">
              <ul className="list-inline d-flex my-auto">
                <li className="my-auto">
                  <ul className="list-inline">
                    <li className="text-black p-2" style={{ fontSize: "16px" }}>
                      {selectedJob?.job_title}
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-end">
            <button
              className="large_btn rounded me-3"
              onClick={() => setShowCancelPopup(false)}
            >
              Cancel
            </button>
            <button className="large_btn rounded" onClick={onRejectJob}>
              Reject
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default SmeJobViewRoutes;
