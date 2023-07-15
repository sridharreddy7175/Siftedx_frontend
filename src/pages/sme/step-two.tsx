import React, { useEffect, useState } from 'react'
import FormBuilder from '../../components/form-builder';
import { useHistory, useParams } from 'react-router-dom';
import { LookUpService } from '../../app/service/lookup.service';
import { SmeService } from '../../app/service/sme.service';
import { AppLoader } from '../../components/loader';
import { toast } from 'react-toastify';
import LogoImg from "../../assets/images/siftedx_home_logo.png";
import { Modal } from 'react-bootstrap';
import Delete from "../../assets/icon_images/delete.png";
import Select from 'react-select';
import { Box, Step, StepButton, Stepper } from '@mui/material';
import AddUpdateSmeSkills from '../../components/sme/add-update-skills';
import { SXUserSkill } from '../../app/model/skills/user-skill';
import { PreparedSkill } from '../../app/model/skills/prepared-skill';
import { SXSkill } from '../../app/model/skills/sx-skill';
import { UsersService } from '../../app/service/users.service';

export const StepTwo = () => {
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const [categories, setCategories] = useState<any[]>([]);
    let { user } = useParams<{ user: string }>();
    const [addAnotherCategory, setAddAnotherCategory] = useState<any>([{
        category: '',
        candidateSkills: [
            {
                skill: '',
                experience: '',
                proficiency: ''
            }
        ]
    }]);
    const [formError, setFormError] = useState<any>('');
    const handleInput = (data: any) => { }
    const [isCategoryAdd, setIsCategoryAdd] = useState(false);
    const [skills, setSkills] = useState<any[]>([]);
    const [experienceList, setExperienceList] = useState<any[]>([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [enteredSkill, setEnteredSkill] = useState("");
    const [enteredSkillError, setEnteredSkillError] = useState("");
    const [enteredCategory, setEnteredCategory] = useState("");
    const [enteredCategoryError, setEnteredCategoryError] = useState("");
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<any>("");
    const [selectedSkillIndex, setSelectedSkillIndex] = useState<any>("");
    const steps = ['Personal', 'Skills', 'Cost'];
    const [activeStep, setActiveStep] = React.useState(1);
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});
    const [expertSkills, setExpertSkills] = useState<SXUserSkill[]>([]);
    const [advancedSkills, setAdvancedSkills] = useState<SXUserSkill[]>([]);
    const [basicSkills, setBasicSkills] = useState<SXUserSkill[]>([]);
    const [sxSkills, setSxSkills] = useState<SXSkill[]>([]);
    const [canShowPopup, setCanShowPopup] = useState(false);
    const [showItem, setShowItem] = useState(false)
    const handleShowClose = () => setShowItem(false)

    const handleSubmit = () => {
        setCanShowPopup(false);
        history.push("/home");
        localStorage.setItem('rememberMeData', '');
        sessionStorage.clear();
    }


    useEffect(() => {
        getSMESkills();
        getAllSkills();
    }, [])

    const getAllSkills = async () => {
        try {            
            const result = await LookUpService.getAllSkills();
            result.forEach((element: any) => {
                element.label = `${element?.skill}`;
                element.value = element.skill
              });
            setSxSkills(result);
        } catch (error) {
            
        }
    };

    const getSMESkills = () => {
        setLoading(true);
        const data: any = [];
        SmeService.getSmeSkillsById(user).then(res => {
            if (res.error) {
                toast.error(res?.error?.message);
                setLoading(false);
            } else {
                if (res.length > 0) {
                    setAddAnotherCategory([])
                    res.forEach((element: any) => {
                        element.experience = `${Number(element?.experience)}`
                    });
                    const basicSkills = res.filter((el: any) => el.proficiency === 'Basic');
                    const advancedSkills = res.filter((el: any) => el.proficiency === 'Advanced');
                    const expertSkills = res.filter((el: any) => el.proficiency === 'Expert');

                    setBasicSkills(basicSkills);
                    setAdvancedSkills(advancedSkills);
                    setExpertSkills(expertSkills);
                }
                setLoading(false);
            }
        })
    }

    useEffect(() => {
        getCategories();
    }, []);
    const getCategories = () => {
        const skillsData = addAnotherCategory;
        const experience = [];
        for (let index = 1; index <= 30; index++) {
            experience.push(index);
            setExperienceList([...experience])
        }
        LookUpService.jobcategories().then(
            res => {
                let data: any[] = [];
                res.push('{Add Category}');
                res.forEach((element: any) => {
                    data.push({
                        value: element,
                        label: element
                    })
                });
                setCategories([...data]);
                if (isCategoryAdd) {
                    skillsData[selectedCategoryIndex].categorysList = { label: enteredCategory, value: enteredCategory };
                    skillsData[selectedCategoryIndex].category = enteredCategory;
                    setAddAnotherCategory([...skillsData])
                }
            }
        )
    }

    const onCategory = (event: any, index: number) => {
        setSelectedCategoryIndex(index);
        setSkills([]);
        const data = addAnotherCategory;
        data[index].skills = [];
        setEnteredSkill("");
        setEnteredSkillError("");
        if (event) {
            data[index].error = '';
            if (event.value === '{Add Category}') {
            } else {
                const isCategoryExist = data.find((category: any) => category.category === event.value);
                if (isCategoryExist) {
                    data[index].error = 'Same category is added multiple times';
                } else {
                    LookUpService.skills(event?.value).then(
                        res => {
                            res.push({ category: '{Add Skill}', skill: '{Add Skill}' });
                            res.forEach((element: any) => {
                                element.value = element?.skill;
                                element.label = element?.skill;
                            });
                            setSkills(res);
                            data[index].skills = [...res];
                            setAddAnotherCategory([...data]);
                        }
                    )
                }
            }
            data[index].category = event;
            data[index].categorysList = event;
            setAddAnotherCategory([...data]);
        } else {
            data[index].error = 'Please select a category';
            setSkills([]);
        }
    }

    const onBack = () => {
        history.push(`/sme-step-one/${user}`);
    }

    const onSkillEnter = (event: any) => {
        setEnteredSkillError('');
        if (event.target.value) {
            setEnteredSkill(event.target.value);
        } else {
            setEnteredSkillError('Please enter skill');
        }
    }

    const onSaveSkill = () => {
        const skillsData = addAnotherCategory;
        setLoading(true);
        if (enteredSkill) {
            const data: any = {
                category: skillsData[selectedCategoryIndex].category,
                skill: enteredSkill
            }
            LookUpService.addSkillToCategory(data).then(res => {
                if (res?.error?.message) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    setLoading(false);
                    setShow(false);
                    onCategory({ label: skillsData[selectedCategoryIndex].category, value: skillsData[selectedCategoryIndex].category }, selectedCategoryIndex);
                    skillsData[selectedCategoryIndex].candidateSkills[selectedSkillIndex].skill = { label: enteredSkill, value: enteredSkill };
                    setAddAnotherCategory([...skillsData])
                }
            })
        } else {
            setLoading(false);
            setEnteredSkillError('Please enter skill');
        }
    }

    const onCategoryEnter = (event: any) => {
        setEnteredCategoryError('');
        if (event.target.value) {
            setEnteredCategory(event.target.value);
        } else {
            setEnteredCategoryError('Please enter category');
        }
    }

    const onSaveCategorySkill = () => {
        const skillsData = addAnotherCategory;
        setLoading(true);
        if (enteredSkill && enteredCategory) {
            const data: any = {
                category: enteredCategory,
                skill: enteredSkill
            }
            LookUpService.addSkillToCategory(data).then(res => {
                if (res?.error?.message) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    setIsCategoryAdd(true);
                    setLoading(false);
                    getCategories();
                    onCategory({ label: enteredCategory, value: enteredCategory }, selectedCategoryIndex);
                    // skillsData[selectedCategoryIndex].candidateSkills[selectedSkillIndex].skill = enteredSkill;
                    // skillsData[selectedCategoryIndex].categorysList = { label: enteredCategory, value: enteredCategory };
                    // setAddAnotherCategory([...skillsData])
                }
            })
        } else {
            setLoading(false);
            if (!enteredSkill) {
                setEnteredSkillError('Please enter skill');
            }
            if (!enteredCategory) {
                setEnteredCategoryError('Please enter category');
            }
        }
    }
    const saveSmeSkills = (data: PreparedSkill[]) => {
        const newSkills: SXSkill[] = [];
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            const isAlreadyExist = sxSkills.find(el => el.skill === element.skill);
            if (!isAlreadyExist) {
                newSkills.push({
                    uuid: '',
                    skill: element.skill,
                    category: '',
                    id: 0,
                    created_at: new Date(),
                    updated_dt: '',
                    created_by: ''
                });
            }
        }

        SmeService.addSmeSkills(data).then(
            async res => {
                if (res.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    try {
                        let loginUserData: any = JSON.parse(sessionStorage.getItem('loginData') || '{}');
                        if (loginUserData.profile_setup_status < 2) {
                            await UsersService.updateProfileCompleteStatus(2);
                        }
                    } catch (profile_step_err) {
                        console.error('Error while reading profile states ', profile_step_err);
                    }

                    history.push(`/sme-step-three/${user}`);
                    setLoading(false);
                    toast.success('Saved successfully');
                }
            }
        )
    }
    const onClickHome = () => {
        setShowItem(true)
    }
    return (
        <div>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-12' style={{ backgroundColor: "#000000", paddingTop: "10px", paddingBottom: "10px" }}>
                        <img src={LogoImg} alt="loading-logo" className='create_company_page_siftedx_log ms-3 ms-lg-5' />
                        <button className='text-end mt-3 mt-lg-2 me-4 me-lg-5  dashboard_names rounded-3 large_btn_apply' style={{ float: "right" }} onClick={() => { onClickHome() }}>Logout</button>

                    </div>
                </div>
                <div className='px-3 mx-3 mx-lg-5 bg-white rounded-3 mt-3 px-lg-5 pb-5 px-0 position-relative' style={{ height: 'calc(100vh - 140px)' }}>
                    <Stepper activeStep={activeStep} alternativeLabel className='w-50 w-sm-100 m-auto pt-4'>
                        {steps.map((label, index) => {
                            const stepProps: { completed?: boolean } = {};
                            const labelProps: {
                                optional?: React.ReactNode;
                            } = {};
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepButton color="black">
                                        {label}
                                    </StepButton>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <div className='mb-3 mt-5 mt-lg-0' style={{ height: 'calc(100% - 150px)', overflow: 'auto' }}>
                        <AddUpdateSmeSkills onClose={() => onBack()} basicSkills={basicSkills} advancedSkills={advancedSkills} expertSkills={expertSkills} onSave={saveSmeSkills} experienceList={experienceList} allSkills={sxSkills}></AddUpdateSmeSkills>
                    </div>
                </div>
                {/* </div> */}
                <div className="col-md-12 text-end mt-3">
                    <p className="copyright mx-5">Copyright © 2022 SiftedX. All Rights Reserved.</p>
                </div>
                {/* </div> */}
            </div>
            <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5 className='schedule_interview_modal_heading p-0 m-0'>Add Skill</h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <div className="my-4">
                        <div className='mt-4'>
                            <label className="input">
                                <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="current_company" name="current_company" placeholder=" " onChange={(e) => onSkillEnter(e)} />
                                <span className={`input__label`}>Add Skill</span>
                            </label>
                            {enteredSkillError && <p className="text-danger job_dis_form_label">{enteredSkillError}</p>}
                            <div className='col-md-12 mt-3 text-end'>
                                <button className='btn-signup rounded-3 me-3' onClick={handleClose}>Cancel</button>
                                <button className='large_btn_apply rounded-3' onClick={onSaveSkill}>Save</button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>

            <Modal show={showItem} onHide={handleShowClose} aria-labelledby="contained-modal-title-vcenter"
                className='sx-close w-100'
                size='sm'

                centered >
                <Modal.Header closeButton>
                    <Modal.Title>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <p className='top_para_styles p-0 m-0 text-center mt-3'>Are you sure you want to logout?</p>
                    <div className='row'>
                        <div className='col-6 px-3 py-3 mt-3'>
                            <button type="button" className="rounded text-decoration-none open_cv ps-3 pt-1 pb-1 pe-3 ms-2 ms-lg-0 ms-sm-2 fw-normal bg-transparent" onClick={() => handleShowClose()}>Cancel</button>

                        </div>
                        <div className='col-6 text-end px-3 py-3 mt-3'>
                            <button type="button" className="rounded text-decoration-none ps-4 pt-1 pb-1 pe-4 fw-normal upload_cv" onClick={handleSubmit}>Yes</button>

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>
        </div>
    )
}
