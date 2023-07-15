import React, { useEffect, useState } from 'react'
import { Modal, Toast, ToastContainer } from 'react-bootstrap';
import ChipInput from '../../../components/chip-input';
import Vector from '../../../assets/images/Vector.png';
import FormBuilder from '../../../components/form-builder';
import { RolesService } from '../../../app/service/roles.service';
import { UsersService } from '../../../app/service/users.service';
import { NavLink, useHistory } from 'react-router-dom';
import grayEllipseImg from '../../../assets/images/gray_ellipse.png';
import { SX_ROLES } from '../../../app/utility/app-codes';
import { toast } from 'react-toastify';
import { AppLoader } from '../../../components/loader';

export const Overview = () => {
    const history = useHistory();
    const [showA, setShowA] = useState(false);
    const toggleShowA = () => setShowA(!showA);
    const [modalShow, setModalShow] = React.useState(false);
    const [roles, setRoles] = useState<any[] | []>([]);
    const [selectedRoles, setSelectedRoles] = useState<any>({});
    const companyUuid = sessionStorage.getItem('company_uuid') || '';
    const [emails, setEmails] = useState([]);
    const role = sessionStorage.getItem('userRole');
    const [emailError, setEmailError] = React.useState('');
    const [roleError, setRoleError] = React.useState('');
    const [loading, setLoading] = useState(false);

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
        if (emails.length > 0 && selectedRoles?.uuid) {
            UsersService.invitation(invitationData).then(res => {
                if (res?.error) {
                    setLoading(false);
                    toast.error(res?.error?.message);
                } else {
                    setLoading(false);
                    toggleShowA();
                    setModalShow(false);
                }
            });
        } else {
            setLoading(false);
            if (!(emails.length > 0)) {
                setEmailError('Please enter email id`s');
            }
            if (!selectedRoles?.uuid) {
                setRoleError('Please select role');
            }
        }
    }
    const onSelectRole = (event: any) => {
        setRoleError('')
        const selectedRole = roles.find((data: any, index: number) => data.uuid === event.target.value);
        if (selectedRole) {
            setSelectedRoles(selectedRole)
        }
    }
    const handleInput = () => {

    }
    const onChipData = (data: any) => {
        setEmailError('')
        setEmails(data)
    }
    const handlePage = () => {
        history.push('/dashboard/jobs/${companyUuid}/form/0');
    }
    const showAddMember = () => {
        toggleShowA();
        setModalShow(true)
    }
    return (
        <div className='row'>
            {role === SX_ROLES.CompanyAdmin &&
                <div className='col-12'>
                    <div className='billing_heading px-md-5 px-3'>
                        <h5 className='top_heading_styles'>Welcome to a faster hiring experience!</h5>
                        <p className='top_para_styles p-0 m-0'>Choose one of the below options and start to streamline your tech screening process</p>
                    </div>
                    <div className='row px-md-5 px-3'>
                        <div className='col-md-9 col-12'>
                            <div className='row mb-sm-5'>
                                <div className='col-md-5 col-12 create_the_team_box'>
                                    <div className='border_color bg-white ms-4'>
                                        <div className='text-center'>
                                            <div className='overview_circle'>
                                                <img src={grayEllipseImg} alt="loading" />
                                            </div>
                                        </div>
                                        <div className='text-center create_the_team_box_content'>
                                            <p className='hiring_experience_heading p-0 m-0'>Create the team</p>
                                            <p className='hiring_experience_text'>It is always better when your team is here, start creating your team.</p>
                                            <p><button className='large_btn rounded' onClick={() => setModalShow(true)}>Add first team member</button></p>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-5 col-12 upload_job_description'>
                                    <div className='border_color bg-white'>
                                        <div className='text-center'>
                                            <div className='overview_circle'>
                                                <img src={grayEllipseImg} alt="loading" />
                                            </div>
                                        </div>
                                        <div className='text-center upload_job_description_content'>
                                            <p className='hiring_experience_heading p-0 m-0'>Upload Job Description</p>
                                            <p className='hiring_experience_text'>Create your first job description and start to see the SME’s best suited for the same.</p>
                                            <p><button className='large_btn rounded' onClick={() => handlePage()}>Upload job description</button></p>
                                           
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }

            <ToastContainer className="p-3" position={'bottom-end'}>
                {/* autohide */}
                <Toast show={showA} delay={5000} onClose={toggleShowA} style={{ borderTop: "5px #79E524 solid" }}>
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">Team members invited</strong>
                    </Toast.Header>
                    <Toast.Body>An invite request email has been sent to their email address</Toast.Body>
                    <div className='d-flex w-100 px-3 py-2'>
                        <div className='w-50'>
                            <button className='extra_large_btn rounded' onClick={() => showAddMember()}>Add member</button>
                        </div>
                        <div className='text-end w-50'>
                            <button className='extra_large_btn rounded' onClick={toggleShowA}>Okay</button>
                        </div>
                    </div>
                </Toast>
            </ToastContainer>

            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <div className='invite_team_heading'>Invite team members</div>
                        <p className='invite_team_content'>An invite request email will be sent to their email address</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <FormBuilder onUpdate={handleInput}>
                            <form>
                                <div className="mb-3">
                                    <label className="form-label job_dis_form_label">Enter email address to invite</label>
                                    <ChipInput type={'email'} placeholder="Enter email addresses" getChipsFieldData={(data) => onChipData(data)}></ChipInput>
                                    {emailError && <p className="text-danger job_dis_form_label">{emailError}</p>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label job_dis_form_label">Role</label>
                                    <select className="form-control job_dis_form_control px-3 rounded" name="role" onChange={(event) => onSelectRole(event)}>
                                        <option value="">Select role</option>
                                        {roles.map((role: any, index: number) => { return <option key={index} value={role.uuid}>{role.name}</option> })}
                                    </select>
                                    {roleError && <p className="text-danger job_dis_form_label">{roleError}</p>}
                                </div>
                                {selectedRoles?.description && <div className="mb-3">
                                    <p className='f12'> <img src={Vector} alt="" /> {selectedRoles?.description}</p>
                                </div>}
                            </form>
                        </FormBuilder>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className='text-end pb-3'>
                        <button className='small_btn rounded-3' onClick={onAddTeamMember}>Send Invite</button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
