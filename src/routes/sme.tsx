import React from 'react';
import { Route, Switch } from 'react-router';
import { JobsdatasList } from '../pages/dashboard/company/jobs/list';
import { JobsForm } from '../pages/dashboard/company/jobs/form';
import { InterviewList } from '../pages/dashboard/sme/interviews/list';
import { InterviewForm } from '../pages/dashboard/sme/interviews/form';
import { UsersList } from '../pages/dashboard/sme/users/list';
import { RecordsForm } from '../pages/dashboard/sme/records/form';
import { RecordsList } from '../pages/dashboard/sme/records/list';
import { SmeProfile } from '../pages/dashboard/sme/profile/form';
import { InvitationsList } from '../pages/dashboard/sme/invitations/list';
import { SchedulersList } from '../pages/dashboard/sme/schedulers/list';
import { SmeReports } from '../pages/dashboard/sme/reports/reports';
const SmeRouts = () => {
    return (
        <Switch>
            <Route path="/dashboard/sme/info/:id/details/:companyCode" component={UsersList}></Route>
            <Route path="/dashboard/sme/info/:id/recordsform/:companyCode/:userId" component={RecordsForm}></Route>
            <Route path="/dashboard/sme/info/:id/jobsform/:companyCode/:userId" component={JobsForm}></Route>
            <Route path="/dashboard/sme/info/:id/records/:companyCode" component={RecordsList}></Route>
            <Route path="/dashboard/sme/info/:id/jobs/:companyCode" component={JobsdatasList}></Route>
            <Route path="/dashboard/sme/info/:id/interviews/:companyCode" component={InterviewList}></Route>
            <Route path="/dashboard/sme/info/:id/interviewsform/:companyCode/:userId" component={InterviewForm}></Route>
            <Route path="/dashboard/sme/profile" component={SmeProfile}></Route>
            <Route path="/dashboard/sme/invitations" component={InvitationsList}></Route>
            <Route path="/dashboard/sme/schedulers" component={SchedulersList}></Route>
            <Route path="/dashboard/sme/schedulers/details" component={SchedulersList}></Route>
            <Route path="/dashboard/sme/interviews" component={InterviewList}></Route>
            <Route path="/dashboard/sme/reports" component={SmeReports}></Route>
        </Switch>
    )
}

export default SmeRouts;