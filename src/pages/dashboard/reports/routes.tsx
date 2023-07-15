import { Switch, Route, Redirect, useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import Tabs from "../../../components/tabs";
import { InterviewResultList } from "./interviews-result/list";
import { InterviewScheduleList } from "./interviews-schedule/list";
import { SmeList } from "./list";
import { ReportsInfo } from "./sme-info";


interface Props {
    match?: any;
}
const ReportsRoutes = (props: Props) => {

    let url: string | undefined = props.match?.url;
    if (url?.endsWith('/')) {
        url = url.substr(0, url.length - 1);
    }
    const locationPath = useLocation().pathname;
    const location = useLocation();
    const { pathname } = location;
    const splitLocation = pathname.split("/");
    const tabsData = [
        {
            path: `/dashboard/reports/interviewschedule`,
            label: 'Interview Scheduler',
            count: ''
        },
        {
            path: `/dashboard/reports/interviewresult`,
            label: 'Interviews Result',
            count: ''
        }
    ]
    return (
        <div>
            <div className="row px-5 py-4">
                <div className="col-md-10">
                    <h2>Reports</h2>
                </div>
            </div>
            <div className="px-5">
                <Tabs tabsData={tabsData} active={locationPath}></Tabs>
            </div>
            <Switch>
                <Route exact path={`${url}/interviewschedule`} >
                    <InterviewScheduleList></InterviewScheduleList>
                </Route>
                <Route path={`${url}/interviewresult`} exact>
                    <InterviewResultList></InterviewResultList>
                </Route>
            </Switch>
        </div>
    );
}
export default ReportsRoutes;