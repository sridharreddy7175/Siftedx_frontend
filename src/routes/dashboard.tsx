import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { RolesList } from '../pages/dashboard/roles/list';
import CompanyPage from '../pages/dashboard/company/index';
import { UsersList } from '../pages/dashboard/company/users/list';
import { UsersForm } from '../pages/dashboard/company/users/form';
import { RoleForm } from '../pages/dashboard/roles/form';
import { ObjectsList } from '../pages/dashboard/objects/list';
import { ObjectForm } from '../pages/dashboard/objects/form';
import SmePage from '../pages/dashboard/sme';
import { CandidatesList } from '../pages/dashboard/company/candidates/list';
import { JobsdatasList } from '../pages/dashboard/company/jobs/list';
import { InterviewList } from '../pages/dashboard/company/interviews/list';
import ReportsPage from '../pages/dashboard/reports';
import { JobsForm } from '../pages/dashboard/company/jobs/form';
import { CandidateForm } from '../pages/dashboard/company/candidates/form';
import { CompanyReportsPage } from '../pages/dashboard/company/reports/reports';
import { DashBoardPage } from '../pages/dashboard/dashboardpage';
import { MapCandidatesList } from '../pages/dashboard/company/candidates/map-candidates';
import { JobsDetails } from '../pages/dashboard/company/jobs/details';
import { CandidateStatus } from '../pages/dashboard/company/jobs/candidate-status';
import { CandidateView } from '../pages/dashboard/company/candidates/view';
import { JobsDscription } from '../pages/dashboard/company/jobs/description';
import InterviewsPage from '../pages/dashboard/interviews';
import { AccountSettings } from '../pages/dashboard/accountsettings/view';
import HrCandidatesRoutes from '../pages/dashboard/candidates/routes';
import { Overview } from '../pages/dashboard/overview';
import { AllMembers } from '../pages/dashboard/manager-team/all-members';
import ManagerTeamPage from '../pages/dashboard/manager-team';
import { RecruitersMembers } from '../pages/dashboard/manager-team/recruiters';
import { AdminMembers } from '../pages/dashboard/manager-team/admins';
import { HiringManagersMembers } from '../pages/dashboard/manager-team/hiring-managers';
import { DeactivatedMembers } from '../pages/dashboard/manager-team/deactivated';
import { Billing } from '../pages/dashboard/billing/billing';
import { EvaluationReport } from '../pages/dashboard/reports/evaluation-report';
import { ManagePayouts } from '../pages/dashboard/manage-payouts/manage-payouts';
import { Availability } from '../pages/dashboard/availability/availability';
import SmeJobViewsPage from '../pages/dashboard/sme-job-view';
import { CreateCompany } from '../pages/login/create-company';
import { PendingInvitationsMembers } from '../pages/dashboard/manager-team/pending-invitations';
import { Help } from '../pages/dashboard/help';

const DashbordRoutes = () => {
    return (
        <Switch>
            <Route path="/dashboard/companies" component={CompanyPage}></Route>
            <Route path="/dashboard/home" component={DashBoardPage}></Route>
            <Route path="/dashboard/sme" component={SmePage}></Route>
            <Route path="/dashboard/reports" component={ReportsPage}></Route>
            <Route path="/dashboard/manager-team" component={ManagerTeamPage}></Route>
            <Route path="/dashboard/candidates" component={HrCandidatesRoutes}></Route>
            <Route path="/dashboard/companyreports" component={CompanyReportsPage}></Route>
            <Route exact path="/dashboard/roles" component={RolesList}></Route>
            <Route exact path="/dashboard/roles/form/:id" component={RoleForm}></Route>
            <Route exact path="/dashboard/objects" component={ObjectsList}></Route>
            <Route exact path="/dashboard/objects/form/:id" component={ObjectForm}></Route>
            <Route exact path="/dashboard/users" component={UsersList}></Route>
            <Route exact path="/dashboard/account-settings" component={CreateCompany}></Route>
            <Route exact path="/dashboard/billing" component={Billing}></Route>
            <Route exact path="/dashboard/users/:id/form/:userId" component={UsersForm}></Route>
            <Route exact path="/dashboard/candidates" component={CandidatesList}></Route>
            <Route exact path="/dashboard/candidates/mapJob" component={MapCandidatesList}></Route>
            <Route exact path="/dashboard/candidates/:id/form/:userId" component={CandidateForm}></Route>
            <Route exact path="/dashboard/candidates/:id/view/:userId" component={CandidateView}></Route>
            <Route exact path="/dashboard/jobs" component={JobsdatasList}></Route>
            <Route exact path="/dashboard/jobs/:id/details/:userId" component={JobsDetails}></Route>
            <Route exact path="/dashboard/jobs/:id/description/:userId" component={JobsDscription}></Route>
            <Route exact path="/dashboard/jobs/:id/details_status/:userId" component={CandidateStatus}></Route>
            <Route exact path="/dashboard/jobs/:id/form/:userId" component={JobsForm}></Route>
            <Route exact path="/dashboard/interviews" component={InterviewList}></Route>
            <Route path="/dashboard/interviews" component={InterviewsPage}></Route>
            <Route path="/dashboard/interviewview" component={SmeJobViewsPage}></Route>
            <Route path="/dashboard/account-settings/view" component={AccountSettings}></Route>
            <Route path="/dashboard/overview" component={Overview}></Route>
            <Route path="/dashboard/evaluation-report" component={EvaluationReport}></Route>
            <Route path="/dashboard/manager-team/all-members" component={AllMembers}></Route>
            <Route path="/dashboard/manager-team/admins" component={AdminMembers}></Route>
            <Route path="/dashboard/manager-team/recruiters" component={RecruitersMembers}></Route>
            <Route path="/dashboard/manager-team/hiring-managers" component={HiringManagersMembers}></Route>
            <Route path="/dashboard/manager-team/deactivated" component={DeactivatedMembers}></Route>
            <Route path="/dashboard/manager-team/invitations" component={PendingInvitationsMembers}></Route>
            <Route path="/dashboard/manage-payouts" component={ManagePayouts}></Route>
            <Route path="/dashboard/availability" component={Availability}></Route>
            <Route path="/dashboard/help" component={Help}></Route>

        </Switch>
    )
}

export default DashbordRoutes;
