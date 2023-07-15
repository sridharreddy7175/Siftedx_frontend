import React from 'react'
import { Route, Switch } from 'react-router'
import { UsersForm } from '../pages/dashboard/company/users/form'
import { UsersList } from '../pages/dashboard/company/users/list'
import { CandidateForm } from '../pages/dashboard/company/candidates/form'
import { CandidatesList } from '../pages/dashboard/company/candidates/list'
import { JobsdatasList } from '../pages/dashboard/company/jobs/list'
import { JobsForm } from '../pages/dashboard/company/jobs/form'
import { InterviewList } from '../pages/dashboard/company/interviews/list'
import { InterviewForm } from '../pages/dashboard/company/interviews/form'
import { MapCandidatesList } from '../pages/dashboard/company/candidates/map-candidates'
import { JobsDetails } from '../pages/dashboard/company/jobs/details'
import { CandidateStatus } from '../pages/dashboard/company/jobs/candidate-status'
import { CandidateView } from '../pages/dashboard/company/candidates/view'
import { JobsDscription } from '../pages/dashboard/company/jobs/description'
import { JobsInfo } from '../pages/dashboard/company/jobs/job-info'

const NestedDashboard = () => {
    return (
        <Switch>
            <Route path="/dashboard/companies/info/:id/users" component={UsersList}></Route>
            <Route path="/dashboard/companies/info/:id/userform/:userId" component={UsersForm}></Route>
            <Route path="/dashboard/companies/info/:id/candidateform/:userId" component={CandidateForm}></Route>
            <Route path="/dashboard/companies/info/:id/view/:userId" component={CandidateView}></Route>
            <Route path="/dashboard/companies/info/:id/jobsform/:userId" component={JobsForm}></Route>
            <Route path="/dashboard/companies/info/:id/job_details/:companyCode/:userId" component={JobsDetails}></Route>
            <Route path="/dashboard/companies/info/:id/description/:companyCode/:userId" component={JobsDscription}></Route>
            <Route path="/dashboard/companies/info/:id/candidate_status/:companyCode/:userId" component={CandidateStatus}></Route>
            <Route path="/dashboard/companies/info/:id/candidates" component={CandidatesList}></Route>
            <Route path="/dashboard/companies/info/:id/mapcandidates/:companyCode" component={MapCandidatesList}></Route>
            <Route path="/dashboard/companies/info/:id/jobslist" component={JobsdatasList}></Route>
            <Route path="/dashboard/companies/info/:id/jobs/info" component={JobsInfo}></Route>
            <Route path="/dashboard/companies/info/:id/interviews" component={InterviewList}></Route>
            <Route path="/dashboard/companies/info/:id/interviewsform/:userId" component={InterviewForm}></Route>
        </Switch>
    )
}

export default NestedDashboard;