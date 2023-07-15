import React, { useEffect, useState } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import FormBuilder, { FormBuilderData } from '../../../components/form-builder';
import { FormControlError, FormField, FormValidators } from '../../../components/form-builder/model/form-field';
import { FormValidator, GetControlIsValid } from '../../../components/form-builder/validations';
import { toast } from 'react-toastify';
import { CandidatesService } from '../../../app/service/candidates.service';
import { CompanyService } from '../../../app/service/company.service';
import { UsersService } from '../../../app/service/users.service';
import { Multiselect } from 'multiselect-react-dropdown';
import { S3Helper } from '../../../app/utility/s3-helper';
import { LookUpService } from '../../../app/service/lookup.service';
import { allCountryMobileNumberValidations, countryCodeValidations, emialValidations, linkedinValidations, mobileNumberValidations, nameValidations } from '../../../app/utility/form-validations';
import { AppLoader } from '../../../components/loader';
import { CLOUDFRONT_URL } from '../../../config/constant';
import ChipInput from '../../../components/chip-input';
import { Form } from 'react-bootstrap';
import Add from "../../../assets/icon_images/Add.png";
import Delete from "../../../assets/icon_images/delete.png";
import Addcandidate from '../../../components/add-candidate/addcandidate';
import { SX_ROLES } from '../../../app/utility/app-codes';


