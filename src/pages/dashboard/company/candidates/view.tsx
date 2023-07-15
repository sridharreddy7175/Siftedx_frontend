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
import Profile from '../../../../assets/images/profile.png';

export const CandidateView = () => {
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
                            <h5 className="form-label mb-2 d-block">Candidate View</h5>
                        </div>
                        <div className="row custom-form">
                            <div className='col-md-12'>
                                <div className='row'>

                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div >
                                    <h5>Profile Image</h5>
                                    <img style={{ height: "300px", width: '300p' }} src={Profile} alt="" />
                                </div>
                                <div className="col-md-12">
                                    <hr />
                                    <h5>Address</h5>
                                    <p className='mb-0 mt-3'>Plot No:722,</p>
                                    <p className='mb-0'>Manjeera Majestic Commercial,</p>
                                    <p className='mb-0'>JNTU Rd, Kukatpally Housing Board Colony, Kukatpally,</p>
                                    <p className='mb-0'>Hyderabad,</p>
                                    <p className='mb-0'>Telangana 500072</p>
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div style={{ display: 'flex' }}>
                                    <h5>John B</h5>
                                    <i className="bi bi-geo-alt-fill ms-3"></i>
                                    <p style={{ fontSize: "12px", marginTop: '5px' }}>Hyderabad</p>
                                </div>
                                <div className="mb-2">
                                    <p>Java developer</p>
                                    <p className='mb-0 mt-3'>Rating</p>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-half"></i>
                                </div>
                                <hr />
                                <div className="col-md-8">
                                    <h5>Skills</h5>
                                    <p className='mb-0 mt-3'>HTML</p>
                                    <p className='mb-0'>Javascript</p>
                                    <p className='mb-0'>react js</p>
                                    <p className='mb-0'>Java</p>
                                </div>
                                <hr />
                                <div className="col-md-8">
                                    <h5>Contact Information</h5>
                                    <div className='row'>
                                        <label className='col-md-3 mt-3'>Phone :</label>
                                        <p className='mb-0 mt-3 col-md-9'>9908096674</p>
                                        <label className='col-md-3'>Email :</label>
                                        <p className='mb-0 col-md-9'>test@gmail.com</p>
                                        <label className='col-md-3'>Site :</label>
                                        <p className='mb-0 col-md-9'>www.test.com</p>
                                        <label className='col-md-3'>Birthday :</label>
                                        <p className='mb-0 col-md-9'>12-07-1995</p>
                                        <label className='col-md-3'>Gender :</label>
                                        <p className='mb-0 col-md-9'>Male</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </FormBuilder>
                <div className="py-3 mt-4 text-center">
                    <Link className="btn btn-danger px-5 rounded-12 text-decoration-none ms-2 cursor-pointer" to={`/dashboard/companies/info/${companyId}/candidates`}>Close</Link>
                </div>
            </div>}
        </div >
    )
}