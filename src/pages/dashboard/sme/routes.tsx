import { Switch, Route, Redirect } from "react-router";
import { InterviewList } from "./interviews/list";
import { InvitationsList } from "./invitations/list";
import { SmeList } from "./list";
import { SmeProfile } from "./profile/form";
import { SmeReports } from "./reports/reports";
import { CandidateDetails } from "./schedulers/candidate-details";
import { SchedulersList } from "./schedulers/list";
import SmeFormPage from "./sme-form";
import { SmeInfo } from "./sme-info";


interface Props {
    match?: any;
}
const SmeRoutes = (props: Props) => {

    let url: string | undefined = props.match?.url;
    if (url?.endsWith('/')) {
        url = url.substr(0, url.length - 1);
    }
    return (
        <Switch>
            <Route exact path={`${url}/list`} >
                <SmeList></SmeList>
            </Route>
            <Route path={`${url}/new`} exact>
                <SmeFormPage></SmeFormPage>
            </Route>
            <Route path={`${url}/new/:id`} exact>
                <SmeFormPage></SmeFormPage>
            </Route>
            <Route path={`${url}/info/:id`} exact>
                <SmeInfo></SmeInfo>
            </Route>

            <Route path={`${url}/info/:id/details/:companyCode`} exact>
                <SmeInfo></SmeInfo>
            </Route>
            <Route path={`${url}/info/:id/userform/:companyCode/:userId`} exact>
                <SmeInfo></SmeInfo>
            </Route>
            <Route path={`${url}/info/:id/recordsform/:companyCode/:userId`} exact>
                <SmeInfo></SmeInfo>
            </Route>
            <Route path={`${url}/info/:id/jobsform/:companyCode/:userId`} exact>
                <SmeInfo></SmeInfo>
            </Route>
            <Route path={`${url}/info/:id/records/:companyCode`} exact>
                <SmeInfo></SmeInfo>
            </Route>
            <Route path={`${url}/info/:id/interviewsform/:companyCode/:userId`} exact>
                <SmeInfo></SmeInfo>
            </Route>
            <Route path={`${url}/info/:id/interviews/:companyCode`} exact>
                <SmeInfo></SmeInfo>
            </Route>
            <Route path={`${url}/info/:id/jobs/:companyCode`} exact>
                <SmeInfo></SmeInfo>
            </Route>
            <Route path={`${url}/profile`} exact>
                <SmeProfile></SmeProfile>
            </Route>
            <Route path={`${url}/invitations`} exact>
                <InvitationsList></InvitationsList>
            </Route>
            <Route path={`${url}/schedulers`} exact>
                <SchedulersList></SchedulersList>
            </Route>
            <Route path={`${url}/schedulers/details`} exact>
                <CandidateDetails></CandidateDetails>
            </Route>
            <Route path={`${url}/interviews`} exact>
                <InterviewList></InterviewList>
            </Route>
            <Route path={`${url}/reports`} exact>
                <SmeReports></SmeReports>
            </Route>
        </Switch>
    );
}
export default SmeRoutes;