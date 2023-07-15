import React from 'react';
import { Route, Switch } from 'react-router';
import { JobsdatasList } from '../pages/dashboard/company/jobs/list';
import { JobsForm } from '../pages/dashboard/company/jobs/form';
import { InterviewList } from '../pages/dashboard/sme/interviews/list';
import { InterviewForm } from '../pages/dashboard/sme/interviews/form';
import { UsersList } from '../pages/dashboard/sme/users/list';
import { RecordsForm } from '../pages/dashboard/sme/records/form';
import { RecordsList } from '../pages/dashboard/sme/records/list';
import { InterviewScheduleList } from '../pages/dashboard/reports/interviews-schedule/list';
const SmeRouts = () => {
    return (
        <Switch>
            <Route path="/dashboard/reports/interviewschedule" component={InterviewScheduleList}></Route>
            <Route path="/dashboard/sme/info/:id/recordsform/:companyCode/:userId" component={RecordsForm}></Route>
            <Route path="/dashboard/sme/info/:id/jobsform/:companyCode/:userId" component={JobsForm}></Route>
            <Route path="/dashboard/sme/info/:id/records/:companyCode" component={RecordsList}></Route>
            <Route path="/dashboard/sme/info/:id/jobs/:companyCode" component={JobsdatasList}></Route>
            <Route path="/dashboard/sme/info/:id/interviews/:companyCode" component={InterviewList}></Route>
            <Route path="/dashboard/sme/info/:id/interviewsform/:companyCode/:userId" component={InterviewForm}></Route>
        </Switch>
    )
}

export default SmeRouts;