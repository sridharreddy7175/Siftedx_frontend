import React from 'react';
import { Route, Switch } from 'react-router';
import { HrAllCandidates } from '../pages/dashboard/candidates/all-candidates/list';
import { FavouritesCandidates } from '../pages/dashboard/candidates/favourites/list';
import { HrCandidateForm } from '../pages/dashboard/candidates/form';
import { ScheduleListInterviewCandidates } from '../pages/dashboard/candidates/schedule-interviews/list';
import { ScreenedCandidates } from '../pages/dashboard/candidates/screened/list';
const CandidatesRouts = () => {
    return (
        <Switch>
            <Route path="/dashboard/candidates/all" component={HrAllCandidates}></Route>
            <Route path="/dashboard/candidates/favorites" component={FavouritesCandidates}></Route>
            <Route path="/dashboard/candidates/schedule" component={ScheduleListInterviewCandidates}></Route>
            <Route path="/dashboard/candidates/screened" component={ScreenedCandidates}></Route>
            <Route path="/dashboard/candidates/form/:id" component={HrCandidateForm}></Route>
            <Route path="/dashboard/candidates/view/:id" component={HrCandidateForm}></Route>

        </Switch>
    )
}

export default CandidatesRouts;