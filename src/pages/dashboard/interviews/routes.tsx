import { useEffect, useState } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { SX_ROLES } from "../../../app/utility/app-codes";
import { NavMenuTabs } from "../../../components/menus/nav-menu-tabs";
import Tabs from "../../../components/tabs";
import { AcceptedList } from "./Accepted/list";
import InterviewCalenderView from "./calender/view";
import { InterviewCompletedList } from "./completed/list";
import { InterviewEvaluationReport } from "./evaluation-report";
import { InterviewEvaluationReportView } from "./evaluation-report-view";
import { OpportunitiesList } from "./opportunities/list";
import { InterviewRejectedList } from "./rejected/list";
import { ReportNeededList } from "./report-needed/list";
import { InterviewUpcomingList } from "./upcomig/list";


interface Props {
    match?: any;
}
const InterviewRoutes = (props: Props) => {
    let url: string | undefined = props.match?.url;
    if (url?.endsWith('/')) {
        url = url.substr(0, url.length - 1);
    }
    const role = sessionStorage.getItem('userRole');
    const location = useLocation();
    const { pathname } = location;
    const splitLocation = pathname.split("/");
    const locationPath = useLocation().pathname;
    const [tabsData, setTabsData] = useState<any>([]);

    // const tabsData = [
    //     {
    //         path: `/dashboard/interviews/opportunities`,
    //         label: 'Opportunities',
    //     },
    //     {
    //         path: `/dashboard/interviews/accepted`,
    //         label: 'Accepted',
    //     },
    //     {
    //         path: `/dashboard/interviews/report-needed`,
    //         label: 'Report Needed',
    //     },
    //     {
    //         path: `/dashboard/interviews/completedlist`,
    //         label: 'Complete',
    //     }
    // ]

    useEffect(() => {
        if (role === SX_ROLES.SME) {
            const data = [
                {
                    path: `/dashboard/interviews/opportunities`,
                    label: 'Interview Requests',
                },
                {
                    path: `/dashboard/interviews/accepted`,
                    label: 'Accepted',
                },
                {
                    path: `/dashboard/interviews/report-needed`,
                    label: 'Pending Evaluation',
                },
                {
                    path: `/dashboard/interviews/completedlist`,
                    label: 'Completed',
                },
                {
                    path: `/dashboard/interviews/rejected`,
                    label: 'Rejected',
                }
            ]
            setTabsData([...data])
        } 
        else if (role === SX_ROLES?.CompanyAdmin) {
            const data = [
                {
                    path: `/dashboard/interviews/upcomming`,
                    label: 'Upcoming',
                },
                {
                    path: `/dashboard/interviews/completedlist`,
                    label: 'Completed',
                }
            ]
            setTabsData([...data])
        }

    }, []);
    return (
        <div>
            {locationPath !== '/dashboard/interviews/calendar-view' && !location.pathname.includes('/dashboard/interviews/evaluation-report') && <div className="row job_description_padding mb-0">
                <div className="col-md-10">
                    <div className="ms-3 ms-lg-2 mt-4 mt-lg-0">
                        <h5 className="top_heading_styles">Interviews</h5>
                        <h6 className="top_para_styles">Details of interviews for the SME</h6>
                    </div>
                </div>
                <div className="col-md-2 text-end">
                    {/* {locationPath === '/dashboard/interviews/accepted' && <NavLink className="large_btn_apply text_color rounded-3 py-1" to={`/dashboard/interviews/calendar-view`}>Calender View</NavLink>} */}
                </div>
            </div>}
            {locationPath !== '/dashboard/interviews/calendar-view' && !location.pathname.includes('/dashboard/interviews/evaluation-report') && <div className="job_description_padding mb-0 mt-2">

                <div className='w-100'>
                    <div className="d-block d-md-none">
                        <NavMenuTabs type="path" activeUrl={locationPath} menuItems={tabsData} activeTab={0} onChangeTab={() => { }}></NavMenuTabs>
                    </div>
                    
                    <div className="d-none d-md-block">
                        <Tabs tabsData={tabsData} active={locationPath}></Tabs>
                    </div>
                </div>
            </div>}
            <Switch>
                <Route exact path={`${url}/opportunities`} >
                    <OpportunitiesList></OpportunitiesList>
                </Route>
                <Route exact path={`${url}/accepted`} >
                    <AcceptedList></AcceptedList>
                </Route>
                <Route exact path={`${url}/report-needed`} >
                    <ReportNeededList></ReportNeededList>
                </Route>
                <Route path={`${url}/completedlist`} exact>
                    <InterviewCompletedList></InterviewCompletedList>
                </Route>
                <Route path={`${url}/rejected`} exact>
                    <InterviewRejectedList></InterviewRejectedList>
                </Route>
                <Route path={`${url}/upcomming`} exact>
                    <InterviewUpcomingList></InterviewUpcomingList>
                </Route>
                <Route path={`${url}/calendar-view`} exact>
                    <InterviewCalenderView></InterviewCalenderView>
                </Route>
                <Route path={`${url}/evaluation-report/:id`} exact>
                    <InterviewEvaluationReport></InterviewEvaluationReport>
                </Route>
                <Route path={`${url}/evaluation-report-view/:id`} exact>
                    <InterviewEvaluationReportView></InterviewEvaluationReportView>
                </Route>

            </Switch>
        </div>
    );
}
export default InterviewRoutes;