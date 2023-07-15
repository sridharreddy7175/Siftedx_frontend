import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom';
import FormBuilder from '../../../../components/form-builder';
import { FormControlError, FormField, FormValidators } from '../../../../components/form-builder/model/form-field';
import { FormValidator, GetControlIsValid } from '../../../../components/form-builder/validations';
import { toast } from 'react-toastify';
import { CandidatesService } from '../../../../app/service/candidates.service';
import { CompanyService } from '../../../../app/service/company.service';
import { UsersService } from '../../../../app/service/users.service';
import { Multiselect } from 'multiselect-react-dropdown';
import { S3Helper } from '../../../../app/utility/s3-helper';

export const CandidateForm = () => {
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [candidateData, setcandidateData] = useState<any>({});
    const [currentCandidateData, setCurrentcandidateData] = useState<any>({});
    const [candidateErrors, setCandidateErrors] = useState<FormControlError[]>([]);
    const [content, setContent] = useState("");

    const [recruiters, setRecruiters] = useState<any>([]);
    const [skills, setSkills] = useState([{ name: 'Java', id: 1 }, { name: 'Javascript', id: 2 }, { name: 'React js', id: 2 }]);
    const [selectedSkills, setSelectedSkills] = useState<any>('');
    const [awsInfo, setAwsInfo] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    let { id, userId } = useParams<{ id: string, userId: string }>();
    const companyId = id || sessionStorage.getItem('company_uuid') || '';
    const usersId: number = parseInt(userId);

    const history = useHistory();

    const candidatesFormValidations = [
        new FormField('user_firstname', [FormValidators.REQUIRED]),
        new FormField('user_lastname', [FormValidators.REQUIRED]),
        new FormField('user_email', []),
        new FormField('mobile_no', [FormValidators.REQUIRED]),
        new FormField('recruiter_uuid', []),
        new FormField('resume_urls', [FormValidators.REQUIRED]),
        new FormField('photo_url', [FormValidators.REQUIRED]),
        new FormField('total_experience', []),
        new FormField('skills_codes', []),
        new FormField('availability_time', []),
        new FormField('time_zone', []),
    ];

    useEffect(() => {
        UsersService.getRecruiter(companyId).then(res => {
            setRecruiters(res);
        });
        CompanyService.getCompanyById(companyId).then(res => {
            setAwsInfo(`${res?.s3_dir}`);
        });
    }, []);

    function createCandidate() {
        const candidate = candidateData.value ? { ...candidateData.value } : { ...currentCandidateData };
        setIsFormSubmitted(true);
        const errors: FormControlError[] = FormValidator(candidatesFormValidations, candidate);
        candidate.company_uuid = companyId;
        candidate.resume_urls = '';
        candidate.photo_url = '';
        candidate.skills_codes = "";
        candidate.time_zone = "";
        candidate.availability_time = '';
        candidate.total_experience = Number(candidate.total_experience);
        CandidatesService.addCandidate(candidate).then(
            res => {
                history.push(`/dashboard/companies/info/${companyId}/candidates`);
            }
        )
    }


    const handleCandidateInput = (data: any) => {
        data.value = { ...currentCandidateData, ...data.value };
        setcandidateData(data);
        const errors: any = FormValidator(candidatesFormValidations, data.value);
        setCandidateErrors(errors);
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

    const updatecandidate = () => {

    }
    const onSelect = (selectedList: any, selectedItem: any) => {
        const skills: any = [];
        selectedList.map((skill: any) => {
            skills.push(skill.name);
        })
        setSelectedSkills(skills.toString())
    }

    const onRemove = (selectedList: any, removedItem: any) => {
    }
    const onUploadProgress = (data: any) => {
        const progress = Math.round((data.loaded / data.total) * 100);
    };

    const onUploadThumbnailPic = async (event: any) => {
        if (event.target.files && event.target.files[0]) {
            setContent(event.target.files[0]);
            const result = await S3Helper.uploadFile(
                event.target.files[0],
                onUploadProgress,
                awsInfo
            );
            toast.success("Uploaded Successfully");
        }
    };
    return (
        <div className="row background-gray px-5 py-5">
            {loading &&
                <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }
            <div className='pb-3'>
                <h5 className="mb-2 d-block">Add Candidate</h5>
            </div>
            {!loading && <div className="row">
                <div className='add_company_border'>
                    <FormBuilder onUpdate={handleCandidateInput}>
                        <form>
                            <div className='col-12 p-5'>
                                <div className='row'>
                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">First name</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <input className="form-control job_dis_form_control" placeholder="Enter first name" type="text" name="user_firstname" defaultValue={candidateData?.user_firstname} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">Last name</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <input className="form-control job_dis_form_control" placeholder="Enter last name" type="text" name='user_lastname' defaultValue={candidateData?.user_lastname} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">Email</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <input className="form-control job_dis_form_control" placeholder="Enter email" type="text" name='user_email' defaultValue={candidateData?.user_email} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">Mobile number</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <input className="form-control job_dis_form_control" placeholder="Enter mobile numer" type="text" name='mobile_no' defaultValue={candidateData?.mobile_no} />
                                        </div>
                                    </div>

                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">Total Experience</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <input className="form-control job_dis_form_control" placeholder="Enter total experience" type="text" name='total_experience' defaultValue={candidateData?.total_experience} />
                                        </div>
                                    </div>

                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">Recruiter</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <select className="form-control job_dis_form_control" name="recruiter_uuid" id="">
                                                <option value="">Select recruiter</option>
                                                {recruiters.map((recruiter: any, index: any) => { return <option value={recruiter.uuid} key={index}>{`${recruiter?.user_firstname} ${recruiter?.user_lastname}`}</option> })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">Skills</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <Multiselect
                                                options={skills}
                                                selectedValues={''}
                                                onSelect={onSelect}
                                                onRemove={onRemove}
                                                displayValue="name"
                                                avoidHighlightFirstOption={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">Availability time</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <input className="form-control job_dis_form_control" placeholder="Enter availability time" name='availability_time' type="time" defaultValue={candidateData?.availability_time} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label">Time zone</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <select className="form-control job_dis_form_control" name="time_zone" id="">
                                                <option value="">Select user</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-3 px-3">
                                        <div className="mb-4">
                                            <div className="file small_btn px-4 rounded-12 mt-2 d-inline-block">Upload Photo
                                                <input type="file" accept="image/*" onChange={(e) => handleUploadLogo(e, "principal")} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 px-3">
                                        <div className="mb-4">
                                            <div className="file small_btn px-4 rounded-12 mt-2 d-inline-block">Upload resume
                                                <input type="file" accept=".doc, .docx,.ppt, .pptx,.txt,.pdf" onChange={(e) => onUploadThumbnailPic(e)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </FormBuilder>
                    <div className="py-3 mt-4 text-center">
                        {usersId === 0 && <a className="small_btn px-5 rounded-12 cursor-pointer" onClick={() => createCandidate()}>Create</a>}
                        {usersId !== 0 && <a className="small_btn px-5 rounded-12 cursor-pointer" onClick={() => updatecandidate()}>Update</a>}
                        <Link className="btn btn-danger px-5 rounded-12 text-decoration-none ms-2 cursor-pointer" to={`/dashboard/companies/info/${companyId}/candidates`}>Cancel</Link>
                    </div>
                </div>
            </div>}
        </div>
    )
}