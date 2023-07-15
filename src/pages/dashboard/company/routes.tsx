import { Switch, Route, Redirect } from "react-router";
import CompanyFormPage from "./company-form";
import { CompanyList } from "./list";
import { CompanyInfo } from "./company-info";
import { JobsRouts } from "./jobs/routes";


interface Props {
    match?: any;
}
const CompanyRoutes = (props: Props) => {
    let url: string | undefined = props.match?.url;
    if (url?.endsWith('/')) {
        url = url.substr(0, url.length - 1);
    }

    return (
        <Switch>
            <Route exact path={`${url}/list`} >
                <CompanyList></CompanyList>
            </Route>
            <Route path={`${url}/new`} exact>
                <CompanyFormPage></CompanyFormPage>
            </Route>
            <Route path={`${url}/new/:id`} exact>
                <CompanyFormPage></CompanyFormPage>
            </Route>
            <Route path={`${url}/info/:id`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>

            <Route path={`${url}/info/:id/users`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/userform/:userId`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/candidateform/:userId`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/view/:userId`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/mapcandidates/:companyCode/:userId`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/jobsform/:userId`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/job_details/:companyCode/:userId`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/description/:companyCode/:userId`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/candidate_status/:companyCode/:userId`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/candidates`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/interviewsform/:userId`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/interviews`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/jobslist`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/jobs/info`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/jobs/info/:jobId/candidates/:type`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/jobs/info/:jobId/description`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/jobs/info/:jobId/skills`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/jobs/info/:jobId/instructions`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/jobs/info/:jobId/interviews`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/jobs/info/:jobId/reports`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/jobs/info/:jobId/reportview`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
            <Route path={`${url}/info/:id/jobs/info/:jobId/sme`} exact>
                <CompanyInfo></CompanyInfo>
            </Route>
        </Switch>
    );
}
export default CompanyRoutes;