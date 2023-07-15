import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom';
import FormBuilder from '../../../../components/form-builder';
import { FormControlError, FormField, FormValidators } from '../../../../components/form-builder/model/form-field';
import { FormValidator, GetControlIsValid } from '../../../../components/form-builder/validations';
import { toast } from 'react-toastify';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { JobsService } from '../../../../app/service/jobs.service';
import { CandidatesService } from '../../../../app/service/candidates.service';

export const InterviewForm = () => {
    let { id, userId } = useParams<{ id: string, userId: string }>();
    const companyId = id || sessionStorage.getItem('company_uuid') || '';
    const [principalValidationErrors, setUserValidationErrors] = useState<FormControlError[]>([]);
    const [userData, setUserData] = useState<any>({});
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [userLogo, setUserLogo] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [imageLoader, setImageLoader] = useState(false);
    const [mobileNumber, setMobileNumber] = useState(false);
    const [email, setEmail] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const usersId: number = parseInt(id);
    const [jobsList, setjobsList] = useState<any>([]);
    const [candidatesList, setcandidatesList] = useState<any>([]);

    const history = useHistory();

    const userFormValidations = [
        new FormField('user_firstname', [FormValidators.REQUIRED]),
        new FormField('user_lastname', [FormValidators.REQUIRED]),
        new FormField('user_email', []),
        new FormField('mobile_no', [FormValidators.REQUIRED]),
        new FormField('password_hash', []),
        new FormField('role', [FormValidators.REQUIRED]),
        new FormField('gender', [FormValidators.REQUIRED]),
        new FormField('location', []),
        new FormField('locked', []),
        new FormField('user_image', []),
        new FormField('user_thumbnail', []),
        new FormField('status', []),
        new FormField('postal_code', []),
        new FormField('state_uuid', []),
        new FormField('city_uuid', []),
    ];

    useEffect(() => {
        JobsService.getJobs(companyId).then(
            res => {
                setjobsList(res);
            }
        )

        CandidatesService.getCandidates(id).then(
            res => {
                setcandidatesList(res)
            }
        )
    }, []);

    const handleUserInput = (data: any) => {
        data.value = { ...userData, ...data.value };
        setUserData(data);
        const errors: any = FormValidator(userFormValidations, data.value);
        setUserValidationErrors(errors);
    };

    function createUser() {
        const selectedUserData = userData.value ? { ...userData.value } : { ...userData };
        setIsFormSubmitted(true);
        const errors: FormControlError[] = FormValidator(userFormValidations, selectedUserData);
        setUserValidationErrors(errors);
        if (errors.length < 1 && !email && !mobileNumber) {
            setLoading(true);
        }
    }

    function updateUser() {
        const selectedUserData = { ...userData.value };
        const errors: FormControlError[] = FormValidator(userFormValidations, selectedUserData);
    }

    return (
        <div className='row background-gray py-5'>
            {loading &&
                <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }
            <div className="mb-4">
                <h5 className="form-label mb-2 d-block">{usersId === 0 ? 'Add Interview Candidate' : 'Edit Interview Candidate'}</h5>
            </div>
            {!loading && <div>
                <div className='add_company_border pb-4 p-5'>
                    <FormBuilder onUpdate={handleUserInput}>
                        <form>
                            <div className="row custom-form">
                                <div className="col-md-6 px-3">
                                    <div className="mb-4">
                                        <label className="form-label job_dis_form_label mb-0">Job</label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                        <select className="form-control job_dis_form_control px-3 rounded" name="job_uuid" id="job">
                                            <option value="">Select role</option>
                                            {jobsList?.map((job: any, index: number) => { return <option key={index} value={job.uuid}>{job.job_title}</option> })}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6 px-3">
                                    <div className="mb-4">
                                        <label className="form-label job_dis_form_label mb-0">Candidate</label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                        <select className="form-control job_dis_form_control px-3 rounded" name="candidate_uuid" id="job">
                                            <option value="">Select candidate</option>
                                            {candidatesList?.map((candidate: any, index: number) => { return <option key={index} value={candidate.uuid}>{`${candidate.user_firstname} ${candidate?.user_lastname}`}</option> })}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6 px-3">
                                    <div className="mb-4">
                                        <label className="form-label job_dis_form_label mb-0">SME</label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                        <select className="form-control job_dis_form_control px-3 rounded" name="sme_uuid" id="job">
                                            <option value="">Select sme</option>
                                            {candidatesList?.map((candidate: any, index: number) => { return <option key={index} value={candidate.uuid}>{`${candidate.user_firstname} ${candidate?.user_lastname}`}</option> })}
                                        </select>                                </div>
                                </div>
                                <div className="col-md-6 px-3">
                                    <div className="mb-4">
                                        <label className="form-label job_dis_form_label mb-0">Recruiter</label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                        <select className="form-control job_dis_form_control px-3 rounded" name="recruiter_uuid" id="job">
                                            <option value="">Select recruiter</option>
                                            {candidatesList?.map((candidate: any, index: number) => { return <option key={index} value={candidate.uuid}>{`${candidate.user_firstname} ${candidate?.user_lastname}`}</option> })}
                                        </select>                                    </div>
                                </div>
                                <div className="col-md-6 px-3">
                                    <div className="mb-4">
                                        <label className="form-label job_dis_form_label mb-0">Interview Schedule </label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                        <input className="form-control job_dis_form_control px-3 rounded" placeholder="Interview Schedule" type="datetime-local" name='interview_schedule' defaultValue={userData?.interview_schedule} />
                                    </div>
                                </div>
                                <div className="col-md-6 px-3">
                                    <div className="mb-4">
                                        <label className="form-label job_dis_form_label mb-0">Meeting Link</label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                        <input className="form-control job_dis_form_control px-3 rounded" placeholder="Enter meeting link" type="text" name='meeting_link' defaultValue={userData?.meeting_link} />
                                    </div>
                                </div>
                                <div className="col-md-6 px-3">
                                    <div className="mb-4">
                                        <label className="form-label job_dis_form_label mb-0">Interview Round</label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                        <input className="form-control job_dis_form_control px-3 rounded" placeholder="Enter interview round" type="text" name='interview_round' defaultValue={userData?.interview_round} />
                                    </div>
                                </div>
                                <div className="col-md-6 px-3">
                                    <div className="mb-4">
                                        <label className="form-label job_dis_form_label mb-0">Interview Status</label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                        <select className="form-control job_dis_form_control px-3 rounded" name="interview_status" >
                                            <option value="">Select interview status</option>
                                            <option value="">Pending</option>
                                            <option value="">Reject</option>
                                            <option value="">Completed</option>
                                            <option value="">Hold</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6 px-3">
                                    <div className="mb-4">
                                        <label className="form-label job_dis_form_label mb-0">Interview Duration</label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                        <input className="form-control job_dis_form_control px-3 rounded" placeholder="Enter interview duration" type="time" name='interview_duration' defaultValue={userData?.interview_duration} />
                                    </div>
                                </div>
                                <div className="col-md-6 px-3">
                                    <div className="mb-4">
                                        <label className="form-label job_dis_form_label mb-0">Feedback Status</label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                        <select className="form-control job_dis_form_control px-3 rounded" name="" id="">
                                            <option value="">Select feedback status</option>
                                            <option value="">1</option>
                                            <option value="">2</option>
                                            <option value="">3</option>
                                            <option value="">4</option>
                                            <option value="">5</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6 px-3">
                                    <div className="mb-4">
                                        <label className="form-label job_dis_form_label mb-0">sme payment status</label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                        <select className="form-control job_dis_form_control px-3 rounded" name="" id="">
                                            <option value="">Select sme payment status</option>
                                            <option value="">Pending</option>
                                            <option value="">Completed</option>
                                        </select>
                                    </div>
                                </div>
                                {imageLoader &&
                                    <div className="text-center col-md-1 p-5">
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                }
                            </div>
                        </form>
                    </FormBuilder>
                    <div className="text-center form-footer border-primary py-3 text-end mt-4">
                        {usersId === 0 && <a className="small_btn px-5 rounded-12 cursor-pointer" onClick={() => createUser()}>Create</a>}
                        {usersId !== 0 && <a className="small_btn px-5 rounded-12 cursor-pointer" onClick={() => updateUser()}>Update</a>}
                        <Link className="btn btn-danger rounded-12 px-5 text-decoration-none ms-2 cursor-pointer" to={`/dashboard/companies/info/${id}/interviews`}>Cancel</Link>
                    </div>
                </div>
            </div>}
        </div>
    )
}