import { useState } from "react";
import { Switch, Route, useLocation, useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { SXROLES } from "../../../app/utility/roles-codes";
import Pageheader from "../../../components/page-header";
import Tabs from "../../../components/tabs";
import { HrAllCandidates } from "./all-candidates/list";
import { HrCandidateView } from "./candidate-view";
import { FavouritesCandidates } from "./favourites/list";
import { HrCandidateForm } from "./form";
import { ScheduleListInterviewCandidates } from "./schedule-interviews/list";
import { ScreenedCandidates } from "./screened/list";
import { Modal } from 'react-bootstrap';
import Addcandidate from "../../../components/add-candidate/addcandidate";
import { NavMenuTabs } from "../../../components/menus/nav-menu-tabs";
import { UsersService } from "../../../app/service/users.service";
import { CandidatesService } from "../../../app/service/candidates.service";
import { toast } from "react-toastify";
import { S3Helper } from "../../../app/utility/s3-helper";




interface Props {
    match?: any;
    onUploadResume: any;
    resumeUrl: any;
    onSave: (data: any) => void;
}
const HrCandidatesRoutes = (props: Props) => {
    const userRole = sessionStorage.getItem("userRole");
    const [showInstructionsPopup, setShowInstructionsPopup] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [candidateData, setCandidateData] = useState<any>({});
    const userUuid = sessionStorage.getItem('userUuid') || [];
    const role = sessionStorage.getItem('userRole') || [];
    const [recruiters, setRecruiters] = useState<any>([]);
    const [selectedSkills, setSelectedSkills] = useState<any>('');
    const [awsInfo, setAwsInfo] = useState<any>(null);
    const [resumeUrl, setResumeUrl] = useState<string>('');
    const [categories, setCategories] = useState<any[]>([]);
    const [timeZones, setTimeZones] = useState<any[]>([]);
    const [skills, setSkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const companyId = sessionStorage.getItem('company_uuid') || '';
    const history = useHistory();
    const [mobileNumberError, setMobileNumberError] = useState("");
    const [mobileNumberCountryCodeError, setMobileNumberCountryCodeError] = useState("");
    const [countryData, setCountryData] = useState<any[] | []>([]);
    const [skillError, setSkillError] = useState("");
    // const id: any = useLocation().pathname.split('/')[4];
    const [experienceList, setExperienceList] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [isEmailVerified, setIsEmailVerified] = useState("0");
    const [isMobileVerified, setIsMobileVerified] = useState("0");
    const [selectedJoiningAvailability, setSelectedJoiningAvailability] = useState(3);
    const [formError, setFormError] = useState<any>('');

    let url: string | undefined = props.match?.url;
    if (url?.endsWith('/')) {
        url = url.substr(0, url.length - 1);
    }
    let { id } = useParams<{ id: string }>();

    const locationPath: any = useLocation().pathname;
    const tabsData = [
        {
            path: `/dashboard/candidates/all`,
            label: 'All Candidates',
            count: ''
        },
        {
            path: `/dashboard/candidates/schedule`,
            label: 'Scheduled Interviews',
            count: ''
        },
        {
            path: `/dashboard/candidates/screened`,
            label: 'Screened',
            count: ''
        },
        // {
        //     path: `/dashboard/candidates/favorites`,
        //     label: 'Favourites',
        //     count: ''
        // }
    ]


    const onUploadResume = async (event: any) => {
        setResumeUrl('');
        setLoading(true);
        if (event.target.files && event.target.files[0]) {
            UsersService.candidateResumeuploadurl(companyId).then(async res => {
                if (res?.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    const result = await S3Helper.uploadFilesToS3BySigned(res.presignedUrl,
                        event.target.files[0],
                        event.target.files[0]?.type
                    );
                    setResumeUrl(`${res.fileUrl}`);
                    setLoading(false);
                    toast.success("Uploaded Successfully");
                }
            })
        }
    };

    const createCandidate = (candidate: any) => {
        setLoading(true);
        candidate.company_uuid = companyId;
        candidate.resume_urls = resumeUrl;
        candidate.photo_url = '';
        candidate.availability_time = "";
        candidate.recruiter_uuid = userUuid;
        CandidatesService.addCandidate(candidate).then(
            res => {
                setLoading(false);
                if (res.error) {
                    toast.error(res?.error?.message);
                } else {
                    //   setAddCandidateModalShow(false);
                    toast.success('Saved Successfully');
                    history.push(`/dashboard/candidates/all`)
                }
            }
        );
        setShowInstructionsPopup(false)
    }

    const addCandidate = (): void => {
        // history.push('/dashboard/candidates/form/0')
        setShowInstructionsPopup(true)
    }




    return (
        <div>
            {userRole === "Recruiter" || userRole === "CompanyAdmin" ?
                <div className='container-fluid'>
                    <Pageheader title="100 Candidates"
                        subTitle="All the candidates in your talent pool"
                        buttonName="Add Candidate"
                        editButtonClick={addCandidate}
                    />
                    <div className="row ps-3 pe-3 pe-lg-5">
                        <div className='col-12'>
                            <div className="row">
                                <div className="col-12">
                                    <div className="mt-2 ms-2 d-none d-lg-block">
                                        <Tabs tabsData={tabsData} active={locationPath}></Tabs>
                                    </div>
                                    <div className="d-block d-lg-none">
                                        <NavMenuTabs type="path" activeUrl={locationPath} menuItems={tabsData} activeTab={0} onChangeTab={() => { }}></NavMenuTabs>
                                    </div>
                                    <div className="col-12">
                                        <div className='bg-white rounded-3'>
                                            <div className='px-1 pb-4 pt-3'>
                                                <Switch>
                                                    <Route exact path={`${url}/all`} >
                                                        <HrAllCandidates></HrAllCandidates>
                                                    </Route>
                                                    {/* <Route path={`${url}/favorites`} exact>
                                                        <FavouritesCandidates></FavouritesCandidates>
                                                    </Route> */}
                                                    <Route path={`${url}/schedule`} exact>
                                                        <ScheduleListInterviewCandidates></ScheduleListInterviewCandidates>
                                                    </Route>
                                                    <Route path={`${url}/screened`} exact>
                                                        <ScreenedCandidates></ScreenedCandidates>
                                                    </Route>
                                                    <Route path={`${url}/view/0`} exact>
                                                        <HrCandidateView></HrCandidateView>
                                                    </Route>
                                                    <Route path={locationPath} exact>
                                                        <HrCandidateForm></HrCandidateForm>
                                                    </Route>
                                                    <Route>

                                                    </Route>
                                                </Switch>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>


                    </div>
                </div>
                :
                <div>
                    {(!locationPath.includes('/dashboard/candidates/form') && locationPath !== '/dashboard/candidates/view/0') &&
                        <div className="job_description_padding mb-0">
                            <div className="row">
                                <div className="col-md-10 col-12">
                                    <h5 className="cadidates_heading">Candidates (Talent pool)</h5>
                                    <p className="cadidates_below_content">All the talent you added is here</p>
                                </div>
                                <div className="text-end col-md-2 col-12 mt-md-2">
                                    <Link to={`/dashboard/candidates/form/0`} className="large_btn_apply rounded-3 text-decoration-none add_candidate_btn text-black">Add Candidate</Link>
                                </div>
                            </div>
                            <div>
                                <Tabs tabsData={tabsData} active={locationPath}></Tabs>
                            </div>
                            <Switch>
                                <Route exact path={`${url}/all`} >
                                    <HrAllCandidates></HrAllCandidates>
                                </Route>
                                <Route path={`${url}/favorites`} exact>
                                    <FavouritesCandidates></FavouritesCandidates>
                                </Route>
                                <Route path={`${url}/schedule`} exact>
                                    <ScheduleListInterviewCandidates></ScheduleListInterviewCandidates>
                                </Route>
                                <Route path={`${url}/screened`} exact>
                                    <ScreenedCandidates></ScreenedCandidates>
                                </Route>
                                <Route path={`${url}/view/0`} exact>
                                    <HrCandidateView></HrCandidateView>
                                </Route>
                                <Route path={locationPath} exact>
                                    <HrCandidateForm></HrCandidateForm>
                                </Route>
                                <Route>

                                </Route>
                            </Switch>
                        </div>
                    }




                </div>
            }


            <Modal
                show={showInstructionsPopup}
                onHide={() => setShowInstructionsPopup(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className='content-size-xl sx-close'
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-0'>
                    <div className='my-2 px-lg-5 pb-5 px-3'
                    // style={{ height: '80vh', overflow: 'hidden', position: 'relative' }}
                    // style={{ height: "calc(100% - 140px)", overflow: "auto" }}
                    >
                        <div>
                            <div className='ms-3 mt-4'>
                                <h5 className="top_heading_styles">Add New Candidate</h5>
                                <p className='top_para_styles'>Enter the candidate details</p>
                            </div>

                            <Addcandidate
                                onUploadResume={onUploadResume}
                                resumeUrl={resumeUrl}
                                onSave={createCandidate}
                            />
                        </div>


                    </div>
                </Modal.Body>

            </Modal>

        </div>
    );
}
export default HrCandidatesRoutes;