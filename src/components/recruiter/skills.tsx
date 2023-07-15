import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { PreparedSkill } from "../../app/model/skills/prepared-skill";
import { SXSkill } from "../../app/model/skills/sx-skill";
import { SXUserSkill } from "../../app/model/skills/user-skill";
import ADD_ICON from '../../assets/icon_images/Add.svg';
import DELETE_ICON from '../../assets/icon_images/delete.svg';
import SEARCH_ICON from '../../assets/icon_images/search.svg';
import INFO_ICON from '../../assets/icon_images/info icon.svg';
import  ENTER_ICON from '../../assets/icon_images/Enter Icon.svg';
import { Modal } from 'react-bootstrap';
import ValidationErrorMsgs from "../../app/utility/validation-error-msgs";
import ReactTooltip from "react-tooltip";
import { JobsService } from "../../app/service/jobs.service";
import { String } from "aws-sdk/clients/cloudhsm";
import { AppLoader } from "../loader";



interface Props {
    allSkills: SXSkill[];
    basicSkills: SXUserSkill[];
    expertSkills: SXUserSkill[];
    advancedSkills: SXUserSkill[];
    experienceList: number[];
    onSave: (data: PreparedSkill[]) => void;
    onClose: () => void;
    jobId: string;
}

interface SelectedSkill {
    skill: string;
    uuid: string;
    experience: number;
    // isNew: boolean;
    matchType: 'full' | 'partial' | 'no-match';
    matchedSklls: SXSkill[],
    inputSkill: string;
    hasError: boolean;
    isDuplicate: boolean;
    tooltip: string;
}

