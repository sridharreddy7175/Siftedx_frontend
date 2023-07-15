import React, { useEffect, useState } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import FormBuilder from '../../../../components/form-builder';
import { FormControlError, FormField, FormValidators } from '../../../../components/form-builder/model/form-field';
import { FormValidator, GetControlIsValid } from '../../../../components/form-builder/validations';
import { toast } from 'react-toastify';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { UsersService } from '../../../../app/service/users.service';
import { RolesService } from '../../../../app/service/roles.service';
import { S3Helper } from '../../../../app/utility/s3-helper';
import { CompanyService } from '../../../../app/service/company.service';
import Profile from '../../../../assets/images/profile.png';
import { LookUpService } from '../../../../app/service/lookup.service';

export const UsersForm = () => {
    const [principalValidationErrors, setUserValidationErrors] = useState<FormControlError[]>([]);
    const [userData, setUserData] = useState<any>({});
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageLoader, setImageLoader] = useState(false);
    const [roles, setRoles] = useState<any[]>([]);
    let { id, userId } = useParams<{ id: string, userId: string }>();
    const usersId = userId;
    const [awsInfo, setAwsInfo] = useState<any>(null);
    const location = useLocation().pathname.split('/');
    const [countryesData, setCountryesData] = useState<any[] | []>([]);
    const [statesData, setStatesData] = useState<any[] | []>([]);
    const locationPath = useLocation().pathname;

    const history = useHistory();

    const userFormValidations = [
        new FormField('user_firstname', [FormValidators.REQUIRED]),
        new FormField('user_lastname', [FormValidators.REQUIRED]),
        new FormField('user_email', []),
        new FormField('mobile_no', [FormValidators.REQUIRED]),
        new FormField('password', []),
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
        RolesService.getRoles().then(res => {
            // const roles = res.records?.filter((role: any) => role.code !== 'Candidate' && role.code !== 'SME' && role.code !== 'ASSIGN_CANDIDATE');
            setRoles([...res]);
        });
        CompanyService.getCompanyById(id).then(res => {
        });
        if (usersId !== '0') {
            UsersService.getUserByUuid(userId).then(res => {
                setUserData(res[0]);
            });
        }
        getCountry();
    }, []);

    const getCountry = () => {
        LookUpService.getCountry().then(
            res => {
                setCountryesData(res);
            }
        )
    }

    const getState = (country: string) => {
        LookUpService.getState(country).then(
            res => {
                setStatesData(res);
            }
        )
    }

    const handleUserInput = (data: any) => {
        setUserData(data);
        const errors: any = FormValidator(userFormValidations, data.value);
        setUserValidationErrors(errors);
    };

    function createUser() {
        const selectedUserData = userData.value ? { ...userData.value } : { ...userData };
        setIsFormSubmitted(true);
        const errors: FormControlError[] = FormValidator(userFormValidations, selectedUserData);
        setUserValidationErrors(errors);
        selectedUserData.company_uuid = id;
        selectedUserData.android_device_token = '';
        selectedUserData.ios_device_token = '';
        selectedUserData.user_image = '';
        selectedUserData.city_uuid = '';
        selectedUserData.state_uuid = '';
        UsersService.addUser(selectedUserData).then(res => {
            history.push(`/dashboard/companies/info/${id}/users`);
        })
    }

    function updateUser() {
        const selectedUserData = { ...userData.value };
        const errors: FormControlError[] = FormValidator(userFormValidations, selectedUserData);
    }

    const getUserInputValid = (control: string) => {
        const value = GetControlIsValid(principalValidationErrors, control);
        return value;
    }

    const onSelectCountry = (e: any) => {
        getState(e.target.value);
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

    const onUploadProgress = (data: any) => {
        const progress = Math.round((data.loaded / data.total) * 100);
        // setProgress(progress);
    };

    const onUploadThumbnailPic = async (event: any) => {
        if (event.target.files && event.target.files[0]) {
            // setContent(event.target.files[0]);
            const result = await S3Helper.uploadFile(
                event.target.files[0],
                onUploadProgress,
                awsInfo
            );
            // setShowThumnail(
            //     `${baseUrl}${awsInfo.folderPath}/${event.target.files[0].name}`
            // );
            toast.success("Uploaded Successfully");
        }
    };

    return (
        <div className={`row background-gray ${locationPath === `/dashboard/users/${id}/form/0` ? 'px-5 py-2' : ''}`}>
            {loading &&
                <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }
            <div className="my-4">
                <h5 className="form-label mb-2 d-block">{usersId == '0' ? "Add User" : "Edit User"}</h5>
            </div>
            {!loading && <div className="row">
                <FormBuilder onUpdate={handleUserInput}>
                    <form>
                        <div className="row add_company_border mb-5 custom-form p-5">
                            <div className='col-12'>
                                <div className='row'>
                                    <div className='col-6 px-3'>
                                        <div className="col-md-12">
                                            <div className="mb-4">
                                                <label className="form-label job_dis_form_label job_dis_form_label mb-0">First name</label>
                                                <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                                <input className="form-control job_dis_form_control px-3 rounded" placeholder="Enter first name" type="text" name="user_firstname" defaultValue={userData?.user_firstname} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="mb-4">
                                                <label className="form-label job_dis_form_label mb-0">Last name</label>
                                                <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                                <input className="form-control job_dis_form_control px-3 rounded" placeholder="Enter last name" type="text" name="user_lastname" defaultValue={userData?.user_lastname} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="mb-4">
                                                <label className="form-label job_dis_form_label mb-0">Email</label>
                                                <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                                <input className="form-control job_dis_form_control px-3 rounded" placeholder="Enter email" type="text" name="user_email" defaultValue={userData?.user_email} />
                                            </div>
                                        </div>
                                        <div className='col-md-12'>
                                            <div className="mb-4">
                                                <label className="form-label job_dis_form_label mb-0">Mobile number</label>
                                                <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                                <input className="form-control job_dis_form_control px-3 rounded" placeholder="Enter mobile numer" type="text" name='mobile_no' defaultValue={userData?.mobile_no} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="mb-4">
                                                <label className="form-label job_dis_form_label mb-0">Password</label>
                                                <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                                <input className="form-control job_dis_form_control px-3 rounded" placeholder="Enter password" type="text" name='password' defaultValue={userData?.password_hash} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="mb-4">
                                                <label className="form-label job_dis_form_label mb-0">Country</label>
                                                <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                                <select className="form-control job_dis_form_control px-3 rounded" name="country" id="country" onChange={(e) => onSelectCountry(e)} >
                                                    <option value="">Select Country</option>
                                                    {countryesData.map((data: any, index: number) => { return <option key={index} value={data?.code}>{data?.name}</option> })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="mb-4">
                                                <label className="form-label job_dis_form_label mb-0">Location</label>
                                                <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                                <input className="form-control job_dis_form_control px-3 rounded" placeholder="Enter location" type="text" name='location' defaultValue={userData?.location} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="mb-4">
                                                <label className="form-label job_dis_form_label mb-0">Postal code</label>
                                                <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                                <input className="form-control job_dis_form_control px-3 rounded" placeholder="Enter postal code" type="text" name='postal_code' defaultValue={userData?.postal_code} />
                                            </div>
                                        </div>

                                    </div>

                                    <div className='col-6 px-3'>
                                        <div className="col-md-4">
                                            <h5>Profile Image</h5>
                                            <div>
                                                <img style={{ height: "190px" }} src={Profile} alt="" />
                                            </div>
                                            <div className="mb-2">
                                                <div className="file small_btn px-4 rounded-12 mt-2 d-inline-block">Upload Photo
                                                    <input type="file" accept="image/*" onChange={(e) => handleUploadLogo(e, "principal")} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-12'>
                                            <div className="mb-4">
                                                <label className="form-label job_dis_form_label mb-2">Gender</label>
                                                <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                                <br />
                                                <div className='mt-2'>
                                                    <input className="mb-0" type="radio" value="male" name="gender" checked={userData?.gender === "male"} onChange={(e) => { handleGender(e) }} />
                                                    <span style={{ paddingRight: '15px', paddingLeft: '10px' }}>Male</span>
                                                    &nbsp;
                                                    <input className="mb-0" type="radio" value="female" name="gender" checked={userData?.gender === "female"} onChange={(e) => { handleGender(e) }} />
                                                    <span style={{ paddingRight: '15px', paddingLeft: '10px' }}>Female</span>
                                                    {isFormSubmitted && !getUserInputValid('gender') && <p className="text-danger">Please select gender</p>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="mb-4">
                                                <label className="form-label job_dis_form_label mb-2 pt-2">locked</label>
                                                <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                                <div>
                                                    <BootstrapSwitchButton checked={true} onstyle="primary" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="mb-4">
                                                <label className="form-label job_dis_form_label mb-0">State</label>
                                                <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                                <select className="form-control job_dis_form_control px-3 rounded" name="state" id="">
                                                    <option value="">Select state</option>
                                                    {statesData.map((data: any, index: number) => { return <option key={index} value={data?.state_code}>{data?.name}</option> })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="mb-4">
                                                <label className="form-label job_dis_form_label mb-0">Role</label>
                                                <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                                <select className="form-control job_dis_form_control px-3 rounded" name="role">
                                                    <option value="">Select role</option>
                                                    {roles.map((role: any, index: number) => { return <option key={index} value={role.uuid}>{role.name}</option> })}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12'>
                                <div className="text-center form-footer border-primary py-3 text-end">
                                    {usersId === '0' && <a className="small_btn px-5 rounded-12 cursor-pointer" onClick={() => createUser()}>Create</a>}
                                    {usersId !== '0' && <a className="small_btn px-5 rounded-12 cursor-pointer" onClick={() => updateUser()}>Update</a>}
                                    {location[2] === 'companies' && <Link className="btn btn-danger rounded-12 px-5 text-decoration-none ms-2 cursor-pointer" to={`${location[2] === 'companies' ? `/dashboard/companies/info/${id}/users` : `/ dashboard / users`}`}>Cancel</Link>}
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
            </div>}
        </div>
    )
}