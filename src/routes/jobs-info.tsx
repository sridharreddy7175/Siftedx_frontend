import React from 'react'
import { Route, Switch } from 'react-router'
import { JobCandidateList } from '../pages/dashboard/company/jobs/candidate-list';
import { JobsDscription } from '../pages/dashboard/company/jobs/description';
import { JobInstructions } from '../pages/dashboard/company/jobs/Instructions';
import { JobInterviews } from '../pages/dashboard/company/jobs/interviews';
import { JobReports } from '../pages/dashboard/company/jobs/reports';
import { JobReportView } from '../pages/dashboard/company/jobs/reports-view';
import {JobsSkills} from '../pages/dashboard/company/jobs/skills';
import { JobSmes } from '../pages/dashboard/company/jobs/sme';


const JobsInfoRouts = () => {
    return (
        <Switch>
            <Route path="/dashboard/companies/info/:id/jobs/info/:jobId/candidates/:type" component={JobCandidateList}></Route>
            <Route path="/dashboard/companies/info/:id/jobs/info/:jobId/description" component={JobsDscription}></Route>
            <Route path="/dashboard/companies/info/:id/jobs/info/:jobId/skills" component={JobsSkills}></Route>
            {/* <Route path="/dashboard/companies/info/:id/jobs/info/:jobId/instructions" component={JobInstructions}></Route> */}
            <Route path="/dashboard/companies/info/:id/jobs/info/:jobId/interviews" component={JobInterviews}></Route>
            <Route path="/dashboard/companies/info/:id/jobs/info/:jobId/reports" component={JobReports}></Route>
            <Route path="/dashboard/companies/info/:id/jobs/info/:jobId/reportview" component={JobReportView}></Route>
            <Route path="/dashboard/companies/info/:id/jobs/info/:jobId/sme" component={JobSmes}></Route>
        </Switch>
    )
}

export default JobsInfoRouts;