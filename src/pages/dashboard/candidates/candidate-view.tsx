import React, { useEffect, useState, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { FormControlError, FormField, FormValidators } from '../../../components/form-builder/model/form-field';
import { FormValidator } from '../../../components/form-builder/validations';
import { toast } from 'react-toastify';
import { CandidatesService } from '../../../app/service/candidates.service';
import { CompanyService } from '../../../app/service/company.service';
import { UsersService } from '../../../app/service/users.service';
import { S3Helper } from '../../../app/utility/s3-helper';
import { LookUpService } from '../../../app/service/lookup.service';
import { AppLoader } from '../../../components/loader';

export const HrCandidateView = () => {
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [candidateData, setcandidateData] = useState<any>({});
    const [currentCandidateData, setCurrentcandidateData] = useState<any>({});
    const [candidateErrors, setCandidateErrors] = useState<FormControlError[]>([]);
    const [content, setContent] = useState("");
    const userUuid = sessionStorage.getItem('userUuid') || [];
    const [recruiters, setRecruiters] = useState<any>([]);
    const [selectedSkills, setSelectedSkills] = useState<any>('');
    const [awsInfo, setAwsInfo] = useState<any>(null);
    const [resumeUrl, setResumeUrl] = useState<string>('');
    const [categories, setCategories] = useState<any[]>([]);
    const [timeZones, setTimeZones] = useState<any[]>([]);
    const [skills, setSkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    let { id } = useParams<{ id: string }>();
    const companyId = sessionStorage.getItem('company_uuid') || '';
    const history = useHistory();
    const [showOptions, setShowOptions] = useState(false);

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
    const optionRef = useRef<any>(null);

    const handleClickOutside = (event: any) => {
        if (optionRef.current && !optionRef.current.contains(event.target)) {
            setShowOptions(false);
        }
    };
    useEffect(() => {
        UsersService.getRecruiter(companyId).then(res => {
            setRecruiters(res);
        });
        CompanyService.getCompanyById(companyId).then(res => {
            setAwsInfo(`${res?.s3_dir}`);
        });
        LookUpService.timezones().then(res => {
            setTimeZones(res);
        });
        getCategories();
        const data = sessionStorage.getItem('selectedCandidate') || '';
        if (data) {
            const userData = JSON.parse(data);
            setcandidateData(userData);
            setSelectedSkills(userData.skills_codes.split(','));
        }

        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    const getCategories = () => {
        LookUpService.jobcategories().then(
            res => {
                setCategories(res);
            }
        )
    }

    const createCandidate = () => {
        const candidate = candidateData.value ? { ...candidateData.value } : { ...currentCandidateData };
        setIsFormSubmitted(true);
        const errors: FormControlError[] = FormValidator(candidatesFormValidations, candidate);
        candidate.company_uuid = companyId;
        candidate.resume_urls = resumeUrl;
        candidate.photo_url = '';
        candidate.skills_codes = selectedSkills;
        candidate.availability_time = '';
        candidate.total_experience = Number(candidate.total_experience);
        candidate.availability_time = '';
        candidate.recruiter_uuid = userUuid;
        delete candidate[''];
        CandidatesService.addCandidate(candidate).then(
            res => {
                history.push(`/dashboard/candidates/all`);
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
            skills.push(skill);
        })
        setSelectedSkills(skills.toString())
    }

    const onRemove = (selectedList: any, removedItem: any) => {
    }
    const onUploadProgress = (data: any) => {
        const progress = Math.round((data.loaded / data.total) * 100);
    };

    const onUploadThumbnailPic = async (event: any) => {
        const awsInfoData = { folderPath: `${awsInfo}/resumes`, bucketName: 'shiftedx-data' }
        if (event.target.files && event.target.files[0]) {
            setContent(event.target.files[0]);
            const result = await S3Helper.uploadFile(
                event.target.files[0],
                onUploadProgress,
                awsInfoData
            );
            setResumeUrl(
                `${awsInfoData.folderPath}/${event.target.files[0].name}`
            );
            toast.success("Uploaded Successfully");
        }
    };
    const onCategory = (event: any) => {
        setSkills([]);
        if (event.target.value) {
            LookUpService.skills(event.target.value).then(
                res => {
                    setSkills(res);
                }
            )
        } else {
            setSkills([]);
        }
    }

    const onEditProfile = () => {
        history.push(`/dashboard/candidates/form/${candidateData?.uuid}`);
    }

    const onShowOptions = () => {
        setShowOptions(true);
    }

    const onFavourite = () => {
        setLoading(true);
        const selectedDandidateData: any = candidateData;
        selectedDandidateData.is_favourite = !selectedDandidateData?.is_favourite;

        const data = {
            candidate_uuid: selectedDandidateData?.uuid,
            is_favourite: selectedDandidateData?.is_favourite
        }
        CandidatesService.candidateFavourite(data).then(
            res => {
                if (res.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    setLoading(false);
                    setcandidateData({ ...selectedDandidateData });
                    setShowOptions(false);
                }
            }
        )
    }
    return (
        <div className="px-5 pt-5">
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }
            <div className='pb-3 d-flex justify-content-between position-relative'>
                <div>
                    <h5 className="mb-2 d-block download_heading">
                        {candidateData?.user_firstname} {candidateData?.user_lastname}
                        <span className='ms-3'>
                            {!candidateData?.is_favourite && <svg className='pointer' width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.99958 12.0232L3.05515 15L4.39935 9.44444L0 5.72968L5.77467 5.27363L7.99958 0L10.2245 5.27363L16 5.72968L11.5998 9.44444L12.944 15L7.99958 12.0232Z" fill="#A9A9A9" />
                            </svg>}
                            {candidateData?.is_favourite &&
                                <svg className='pointer' width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.99958 12.0232L3.05515 15L4.39935 9.44444L0 5.72968L5.77467 5.27363L7.99958 0L10.2245 5.27363L16 5.72968L11.5998 9.44444L12.944 15L7.99958 12.0232Z" fill="#FFA800" />
                                </svg>}
                        </span>
                    </h5>
                    <p className="download_para">All the talent you added is here</p>
                </div>
                <div className='me-2'>
                    <button className='large_btn rounded mx-3' onClick={onEditProfile}>Edit Profile</button>
                    <button className='large_btn rounded' onClick={onShowOptions}>
                        <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM14 4C15.1 4 16 3.1 16 2C16 0.9 15.1 0 14 0C12.9 0 12 0.9 12 2C12 3.1 12.9 4 14 4ZM8 0C6.9 0 6 0.9 6 2C6 3.1 6.9 4 8 4C9.1 4 10 3.1 10 2C10 0.9 9.1 0 8 0Z" fill="white" />
                        </svg>
                    </button>
                    {showOptions &&
                        <div className='three_douts_link_div' ref={optionRef}>
                            <ul className='list-inline mb-0'>
                                <li className='move_to_draft mb-2' style={{ cursor: 'pointer' }} onClick={() => onFavourite()}>{candidateData?.is_favourite ? 'Remove Favourite' : 'Add Favourite'}</li>
                            </ul>
                        </div>
                    }
                </div>
            </div>

            <div className="row">
                <div className="col-8 col_width_add_candidate_box1">
                    <div className="add_company_border rounded-3 mb-4 px-4">
                        <div className='mt-4'>
                            <h6 className='mb-4 report_heading'>Basic Info</h6>
                            <ul className='d-flex list-inline'>
                                <li>
                                    <ul className='list-inline'>
                                        <li><p className='report_details_headings'>Email</p></li>
                                        <li><p className='report_details_headings'>Mobile</p></li>
                                        <li><p className='report_details_headings'>LinkedIn</p></li>
                                        <li><p className='report_details_headings'>Added</p></li>
                                        <li><p className='report_details_headings'>CV</p></li>
                                    </ul>
                                </li>

                                <li className='ms-5'>
                                    <ul className='list-inline'>
                                        <li><p className='report_details'>{candidateData?.user_email}</p></li>
                                        <li><p className='report_details text-decoration-underline'>{candidateData?.mobile_no}</p></li>
                                        <li><p className='report_details'>
                                            <a style={{ color: '#000000' }} href={candidateData?.linkedin_url} target="_blank">{candidateData?.linkedin_url}</a></p></li>
                                        <li><p className='report_details'>{candidateData?.created_dt}</p></li>
                                        <li><p className='report_details'>
                                            <a style={{ color: '#000000' }} href={candidateData?.resume_urls} target="_blank">Document</a>
                                        </p></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>


                    <div className="add_company_border rounded-3 mb-4 px-4">
                        <div className="my-4">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className='mb-4 report_heading '>Interviews</h6>
                                </div>
                                <div>
                                    <button className='large_btn rounded'>Add</button>
                                </div>
                            </div>
                            <div className="">
                                {/* <ul className="d-flex list-inline">
                                    <li className="my-auto"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="16" cy="16" r="16" fill="#F4F4F4" />
                                    </svg>
                                    </li>
                                    <li className="mx-3">
                                        <ul className="list-inline">
                                            <li className="interview_first_line">Scheduled screening with <span className="interview_first_line_inner_line">Clerra Hyatt - 28 Feb 2022, 4pm - 5pm</span></li>
                                            <li className="interview_second_line">By Recruiter Ray, 15 Feb</li>
                                        </ul>
                                    </li>
                                </ul> */}
                            </div>
                        </div>
                    </div>

                    <div className="add_company_border rounded-3 mb-4 px-4">
                        <div className='mt-4'>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className='mb-4 report_heading'>Report</h6>
                                </div>
                                <div>
                                    <button className='large_btn rounded'>Download</button>
                                </div>
                            </div>
                            <ul className='d-flex list-inline'>
                                <li>
                                    <ul className='list-inline'>
                                        <li><p className='report_details_headings'>Interview ID</p></li>
                                        <li><p className='report_details_headings'>Interviewer</p></li>
                                        <li><p className='report_details_headings'>Interview date </p></li>
                                        <li><p className='report_details_headings'>Experience</p></li>
                                        <li><p className='report_details_headings'>Competency</p></li>
                                        <li><p className='report_details_headings'>Skills</p></li>
                                    </ul>
                                </li>

                                <li className='ms-5'>
                                    <ul className='list-inline'>
                                        <li><p className='report_details'></p></li>
                                        <li><p className='report_details text-decoration-underline'></p></li>
                                        <li><p className='report_details'></p></li>
                                        {/* <li>
                                            <p className='report_details'>
                                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                </svg>
                                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                </svg>
                                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                </svg>
                                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                </svg>
                                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#A9A9A9" />
                                                </svg>
                                            </p>
                                        </li>
                                        <li><p className='report_details'>3.0 <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                        </svg>
                                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                            </svg>
                                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                            </svg>
                                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#A9A9A9" />
                                            </svg>
                                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#A9A9A9" />
                                            </svg>
                                        </p></li> */}
                                        <li><p className='report_details'>
                                            {/* <span className='skills_border_color'>Photogrammetry</span>
                                            <span className='mx-3 skills_border_color'>Satellite analytics</span>
                                            <span className='mx-3 skills_border_color'>Python</span> */}
                                        </p></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h6 className='report_details_headings'>Comments</h6>
                            {/* <p className='report_details'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p> */}
                        </div>
                        <div>
                            <h6 className='report_details_headings'>Short Summary</h6>
                            {/* <p className='report_details'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</p> */}
                        </div>
                        <div>
                            <h6 className='report_details_headings'>Detailed Summary</h6>
                            {/* <p className='report_details'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p> */}
                        </div>
                        <div>
                            <h6 className='report_details_headings'>Audio Summary</h6>
                            {/* <p><audio src="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3" controls /></p> */}
                        </div>
                    </div>

                    <div className='border_color rounded-3 mb-4'>
                        <div className='bg-white d-flex justify-content-between px-3 py-3 rounded-top' style={{ borderBottom: "2px solid #BBBBBB" }}>
                            <ul className='list-inline my-auto'>
                                {/* <li className='dashboard_happy_monday_fourth_line'>Senior AI Engineer</li>
                                <li className='dashboard_happy_monday_fourth_line'>microsoft</li>
                                <li className='dashboard_happy_monday_fifth_line'>NY, USA � Artificial Inteligence</li> */}
                            </ul>
                            <ul className='d-flex list-inline my-auto'>
                                <li className=''><svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.99958 12.0232L3.05515 15L4.39935 9.44444L0 5.72968L5.77467 5.27363L7.99958 0L10.2245 5.27363L16 5.72968L11.5998 9.44444L12.944 15L7.99958 12.0232Z" fill="#FFA800" />
                                </svg>
                                </li>
                                <li className='mx-2'><button className='large_btn rounded'>open</button></li>
                                <li className=''><button className='large_btn rounded'><svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM14 4C15.1 4 16 3.1 16 2C16 0.9 15.1 0 14 0C12.9 0 12 0.9 12 2C12 3.1 12.9 4 14 4ZM8 0C6.9 0 6 0.9 6 2C6 3.1 6.9 4 8 4C9.1 4 10 3.1 10 2C10 0.9 9.1 0 8 0Z" fill="black" />
                                </svg>
                                </button></li>
                            </ul>
                        </div>
                        <div className='bg_gray d-flex justify-content-between px-3 py-3 rounded-bottom '>
                            <h6 className='dashboard_happy_monday_candidates_text'><span className='fs-4'>0</span> Candidates</h6>
                            <div>
                                <ul className='d-flex list-inline'>
                                    <li className='mx-3 dashboard_happy_monday_number'><span className='me-1'><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 0H1.99C0.88 0 0.00999999 0.9 0.00999999 2L0 16C0 17.1 0.88 18 1.99 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM16 12H12C12 13.66 10.65 15 9 15C7.35 15 6 13.66 6 12H1.99V2H16V12ZM13 7H11V4H7V7H5L9 11L13 7Z" fill="#757575" />
                                    </svg>
                                    </span> 0</li>
                                    <li className='mx-3 dashboard_happy_monday_number'><span className='me-1'><svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 2H15V0H13V2H5V0H3V2H2C0.89 2 0 2.9 0 4V18C0 19.1 0.89 20 2 20H16C17.1 20 18 19.1 18 18V4C18 2.9 17.1 2 16 2ZM9 5C10.66 5 12 6.34 12 8C12 9.66 10.66 11 9 11C7.34 11 6 9.66 6 8C6 6.34 7.34 5 9 5ZM15 17H3V16C3 14 7 12.9 9 12.9C11 12.9 15 14 15 16V17Z" fill="#757575" />
                                    </svg>
                                    </span> 0</li>
                                    <li className='mx-3 dashboard_happy_monday_number'><span className='me-1'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#757575" />
                                    </svg>
                                    </span> 0</li>
                                    <li className='mx-3 dashboard_happy_monday_number'><span className='me-1'><svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.4 2L9 0H0V17H2V10H7.6L8 12H15V2H9.4Z" fill="#757575" />
                                    </svg>
                                    </span> 0</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-4 col_width_add_candidate_box2 ms-4">
                    <div className="add_company_border p-4 mb-4">
                        <div className='d-flex justify-content-between'>
                            <div>
                                <h5 className="availability_style">Availability</h5>
                            </div>
                            <button className='upload_file rounded px-3'>Change</button>
                        </div>
                        <div className="mt-3">
                            {/* <span className="weekends_bg_color px-3 py-2">Weekends, 4pm-6pm</span> */}
                        </div>
                    </div>

                    {/* <div className="add_company_border p-4 mb-4">
                        <div className='d-flex justify-content-between'>
                            <div>
                                <h5 className="availability_style">Tags</h5>
                            </div>
                            <button className='upload_file rounded px-3'>Edit</button>
                        </div>
                    </div> */}


                    <div className='add_company_border p-4 mb-4'>
                        <div className='d-flex justify-content-between'>
                            <div>
                                <h5 className="availability_style">Notes</h5>
                            </div>
                            <button className='upload_file rounded px-3'>Edit</button>
                        </div>
                        <div className='mt-4'>
                            <p className='add_tag_style mt-3'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard </p>
                        </div>
                    </div>

                    <div className='add_company_border p-4'>
                        <div>
                            <h5 className="availability_style">Updates</h5>
                        </div>
                        {/* <div>
                            <ul className="d-flex list-inline">
                                <li className="my-auto"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="16" cy="16" r="16" fill="#F4F4F4" />
                                </svg>
                                </li>
                                <li className="mx-2">
                                    <ul className="list-inline">
                                        <li className="interview_first_line"><span className="interview_first_line_inner_line">Recruiter Ray</span> added the candidate</li>
                                        <li className="interview_second_line">A few seconds ago</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <ul className="d-flex list-inline">
                                <li className="my-auto"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="16" cy="16" r="16" fill="#F4F4F4" />
                                </svg>
                                </li>
                                <li className="mx-2">
                                    <ul className="list-inline">
                                        <li className="interview_first_line"><span className="interview_first_line_inner_line">Recruiter Ray</span> added the candidate</li>
                                        <li className="interview_second_line">A few seconds ago</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <ul className="d-flex list-inline">
                                <li className="my-auto"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="16" cy="16" r="16" fill="#F4F4F4" />
                                </svg>
                                </li>
                                <li className="mx-2">
                                    <ul className="list-inline">
                                        <li className="interview_first_line"><span className="interview_first_line_inner_line">Recruiter Ray</span> added the candidate</li>
                                        <li className="interview_second_line">A few seconds ago</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <ul className="d-flex list-inline">
                                <li className="my-auto"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="16" cy="16" r="16" fill="#F4F4F4" />
                                </svg>
                                </li>
                                <li className="mx-2">
                                    <ul className="list-inline">
                                        <li className="interview_first_line"><span className="interview_first_line_inner_line">Recruiter Ray</span> added the candidate</li>
                                        <li className="interview_second_line">A few seconds ago</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <ul className="d-flex list-inline">
                                <li className="my-auto"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="16" cy="16" r="16" fill="#F4F4F4" />
                                </svg>
                                </li>
                                <li className="mx-2">
                                    <ul className="list-inline">
                                        <li className="interview_first_line"><span className="interview_first_line_inner_line">Recruiter Ray</span> added the candidate</li>
                                        <li className="interview_second_line">A few seconds ago</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div className="text-center">
                            <p className="see_all_updates_style">See all updates</p>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}