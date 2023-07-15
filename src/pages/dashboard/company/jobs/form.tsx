import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import FormBuilder from '../../../../components/form-builder';
import { FormControlError, FormField, FormValidators } from '../../../../components/form-builder/model/form-field';
import { FormValidator } from '../../../../components/form-builder/validations';
import { UsersService } from '../../../../app/service/users.service';
import { JobsService } from '../../../../app/service/jobs.service';
import { LookUpService } from '../../../../app/service/lookup.service';
import ChipInput from '../../../../components/chip-input';
import moment from 'moment';
import { descriptionValidations, nameValidations, numberValidations, titleValidations } from '../../../../app/utility/form-validations';
import { AppLoader } from '../../../../components/loader';
import { toast } from 'react-toastify';
import { DefaultEditor } from 'react-simple-wysiwyg';
import Select from 'react-select';
import Add from "../../../../assets/icon_images/Add.png" 
import Delete from "../../../../assets/icon_images/delete.png";

export const JobsForm = () => {
  const [loading, setLoading] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [jobvalidationErrors, setJobvalidationErrors] = useState<FormControlError[]>([]);
  const [currentJobData, setCurrentJobData] = useState<any>();
  const [selectedSkills, setSelectedSkills] = useState<any>('');
  const [selectedOptionalSkills, setSelectedOptionalSkills] = useState<any>('');
  const [selectedTeamMeber, setSelectedTeamMeber] = useState<any>([]);
  const [selectedTeamMeberList, setSelectedTeamMeberList] = useState<any>([]);
  const [selectedHiringManager, setSelectedHiringManager] = useState<any>([]);
  const [selectedHiringManagerList, setSelectedHiringManagerList] = useState<any>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experienceList, setExperienceList] = useState<any[]>([]);
  let { id, userId } = useParams<{ id: string, userId: string }>();
  const [selectedJobId, setSelectedJobId] = useState<any>(userId);
  const companyId = sessionStorage.getItem('company_uuid') || '';
  const [jobTitleError, setJobTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [smeInstructionsError, setSmeInstructionsError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [seniorityError, setSeniorityError] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const [skillsError, setSkillsError] = useState("");
  const [optionalSkillsError, setOptionalSkillsError] = useState("");
  const [dueDateError, setDueDateError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [positionsError, setPositionsError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const history = useHistory();
  const [allMembers, setAllMembers] = useState<any[] | []>([]);
  const [hrMembers, setHrMembers] = useState<any[] | []>([]);
  const [madatorySkills, setMadatorySkills] = useState<any[] | []>([{ skill: '', experience: '', proficiency: '' }]);
  const [optionalSkills, setOptionalSkills] = useState<any[] | []>([{ skill: '', experience: '', proficiency: '' }]);
  const companyUuid = sessionStorage.getItem('company_uuid') || '';
  const jobFormValidations = [
    new FormField('job_title', [FormValidators.REQUIRED]),
    new FormField('job_description', [FormValidators.REQUIRED]),
    new FormField('job_skills', []),
    new FormField('positions', [FormValidators.REQUIRED]),
    new FormField('location', []),
    new FormField('validity_start_dt', [FormValidators.REQUIRED]),
    new FormField('validity_end_dt', [FormValidators.REQUIRED]),
    new FormField('seniority_code', [FormValidators.REQUIRED]),
    new FormField('status', []),
    new FormField('instructions_to_sme', []),
  ];
  const [jobDescription, setJobDescription] = useState("");
  const [Instructions, setInstructions] = useState("");
  const [jobTage, setJobTage] = useState("");
  const [positions, setPositions] = useState("");
  const loginUserId = sessionStorage.getItem('userUuid') || '';
  const [isCandidateAdd, setIsCandidateAdd] = useState(false);
  const [formError, setFormError] = useState<any>('');

  useEffect(() => {
    const experience = [];
    for (let index = 0; index <= 30; index++) {
      experience.push(index);
      setExperienceList([...experience])
    }
    getAllSkills();
    allUsers();
    getHRTeam();
    if (selectedJobId !== '0') {
      JobsService.getJobsByUuid(selectedJobId).then(res => {
        if (res?.error) {
          setLoading(false);
          toast.error(res?.error?.message);
        } else {
          res.job_due_dt = moment(res?.job_due_dt).format('YYYY-MM-DD');
          res.experience = res.experience.toString();
          setCurrentJobData(res);
          setJobDescription(res?.job_description);
          setInstructions(res?.instructions_to_sme);
          const allSkills: any = [];
          const allOPtionalSkills: any = [];
          const skills = res?.job_mandatory_skills ? res?.job_mandatory_skills.split(',') : [];
          const optionSkills = res?.job_optional_skills ? res?.job_optional_skills.split(',') : [];
          const skillsExp = res?.job_mandatory_skills_exp ? res?.job_mandatory_skills_exp.split(',') : [];
          const optionSkillsExp = res?.job_optional_skills_exp ? res?.job_optional_skills_exp.split(',') : [];
          const skillsProficiency = res?.job_mandatory_skills_proficiency ? res?.job_mandatory_skills_proficiency.split(',') : [];
          const optionSkillsProficiency = res?.job_optional_skills_proficiency ? res?.job_optional_skills_proficiency.split(',') : [];
          setPositions(res?.positions)
          skills?.forEach((element: any, index: number) => {
            allSkills.push({ skill: element, experience: skillsExp[index], proficiency: skillsProficiency[index] })
          });
          setMadatorySkills([...allSkills])
          optionSkills?.forEach((element: any, index: number) => {
            allOPtionalSkills.push({ skill: element, experience: optionSkillsExp[index], proficiency: optionSkillsProficiency[index] })
          });
          setOptionalSkills([...allOPtionalSkills])
          // setSelectedSkills();
          // setSelectedOptionalSkills();
          // setSelectedHiringManager([res[0]?.])
        }
      })
      JobsService.getJobsTeamMembers(selectedJobId).then(
        res => {
          if (res?.error) {
            toast.error(res?.error?.message);
          } else {
            res.forEach((element: any) => {
              element.fullName = `${element?.user_firstname} ${element?.user_lastname} `
            });
            const team = res?.filter((data: any) => data?.type === 1);
            const hr = res?.filter((data: any) => data?.type === 2);
            const teamMembers: any = [];
            const hrMembers: any = [];
            team.forEach((element: any) => {
              teamMembers.push(element?.user_uuid)
            });
            hr.forEach((element: any) => {
              hrMembers.push(element?.user_uuid)
            });
            setSelectedTeamMeber([...teamMembers])
            setSelectedHiringManager([...hrMembers]);
            setSelectedTeamMeberList([...team])
            setSelectedHiringManagerList([...hr]);
          }
        }
      )
    }

    return () => {
      // autoSaveJob(selectedStatus)
    }
  }, []);

  const allUsers = () => {
    setLoading(true);
    UsersService.getUsers(companyUuid, '').then(res => {
      if (res.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        setLoading(false);
        res.forEach((element: any) => {
          element.fullName = `${element?.user_firstname} ${element?.user_lastname} `
          element.label = `${element?.user_firstname} ${element?.user_lastname}`
          element.value = element?.uuid
        });
        const data = res.filter((data: any) => loginUserId !== data?.uuid)
        setAllMembers([...data]);
      }
    });
  }

  const getHRTeam = () => {
    setLoading(true);
    UsersService.getUsersByRole(companyUuid, 'ea0308c8-16cf-4d7f-bca9-483cc14bb3c1', '').then(res => {
      if (res.error) {
        toast.error(res?.error?.message);
        setLoading(false);
      } else {
        res.forEach((element: any) => {
          element.fullName = `${element?.user_firstname} ${element?.user_lastname} `
        });
        setHrMembers([...res]);
        setLoading(false);
      }
    });
  }

  const getAllSkills = async () => {
    try {
      const skills = await LookUpService.getAllSkills();
      setSkills(skills);
    } catch (error) {
      setSkills([]);
    }
  }

  const createJob = (isType: string, isCandidate: string) => {
    setLoading(true);
    const jobsData = currentJobData || {};
    
    setIsFormSubmitted(true);
    jobsData.team_members = selectedTeamMeber ? selectedTeamMeber : [];
    jobsData.hr_managers = selectedHiringManager ? selectedHiringManager : [];
    jobsData.company_uuid = companyId;
    jobsData.seniority_code = jobsData.seniority_code ? jobsData.seniority_code : '';
    jobsData.job_start_dt = moment().format('YYYY-MM-DD');
    jobsData.experience = jobsData?.experience >= 0 ? jobsData?.experience.toString() : '';
    jobsData.positions = jobsData?.positions >= 0 ? jobsData?.positions.toString() : '';
    jobsData.tags = jobTage ? jobTage.toString() : '';
    const mandatorySkills: any = [];
    const mandatorySkillsExperience: any = [];
    const mandatorySkillsProficiency: any = [];
    const optionalSkillsData: any = [];
    const optionalSkillsExperience: any = [];
    const optionalSkillsProficiency: any = [];
    if (madatorySkills.length > 0) {
      madatorySkills.forEach(element => {
        if (element?.skill && element?.experience && element?.proficiency) {
          mandatorySkills.push(element?.skill);
          mandatorySkillsExperience.push(element?.experience);
          mandatorySkillsProficiency.push(element?.proficiency);
        }
      });
    }
    if (optionalSkills.length > 0) {
      optionalSkills.forEach(element => {
        if (element?.skill && element?.experience && element?.proficiency) {
          optionalSkillsData.push(element?.skill);
          optionalSkillsExperience.push(element?.experience);
          optionalSkillsProficiency.push(element?.proficiency);
        }
      });
    }
    if (jobsData.job_title
      && jobDescription
      && Instructions
      && jobsData.location
      && jobsData.experience
      && mandatorySkills.length > 0
      // && optionalSkillsData.length > 0
      && jobsData.job_due_dt
      && jobsData.status
      && jobsData.positions) {
      jobsData.positions = positions ? Number(positions) : null;
      jobsData.experience = Number(jobsData.experience);
      jobsData.status = isType === 'draft' ? 'draft' : 'active';
      jobsData.job_description = jobDescription;
      jobsData.instructions_to_sme = Instructions;
      jobsData.job_mandatory_skills = mandatorySkills.toString();
      jobsData.job_optional_skills = optionalSkillsData.toString();
      jobsData.job_mandatory_skills_exp = mandatorySkillsExperience.toString();
      jobsData.job_optional_skills_exp = optionalSkillsExperience.toString();
      jobsData.job_mandatory_skills_proficiency = mandatorySkillsProficiency.toString();
      jobsData.job_optional_skills_proficiency = optionalSkillsProficiency.toString();
      if (selectedJobId === '0') {
        JobsService.addJobs(jobsData).then(res => {
          if (res?.error) {
            setLoading(false);
            toast.error(res?.error?.message);
          } else {
            toast.success('Job saved successfully');
            setLoading(false);
            if (isCandidate) {
              history.push(`/dashboard/companies/info/${companyId}/jobs/info/${res?.uuid}/candidates/candidates`)
            } else {
              history.push('/dashboard/jobs');
            }
          }
        })
      } else {
        const updatingJobId = currentJobData?.uuid ? currentJobData?.uuid : selectedJobId;
        JobsService.updateJob(jobsData, updatingJobId).then(res => {
          if (res?.error) {
            setLoading(false);
            toast.error(res?.error?.message);
          } else {
            toast.success('Job saved successfully');
            setLoading(false);
            if (isCandidate) {
              history.push(`/dashboard/companies/info/${companyId}/jobs/info/${updatingJobId}/candidates/candidates`)
            } else {
              history.push('/dashboard/jobs');
            }
          }
        })
      }
    } else {
      setFormError('Mandatory fields are not filled');
      setTimeout(() => {
        setFormError('');
      }, 2000);
      setLoading(false);
      if (!jobsData.job_title) {
        setJobTitleError(titleValidations(jobsData.job_title, 'job title'));
      }
      if (!jobDescription) {
        setDescriptionError(descriptionValidations(jobDescription, 'description'));
      }
      if (!Instructions) {
        setSmeInstructionsError(descriptionValidations(Instructions, 'instructions to SME'));
      }
      if (!jobsData.location) {
        setLocationError(nameValidations(jobsData.location, 'loaction'));
      }
      if (!jobsData.experience && jobsData.experience !== 0) {
        setExperienceError(nameValidations(jobsData.experience, 'experience'));
      }
      if ((mandatorySkills.length <= 0)) {
        setSkillsError('Please add skills');
      }
      // if ((optionalSkillsData.length <= 0)) {
      //   setOptionalSkillsError('Please add optional skills');
      // }
      if (!jobsData.job_due_dt) {
        setDueDateError(nameValidations(jobsData.job_due_dt, 'due date'));
      }
      if (!jobsData.status) {
        setStatusError(nameValidations(jobsData.status, 'status'));
      }
      if (!jobsData.seniority_code) {
        setSeniorityError('Please select seniority');
      }
      if (!jobsData.positions) {
        setPositionsError(numberValidations(jobsData.positions, 'positions'));
      }
    }
  }

  const autoSaveJob = (isType: string) => {
    setIsFormSubmitted(true);
    const jobsData = currentJobData;
    if (jobsData?.job_title
      && jobDescription) {
      jobsData.team_members = selectedTeamMeber ? selectedTeamMeber : [];
      jobsData.hr_managers = selectedHiringManager ? selectedHiringManager : [];
      jobsData.company_uuid = companyId;
      jobsData.seniority_code = jobsData.seniority_code ? jobsData.seniority_code : '';
      jobsData.job_start_dt = moment().format('YYYY-MM-DD');
      jobsData.experience = jobsData?.experience ? jobsData?.experience.toString() : '';
      jobsData.tags = jobTage ? jobTage.toString() : '';
      const mandatorySkills: any = [];
      const mandatorySkillsExperience: any = [];
      const mandatorySkillsProficiency: any = [];
      const optionalSkillsData: any = [];
      const optionalSkillsExperience: any = [];
      const optionalSkillsProficiency: any = [];
      if (madatorySkills.length > 0) {
        madatorySkills.forEach(element => {
          if (element?.skill && element?.experience && element?.proficiency) {
            mandatorySkills.push(element?.skill);
            mandatorySkillsExperience.push(element?.experience);
            mandatorySkillsProficiency.push(element?.proficiency);
          }
        });
      }
      if (optionalSkills.length > 0) {
        optionalSkills.forEach(element => {
          if (element?.skill && element?.experience && element?.proficiency) {
            optionalSkillsData.push(element?.skill);
            optionalSkillsExperience.push(element?.experience);
            optionalSkillsProficiency.push(element?.proficiency);
          }
        });
      }

      jobsData.positions = positions ? Number(positions) : null;
      jobsData.experience = Number(jobsData.experience);
      jobsData.status = isType === 'draft' ? 'draft' : 'active';
      jobsData.job_description = jobDescription;
      jobsData.instructions_to_sme = Instructions;
      jobsData.job_mandatory_skills = mandatorySkills.toString();
      jobsData.job_optional_skills = optionalSkillsData.toString();
      jobsData.job_mandatory_skills_exp = mandatorySkillsExperience.toString();
      jobsData.job_optional_skills_exp = optionalSkillsExperience.toString();
      jobsData.job_mandatory_skills_proficiency = mandatorySkillsProficiency.toString();
      jobsData.job_optional_skills_proficiency = optionalSkillsProficiency.toString();
      if (selectedJobId === '0') {
        JobsService.addJobs(jobsData).then(res => {
          if (res?.error) {
            setLoading(false);
            toast.error(res?.error?.message);
          } else {
            setLoading(false);
            setSelectedJobId(res?.uuid);
            // history.push('/dashboard/jobs');
          }
        })
      } else {
        JobsService.updateJob(jobsData, selectedJobId).then(res => {
          if (res?.error) {
            setLoading(false);
            toast.error(res?.error?.message);
          } else {
            setLoading(false);
          }
        })
      }
    } else {
      setLoading(false);
      if (!jobsData?.job_title) {
        setJobTitleError(titleValidations(jobsData?.job_title, 'job title'));
      }
      if (!jobDescription) {
        setDescriptionError(descriptionValidations(jobDescription, 'description'));
      }
    }
  }
  const handleJobInput = (data: any) => {
    data.value = { ...currentJobData, ...data.value };
    setCurrentJobData(data.value);
    const errors: any = FormValidator(jobFormValidations, data.value);
    setJobvalidationErrors(errors);
  }

  const onSelectTeamMember = (selectedList: any) => {
    const teamMembers: any = selectedTeamMeber;
    selectedList.map((teamMember: any) => {
      teamMembers.push(teamMember?.uuid);
    })
    setSelectedTeamMeberList([...selectedList])
    setSelectedTeamMeber([...teamMembers])
  }

  const onRemoveTeamMember = (selectedList: any, removedItem: any) => {
    const teamMembers: any = [];
    selectedList.map((teamMember: any) => {
      teamMembers.push(teamMember?.uuid);
    })
    setSelectedTeamMeberList([...selectedList])
    setSelectedTeamMeber([...teamMembers])
  }

  const onSelectHiringManager = (selectedList: any) => {
    // const hrManagers: any = selectedHiringManager;
    // selectedList.map((hrManager: any) => {
    //   hrManagers.push(hrManager?.uuid);
    // })
    // setSelectedHiringManagerList([...selectedList])
    setSelectedHiringManager([...selectedList])
  }

  const onRemoveHiringManager = (selectedList: any, removedItem: any) => {
    const hrManagers: any = [];
    selectedList.map((hrManager: any) => {
      hrManagers.push(hrManager?.uuid);
    })
    setSelectedHiringManagerList([...selectedList])
    setSelectedHiringManager([...hrManagers])
  }

  const onChangeJobTitle = (event: any) => {
    setJobTitleError(titleValidations(event.target.value, 'job title'));
  }



  const onChangeSmeInstructions = (event: any) => {
    setSmeInstructionsError(descriptionValidations(event.target.value, 'instructions to SME'));
  }

  const onChangeLocation = (event: any) => {
    setLocationError(nameValidations(event.target.value, 'location'));
  }

  const onChangeSeniority = (event: any) => {
    setSeniorityError(nameValidations(event.target.value, 'seniority'));
  }
  const onChangeExperience = (event: any) => {
    setExperienceError(nameValidations(event.target.value, 'experience'));
  }
  const onChangeSkills = (event: any) => {
    setSkillsError(nameValidations(event.target.value, 'skills'));
  }
  const onChangeOptionalSkills = (event: any) => {
    setOptionalSkillsError(nameValidations(event.target.value, 'optional skills'));
  }
  const onChangeDueDate = (event: any) => {
    setDueDateError(nameValidations(event.target.value, 'due date'));
  }
  const onChangeStatus = (event: any) => {
    setStatusError(nameValidations(event.target.value, 'status'));
    setSelectedStatus(event.target.value);
  }
  const onChangePositions = (event: any) => {
    setPositionsError('');
    if (!event.target.value) {
      setPositionsError(numberValidations(event.target.value, 'positions'));
    }
    if (Number(event.target.value) >= 0) {
      setPositions(event.target.value)
    } else {
      setPositions('0')
    }
  }


  const onChipData = (data: any) => {
    setJobTage(data);
  }
  const onAddSkills = () => {
    const data: any = madatorySkills;
    data.push({ skill: '', experience: '', proficiency: '' });
    setMadatorySkills([...data])
  }
  const onOptionalSkills = () => {
    const data: any = optionalSkills;
    data.push({ skill: '', experience: '', proficiency: '' });
    setOptionalSkills([...data])
  }

  const onChanegMandatorySkill = (e: any, index: number) => {
    setSkillsError('');
    const data: any = madatorySkills;
    data[index].skill = e.target.value;
    setMadatorySkills([...data])
  }

  const onChanegMandatorySkillExperie = (e: any, index: number) => {
    const data: any = madatorySkills;
    data[index].experience = e.target.value;
    setMadatorySkills([...data])
  }

  const onChanegOptionalSkill = (e: any, index: number) => {
    setOptionalSkillsError('')
    const data: any = optionalSkills;
    data[index].skill = e.target.value;
    setOptionalSkills([...data])
  }

  const onChanegOptionalSkillExperie = (e: any, index: number) => {
    const data: any = optionalSkills;
    data[index].experience = e.target.value;
    setOptionalSkills([...data])
  }

  const onSelectProficiency = (event: any, index: number) => {
    if (event.target.value) {
      const data = madatorySkills;
      data[index].proficiency = event.target.value;
      setMadatorySkills([...data]);
    }
  }

  const onSelectOptionalProficiency = (event: any, index: number) => {
    if (event.target.value) {
      const data = optionalSkills;
      data[index].proficiency = event.target.value;
      setOptionalSkills([...data]);
    }
  }

  const onChangeDescription = (e: any) => {
    setDescriptionError('');
    setJobDescription(e.target.value);
    if (!e.target.value) {
      setDescriptionError("Please enter description");
    }
  }
  const onChangeInstructions = (e: any, currentJobData: any) => {
    setInstructions(e.target.value);
    setSmeInstructionsError('');
    if (!e.target.value) {
      setSmeInstructionsError("Please enter instructions to SME");
    }

  
  }

  const onDeleteSkill = (index: number) => {
    const data = madatorySkills;
    data.splice(index, 1);
    setMadatorySkills([...data]);
  }

  const onDeleteOptionalSkill = (index: number) => {
    const data = optionalSkills;
    data.splice(index, 1);
    setOptionalSkills([...data]);
  }

  const onCloseForm = () => {
    history.goBack();
  }

  const onAddCandidates = () => {
    setIsCandidateAdd(true);
    sessionStorage.setItem('isFromJobForm', 'yes');
    createJob('normal', 'Yes');
  }


  return (
    <div className='job_discription'>
      {loading &&
        <AppLoader loading={loading}></AppLoader>
      }
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12'>
            <div className='job_discription_heading d-flex justify-content-between py-3 ps-4 pe-5'>
              <div className='my-auto'>
                <h5 className='top_heading_styles mt-4'>Job Description and Details</h5>
                <p className='top_para_styles mb-1'>Here's where you can add and edit the general information for this job</p>
              </div>
              <div className='my-auto'>
                <button className='large_btn rounded'>{currentJobData?.status ? currentJobData?.status : 'Draft'}</button>
              </div>
            </div>
            <FormBuilder onUpdate={handleJobInput}>
              <form>
                <div className='row ps-4 pe-5 mb-5'>
                  <div className='col-lg-8 col-md-6 col-12 mx-auto'>
                    <div className='bg-white rounded-3 p-4 me-3 border_color'>
                      <div className='row'>
                        <div className='col-md-12 col-sm-12'>
                          <div className="mb-3 mt-2">
                          <label className="input">
                              <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="jobTitle" name="job_title" placeholder="  "  defaultValue={currentJobData?.job_title} onChange={(event) => onChangeJobTitle(event)} />
                               <span className="input__label">Job Title <span className='text-danger'>*</span></span>
                           </label>

                            {jobTitleError && <p className="text-danger job_dis_form_label">{jobTitleError}</p>}
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-12 col-sm-12'>
                          <div className="mb-4">
                            <label className="form-label job_dis_form_label">Description <span className='text-danger'>*</span></label>
                            <DefaultEditor value={jobDescription} onChange={(e) => onChangeDescription(e)} />
                            {descriptionError && <p className="text-danger job_dis_form_label">{descriptionError}</p>}
                          </div>
                        </div>
                      </div>
                      <div className='row mb-4 mt-2'>
                        <div className='col-md-12 col-sm-12'>
                          <div className='row'>
                            <div className='col-6'>
                              <div className='me-2'>
                              <label className="input">
                              <select className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" aria-label="Default select example" value={currentJobData?.seniority_code} name="seniority_code" onChange={(event) => onChangeSeniority(event)} onBlur={() => autoSaveJob(currentJobData?.status ? currentJobData?.status : 'draft')}>
                                  <option value={''} selected>Select Seniority level</option>
                                  <option value={'Trainee'}>Trainee</option>
                                  <option value={'Junior'}>Junior</option>
                                  <option value={'Middle'}>Middle</option>
                                  <option value={'Senior'}>Senior</option>
                                </select>
                                {seniorityError && <p className="text-danger job_dis_form_label">{seniorityError}</p>}
                               <span className="input__label">Seniority <span className='text-danger'>*</span></span>
                             </label>
                             
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='row mb-3'>
                        <div className='col-md-12 col-sm-12'>
                          <div className='row mt-2'>
                            <div className='col-6'>
                              <div className='me-2'>
                              <label className="input">
                                <select className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" name='experience' value={currentJobData?.experience} aria-label="Default select example" onChange={(event) => onChangeExperience(event)} onBlur={() => autoSaveJob(currentJobData?.status ? currentJobData?.status : 'draft')}>
                                  <option selected>Select experience needed</option>
                                  {experienceList.map((data: any, index: number) => { return <option key={index} value={data}>{data}</option> })}
                                </select>
                                {experienceError && <p className="text-danger job_dis_form_label">{experienceError}</p>}
                                <span className="input__label">Experience <span className='text-danger'>*</span></span>
                                </label>
                              </div>
                            </div>
                            <div className='col-6'>
                              <div className='ms-3'>
                              <label className="input">
                              <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="location" name="location" placeholder="  " defaultValue={currentJobData?.location}  onChange={(event) => onChangeLocation(event)} onBlur={() => autoSaveJob(currentJobData?.status ? currentJobData?.status : 'draft')} />
                               <span className="input__label">Location <span className='text-danger'>*</span></span>
                              </label>
                              
                                {locationError && <p className="text-danger job_dis_form_label">{locationError}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-12 col-sm-12'>
                          <div className="mb-2">
                         
                            <div className='row'>
                              <div className='col-12'>
                                {madatorySkills.map((data: any, index: number) => {
                                  return <div className='row mt-3 mb-4' key={index}>
                                    <div className='col-6  pe-2'>
                                    <label className="input">
                                      <select className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" value={data?.skill} aria-label="Default select example" onChange={(e) => onChanegMandatorySkill(e, index)} onBlur={() => autoSaveJob(currentJobData?.status ? currentJobData?.status : 'draft')}>
                                        <option value="">Select</option>
                                        {skills.map((data: any, index: number) => { return <option key={index} value={data.skill}>{data.skill}</option> })}
                                      </select>
                                     <span className="input__label">Skills <span className='text-danger'>*</span></span>
                                    </label>
                           
                                    </div>
                                   
                                    <div className='col-2'>
                                    <label className="input ms-3">
                                      <select className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" value={data?.experience} aria-label="Default select example" onChange={(e) => onChanegMandatorySkillExperie(e, index)} onBlur={() => autoSaveJob(currentJobData?.status ? currentJobData?.status : 'draft')}>
                                        <option value="">Select</option>
                                        {experienceList.map((data: any, index: number) => { return <option key={index} value={data}>{data}</option> })}
                                      </select>
                                        <span className="input__label">Experience </span>
                                      </label>
                               
                                    </div>
                                    <div className='col-2'>
                                    <label className="input ms-4">
                                      <select className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" aria-label="Default select example" value={data?.proficiency} onChange={(e) => onSelectProficiency(e, index)} onBlur={() => autoSaveJob(currentJobData?.status ? currentJobData?.status : 'draft')}>
                                        <option value="">Select</option>
                                        <option value="Basic">Basic</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                      </select>
                                      <span className="input__label">Proficiency </span>
                                     </label>
                                   
                                    </div>
                                    <div className='col-2'>
                                      <div className='row'>
                                        <div className='col-sm-6'>
                                        {
                                      madatorySkills.length>1&&
                                      <img src={Delete} alt="Delete"  className="pointer ms-5 mt-2" onClick={() => onDeleteSkill(index)}/>
                                    }
                                          </div>
                                          <div className='col-sm-6'>
                                          {
                                        (madatorySkills.length-1===index)&&
                                      <img src={Add} alt="add" className="pointer ms-3 mt-2" onClick={onAddSkills} />
                                    }
                                          </div>
                                        </div>
                                   
                                 
                                  
                                    </div>
                                  </div>
                                })}
                              </div>
                            </div>
                            {skillsError && <p className="text-danger job_dis_form_label">{skillsError}</p>}
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-12 col-sm-12'>
                          <div className="mb-3">
                        
                            <div className='row'>
                              <div className='col-12'>
                                {optionalSkills.map((data: any, index: number) => {
                                  return <div className='row mb-4' key={index}>
                                    <div className='col-6 pe-2'>
                                    <label className="input">
                                      <select className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" value={data?.skill} aria-label="Default select example" onChange={(e) => onChanegOptionalSkill(e, index)} onBlur={() => autoSaveJob(currentJobData?.status ? currentJobData?.status : 'draft')}>
                                        <option value="">Select</option>
                                        {skills.map((data: any, index: number) => { return <option key={index} value={data.skill}>{data.skill}</option> })}
                                      </select>
                                      <span className="input__label">Optional Skills </span>
                                    </label>
                               
                                    </div>
                                    <div className='col-2'>
                                    <label className="input ms-3">
                                      <select className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" value={data?.experience} aria-label="Default select example" onChange={(e) => onChanegOptionalSkillExperie(e, index)} onBlur={() => autoSaveJob(currentJobData?.status ? currentJobData?.status : 'draft')}>
                                        <option value="">Select</option>
                                        {experienceList.map((data: any, index: number) => { return <option key={index} value={data}>{data}</option> })}
                                      </select>
                                      <span className="input__label">Experience </span>
                                    </label>
                              
                                    </div>
                                    <div className='col-2'>
                                    <label className="input ms-4">
                                      <select className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" aria-label="Default select example" onChange={(e) => onSelectOptionalProficiency(e, index)} onBlur={() => autoSaveJob(currentJobData?.status ? currentJobData?.status : 'draft')}>
                                        <option value="">Select</option>
                                        <option value="Basic">Basic</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                      </select>
                                      <span className="input__label">Proficiency </span>
                                    </label>
                                  
                                    </div>
                                    <div className='col-2'>
                                    <div className='row'>
                                        <div className='col-sm-6'>

                                    {
                                      optionalSkills.length>1 &&
                                      <img src={Delete} alt="Delete" className="pointer ms-5 mt-2" onClick={() => onDeleteOptionalSkill(index)}/>
                                    }
                                     </div>
                                     <div className='col-sm-6'>

                                    {
                                     (optionalSkills.length-1===index)&&
                                    <img src={Add} alt="add" className='pointer ms-3 mt-2' onClick={onOptionalSkills} />
                                     }
                                   </div>
                                    </div>
                                    </div>
                                  </div>
                                })}
                              </div>
                            </div>
                            {optionalSkillsError && <p className="text-danger job_dis_form_label">{optionalSkillsError}</p>}
                          </div>
                        </div>
                      </div>
                      <div className='row mb-3'>
                        <div className='col-md-12 col-sm-12'>
                          <div className='row'>
                            <div className='col-6'>
                              <div className='me-2'>
                              <label className="input">
                              <input type="date" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" min={moment().add(1, 'day').format('YYYY-MM-DD')} id="dueDate" name='job_due_dt' defaultValue={currentJobData?.job_due_dt} placeholder="When this job should be completed" onChange={(event) => onChangeDueDate(event)} onBlur={() => autoSaveJob(currentJobData?.status ? currentJobData?.status : 'draft')} />
                                {dueDateError && <p className="text-danger job_dis_form_label">{dueDateError}</p>}
                               <span className="input__label">Due Date <span className='text-danger'>*</span></span>
                           </label>
                              
                              </div>
                            </div>
                            <div className='col-6'>
                              <div className='ms-3'>
                              <label className="input">
                              <select className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" aria-label="Default select example" name="status" value={currentJobData?.status} onChange={(event) => onChangeStatus(event)} onBlur={() => autoSaveJob(currentJobData?.status ? currentJobData?.status : 'draft')}>
                                  <option selected>Select status</option>
                                  <option value="active">Active</option>
                                  <option value="draft">Draft</option>
                                  <option value="archived">Archived</option>
                                </select>
                               <span className="input__label">Status <span className='text-danger'>*</span></span>
                             </label>
                            
                                {statusError && <p className="text-danger job_dis_form_label">{statusError}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='row mb-3'>
                        <div className='col-md-12 col-sm-12'>
                          <div className='row mt-2'>
                            <div className='col-6'>
                              <div className='me-2'>
                              <label className="input">
                              <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field"  name="positions" placeholder="  " value={positions} onChange={(event) => onChangePositions(event)} onBlur={() => autoSaveJob(currentJobData?.status ? currentJobData?.status : 'draft')}  />
                               <span className="input__label">Positions <span className='text-danger'>*</span></span>
                              </label>
                             
                                {positionsError && <p className="text-danger job_dis_form_label">{positionsError}</p>}
                              </div>
                            </div>
                            <div className='col-6'>
                              <div className='ms-2'>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-12 col-sm-12'>
                          <div className="mb-3">
                            <label className="form-label job_dis_form_label">Instructions to SMEs to ask during the interview <span className='text-danger'>*</span></label>
                            <DefaultEditor value={Instructions} onChange={(e) => onChangeInstructions(e, currentJobData)} />

                            {smeInstructionsError && <p className="text-danger job_dis_form_label">{smeInstructionsError}</p>}
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-12 col-sm-12'>
                          <div className='mb-3'>
                            <label className="form-label job_dis_form_label">Add team members to this project</label>
                            <Select
                              isMulti={true}
                              value={selectedTeamMeberList}
                              placeholder="Enter JD name"
                              onChange={(e) => onSelectTeamMember(e)}
                              options={allMembers}
                              className="search_dropdown"
                            />
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-12 col-sm-12'>
                          <div className='mb-3'>
                       
                            <label className="form-label job_dis_form_label">Add Hiring Manager to this project</label>
                            <ChipInput type={'email'} placeholder="Enter email addresses" items={selectedHiringManager.toString()} getChipsFieldData={(data) => onSelectHiringManager(data)}></ChipInput>
                          </div>
                        </div>
                      </div>
                      <div className='btns_row'>
                        <button type='button' className='large_btn_apply rounded' onClick={() => createJob('normal', '')}>Save Job Description</button>
                        <button type='button' className='large_btn_apply rounded ms-3' onClick={() => onCloseForm()}>Cancel</button>
                        <button type='button' className='large_btn_apply rounded ms-3' onClick={() => onAddCandidates()}>Add Candidates</button>
                        {selectedStatus === 'draft' && <button type='button' className='large_btn rounded mx-3' onClick={() => createJob('draft', '')}>Save as draft</button>}
                        {formError && <p className="text-danger job_dis_form_label">{formError}</p>}
                      </div>
                    </div>
                  </div>
                  <div className='col-lg-4 col-md-6 col-12 mx-auto'>
                    <div className='bg-white rounded-3 border_color p-2'>
                      <div className='job_discription_heading d-flex justify-content-between py-3 pe-5'>
                        <div className='my-auto'>
                          <label className="form-label job_dis_form_label"> Tags <span className='text-danger'>*</span></label>
                        </div>
                        <div className='my-auto'>
                        </div>
                      </div>
                      <div>
                        {currentJobData?.tags &&
                          <ChipInput type={'text'} placeholder="Type and press enter" items={currentJobData?.tags} isOutside={true} outSideText={''} getChipsFieldData={(data) => onChipData(data)}></ChipInput>
                        }
                        {!currentJobData?.tags &&
                          <ChipInput type={'text'} placeholder="Type and press enter" items={currentJobData?.tags} isOutside={true} outSideText={''} getChipsFieldData={(data) => onChipData(data)}></ChipInput>
                        }
                       
                      </div>
                    </div>

                  </div>
                </div>
              </form>
            </FormBuilder>
          </div>
        </div>
      </div>
    </div >
  )
}