import React from 'react'
import { HashRouter, BrowserRouter, Switch, Route } from 'react-router-dom'
import { dashboardFigmaPage } from '../components/dashboard/dashboard';
import { JobDiscription } from '../components/job-discription/job-discription';
import { AllMembers } from '../pages/dashboard/manager-team/all-members';
import { BookYourTime } from '../pages/book-your-time';
import { DashboardView } from '../pages/dashboard/dashboard';
import { CreateAccount } from '../pages/login/create-account';
import { CreateCompany } from '../pages/login/create-company';
import { ForgotPasswordPage } from '../pages/login/forgot-password';
import { LoginPage } from '../pages/login/login-page';
import { RegistrationPage } from '../pages/login/registration';
import { SetPasswordPage } from '../pages/login/set-password';
import { VerifyEmail } from '../pages/login/verify-email';
import { VerifyEmailCode } from '../pages/login/verify-email-code';
import { CompanyAlreadyExist } from '../pages/login/company-already-exist';
import { LinkedinLogin } from '../pages/login/linkedin-login';
import { ResetPassword } from '../pages/login/reset-password';
import { StepOne } from '../pages/sme/step-one';
import { StepTwo } from '../pages/sme/step-two';
import { StepThree } from '../pages/sme/step-three';
import { SmeSuccessPage } from '../pages/sme/sme-success-page';
import { VideoPage } from '../pages/sme/video';
import { CreateSMEAccount } from '../pages/login/create-sme-account';


const Routes = () => {
    return (
        <BrowserRouter>
            {/* <HashRouter> */}
            <Switch>
                <Route exact path="/" component={LoginPage}></Route>
                <Route exact path="/sme-step-one/:user" component={StepOne}></Route>
                <Route exact path="/sme-step-two/:user" component={StepTwo}></Route>
                <Route exact path="/sme-step-three/:user" component={StepThree}></Route>
                <Route exact path="/sme-success-page" component={SmeSuccessPage}></Route>
                <Route exact path="/reset-password/:id" component={ResetPassword}></Route>
                <Route exact path="/create-company" component={CreateAccount}></Route>
                <Route exact path="/linkedin-login" component={LinkedinLogin}></Route>
                <Route exact path="/accept/:id" component={CreateAccount}></Route>
                <Route exact path="/verify-email/:email" component={VerifyEmail}></Route>
                <Route exact path="/company-exist/:email" component={CompanyAlreadyExist}></Route>
                <Route exact path="/confirm-verify/:code" component={VerifyEmailCode}></Route>
                <Route exact path="/create-comapny" component={CreateCompany}></Route>
                <Route exact path="/create-sme" component={CreateSMEAccount}></Route>
                <Route exact path="/all-members" component={AllMembers}></Route>
                <Route exact path="/dashboard_figmaPage" component={dashboardFigmaPage}></Route>
                <Route exact path="/job-discription" component={JobDiscription}></Route>
                <Route exact path="/forgot-password" component={ForgotPasswordPage}></Route>
                <Route exact path="/registration" component={RegistrationPage}></Route>
                <Route exact path="/set-password/:userName" component={SetPasswordPage}></Route>
                <Route exact path="/home" component={LoginPage}></Route>
                <Route path="/dashboard" component={DashboardView}></Route>
                <Route path="/book-your-time" component={BookYourTime}></Route>
                <Route path="/video/:id/:interview" component={VideoPage}></Route>
            </Switch>
            {/* </HashRouter> */}
        </BrowserRouter>
    )
}

export default Routes;
