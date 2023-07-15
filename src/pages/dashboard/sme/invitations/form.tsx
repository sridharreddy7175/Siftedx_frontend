import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom';
import FormBuilder from '../../../../components/form-builder';
import { FormControlError, FormField, FormValidators } from '../../../../components/form-builder/model/form-field';
import { FormValidator, GetControlIsValid } from '../../../../components/form-builder/validations';
import { toast } from 'react-toastify';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

export const InvitationsForm = () => {
    const [principalValidationErrors, setUserValidationErrors] = useState<FormControlError[]>([]);
    const [userData, setUserData] = useState<any>({});
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [userLogo, setUserLogo] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [imageLoader, setImageLoader] = useState(false);
    const [mobileNumber, setMobileNumber] = useState(false);
    const [email, setEmail] = useState(false);
    const [startDate, setStartDate] = useState(null);

    let { id, userId } = useParams<{ id: string, userId: string }>();
    const companyId = parseInt(id);
    const usersId: number = parseInt(userId);

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
        if (usersId > 0) {
            setLoading(true);
        }
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

    const getUserInputValid = (control: string) => {
        const value = GetControlIsValid(principalValidationErrors, control);
        return value;
    }

    function handleUploadLogo(e: any, type: string) {
        if (e.target.files && e.target.files[0]) {
            const fileType = e.target.files[0].name.split('.').pop()
            if (fileType == "jpeg" || fileType == "jpg") {
                const formData = new FormData();
                formData.append('file', e.target.files[0], e.target.files[0].name);
                uploadLogo(formData, type);
            } else {
                toast.error("Valid file type .jpg, .jpeg only");
            }
        }
    }

    function uploadLogo(formdata: any, type: string) {
        setImageLoader(true);
    }

    const handleGender = (e: any) => {
        const data = { ...userData.value };
        data.gender = e.target.value;
        if (userData) {
            userData.gender = e.target.value;
        }
    }

    const handleMobileChange = (e: any) => {
        const data = { ...userData.value };
        const re = /(6|7|8|9)\d{9}/;

        if ((e.target.value === '' || re.test(e.target.value)) && e.target.value.length === 10) {
            data.mobile_number = e.target.value;
            setMobileNumber(false);
        } else {
            data.mobile_number = e.target.value;
            setMobileNumber(true);
        }

        if (userData) {
            userData.mobile_number = e.target.value.replace(/\D+/g, '');
        }
    }

    const handleEmailChange = (e: any) => {
        const data = { ...userData.value };
        const re = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

        if (e.target.value === '' || re.test(e.target.value)) {
            data.email_id = e.target.value;
            setEmail(false);
        } else {
            data.email_id = e.target.value;
            setEmail(true);
        }

        if (userData) {
            userData.email_id = e.target.value;
        }
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
                <FormBuilder onUpdate={handleUserInput}>
                    <form>
                        <div style={{ marginTop: '15px', paddingLeft: '10px' }} className="mb-4">
                            <h5 className="form-label mb-2 d-block">add Interview Candidate</h5>
                        </div>
                        <div className="row custom-form">
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">Id</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <input className="form-control" placeholder="Enter first name" type="text" defaultValue={userData?.user_firstname} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">job</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <input className="form-control" placeholder="Enter last name" type="text" defaultValue={userData?.user_lastname} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">candidate</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <input className="form-control" placeholder="Enter email" type="text" defaultValue={userData?.user_email} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">recruiter </label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <input className="form-control" placeholder="Enter email" type="text" defaultValue={userData?.user_email} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">company</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <input className="form-control" placeholder="Enter mobile numer" type="text" defaultValue={userData?.mobile_no} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">sme</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <input className="form-control" placeholder="Enter password" type="text" defaultValue={userData?.password_hash} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">interview schedule</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <input className="form-control" placeholder="Enter password" type="text" defaultValue={userData?.password_hash} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">interview status</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <select className="form-control" name="" id="">
                                        <option value="">Select role</option>
                                        <option value="">Sme</option>
                                        <option value="">Job seeker</option>
                                        <option value="">Recruiter</option>
                                        <option value="">HR managers</option>
                                        <option value="">Super admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">feedback status</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <select className="form-control" name="" id="">
                                        <option value="">Select role</option>
                                        <option value="">Sme</option>
                                        <option value="">Job seeker</option>
                                        <option value="">Recruiter</option>
                                        <option value="">HR managers</option>
                                        <option value="">Super admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">sme payment status</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <select className="form-control" name="" id="">
                                        <option value="">Select role</option>
                                        <option value="">Sme</option>
                                        <option value="">Job seeker</option>
                                        <option value="">Recruiter</option>
                                        <option value="">HR managers</option>
                                        <option value="">Super admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">meeting_link</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <input className="form-control" placeholder="Enter location" type="text" defaultValue={userData?.location} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">interview round</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <input className="form-control" placeholder="Enter postal code" type="text" defaultValue={userData?.postal_code} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label mb-0">interview duration</label>
                                    <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                    <input className="form-control" placeholder="Enter state" type="text" defaultValue={userData?.state_uuid} />
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
                    {usersId > 0 && <a className="small_btn px-5 rounded-12 cursor-pointer" onClick={() => updateUser()}>Update</a>}
                    <Link className="btn btn-danger rounded-12 px-5 text-decoration-none ms-2 cursor-pointer" to={`/dashboard/companies/info/${id}/users`}>Cancel</Link>
                </div>
            </div>}
        </div>
    )
}