import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom';
import FormBuilder from '../../../../components/form-builder';
import { FormControlError, FormField, FormValidators } from '../../../../components/form-builder/model/form-field';
import { FormValidator, GetControlIsValid } from '../../../../components/form-builder/validations';
import { toast } from 'react-toastify';

export const RecordsForm = () => {
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [candidateData, setcandidateData] = useState<any>({});
    const [currentCandidateData, setCurrentcandidateData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [mobileNumber, setMobileNumber] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState(false);
    const [email, setEmail] = useState(false);

    let { userId } = useParams<{ userId: string }>();
    const usersId: number = parseInt(userId);

    const history = useHistory();

    const vicePrincipalFormValidations = [
        new FormField('name', [FormValidators.REQUIRED]),
        new FormField('gender', [FormValidators.REQUIRED]),
        new FormField('date_of_birth', []),
        new FormField('blood_group', [FormValidators.REQUIRED]),
        new FormField('city_village', []),
        new FormField('email_id', [FormValidators.REQUIRED]),
        new FormField('mobile_number', [FormValidators.REQUIRED]),
        new FormField('whatsapp_number', []),
    ];

    useEffect(() => {
        if (usersId > 0) {
            setLoading(true);
        }
    }, []);

    function createCandidate() {
        const candidate = candidateData.value ? { ...candidateData.value } : { ...currentCandidateData };
        setIsFormSubmitted(true);
        const errors: FormControlError[] = FormValidator(vicePrincipalFormValidations, candidate);
        if (errors.length < 1 && !email && !mobileNumber && !whatsappNumber) {
            setLoading(true);
        }
    }


    const handleCandidateInput = (data: any) => {
        data.value = { ...candidateData, ...data.value };
        setcandidateData(data);
        const errors: any = FormValidator(vicePrincipalFormValidations, data.value);
    };

    function handleUploadLogo(e: any, type: string) {
        if (e.target.files && e.target.files[0]) {
            const fileType = e.target.files[0].name.split('.').pop()
            if (fileType == "jpeg" || fileType == "jpg") {
                const formData = new FormData();
                formData.append('file', e.target.files[0], e.target.files[0].name);
            } else {
                toast.error("Please select image file only");
            }
        }
    }

    const handleGender = (e: any) => {
        const data = { ...candidateData.value };
        data.gender = e.target.value;
        if (currentCandidateData) {
            currentCandidateData.gender = e.target.value;
        }
    }

    const handleMobileChange = (e: any) => {
        const data = { ...candidateData.value };
        const re = /(6|7|8|9)\d{9}/;

        if ((e.target.value === '' || re.test(e.target.value)) && e.target.value.length === 10) {
            data.mobile_number = e.target.value;
            setMobileNumber(false);
        } else {
            data.mobile_number = e.target.value;
            setMobileNumber(true);
        }

        if (currentCandidateData) {
            currentCandidateData.mobile_number = e.target.value.replace(/\D+/g, '');
        }
    }

    const handleEmailChange = (e: any) => {
        const data = { ...candidateData.value };
        const re = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

        if (e.target.value === '' || re.test(e.target.value)) {
            data.email_id = e.target.value;
            setEmail(false);
        } else {
            data.email_id = e.target.value;
            setEmail(true);
        }

        if (currentCandidateData) {
            currentCandidateData.email_id = e.target.value;
        }
    }

    const updatecandidate = () => {

    }
    return (
        <div>
            {loading &&
                <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }
            {!loading && <div>
                <FormBuilder onUpdate={handleCandidateInput}>
                    <form>
                        <div style={{ marginTop: '15px', paddingLeft: '10px' }} className="mb-4">
                            <h5 className="form-label mb-2 d-block">Add Candidate</h5>
                        </div>
                        <div className="row custom-form">
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">First name</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <input className="form-control" placeholder="Enter first name" type="text" defaultValue={candidateData?.user_firstname} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">Last name</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <input className="form-control" placeholder="Enter last name" type="text" defaultValue={candidateData?.user_lastname} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">Email</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <input className="form-control" placeholder="Enter email" type="text" defaultValue={candidateData?.user_email} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">Mobile number</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <input className="form-control" placeholder="Enter mobile numer" type="text" defaultValue={candidateData?.mobile_no} />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">Total Experience</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <input className="form-control" placeholder="Enter total experience" type="text" defaultValue={candidateData?.total_experience} />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">Recruiter</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <select className="form-control" name="" id="">
                                        <option value="">Select recruiter</option>
                                        <option value="">raju</option>
                                        <option value="">Uday</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">Skills</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <select className="form-control" name="" id="">
                                        <option value="">Select skills</option>
                                        <option value="">React js</option>
                                        <option value="">Node js</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">Availability time</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <input className="form-control" placeholder="Enter availability time" type="text" defaultValue={candidateData?.availability_time} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label">Time_zone</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <select className="form-control" name="" id="">
                                        <option value="">Select user</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-4">
                                    <div className="file small_btn px-4 rounded-12 mt-2 d-inline-block">Upload Photo
                                        <input type="file" accept="image/*" onChange={(e) => handleUploadLogo(e, "principal")} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-4">
                                    <div className="file small_btn px-4 rounded-12 mt-2 d-inline-block">Upload resume
                                        <input type="file" accept="image/*" onChange={(e) => handleUploadLogo(e, "principal")} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </FormBuilder>
                <div className="form-footer py-3 text-end mt-4">
                    {usersId === 0 && <a className="small_btn px-5 rounded-12 cursor-pointer" onClick={() => createCandidate()}>Create</a>}
                    {usersId > 0 && <a className="small_btn px-5 rounded-12 cursor-pointer" onClick={() => updatecandidate()}>Update</a>}
                    <Link className="btn btn-danger px-5 rounded-12 text-decoration-none ms-2 cursor-pointer" to={`/dashboard/school/info/0/candidates/1`}>Cancel</Link>
                </div>
            </div>}
        </div>
    )
}