const Skills: React.FC<Props> = (props: Props) => {
    const [skillOptions, setSkillOptions] = useState<any[]>([]);
    const [searchedMandatorySkills, setSearchedMandatorySkills] = useState<SelectedSkill[]>([]);
    // const [searchedExpertSkills, setSearchedExpertSkills] = useState<SelectedSkill[]>([]);
    const [searchedOptionalSkills, setSearchedOptionalSkills] = useState<SelectedSkill[]>([]);
    // const [searchedAdvancedSkills, setSearchedAdvancedSkills] = useState<SelectedSkill[]>([]);
    // const [searchedBasicSkills, setSearchedBasicSkills] = useState<SelectedSkill[]>([]);
    // const [selectedExpertSkills, setSelectedExpertSkills] = useState<SelectedSkill[]>([]);
    const [selectedMandatorySkills, setSelectedMandatorySkills] = useState<SelectedSkill[]>([]);
    const [selectedOptionalSkills, setSelectedOptionalSkills] = useState<SelectedSkill[]>([]);
    // const [selectedAdvancedSkills, setSelectedAdvancedSkills] = useState<SelectedSkill[]>([]);
    // const [selectedBasicSkills, setSelectedBasicSkills] = useState<SelectedSkill[]>([]);
    // const [expertSkillsInput, setExpertSkillsInput] = useState('');
    const [mandatorySkillsInput, setMandatorySkillsInput] = useState('');
    const [optionalSkillsInput, setOptionalSkillsInput] = useState('');
    // const [advancedSkillsInput, setAdvancedSkillsInput] = useState('');
    // const [basicSkillsInput, setBasicSkillsInput] = useState('');
    // const [expertExperienceInput, setExpertExperienceInput] = useState("");
    const [mandatoryExperienceInput, setMandatoryExperienceInput] = useState("");
    // const [advancedExperienceInput, setAdvancedExperienceInput] = useState("");
    const [optionalExperienceInput, setOptionalExperienceInput] = useState("");
    // const [basicExperienceInput, setBasicExperienceInput] = useState("");
    const [mandatorySearchInput, setMandatorySearchInput] = useState("");
    // const [expertSearchInput, setExpertSearchInput] = useState("")
    // const [advancedSearchInput, setAdvancedSearchInput] = useState("");
    const [optionalSearchInput, setOptionalSearchInput] = useState("");
    // const [basicSearchInput, setBasicSearchInput] = useState("");
    const [showInstructionsPopup, setShowInstructionsPopup] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [experienceError, setExperienceError] = useState<{ mandatory: boolean; optional: boolean;  }>({
        mandatory: false,
        optional: false,
    });
    const [loading,setLoading]=useState(false)

    useEffect(() => {
        if(props.jobId){
            getJobDetailsId(props.jobId)
        }
    }, []);
    

    useEffect(() => {
        const skills = props.allSkills.map(el => {
            return {
                label: el.skill,
                value: el.skill,
                uuid: el.uuid
            }
        });
        setSkillOptions(skills);
        setSelectedOptionalSkills(props.advancedSkills.map(el => {
            return {

                skill: el.skill,
                uuid: el.uuid,
                experience: Number(el.experience),
                isNew: false,
                matchType: 'full',
                inputSkill: el.skill,
                hasError: false,
                matchedSklls: [],
                isDuplicate: false,
                tooltip: ValidationErrorMsgs.SKILL_RECOGNIZED
            }
        }));
        setSelectedMandatorySkills(props.expertSkills.map(el => {
            return {

                skill: el.skill,
                uuid: el.uuid,
                experience: Number(el.experience),
                isNew: false,
                matchType: 'full',
                inputSkill: el.skill,
                hasError: false,
                matchedSklls: [],
                isDuplicate: false,
                tooltip: ValidationErrorMsgs.SKILL_RECOGNIZED
            }
        }));
    }, [props.basicSkills, props.advancedSkills, props.expertSkills]);

    useEffect(() => {
        setSaveError('');
        if (mandatorySearchInput) {
            const skills = selectedMandatorySkills.filter(el => el.skill.indexOf(mandatorySearchInput) > -1)
            setSearchedMandatorySkills(skills);
        } else {

            setSearchedMandatorySkills(selectedMandatorySkills);
        }
        if (optionalSearchInput) {
            const skills = selectedOptionalSkills.filter(el => el.skill.indexOf(optionalSearchInput) > -1)
            setSearchedOptionalSkills(skills);
        } else {

            setSearchedOptionalSkills(selectedOptionalSkills);
        }
        // if (basicSearchInput) {
        //     const skills = selectedBasicSkills.filter(el => el.skill.indexOf(basicSearchInput) > -1)
        //     setSearchedBasicSkills(skills);
        // } else {
        //     setSearchedBasicSkills(selectedBasicSkills);
        // }
    }, [selectedMandatorySkills, selectedOptionalSkills]);

    useEffect(() => {
        ReactTooltip.rebuild();
    }, [searchedMandatorySkills, searchedOptionalSkills, ]);


    const getJobDetailsId = (jobId: string) => {
        setLoading(true)
        JobsService.getJobsByUuid(jobId).then((res) => {
          if (res?.error) {
            setLoading(false)
            // toast.error(res?.error?.message);
          } else {
            // console.log("res", res);
            let mandatorySkills_existing: string[] = [];
            let mandatoryExps_existing: number[] = [];
            let mandatoryProfs_existing: string[] = [];
            const mandatory_skills: SelectedSkill[] = [];
            let optionalSkills_existing: string[] = [];
            let optionalExps_existing: number[] = [];
            const optional_skills: SelectedSkill[] = [];
            if(res.job_mandatory_skills) {
                mandatorySkills_existing = res.job_mandatory_skills.split(',');
            }
            if(res.job_mandatory_skills_exp) {
                mandatoryExps_existing = res.job_mandatory_skills_exp.split(',').map((el: string)=> Number(el));
            }
            if(res.job_optional_skills) {
                optionalSkills_existing = res.job_optional_skills.split(',');
            }
            if(res.job_optional_skills_exp) {
                optionalExps_existing = res.job_optional_skills_exp.split(',').map((el: string)=> Number(el));
            }
            for (let index = 0; index < mandatorySkills_existing.length; index++) {
                const element = mandatorySkills_existing[index];
                const exp = mandatoryExps_existing[index] || 0;
                mandatory_skills.push({
                    inputSkill: element,
                    experience: exp,
                    hasError: false,
                    isDuplicate: false,
                    matchedSklls: [],
                    matchType: 'full',
                    skill: element,
                    tooltip: ValidationErrorMsgs.SKILL_RECOGNIZED,
                    uuid: `${Math.random() * 10000}-${index}`
                })
            }
            for (let index = 0; index < optionalSkills_existing.length; index++) {
                const element = optionalSkills_existing[index];
                const exp = optionalExps_existing[index] || 0;
                optional_skills.push({
                    inputSkill: element,
                    experience: exp,
                    hasError: false,
                    isDuplicate: false,
                    matchedSklls: [],
                    matchType: 'full',
                    skill: element,
                    tooltip: ValidationErrorMsgs.SKILL_RECOGNIZED,
                    uuid: `${Math.random() * 10000}-${index}`
                })
            }
            setLoading(false)
            setSelectedMandatorySkills(mandatory_skills);
            setSelectedOptionalSkills(optional_skills)
          }
        });
      };
      
    const onChangeSkillExperience = (e: any, skill: SelectedSkill) => {
        skill.experience = Number(e.target.value);
    }

    const onChangeMandatoryExperince = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        // console.log("target",target)
        setMandatoryExperienceInput(target.value);
        setExperienceError({ ...experienceError, mandatory: false });
    }

    const onChangeOptionalExperince = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        setOptionalExperienceInput(target.value);
        setExperienceError({ ...experienceError, optional: false });
    }

    // const onChangeBasicExperince = (e: SyntheticEvent) => {
    //     const target = e.target as HTMLInputElement;
    //     setBasicExperienceInput(target.value);
    //     setExperienceError({ ...experienceError, basic: false });
    // }

    const onClose = () => {
        props.onClose();
    }

    const onSaveSkills = () => {
        const userSkills: PreparedSkill[] = [];
        let hasMandatoryError = false;
        for (let index = 0; index < selectedMandatorySkills.length; index++) {
            const element = selectedMandatorySkills[index];
            const existingSkill = userSkills.find(el => el.skill === element.skill);
            if (!existingSkill) {
                if (element.matchedSklls.length > 1 && element.matchType === 'partial') {
                    if (element.skill === element.inputSkill && element.matchType === 'partial') {
                        hasMandatoryError = true;
                    }
                }
                if (!hasMandatoryError) {
                    userSkills.push({
                        skill: element.skill,
                        experience: element.experience,
                        proficiency: 'Mandatory'
                    });
                }
            }
        }
        if (!hasMandatoryError) {
            const duplicateSkill = selectedMandatorySkills.find(el => el.isDuplicate);
            if (duplicateSkill) {
                hasMandatoryError = true;
            }
        }

        let hasOptionalError = false;
        for (let index = 0; index < selectedOptionalSkills.length; index++) {
            const element = selectedOptionalSkills[index];
            const existingSkill = userSkills.find(el => el.skill === element.skill);
            if (!existingSkill) {
                if (element.matchedSklls.length > 1) {
                    if (element.skill === element.inputSkill && element.matchType === 'partial') {
                        hasOptionalError = true;
                    }
                }
                if (!hasOptionalError) {

                    userSkills.push({
                        skill: element.skill,
                        experience: element.experience,
                        proficiency: 'Optional'
                    });
                }
            }
        }
        if (!hasOptionalError) {
            const duplicateSkill = selectedOptionalSkills.find(el => el.isDuplicate);
            if (duplicateSkill) {
                hasOptionalError = true;
            }
        }

        // let hasBasicError = false;
        // for (let index = 0; index < selectedBasicSkills.length; index++) {
        //     const element = selectedBasicSkills[index];
        //     const existingSkill = userSkills.find(el => el.skill === element.skill);
        //     if (!existingSkill) {
        //         if (element.matchedSklls.length > 1) {
        //             if (element.skill === element.inputSkill && element.matchType === 'partial') {
        //                 hasBasicError = true;
        //             }
        //         }
        //         if (!hasBasicError) {
        //             userSkills.push({
        //                 skill: element.skill,
        //                 experience: element.experience,
        //                 proficiency: 'Basic'
        //             });
        //         }
        //     }
        // }
        // if (!hasBasicError) {
        //     const duplicateSkill = selectedBasicSkills.find(el => el.isDuplicate);
        //     if (duplicateSkill) {
        //         hasBasicError = true;
        //     }
        // }

        let hasNotAddedInput = mandatorySkillsInput.trim().length > 0 || optionalSkillsInput.trim().length > 0 

        if (hasMandatoryError) {
            setSaveError('You have error in expert skills');
        } else if (hasOptionalError) {
            setSaveError('You have error in advanced skills');
        } else if (hasNotAddedInput) {
            setSaveError(ValidationErrorMsgs.SKILL_NOT_ADDED);
        } else {
            props.onSave(userSkills);
        }
    }

    const onMandatorySkill = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        setMandatorySkillsInput(target.value);
    }

    const onOptionalSkill = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        setOptionalSkillsInput(target.value);
    }

    // const onBasicSkill = (e: SyntheticEvent) => {
    //     const target = e.target as HTMLInputElement;
    //     setBasicSkillsInput(target.value);
    // }

    const updateMandatorySkills = () => {
        if (mandatoryExperienceInput === '') {
            setExperienceError({ ...experienceError, mandatory: true });
            return;
        }
        setExperienceError({ ...experienceError, mandatory: false });
        let expertSkillsInputStr = mandatorySkillsInput.trim();
        if (!expertSkillsInputStr.length) {
            return;
        }
        const previousSKills = [...selectedMandatorySkills];
        // console.log("previous",previousSKills)
        const skills: string[] = expertSkillsInputStr.split(',');
        for (let index = 0; index < skills.length; index++) {
            const element = skills[index].trim();
            if (element) {
                const elementLowercase = element.toLowerCase();
                const existingPreviousSkill = previousSKills.find(el => el.skill.toLowerCase() === elementLowercase);
                const existingSkills = props.allSkills.filter(el => el.skill.toLowerCase().indexOf(elementLowercase) > -1);
                const fullMatchSkill = props.allSkills.find(el => el.skill.toLowerCase() === elementLowercase);

                if (!existingPreviousSkill) {
                    let uuid = `${Math.random() * 10000}-${index}`;
                    // let isNew = true;
                    let inputSkill = element;//.trim();
                    let matchType: "partial" | "full" | "no-match" = 'partial';
                    let initialSkill = inputSkill;
                    let isDuplicate = false;
                    let tooltip = ValidationErrorMsgs.SKILL_PARTIAL_MATCH;
                    if (fullMatchSkill) {
                        matchType = 'full';
                        tooltip = ValidationErrorMsgs.SKILL_RECOGNIZED;
                        initialSkill = fullMatchSkill.skill;
                        isDuplicate = selectedOptionalSkills.findIndex(el => el.skill.toLowerCase() === element.toLowerCase()) > -1;
                        // if (!isDuplicate) {
                        //     isDuplicate = selectedBasicSkills.findIndex(el => el.skill.toLowerCase() === element.toLowerCase()) > -1;
                        // }
                    } else if (existingSkills.length === 0) {
                        matchType = 'no-match';
                        tooltip = ValidationErrorMsgs.SKILL_UNRECOGNIZED;
                        isDuplicate = selectedOptionalSkills.findIndex(el => el.skill.toLowerCase() === element.toLowerCase()) > -1;
                        // if (!isDuplicate) {
                        //     isDuplicate = selectedBasicSkills.findIndex(el => el.skill.toLowerCase() === element.toLowerCase()) > -1;
                        // }
                    }
                    if (isDuplicate) {
                        tooltip = ValidationErrorMsgs.SKILL_DUPLICATE_DIFFERENT_CATEGORY;
                    }
                    previousSKills.push({
                        skill: initialSkill,
                        experience: Number(mandatoryExperienceInput),
                        uuid,
                        // isNew,
                        inputSkill,
                        matchedSklls: existingSkills,
                        matchType,
                        hasError: existingSkills.length > 0,
                        isDuplicate,
                        tooltip
                    });
                }
            }
        }
        setSelectedMandatorySkills(previousSKills);
        setMandatorySkillsInput('');
        setMandatoryExperienceInput('');
    }

    const updateOptionalSkills = () => {
        if (optionalExperienceInput=== '') {
            setExperienceError({ ...experienceError, optional: true });
            return;
        }
        setExperienceError({ ...experienceError, optional: false });
        let advancedSkillsInputStr = optionalSkillsInput.trim();
        if (!advancedSkillsInputStr.length) {
            return;
        }
        const previousSKills = [...selectedOptionalSkills];
        // console.log("previous",previousSKills)
        const skills: string[] = advancedSkillsInputStr.split(',');
        for (let index = 0; index < skills.length; index++) {
            const element = skills[index].trim();
            const elementLowercase = element.toLowerCase();
            const existingPreviousSkill = previousSKills.find(el => el.skill.toLowerCase() === elementLowercase);
            const existingSkills = props.allSkills.filter(el => el.skill.toLowerCase().indexOf(elementLowercase) > -1);
            const fullMatchSkill = props.allSkills.find(el => el.skill.toLowerCase() === elementLowercase);
            if (!existingPreviousSkill && element) {
                let uuid = `${Math.random() * 10000}-${index}`;
                // let isNew = true;
                const inputSkill = element.trim();
                let initialSkill = inputSkill;
                let matchType: "partial" | "full" | "no-match" = 'partial';
                let isDuplicate = false;
                let tooltip = ValidationErrorMsgs.SKILL_PARTIAL_MATCH;
                // console.log("MatchType",tooltip)

                if (fullMatchSkill) {
                    matchType = 'full';
                    initialSkill = fullMatchSkill.skill;
                    isDuplicate = selectedMandatorySkills.findIndex(el => el.skill.toLowerCase() === element.toLowerCase()) > -1;
                    // if (!isDuplicate) {
                    //     isDuplicate = selectedBasicSkills.findIndex(el => el.skill.toLowerCase() === element.toLowerCase()) > -1;
                    // }
                    tooltip = ValidationErrorMsgs.SKILL_RECOGNIZED;
                } else if (existingSkills.length === 0) {
                    matchType = 'no-match';
                    isDuplicate = selectedMandatorySkills.findIndex(el => el.skill.toLowerCase() === element.toLowerCase()) > -1;
                    // if (!isDuplicate) {
                    //     isDuplicate = selectedBasicSkills.findIndex(el => el.skill.toLowerCase() === element.toLowerCase()) > -1;
                    // }
                    tooltip = ValidationErrorMsgs.SKILL_UNRECOGNIZED;
                }
                if (isDuplicate) {
                    tooltip = ValidationErrorMsgs.SKILL_DUPLICATE_DIFFERENT_CATEGORY;
                }
                previousSKills.push({
                    skill: initialSkill,
                    experience: Number(optionalExperienceInput),
                    uuid,
                    // isNew,
                    inputSkill,
                    matchedSklls: existingSkills,
                    matchType,
                    hasError: existingSkills.length > 0,
                    isDuplicate,
                    tooltip
                });
            }
        }
        setSelectedOptionalSkills(previousSKills);
        setOptionalSkillsInput('');
        setOptionalExperienceInput('');
    }

    // const updateBasicSkills = () => {
    //     if (basicExperienceInput === '') {
    //         setExperienceError({ ...experienceError, basic: true });
    //         return;
    //     }
    //     setExperienceError({ ...experienceError, basic: false });
    //     let basicSkillsInputStr = basicSkillsInput.trim();
    //     if (!basicSkillsInputStr.length) {
    //         return;
    //     }
    //     const previousSKills = [...selectedBasicSkills];
    //     const skills: string[] = basicSkillsInputStr.split(',');
    //     for (let index = 0; index < skills.length; index++) {
    //         const element = skills[index].trim();
    //         const elementLowercase = element.toLowerCase();
    //         const existingPreviousSkill = previousSKills.find(el => el.skill.toLowerCase() === elementLowercase);
    //         const existingSkills = props.allSkills.filter(el => el.skill.toLowerCase().indexOf(elementLowercase) > -1);
    //         const fullMatchSkill = props.allSkills.find(el => el.skill.toLowerCase() === elementLowercase);
    //         if (!existingPreviousSkill && element) {
    //             let uuid = `${Math.random() * 10000}-${index}`;
    //             const inputSkill = element.trim();
    //             let matchType: "partial" | "full" | "no-match" = 'partial';
    //             let initialSkill = inputSkill;
    //             let isDuplicate = false;
    //             let tooltip = ValidationErrorMsgs.SKILL_PARTIAL_MATCH;
    //             if (fullMatchSkill) {
    //                 matchType = 'full';
    //                 initialSkill = fullMatchSkill.skill;
    //                 isDuplicate = selectedMandatorySkills.findIndex(el => el.skill.toLowerCase() === element.toLowerCase()) > -1;
    //                 if (!isDuplicate) {
    //                     isDuplicate = selectedAdvancedSkills.findIndex(el => el.skill.toLowerCase() === element.toLowerCase()) > -1;
    //                 }
    //                 tooltip = ValidationErrorMsgs.SKILL_RECOGNIZED;
    //             } else if (existingSkills.length === 0) {
    //                 matchType = 'no-match';
    //                 isDuplicate = selectedMandatorySkills.findIndex(el => el.skill.toLowerCase() === element.toLowerCase()) > -1;
    //                 if (!isDuplicate) {
    //                     isDuplicate = selectedAdvancedSkills.findIndex(el => el.skill.toLowerCase() === element.toLowerCase()) > -1;
    //                 }
    //                 tooltip = ValidationErrorMsgs.SKILL_UNRECOGNIZED;
    //             }
    //             if (isDuplicate) {
    //                 tooltip = ValidationErrorMsgs.SKILL_DUPLICATE_DIFFERENT_CATEGORY;
    //             }
    //             previousSKills.push({
    //                 skill: initialSkill,
    //                 experience: Number(basicExperienceInput),
    //                 uuid,
    //                 // isNew,
    //                 inputSkill,
    //                 matchedSklls: existingSkills,
    //                 matchType,
    //                 hasError: existingSkills.length > 0,
    //                 isDuplicate,
    //                 tooltip
    //             });
    //         }
    //     }
    //     setSelectedBasicSkills(previousSKills);
    //     setBasicSkillsInput('');
    //     setBasicExperienceInput('');
    // }

    const removeMandatorySkill = (index: number) => {
        const skills = [...selectedMandatorySkills];
        skills.splice(index, 1);
        // refreshAdvancedSkills(skills, selectedBasicSkills);
        // refreshBasicSkills(skills, selectedAdvancedSkills);
        setSelectedMandatorySkills(skills);
    }

    const removeOptionalSkill = (index: number) => {
        const skills = [...selectedOptionalSkills];
        skills.splice(index, 1);
        // refreshExpertSkills(skills, selectedBasicSkills);
        // refreshBasicSkills(selectedExpertSkills, skills);
        setSelectedOptionalSkills(skills);
    }

    // const removeBasicSkill = (index: number) => {
    //     const skills = [...selectedBasicSkills];
    //     skills.splice(index, 1);
    //     refreshExpertSkills(selectedAdvancedSkills, skills);
    //     refreshAdvancedSkills(selectedMandatorySkills, skills);
    //     setSelectedBasicSkills(skills);
    // }

    const onSearchMandatorySkill = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        setMandatorySearchInput(value);
        const skills = selectedMandatorySkills.filter(el => el.skill.toLowerCase().indexOf(value.toLocaleLowerCase()) > -1);
        setSearchedMandatorySkills(skills);
    }

    const onSearchOptionalSkill = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        setOptionalSearchInput(value);
        const skills = selectedOptionalSkills.filter(el => el.skill.toLowerCase().indexOf(value.toLocaleLowerCase()) > -1);
        setSearchedOptionalSkills(skills);
    }

    // const onSearchBasicSkill = (e: SyntheticEvent) => {
    //     const target = e.target as HTMLInputElement;
    //     const value = target.value;
    //     setBasicSearchInput(value);
    //     const skills = selectedBasicSkills.filter(el => el.skill.toLowerCase().indexOf(value.toLocaleLowerCase()) > -1);
    //     setSearchedBasicSkills(skills);
    // }

    const openInstructions = () => {
        setShowInstructionsPopup(true)

    }

    const onChangeMandatoryPartialSkill = (skillItem: SelectedSkill, event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        const skills = [...selectedMandatorySkills];
        const updatedSkillItem = skills.find(el => el === skillItem);
        if (target && updatedSkillItem) {
            skillItem.skill = target.value;
            updatedSkillItem.hasError = skillItem.skill === skillItem.inputSkill;
            if (!updatedSkillItem.hasError) {
                let isDuplicate = selectedOptionalSkills.findIndex(el => el.skill.toLowerCase() === updatedSkillItem.skill.toLowerCase()) > -1;
                // if (!isDuplicate) {
                //     isDuplicate = selectedBasicSkills.findIndex(el => el.skill.toLowerCase() === updatedSkillItem.skill.toLowerCase()) > -1;
                // }
                updatedSkillItem.tooltip = isDuplicate ? ValidationErrorMsgs.SKILL_DUPLICATE_SAME_CATEGORY : ValidationErrorMsgs.SKILL_PARTIAL_MATCH;
                updatedSkillItem.isDuplicate = isDuplicate;
                updatedSkillItem.hasError = isDuplicate;
            } else {
                updatedSkillItem.tooltip = ValidationErrorMsgs.SKILL_RECOGNIZED;
            }
        }
        setSelectedMandatorySkills(skills);
    }

    const onChangeOptionalPartialSkill = (skillItem: SelectedSkill, event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        const skills = [...selectedOptionalSkills];
        const updatedSkillItem = skills.find(el => el === skillItem);
        if (target && updatedSkillItem) {
            skillItem.skill = target.value;
            updatedSkillItem.hasError = skillItem.skill === skillItem.inputSkill;
            if (!updatedSkillItem.hasError) {
                let isDuplicate = selectedMandatorySkills.findIndex(el => el.skill.toLowerCase() === updatedSkillItem.skill.toLowerCase()) > -1;
                // if (!isDuplicate) {
                //     isDuplicate = selectedBasicSkills.findIndex(el => el.skill.toLowerCase() === updatedSkillItem.skill.toLowerCase()) > -1;
                // }
                updatedSkillItem.tooltip = isDuplicate ? ValidationErrorMsgs.SKILL_DUPLICATE_SAME_CATEGORY : ValidationErrorMsgs.SKILL_PARTIAL_MATCH;
                updatedSkillItem.isDuplicate = isDuplicate;
                updatedSkillItem.hasError = isDuplicate;
            } else {
                updatedSkillItem.tooltip = ValidationErrorMsgs.SKILL_RECOGNIZED;
            }
        }
        setSelectedOptionalSkills(skills);
    }

    // const onChangeBasicPartialSkill = (skillItem: SelectedSkill, event: SyntheticEvent) => {
    //     const target = event.target as HTMLInputElement;
    //     const skills = [...selectedBasicSkills];
    //     const updatedSkillItem = skills.find(el => el === skillItem);
    //     if (target && updatedSkillItem) {
    //         skillItem.skill = target.value;
    //         updatedSkillItem.hasError = skillItem.skill === skillItem.inputSkill;
    //         if (!updatedSkillItem.hasError) {
    //             let isDuplicate = selectedMandatorySkills.findIndex(el => el.skill.toLowerCase() === updatedSkillItem.skill.toLowerCase()) > -1;
    //             if (!isDuplicate) {
    //                 isDuplicate = selectedAdvancedSkills.findIndex(el => el.skill.toLowerCase() === updatedSkillItem.skill.toLowerCase()) > -1;
    //             }
    //             updatedSkillItem.tooltip = isDuplicate ? ValidationErrorMsgs.SKILL_DUPLICATE_SAME_CATEGORY : ValidationErrorMsgs.SKILL_PARTIAL_MATCH;
    //             updatedSkillItem.isDuplicate = isDuplicate;
    //             updatedSkillItem.hasError = isDuplicate;
    //         } else {
    //             updatedSkillItem.tooltip = ValidationErrorMsgs.SKILL_RECOGNIZED;
    //         }
    //     }
    //     setSelectedBasicSkills(skills);
    // }

    const refreshMandatorySkills = (pAdvancedSkills: SelectedSkill[], pBasicSkills: SelectedSkill[]) => {
        for (let index = 0; index < selectedMandatorySkills.length; index++) {
            const element = selectedMandatorySkills[index];
            let isDuplicate = pAdvancedSkills.findIndex(el => el.skill.toLowerCase() === element.skill.toLowerCase()) > -1;
            if (!isDuplicate) {
                isDuplicate = pBasicSkills.findIndex(el => el.skill.toLowerCase() === element.skill.toLowerCase()) > -1;
            }
            element.isDuplicate = isDuplicate;
            element.hasError = isDuplicate;
            if (isDuplicate) {
                element.tooltip = ValidationErrorMsgs.SKILL_DUPLICATE_DIFFERENT_CATEGORY;
            } else if (!element.hasError && element.matchType === 'partial') {
                element.hasError = element.skill === element.inputSkill;;
                if (element.hasError) {
                    element.tooltip = ValidationErrorMsgs.SKILL_PARTIAL_MATCH;
                } else {
                    element.tooltip = ValidationErrorMsgs.SKILL_RECOGNIZED;
                }
            }
        }
    }

    const refreshOptionalSkills = (pExpertSkills: SelectedSkill[], pBasicSkills: SelectedSkill[]) => {
        for (let index = 0; index < selectedOptionalSkills.length; index++) {
            const element = selectedOptionalSkills[index];
            let isDuplicate = pExpertSkills.findIndex(el => el.skill.toLowerCase() === element.skill.toLowerCase()) > -1;
            if (!isDuplicate) {
                isDuplicate = pBasicSkills.findIndex(el => el.skill.toLowerCase() === element.skill.toLowerCase()) > -1;
            }
            element.isDuplicate = isDuplicate;
            element.hasError = isDuplicate;
            if (isDuplicate) {
                element.tooltip = ValidationErrorMsgs.SKILL_DUPLICATE_DIFFERENT_CATEGORY;
            } else if (!element.hasError && element.matchType === 'partial') {
                element.hasError = element.skill === element.inputSkill;;
                if (element.hasError) {
                    element.tooltip = ValidationErrorMsgs.SKILL_PARTIAL_MATCH;
                } else {
                    element.tooltip = ValidationErrorMsgs.SKILL_RECOGNIZED;
                }
            }
        }
    }

    // const refreshBasicSkills = (pExpertSkills: SelectedSkill[], pAdvancedSkills: SelectedSkill[]) => {
    //     for (let index = 0; index < selectedBasicSkills.length; index++) {
    //         const element = selectedBasicSkills[index];
    //         let isDuplicate = pExpertSkills.findIndex(el => el.skill.toLowerCase() === element.skill.toLowerCase()) > -1;
    //         if (!isDuplicate) {
    //             isDuplicate = pAdvancedSkills.findIndex(el => el.skill.toLowerCase() === element.skill.toLowerCase()) > -1;
    //         }
    //         element.isDuplicate = isDuplicate;
    //         element.hasError = isDuplicate;
    //         if (isDuplicate) {
    //             element.tooltip = ValidationErrorMsgs.SKILL_DUPLICATE_DIFFERENT_CATEGORY;
    //         } else if (!element.hasError && element.matchType === 'partial') {
    //             element.hasError = element.skill === element.inputSkill;
    //             if (element.hasError) {
    //                 element.tooltip = ValidationErrorMsgs.SKILL_PARTIAL_MATCH;
    //             } else {
    //                 element.tooltip = ValidationErrorMsgs.SKILL_RECOGNIZED;
    //             }
    //         }
    //     }
    // }

    return <>
          {loading && <AppLoader loading={loading}></AppLoader>}

        <ReactTooltip place='bottom' type='light' effect='solid' border={true} borderColor={'#707070'} />
        {/* <div className='py-lg-2'> */}
            <div className='mb-1'>
                <div className='top_heading_styles'>What skills are needed for this job?</div>
                <div className='row'>
                    <div className='col-md-8'>
                        <p className="top_para_styles mb-0 mt-1">SMEs will be matched based on the skills</p>
                    </div>
                    <div className="col-md-4 text-lg-end mb-3 mb-lg-0 ms-lg-0 ps-1">
                        <b className="sx-text-primary pointer" onClick={() => openInstructions()}><img src={INFO_ICON} alt="info icon" className="me-1 mobile_info" /> Instructions to add skills</b>
                    </div>
                </div>
            </div>
            <div className="row mt-3 overflow-auto overflow-lg-hidden" style={ { height: 'calc(100% - 80px)' }}>
                <div className="col-12  col-lg-6 h-lg-100 pe-sm-0 pe-lg-3 pe-0 border-end border-end-sm-none overflow-auto pb-3 ">
                    <div className={`d-flex align-items-center py-3 ${experienceError.mandatory && 'pb-0'}`}>
                        <label className="input">
                            <input type="text" className="form-control job_dis_form_control px-3 rounded input__field" onChange={onMandatorySkill} value={mandatorySkillsInput} />
                            <span className={`input__label`}>Mandatory Skills</span>
                        </label>
                        <label className="input ps-2">
                            <select value={mandatoryExperienceInput} className="form-select job_dis_form_control ps-2 rounded down_arrow_bg_img input__field" onChange={onChangeMandatoryExperince}>
                                <option value="" disabled style={{ display: 'none' }}></option>
                                {props.experienceList.map((data: any, index: number) => { return <option key={index} value={data}>{data} yrs</option> })}
                            </select>
                            <span className={`input__label`}>Experience</span>
                        </label>
                        <div className="ps-3">
                            <span data-tip="Click to add skills" className=" h-100 sx-text-primary pointer ps-0 position-relative">
                                <img src={ENTER_ICON} alt="" onClick={updateMandatorySkills} className=" pointer" />
                            </span>
                        </div>
                    </div>
                    {experienceError.mandatory &&
                        <div className="d-flex">
                            <small className="w-100"></small>
                            <small className="w-100 text-danger pt-2 pb-2">Please select experience</small>
                        </div>
                    }
                    {
                        selectedMandatorySkills.length > 1 &&
                        <label className="input mt-4">
                            <input type="text" className="form-control job_dis_form_control px-3 rounded input__field" placeholder="Search Skill" onChange={onSearchMandatorySkill} value={mandatorySearchInput} />
                            <span className={`input__label input__label_disabled`}>Search Skill
                            </span>
                            <img src={SEARCH_ICON} alt="" 
                            // onClick={updateBasicSkills} 
                            className="ps-3 pointer search_skills" />

                        </label>

                    }

                    {
                        searchedMandatorySkills.map((mandatorySkill, skill_index: number) => {
                            return <div className="d-flex align-items-center mt-4" key={mandatorySkill.uuid}>
                                <label className="input pe-2" data-tip={mandatorySkill.tooltip}>
                                    {
                                        mandatorySkill.matchType === 'full' &&
                                        <input type="text" className={`border-3 form-control job_dis_form_control px-3 rounded input__field ${ mandatorySkill.isDuplicate ? 'is-invalid' : 'sx-border-clr'}`} placeholder="Skill" defaultValue={mandatorySkill.skill} disabled />
                                    }
                                    {
                                        mandatorySkill.matchType === 'partial' &&
                                        <select onChange={(e) => onChangeMandatoryPartialSkill(mandatorySkill, e)}
                                            className={`form-select job_dis_form_control ps-2 rounded down_arrow_bg_img input__field ${ mandatorySkill.hasError ? 'is-invalid' : 'sx-border-clr border-3'}`}>
                                            <option value={mandatorySkill.inputSkill}>{mandatorySkill.inputSkill}</option>
                                            {
                                                mandatorySkill.matchedSklls.map(el => <option value={el.skill}>
                                                    {el.skill}
                                                </option>)
                                            }
                                        </select>
                                    }
                                    {
                                         mandatorySkill.matchType === 'no-match' &&
                                        <input type="text" className="border-3 form-control job_dis_form_control px-3 rounded input__field" placeholder="Skill" defaultValue={  mandatorySkill.skill} disabled />
                                    }
                                    <span className={`input__label input__label_disabled`}>Skill</span>
                                </label>
                                <label className="input">
                                    <select defaultValue={ mandatorySkill.experience} className="form-select job_dis_form_control ps-2 rounded down_arrow_bg_img input__field" onChange={(e) => onChangeSkillExperience(e,  mandatorySkill)}>
                                        {props.experienceList.map((data: any, index: number) => { return <option key={index} value={data}>{data} yrs</option> })}
                                    </select>
                                    <span className={`input__label`}>Experience</span>
                                </label>
                                <img src={DELETE_ICON} alt="" onClick={() => removeMandatorySkill(skill_index)} className="ps-3 pointer" />
                            </div>
                        })
                    }
                </div>
                <hr className="d-block d-lg-none my-5"></hr>
                <div className="col-12  col-lg-6 h-lg-100 pe-sm-0 pe-lg-3 pe-0 ps-0 ps-sm-0 ps-lg-3 border-end border-end-sm-none px-3 overflow-auto pb-3">
                    <div className={`d-flex align-items-center py-3 ${experienceError.optional && 'pb-0'}`}>
                        <label className="input">
                            <input type="text" className="form-control job_dis_form_control px-3 rounded input__field" onChange={onOptionalSkill} value={optionalSkillsInput} />
                            <span className={`input__label`}>Optional Skills</span>
                        </label>
                        {/* <i className="fa fa-plus pointer" onClick={updateAdvancedSkills}></i> */}
                        <label className="input ps-2">
                            <select value={optionalExperienceInput} className="form-select job_dis_form_control ps-2 rounded down_arrow_bg_img input__field" onChange={onChangeOptionalExperince}>
                                <option value="" disabled style={{ display: 'none' }}></option>
                                {props.experienceList.map((data: any, index: number) => { return <option key={index} value={data}>{data} yrs</option> })}
                            </select>
                            <span className={`input__label`}>Experience</span>
                            {/* {experienceError.advanced && <small className="text-danger position-absolute mt-2 mb-2">Please select experience</small>} */}
                        </label>

                        <div className="ps-3">
                            <span data-tip="Click to add skills" className=" h-100 sx-text-primary pointer ps-0 position-relative">
                                <img src={ENTER_ICON} alt="" onClick={updateOptionalSkills} className="pointer" />

                            </span>
                        </div>

                    </div>
                    {experienceError.optional &&
                        <div className="d-flex">
                            <small className="w-100"></small>
                            <small className="w-100 text-danger pt-2 pb-2">Please select experience</small>
                        </div>
                    }


                    {
                        selectedOptionalSkills.length > 1 &&
                        <label className="input mt-4">
                            <input type="text" className="form-control job_dis_form_control px-3 rounded input__field" placeholder="Search Skill" onChange={onSearchOptionalSkill} value={optionalSearchInput} />
                            <span className={`input__label input__label_disabled`}>Search Skill</span>
                            <img src={SEARCH_ICON} alt=""
                            //  onClick={updateBasicSkills} 
                             className="ps-3 pointer search_skills" />

                        </label>
                    }

                    {
                        searchedOptionalSkills.map((optionalSkill, skill_index: number) => {
                            // console.log("Optional skills",optionalSkill)
                            return <div className="d-flex align-items-center mt-4" key={optionalSkill.uuid}>
                                <label className="input pe-2" data-tip={optionalSkill.tooltip}>
                                    {
                                        optionalSkill.matchType === 'full' &&
                                        <input type="text" className={`border-3 form-control job_dis_form_control px-3 rounded input__field ${optionalSkill.isDuplicate ? 'is-invalid' : 'sx-border-clr'}`} placeholder="Skill" defaultValue={optionalSkill.skill} disabled />
                                    }
                                    {
                                        optionalSkill.matchType === 'partial' &&
                                        <select onChange={(e) => onChangeOptionalPartialSkill(optionalSkill, e)}
                                            className={`form-select job_dis_form_control ps-2 rounded down_arrow_bg_img input__field ${optionalSkill.hasError ? 'is-invalid' : 'sx-border-clr border-3'}`}>
                                            <option value={optionalSkill.inputSkill}>{optionalSkill.inputSkill}</option>
                                            {
                                                optionalSkill.matchedSklls.map(el => <option value={el.skill}>
                                                    {el.skill}
                                                </option>)
                                            }
                                        </select>
                                    }
                                    {
                                        optionalSkill.matchType === 'no-match' &&
                                        <input type="text" className={`form-control job_dis_form_control px-3 rounded input__field border-3 ${optionalSkill.isDuplicate ? 'is-invalid' : ''}`} placeholder="Skill" defaultValue={optionalSkill.skill} disabled />
                                    }
                                    <span className={`input__label input__label_disabled`}>Skill</span>
                                </label>
                                <label className="input">
                                    <select defaultValue={optionalSkill.experience} className="form-select job_dis_form_control ps-2 rounded down_arrow_bg_img input__field" onChange={(e) => onChangeSkillExperience(e, optionalSkill)}>
                                        {props.experienceList.map((data: any, index: number) => { return <option key={index} value={data}>{data} yrs</option> })}
                                    </select>
                                    <span className={`input__label`}>Experience</span>
                                </label>
                                <img src={DELETE_ICON} alt="" onClick={() => removeOptionalSkill(skill_index)} className="ps-3 pointer" />
                            </div>
                        })
                    }
                </div>
                <hr className="d-block d-lg-none my-5"></hr>
            </div>
            <div className={`row position-absolute px-3 px-lg-5 bottom-30 bottom-sm-20`} style={{width: '100%', left: 0}}>
                <div className='col-md-6 col-6  mt-5 mt-lg-0 mt-sm-4'>
                    <button className='btn-signup rounded me-2' type="button" onClick={onClose}>Previous</button>
                </div>
                <div className='col-md-6 col-6 text-end mt-5 mt-lg-0 mt-sm-4 pe-2'>
                    {saveError && <span className="d-none d-lg-inline">
                    {saveError === ValidationErrorMsgs.SKILL_NOT_ADDED?<small className="text-danger me-3">Please click the <img src={ENTER_ICON} alt="" /> to add your skills</small> : <small className="text-danger me-3">{saveError}</small>}
                    </span>}
                    <button className='large_btn_apply rounded me-2' type="button" onClick={onSaveSkills}>Save & Next</button>
                </div>
                {saveError && <div className="col-12 mt-2 text-end">
                <span className="d-block d-lg-none">
                    {saveError === ValidationErrorMsgs.SKILL_NOT_ADDED?<small className="text-danger me-3">Please click the <img src={ENTER_ICON} alt="" /> to add your skills</small> : <small className="text-danger me-3">{saveError}</small>}
                    </span>
                </div>}
            </div>

            <Modal
                show={showInstructionsPopup}
                onHide={() => setShowInstructionsPopup(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                size="xl"
                className="sx-close px-4"
                backdropClassName='z-index-1055'
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className=''>
                        <div className='py-3'>
                            <div className='my-2'>

                                <div className='container-fluid'>
                                    <div className='row align-items-center'>
                                        <div className='col-12'>
                                            <div className="mx-lg-5">
                                                <p className="ms-3 top_heading_styles">Instructions to add skills</p>
                                                <ol className="top_para_styles">
                                                   <li>Please type the mandatory and options skills, separated by comma.</li>
                                                    <li>Years of experience next to the skills can be used to apply same years of experience to all skills typed in
                                                        that category. This can be edited per individual skill as well once added.
                                                    </li>
                                                    <li>Once all skills are typed with comma separation, click enter to populate them below. Skills recognized by the 
                                                        platform are highlighted with a yellow border and the skills not recognized are highlighted with grey border
                                                        which are automatically added to the system as new skills.
                                                    </li>
                                                    <li>
                                                        Interviewers are matched based on skills in mandatory and optional categories, irrespective of 
                                                        whether recognized or not.
                                                    </li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                </Modal.Body>

            </Modal>
        {/* </div> */}
    </>
}

export default Skills;