export const HrCandidateForm = () => {
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [candidateData, setCandidateData] = useState<any>({});
    const userUuid = sessionStorage.getItem('userUuid') || [];
    const role = sessionStorage.getItem('userRole') || [];

    const [recruiters, setRecruiters] = useState<any>([]);
    const [selectedSkills, setSelectedSkills] = useState<any>('');
    const [awsInfo, setAwsInfo] = useState<any>(null);
    const [resumeUrl, setResumeUrl] = useState<string>('');
    const [categories, setCategories] = useState<any[]>([]);
    const [timeZones, setTimeZones] = useState<any[]>([]);
    const [skills, setSkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    // let { id } = useParams<{ id: string }>();
    const companyId = sessionStorage.getItem('company_uuid') || '';
    const history = useHistory();
    const [mobileNumberError, setMobileNumberError] = useState("");
    const [mobileNumberCountryCodeError, setMobileNumberCountryCodeError] = useState("");
    const [countryData, setCountryData] = useState<any[] | []>([]);

    const [skillError, setSkillError] = useState("");
    const id: any = useLocation().pathname.split('/')[4];
    // const [madatorySkills, setMadatorySkills] = useState<any[] | []>([{ skill: '', experience: '', proficiency: '' }]);
    const [experienceList, setExperienceList] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [isEmailVerified, setIsEmailVerified] = useState("0");
    const [isMobileVerified, setIsMobileVerified] = useState("0");
    const [selectedJoiningAvailability, setSelectedJoiningAvailability] = useState(3);
    const [formError, setFormError] = useState<any>('');
    const [candidateFormData, setCandidateFormData] = useState<FormBuilderData | null>({
        errors: [],
        isValid: false,
        value: {}
    });

    useEffect(() => {
        setLoading(true);
        const experience = [];
        for (let index = 0; index <= 30; index++) {
            experience.push(index);
            setExperienceList([...experience])
        }
        UsersService.getRecruiter(companyId).then(res => {
            setRecruiters(res);
        });
        CompanyService.getCompanyById(companyId).then(res => {
            setAwsInfo(`${res?.s3_dir}`);
        });
        LookUpService.timezones().then(res => {
            setTimeZones(res);
        });
        // getJobskills();
        if (id !== '0') {
            const data = sessionStorage.getItem('selectedCandidate') || '';
            if (data) {
                const userData: any = JSON.parse(data);
                if (userData?.resume_urls) {
                    userData.resume_urls = userData.resume_urls.replace(CLOUDFRONT_URL + '/', '');
                }
                userData.country_code = userData.mobile_no?.substring(0, userData.mobile_no.indexOf(' '));
                userData.mobile_no = userData.mobile_no?.substring(userData.mobile_no.indexOf(' ') + 1);
                setCandidateData(userData);
                // onCategory(userData?.job_category);
                setResumeUrl(userData?.resume_urls);
                setIsEmailVerified(userData?.email_verified ? '1' : '0');
                setIsMobileVerified(userData?.mobile_verified ? '1' : '0');
                // setSelectedSkills(userData.skills_codes.split(','));
                const allSkills: any = [];
                const skills = userData?.skills_codes ? userData?.skills_codes.split(',') : [];
                const skillsExp = userData?.skills_exp ? userData?.skills_exp.split(',') : [];
                const skillsProficiency = userData?.skills_proficiency ? userData?.skills_proficiency.split(',') : [];
                skills?.forEach((element: any, index: number) => {
                    allSkills.push({ skill: element, experience: skillsExp[index], proficiency: skillsProficiency[index] })
                });
                // setMadatorySkills([...allSkills])
            }
            CandidatesService.getCandidateById(companyId, id).then(
                res => {
                    if (res?.error) {
                        toast.error(res?.error?.message);
                    } else {
                        // const userData: any = res[0];
                        // if (userData?.resume_urls) {
                        //     userData.resume_urls = userData.resume_urls.replace(CLOUDFRONT_URL + '/', '');
                        // }
                        // userData.country_code = userData?.mobile_no ? userData?.mobile_no.substring(0, userData?.mobile_no.indexOf(' ')) : '';
                        // userData.mobile_no = userData?.mobile_no ? userData?.mobile_no.substring(userData?.mobile_no.indexOf(' ') + 1) : '';
                        // setcandidateData(userData);
                        // onCategory(userData?.job_category);
                        // setResumeUrl(userData?.resume_urls);
                        // setIsEmailVerified(userData?.email_verified ? '1' : '0');
                        // setIsMobileVerified(userData?.mobile_verified ? '1' : '0');
                        // // setSelectedSkills(userData.skills_codes.split(','));
                        // const allSkills: any = [];
                        // const skills = userData?.skills_codes ? userData?.skills_codes.split(',') : [];
                        // const skillsExp = userData?.skills_exp ? userData?.skills_exp.split(',') : [];
                        // const skillsProficiency = userData?.skills_proficiency ? userData?.skills_proficiency.split(',') : [];
                        // skills?.forEach((element: any, index: number) => {
                        //     allSkills.push({ skill: element, experience: skillsExp[index], proficiency: skillsProficiency[index] })
                        // });
                        // setMadatorySkills([...allSkills])
                        // history.push(`/dashboard/candidates/all`);
                    }
                }
            )
        }
        setLoading(false);

    }, []);

    // const getCategories = () => {
    //     LookUpService.jobcategories().then(
    //         res => {
    //             setCategories(res);
    //         }
    //     )
    // }

    // const getJobskills = () => {
    //     LookUpService.getAllSkills().then(
    //         res => {
    //             setSkills(res);
    //         }
    //     )
    // }

    const createCandidate = (candidate: any) => {
        setLoading(true);
        candidate.company_uuid = companyId;
        candidate.resume_urls = resumeUrl;
        candidate.photo_url = '';
        // candidate.skills_codes = selectedSkills.toString();
        // candidate.total_experience = Number(candidate.total_experience);
        // candidate.availability_time = '';
        candidate.recruiter_uuid = userUuid;
        // candidate.job_uuid = selectedJobId;
        CandidatesService.addCandidate(candidate).then(
            res => {
                setLoading(false);
                if (res.error) {
                    toast.error(res?.error?.message);
                } else {
                    //   setAddCandidateModalShow(false);
                    toast.success('Saved Successfully');
                    history.push(`/dashboard/candidates/all`)
                }
            }
        );
    }

    // const createCandidate = (candidate: any) => {
    //     console.log(candidate);
    //     // setIsFormSubmitted(true);
    //     // if (!candidateFormData?.isValid) {
    //     //     return;
    //     // }
    //     setLoading(true);
    //     // const candidate = candidateData || {};
    //     // const errors: FormControlError[] = FormValidator(candidatesFormValidations, candidate);
    //     candidate.company_uuid = companyId;
    //     candidate.resume_urls = resumeUrl;
    //     candidate.photo_url = '';
    //     // candidate.skills_codes = selectedSkills.toString();
    //     candidate.availability_time = '';
    //     candidate.total_experience = Number(candidate.total_experience);
    //     candidate.availability_time = '';
    //     candidate.recruiter_uuid = userUuid;
    //     candidate.mobile_verified = isMobileVerified === '1' ? true : false;
    //     candidate.email_verified = isEmailVerified === '1' ? true : false;
    //     candidate.join_availability = selectedJoiningAvailability;
    //     delete candidate[''];
    //     if (candidate.user_firstname
    //         && candidate.user_lastname
    //         && candidate.user_email
    //         && candidate.mobile_no
    //         && candidate.country_code
    //         && candidate.linkedin_url
    //         && candidate.job_category) {
    //         // const mandatorySkills: any = [];
    //         // const mandatorySkillsExperience: any = [];
    //         // const mandatorySkillsProficiency: any = [];
    //         // madatorySkills.forEach(element => {
    //         //     mandatorySkills.push(element?.skill);
    //         //     mandatorySkillsExperience.push(element?.experience);
    //         //     mandatorySkillsProficiency.push(element?.proficiency);
    //         // });
    //         // candidate.skills_codes = mandatorySkills.toString();
    //         // candidate.skills_exp = mandatorySkillsExperience.toString();
    //         // candidate.skills_proficiency = mandatorySkillsProficiency.toString();
    //         candidate.tags = tags.length > 0 ? tags.toString() : '';
    //         candidate.mobile_no = `${candidate.country_code} ${candidate.mobile_no}`
    //         // if (id === '0') {
    //         //     CandidatesService.addCandidate(candidate).then(
    //         //         res => {
    //         //             if (res?.error) {
    //         //                 setLoading(false);
    //         //                 toast.error(res?.error?.message);
    //         //             } else {
    //         //                 setLoading(false);
    //         //                 toast.success('Added successfully');
    //         //                 history.push(`/dashboard/candidates/all`);
    //         //             }
    //         //         }
    //         //     )
    //         // } else {
    //         //     CandidatesService.updateCandidate(candidate).then(
    //         //         res => {
    //         //             if (res?.error) {
    //         //                 setLoading(false);
    //         //                 toast.error(res?.error?.message);
    //         //             } else {
    //         //                 setLoading(false);
    //         //                 toast.success('Updated successfully');
    //         //                 history.push(`/dashboard/candidates/all`);
    //         //             }
    //         //         }
    //         //     )
    //         // }
    //     } else {
    //         setFormError('Mandatory fields are not filled');
    //         setTimeout(() => {
    //             setFormError('');
    //         }, 2000);
    //         if (!candidate.mobile_no) {
    //             setMobileNumberError('Please enter mobile number');
    //         }
    //         if (!candidate.country_code) {
    //             setMobileNumberCountryCodeError('Please enter the country code');
    //         }
    //         setLoading(false);
    //     }
    // }

    const handleCandidateInput = (data: FormBuilderData) => {
        setCandidateFormData(data);
    };

    const onUploadProgress = (data: any) => {
        const progress = Math.round((data.loaded / data.total) * 100);
    };

    // const getCountry = () => {
    //     LookUpService.getCountry().then(
    //         res => {
    //             // setCountryesData(res);
    //             setCountryData(res)
    //         }
    //     )
    // }

    // useEffect(() => {
    //     getCountry()
    // }, [])

    const onUploadResume = async (event: any) => {
        setResumeUrl('');
        setLoading(true);
        if (event.target.files && event.target.files[0]) {
            UsersService.candidateResumeuploadurl(companyId).then(async res => {
                if (res?.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    const result = await S3Helper.uploadFilesToS3BySigned(res.presignedUrl,
                        event.target.files[0],
                        event.target.files[0]?.type
                    );
                    setResumeUrl(`${res.fileUrl}`);
                    setLoading(false);
                    toast.success("Uploaded Successfully");
                }
            })
        }
    };
    // const onCategory = (event: any) => {
    //     setSkills([]);
    //     setCategoryError('');
    //     if (event) {
    //         LookUpService.skills(event).then(
    //             res => {
    //                 setSkills(res);
    //             }
    //         )
    //     } else {
    //         setCategoryError('Please select a category');
    //         setSkills([]);
    //     }
    // }
    const onSelectSkills = (selectedList: any, selectedItem: any) => {
        setSkillError('');
        const skills: any = [];
        selectedList.map((skill: any) => {
            skills.push(skill);
        })
        if (skills.length > 0) {
            setSelectedSkills(skills);
        } else {
            setSkillError(nameValidations('', 'skills'));
        }
    }

    const onRemoveSkills = (selectedList: any, removedItem: any) => {
        setSkillError('');
        const skills: any = [];
        selectedList.map((skill: any) => {
            skills.push(skill);
        })
        if (skills.length > 0) {
            setSelectedSkills(skills);
        } else {
            setSkillError(nameValidations('', 'skills'));
        }
    }

    return (
        <>

            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }

            {

                SX_ROLES.Recruiter === "Recruiter" ?
                    <>
                        <div className='ms-3 mt-4'>
                            <h5 className="top_heading_styles">Add New Candidate</h5>
                            <p className='top_para_styles'>Enter the candidate details</p>
                        </div>
                        <Addcandidate

                            onUploadResume={onUploadResume}
                            resumeUrl={resumeUrl}
                            onSave={createCandidate} />
                    </>
                    :
                    <div className="row  px-4 py-5">

                        <div className='pb-3 d-flex justify-content-between '>
                            <div>
                                <h5 className="mb-2 d-block top_heading_styles">{id === '0' ? 'Add New Candidate' : 'Edit Candidate'}</h5>
                                <p style={{ fontSize: '14px' }} className="top_para_styles">Here's where you can add and edit the general information for this job</p>
                            </div>
                            <div className='me-2'>

                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-8 col_width_add_candidate_box1'>
                                <div className='add_company_border rounded-3'>
                                    <div className='row'>
                                        <div className='col-12 mx-3 my-4'>
                                            <Addcandidate
                                                // countryData={countryData}
                                                // skills={skills}
                                                onUploadResume={onUploadResume}
                                                resumeUrl={resumeUrl}
                                                onSave={createCandidate} />

                                            {/* <FormBuilder onUpdate={setCandidateFormData} showValidations={isFormSubmitted}>
                                   <form>
                                       <div className='row'>
                                           <div className="col-md-4 px-2">
                                               <div className="mb-4">
                                                   
                                                   <label className="input">
                                                       <input type="text" className="form-control job_dis_form_control rounded manual_profile_padding input__field" placeholder="Name" name="user_firstname" defaultValue={candidateData?.user_firstname} 
                                                                                 data-validate-required="Please enter your first name"
                                                                                 data-validate-name='Special characters are not allowed'
                                                       />
                                                       <span className={`input__label`}>First name<span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span></span>
                                                   </label>
                                               </div>
                                           </div>
                                           <div className="col-md-4 px-2">
                                               <div className="mb-4">
                                                                                                      <label className="input">
                                                       <input className="form-control job_dis_form_control rounded manual_profile_padding input__field" placeholder="Name" type="text" name="user_middlename" defaultValue={candidateData?.user_middlename} />
                                                       <span className={`input__label`}>Middle Name</span>
                                                   </label>
                                               </div>
                                           </div>
                                           <div className="col-md-4 px-2">
                                               <div className="mb-4">
                                                 
                                                   <label className="input">
                                                       <input className="form-control job_dis_form_control rounded manual_profile_padding input__field" placeholder="Name" type="text" name="user_lastname" defaultValue={candidateData?.user_lastname} 
                         data-validate-required="Please enter your last name"
                         data-validate-name='Special characters are not allowed'/>
                                                       <span className={`input__label`}>Last Name<span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span></span>
                                                   </label>
                                               </div>
                                           </div>
                                           <div className="col-md-8 px-2">
                                               <div className="mb-4">
                                                   <label className="input">
                                                       <input className="form-control job_dis_form_control rounded manual_profile_padding input__field" placeholder="Email" type="text" name="user_email" defaultValue={candidateData?.user_email}
                                                       data-validate-required="Please enter your email"
                                                       data-validate-email="email"/>
                                                       <span className={`input__label`}>Email<span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span></span>
                                                   </label>
                                               </div>
                                           </div>
                                           <div className="col-md-4 px-2">
                                               <div className="mb-4">
                                              
                                                   <label className="input">
                                                       <select className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" value={isEmailVerified} onChange={(e) => onEmailVerified(e)}>
                                                           <option selected disabled>Select</option>
                                                           <option value="1">Yes</option>
                                                           <option value="0">No</option>
                                                       </select>
                                                       <span className={`input__label`}>Email verified?</span>
                                                   </label>
                                               </div>
                                           </div>
                                           <div className="col-md-3 px-2">
                                               <div className="mb-4">
                                                   
                                                   <label className="input">
                                                       <input className="form-control job_dis_form_control rounded manual_profile_padding input__field" placeholder="Country code" type="text" name="country_code" defaultValue={candidateData?.country_code} onChange={(event) => onChangeMobileNumberCountryCode(event)} />
                                                       <span className={`input__label`}>Country Code<span style={{ color: 'red', fontSize: '15px' }}>*</span></span>
                                                   </label>
                                                   {mobileNumberCountryCodeError && <p className="text-danger job_dis_form_label">{mobileNumberCountryCodeError}</p>}
                                               </div>
                                           </div>
                                           <div className="col-md-5 px-2">
                                               <div className="mb-4">
                                                   <label className="input">
                                                       <input className="form-control job_dis_form_control rounded manual_profile_padding input__field" placeholder="Mobile number" type="text" name="mobile_no" defaultValue={candidateData?.mobile_no} onChange={(event) => onChangeMobileNumber(event)} />
                                                       <span className={`input__label`}>Mobile Number<span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span></span>
                                                   </label>
                                                   {mobileNumberError && <p className="text-danger job_dis_form_label">{mobileNumberError}</p>}
                                               </div>
                                           </div>
                                           <div className="col-md-4 px-2">
                                               <div className="mb-4">
                                                 
                                                   <label className="input">
                                                       <select className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" aria-label="Default select example" value={isMobileVerified} onChange={(e) => onMobileVerified(e)}>
                                                           <option selected disabled>Select</option>
                                                           <option value="1">Yes</option>
                                                           <option value="0">No</option>
                                                       </select>
                                                       <span className={`input__label`}>Mobile verified?</span>
                                                   </label>
                                               </div>
                                           </div>
                                           <div className="col-md-8 px-2">
                                               <div className="mb-4">
                                                  
                                                   <label className="input">
                                                       <input  className="form-control job_dis_form_control rounded manual_profile_padding input__field" placeholder=" " type="text" name="linkedin_url" defaultValue={candidateData?.linkedin_url}
                                                       data-validate-required="Please enter linkedin address"
                                                       data-validate-linkedin="linkedin"/>
                                                       <span className={`input__label`}>LinkedIn<span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span></span>
                                                   </label>
                                               </div>
                                           </div>
                                           <div className="col-md-12 px-2">
                                               <div className="mb-4">
                                                  
                                                   <div className='row'>
                                                       <div className='col-12'>
                                                           {madatorySkills.map((data: any, index: number) => {
                                                               return <div className='row mt-2' key={index}>
                                                                   <div className='col-6 pe-3'>
                                                                   
                                                                       <label className="input">
                                                                           <select className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" aria-label="Default select example" onChange={(e) => onChanegMandatorySkill(e, index)}>
                                                                               <option value="">Select</option>
                                                                               {skills.map((data: any, index: number) => { return <option key={index} value={data.skill}>{data.skill}</option> })}
                                                                           </select>
                                                                           <span className={`input__label`}>Skill set<span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span></span>
                                                                       </label>
                                                                   </div>
                                                                   <div className='col-2 pe-3'>
                                                                  
                                                                       <label className="input">
                                                                           <select className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" value={data?.experience} aria-label="Default select example" onChange={(e) => onChanegMandatorySkillExperie(e, index)}>
                                                                               <option value="">Select</option>
                                                                               {experienceList.map((data: any, index: number) => { return <option key={index} value={data}>{data}</option> })}
                                                                           </select>
                                                                           <span className={`input__label`}>Select<span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span></span>
                                                                       </label>
                                                                   </div>
                                                                   <div className='col-2 pe-3'>
                                                                  
                                                                       <label className="input">
                                                                           <select className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" value={data?.proficiency} aria-label="Default select example" onChange={(e) => onSelectProficiency(e, index)}>
                                                                               <option value="">Select</option>
                                                                               <option value="Basic">Basic</option>
                                                                               <option value="Advanced">Advanced</option>
                                                                               <option value="Expert">Expert</option>
                                                                           </select>
                                                                           <span className={`input__label`}>Select<span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span></span>
                                                                       </label>
                                                                   </div>
                                                                   <div className='col-2'>
                                                                       <img src={Add} alt="add" className='pointer ms-3' onClick={onAddSkills} />

                                                                       {
                                                                           index > 0 &&
                                                                           <img src={Delete} alt="delete" className='pointer ms-3' onClick={() => onDeleteSkill(index)} />

                                                                       }
                                                                   </div>
                                                               </div>
                                                           })}
                                                       </div>
                                                   </div>
                                                   {skillError && <p className="text-danger job_dis_form_label">{skillError}</p>}
                                               </div>
                                           </div>
                                           <div className="col-md-12 px-2">
                                               <label className="form-label job_dis_form_label mb-0">CV</label>
                                               <span className='text-danger'>*</span>
                                               <div className="mb-4">
                                                   <div className="file small_btn px-3 py-2 rounded-5 d-inline-block upload_file text-dark">Upload CV
                                                       <input type="file" accept="application/msword, application/pdf" onChange={(e) => onUploadResume(e)} />
                                                   </div>
                                                   <span className='mx-3 text_style'>Document with PDF or Word format</span>
                                                   {resumeUrl && <a href={`${CLOUDFRONT_URL}/${resumeUrl}`} target="_blank">Open CV</a>}
                                                   {resumeUrl && <img src={Delete} alt="delete" className='pointer ms-3' onClick={() => setResumeUrl('')} />}

                                               </div>
                                           </div>
                                       </div>
                                   </form>
                               </FormBuilder> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }

        </>


    )
}
