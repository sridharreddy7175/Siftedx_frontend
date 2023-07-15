import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import FormBuilder from '../../../../components/form-builder';
import { FormControlError } from '../../../../components/form-builder/model/form-field';
import { GetControlIsValid } from '../../../../components/form-builder/validations';
import Profile from '../../../../assets/images/profile.png';


export const CandidateDetails = () => {
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    let { id } = useParams<{ id: string }>();
    const [isFormEdit, setIsFormEdit] = useState(false);
    const [comapnyValidationErrors, setCompanyValidationErrors] = useState<FormControlError[]>([]);
    const [currentSmeData, setcurrentSmeData] = useState<any>({});
    const [companyData, setCompanyData] = useState<any>({});

    const [interviewList, setinterviewList] = useState<any>([
        {
            company: 'shifted-x',
            date: '08-02-2022',
            time: '10:30',
            name: 'Uday',
            experience: '20',
            skills: 'java,js,node',
        }
    ]);
    const [loading, setLoading] = useState(false);
    const filteredData = [
        { name: 'Contact Number', value: 'contact_number' },
        { name: 'Address', value: 'address' },
        { name: 'District', value: 'district' },
        { name: 'Pincode', value: 'pin_code' },
    ];
    useEffect(() => {
    }, []);

    const handleSmeInput = (data: any) => {
    };

    const getSmeInputValid = (control: string) => {
        const value = GetControlIsValid(comapnyValidationErrors, control);
        return value;
    }
    const handleSubmit = () => {

    }
    const handleUpdate = () => {
        const selectedCompanyData = { ...companyData.value };
    }

    return (
        <div>
            <div className="row">
                <div className="col-md-10">
                    <h2>Candidate Details</h2>
                </div>
            </div>
            {loading &&
                <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }
            {!loading && <div>
                <FormBuilder onUpdate={handleSmeInput}>
                    <form>
                        <div className="row custom-form">
                            <div className='col-md-6' >
                                <div style={{ padding: "10px" }}>
                                    <h5>Details</h5>
                                    <div className="col-md-12">
                                        <div className="mb-4">
                                            <label className="form-label">Name</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                            <input className="form-control" type="text" name="linked_in_url" defaultValue={currentSmeData.linked_in_url} placeholder="Enter name" />
                                            {isFormSubmitted && !getSmeInputValid('linked_in_url') && <p className="text-danger">Please fill the name</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="mb-4">
                                            <label className="form-label">Expert Title</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                            <input className="form-control" type="text" name="expert_title" defaultValue={currentSmeData.expert_title} placeholder="Enter expert title" />
                                            {isFormSubmitted && !getSmeInputValid('expert_title') && <p className="text-danger">Please fill the field</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="mb-4">
                                            <label className="form-label">Total Experience</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                            <input className="form-control" type="text" name="total_experience" defaultValue={currentSmeData.total_experience} placeholder="Enter total experience" />
                                            {isFormSubmitted && !getSmeInputValid('total_experience') && <p className="text-danger">Please fill the field</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="mb-4">
                                            <label className="form-label">Subject experience</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                            <input className="form-control" type="text" name="subject_experience" defaultValue={currentSmeData.subject_experience} placeholder="Enter subject experience" />
                                            {isFormSubmitted && !getSmeInputValid('subject_experience') && <p className="text-danger">Please fill the field</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="mb-4">
                                            <label className="form-label">Sme rating</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                            <input className="form-control" type="text" name="sme_rating" defaultValue={currentSmeData.sme_rating} placeholder="Enter sme rating" />
                                            {isFormSubmitted && !getSmeInputValid('sme_rating') && <p className="text-danger">Please fill the field</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="mb-4">
                                            <label className="form-label">Sme fee</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                            <input className="form-control" type="text" name="sme_fee" defaultValue={currentSmeData.sme_fee} placeholder="Enter sme fee" />
                                            {isFormSubmitted && !getSmeInputValid('sme_fee') && <p className="text-danger">Please fill the field</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="row" >
                                    <div className="col-md-12">
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div style={{ padding: "10px" }}>
                                                    <h5>Introduction Video</h5>
                                                    <div>
                                                        <video loop autoPlay controls style={{ height: "180px", width: "100%" }}>
                                                            <source src={'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'} type="video/mp4" />
                                                        </video>
                                                    </div>
                                                    <button className='small_btn'>Upload</button>
                                                </div>
                                            </div>
                                            <div className='col-md-6'>
                                                <div style={{ padding: "10px", marginRight: '10px' }}>
                                                    <h5>Profile Image</h5>
                                                    <div>
                                                        <img style={{ height: "180px" }} src={Profile} alt="" />
                                                    </div>
                                                    <button className='small_btn'>Upload</button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="col-md-12">
                                        <div style={{ padding: "10px", marginTop: "4px" }}>
                                            <h5 style={{ display: "flex" }}>Connections <div style={{
                                                height: "1px", borderBottom: "1px solid #012346", width: "100%", marginTop: "14px"
                                            }}></div></h5>
                                            <div className='row'>
                                                <div className="col-md-12">
                                                    <div className="mb-4">
                                                        <label className="form-label">Linked in url</label>
                                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                                        <input className="form-control" type="text" name="linked_in_url" defaultValue={currentSmeData.linked_in_url} placeholder="Enter linked in url" />
                                                        {isFormSubmitted && !getSmeInputValid('linked_in_url') && <p className="text-danger">Please fill the field</p>}
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="mb-4">
                                                        <label className="form-label">Skype id</label>
                                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                                        <input className="form-control" type="text" name="skype_id" defaultValue={currentSmeData.skype_id} placeholder="Enter skype id" />
                                                        {isFormSubmitted && !getSmeInputValid('skype_id') && <p className="text-danger">Please fill the field</p>}
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="mb-4">
                                                        <label className="form-label">Stripe account id</label>
                                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                                        <input className="form-control" type="text" name="stripe_account_id" defaultValue={currentSmeData.stripe_account_id} placeholder="Enter stripe account id" />
                                                        {isFormSubmitted && !getSmeInputValid('stripe_account_id') && <p className="text-danger">Please fill the field</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className='col-md-12' style={{ padding: "10px" }}>
                            <div className='row' >
                                <h5 style={{ display: "flex" }}>Timings <div style={{
                                    height: "1px", borderBottom: "1px solid #012346", width: "100%", marginTop: "14px"
                                }}></div></h5>
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <label className="form-label">Start day time</label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                        <input className="form-control" type="text" name="start_day_time" defaultValue={currentSmeData.start_day_time} placeholder="Enter start day time" />
                                        {isFormSubmitted && !getSmeInputValid('start_day_time') && <p className="text-danger">Please fill the field</p>}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <label className="form-label">End day time</label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                        <input className="form-control" type="text" name="end_day_time" defaultValue={currentSmeData.end_day_time} placeholder="Enter end day time" />
                                        {isFormSubmitted && !getSmeInputValid('end_day_time') && <p className="text-danger">Please fill the field</p>}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <label className="form-label">Time_zone</label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '10px' }}>*</span>
                                        <select className="form-control" name="" id="">
                                            <option value="">Select user</option>
                                        </select>
                                        {isFormSubmitted && !getSmeInputValid('time_zone') && <p className="text-danger">Please fill the field</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </FormBuilder >
                <div className="form-footer text-center py-3 text-end mt-4">
                    {!isFormEdit && <a className="small_btn px-5 rounded-12 cursor-pointer" onClick={() => handleSubmit()}>Save</a>}
                    {isFormEdit && <a className="small_btn px-5 rounded-12 cursor-pointer" onClick={handleUpdate}>Update</a>}
                    <Link className="btn btn-danger px-5 rounded-12 text-decoration-none ms-2 cursor-pointer" to="/dashboard/sme/schedulers">Cancel</Link>
                </div>
            </div >}
        </div>
    )
}