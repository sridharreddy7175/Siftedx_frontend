import React, { useState } from "react";
import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Switch, Route, useLocation } from "react-router";
import { RolesService } from "../../../app/service/roles.service";
import { UsersService } from "../../../app/service/users.service";
import ChipInput from "../../../components/chip-input";
import FormBuilder from "../../../components/form-builder";
import Tabs from "../../../components/tabs";
import { AdminMembers } from "./admins";
import { AllMembers } from "./all-members";
import { DeactivatedMembers } from "./deactivated";
import { HiringManagersMembers } from "./hiring-managers";
import { RecruitersMembers } from "./recruiters";
import Vector from '../../../assets/images/Vector.png'
import { ERROR_CODES } from "../../../app/utility/app-codes";
import { AppLoader } from "../../../components/loader";
import { toast } from "react-toastify";
import { PendingInvitationsMembers } from "./pending-invitations";
import Pageheader from "../../../components/page-header";
import { NavMenuTabs } from "../../../components/menus/nav-menu-tabs";


interface Props {
    match?: any;
}
const ManagerTeamRoutes = (props: Props) => {
    const [loading, setLoading] = useState(false);
    let url: string | undefined = props.match?.url;
    if (url?.endsWith('/')) {
        url = url.substr(0, url.length - 1);
    }
    const locationPath = useLocation().pathname;
    const [modalShow, setModalShow] = React.useState(false);
    const [showA, setShowA] = useState(false);
    const toggleShowA = () => setShowA(!showA);
    const [roles, setRoles] = useState<any[] | []>([]);
    const [selectedRoles, setSelectedRoles] = useState<any>({});
    const companyUuid = sessionStorage.getItem('company_uuid') || '';
    const [emails, setEmails] = useState([]);
    let companyData: any = sessionStorage.getItem('companyData') || '';
    companyData = companyData ? JSON.parse(companyData) : '';
    const tabsData = [
        {
            path: `/dashboard/manager-team/all-members`,
            label: 'All members',
            count: ''
        },
        {
            path: `/dashboard/manager-team/admins`,
            label: 'Admins',
            count: ''
        },
        {
            path: `/dashboard/manager-team/recruiters`,
            label: 'Recruiters',
            count: ''
        },
        {
            path: `/dashboard/manager-team/hiring-managers`,
            label: 'Hiring Managers',
            count: ''
        },
        {
            path: `/dashboard/manager-team/deactivated`,
            label: 'Deactivated',
            count: ''
        },
        {
            path: `/dashboard/manager-team/invitations`,
            label: 'Pending Invitations',
            count: ''
        }
    ];
    useEffect(() => {
        RolesService.getRoles().then(res => {
            // const roles = res.records?.filter((role: any) => role.code !== 'Candidate' && role.code !== 'SME' && role.code !== 'ASSIGN_CANDIDATE');
            setRoles([...res]);
        });
    }, []);

    const onAddTeamMember = () => {
        setLoading(true);
        const invitationData = {
            user_emails: emails,
            company_uuid: companyUuid,
            role: selectedRoles?.uuid
        }
        UsersService.invitation(invitationData).then(res => {
            if (res.error) {
                setLoading(false);
                toast.error(res.error.message);
            } else {
                toggleShowA();
                setModalShow(false);
                setLoading(false);
                toast.success('Invitation sent successfully');
            }
        });
    }
    const onSelectRole = (event: any) => {
        const selectedRole = roles.find((data: any, index: number) => data.uuid === event.target.value);
        if (selectedRole) {
            setSelectedRoles(selectedRole)
        }
    }
    const handleInput = () => {

    }
    const onChipData = (data: any) => {
        setEmails(data)
    }
    const createTeam = (): void => {
        setModalShow(true)
    }
    return (
        <>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }

            <div className='container-fluid'>
                {/* <div className='row '> */}
                    {/* <div className="row ps-3 pe-3 mt-5 mt-3 pe-lg-5 ms-4 mb-1">
                            <div className="col-8">
                                <h5 className='top_heading_styles'>Manage Team {companyData?.company_name}</h5>
                                <p className='top_para_styles'>Add or delete users in your team</p>
                            </div>
                            <div className="col-4 text-end pe-2 mt-3">
                                <button className='large_btn_apply rounded-3' onClick={() => setModalShow(true)}>Create Team</button>

                            </div>
                        </div> */}
                    <Pageheader title={`Manage Team ${companyData?.company_name}`}
                        subTitle="Add or delete users in your team"
                        buttonName="Create Team"
                        editButtonClick={createTeam}
                    />

                    <div className="row ps-3 pe-3 pe-lg-5">
                        <div className='col-12'>
                            <div className="row">
                                <div className="col-12">
                                    <div className="mt-2 ms-1 d-none d-lg-block">
                                        <Tabs tabsData={tabsData} active={locationPath}></Tabs>

                                    </div>

                                    <div className="d-block d-lg-none">
                                    <NavMenuTabs type="path" activeUrl={locationPath} menuItems={tabsData} activeTab={0} onChangeTab={() => { }}></NavMenuTabs>


                                    </div>
                                    <Switch>
                                        <Route exact path={`${url}/all-members`}>
                                            <AllMembers></AllMembers>
                                        </Route>
                                        <Route exact path={`${url}/admins`} >
                                            <AdminMembers></AdminMembers>
                                        </Route>
                                        <Route exact path={`${url}/recruiters`} >
                                            <RecruitersMembers></RecruitersMembers>
                                        </Route>
                                        <Route exact path={`${url}/hiring-managers`} >
                                            <HiringManagersMembers></HiringManagersMembers>
                                        </Route>
                                        <Route exact path={`${url}/deactivated`} >
                                            <DeactivatedMembers></DeactivatedMembers>
                                        </Route>
                                        <Route exact path={`${url}/invitations`} >
                                            <PendingInvitationsMembers></PendingInvitationsMembers>
                                        </Route>
                                    </Switch>
                                </div>
                            </div>

                    </div>


                </div>
            </div>


            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                className="sx-close w-100"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <div className='invite_team_heading'>Invite team members</div>
                        <p className='invite_team_content'>An invite request email will be sent to their email address</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormBuilder onUpdate={handleInput}>
                        <form>
                            <div className="mb-3">
                                <label className="form-label job_dis_form_label">Enter email address to invite</label>
                                <ChipInput type={'email'} placeholder="Enter email addresses" getChipsFieldData={(data) => onChipData(data)}></ChipInput>
                            </div>
                            <div className="mb-3">
                                <label className="input mt-2">
                                    {/* <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="jobTitle" name="job_title" placeholder="  "  defaultValue={currentJobData?.job_title} onChange={(event) => onChangeJobTitle(event)} /> */}
                                    <select className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" name="role" onChange={(event) => onSelectRole(event)}>
                                        <option value="">Select role</option>
                                        {roles.map((role: any, index: number) => { return <option key={index} value={role.uuid}>{role.name}</option> })}
                                    </select>
                                    <span className="input__label">Role</span>
                                </label>
                                {/* <label className="form-label job_dis_form_label">Role</label>
                                <select className="form-control job_dis_form_control px-3 rounded" name="role" onChange={(event) => onSelectRole(event)}>
                                    <option value="">Select role</option>
                                    {roles.map((role: any, index: number) => { return <option key={index} value={role.uuid}>{role.name}</option> })}
                                </select> */}
                            </div>

                            {selectedRoles?.description && <div className="mb-3">
                                <p className='f12'> <img src={Vector} alt="" /> {selectedRoles?.description}</p>
                            </div>}
                        </form>
                    </FormBuilder>
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex justify-content-between mx-3 mb-3">
                        <div className="text-start">
                        <button className='large_btn_filter ps-2 login_btn rounded' onClick={() => setModalShow(false)}>Cancel</button>
                        </div>
                    
                    <div className='text-end '>
                        <button className='large_btn_apply login_btn rounded' onClick={onAddTeamMember}>Send Invite</button>
                    </div>
                 </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default ManagerTeamRoutes;