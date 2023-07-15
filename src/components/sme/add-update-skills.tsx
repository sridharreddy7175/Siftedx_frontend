import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
// import Select from "react-select";
// import Creatable from 'react-select/creatable';
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
import Select from "react-select";
import Creatable from 'react-select/creatable';



interface Props {
    allSkills: SXSkill[];
    basicSkills: SXUserSkill[];
    expertSkills: SXUserSkill[];
    advancedSkills: SXUserSkill[];
    experienceList: number[];
    onSave: (data: PreparedSkill[]) => void;
    onClose: () => void;
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

const AddUpdateSmeSkills: React.FC<Props> = (props: Props) => {
    const [skillOptions, setSkillOptions] = useState<any[]>([]);
    const [searchedExpertSkills, setSearchedExpertSkills] = useState<SelectedSkill[]>([]);
    const [searchedAdvancedSkills, setSearchedAdvancedSkills] = useState<SelectedSkill[]>([]);
    const [searchedBasicSkills, setSearchedBasicSkills] = useState<SelectedSkill[]>([]);
    const [selectedExpertSkills, setSelectedExpertSkills] = useState<SelectedSkill[]>([]);
    const [selectedAdvancedSkills, setSelectedAdvancedSkills] = useState<SelectedSkill[]>([]);
    const [selectedBasicSkills, setSelectedBasicSkills] = useState<SelectedSkill[]>([]);
    const [expertSkillsInput, setExpertSkillsInput] = useState<any>([]);
    const [advancedSkillsInput, setAdvancedSkillsInput] = useState<any>([]);
    const [basicSkillsInput, setBasicSkillsInput] = useState<any>([]);
    const [expertExperienceInput, setExpertExperienceInput] = useState("");
    const [advancedExperienceInput, setAdvancedExperienceInput] = useState("");
    const [basicExperienceInput, setBasicExperienceInput] = useState("");
    const [expertSearchInput, setExpertSearchInput] = useState("");
    const [advancedSearchInput, setAdvancedSearchInput] = useState("");
    const [basicSearchInput, setBasicSearchInput] = useState("");
    const [showInstructionsPopup, setShowInstructionsPopup] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<any>('');
    const [experienceError, setExperienceError] = useState<{ expert: boolean; advanced: boolean; basic: boolean }>({
        expert: false,
        advanced: false,
        basic: false
    });

    useEffect(() => {
        const skills = props.allSkills.map(el => {
            return {
                label: el.skill,
                value: el.skill,
                uuid: el.uuid
            }
        });
        setSkillOptions(skills);
        setSelectedBasicSkills(props.basicSkills.map(el => {
            return {
                skill: el.skill,
                uuid: el.uuid,
                experience: Number(el.experience),
                isNew: false,
                matchType: 'full',
                matchedSklls: [],
                hasError: false,
                inputSkill: el.skill,
                isDuplicate: false,
                tooltip: ValidationErrorMsgs.SKILL_RECOGNIZED
            }
        }));
        setSelectedAdvancedSkills(props.advancedSkills.map(el => {
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
        setSelectedExpertSkills(props.expertSkills.map(el => {
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
        if (expertSearchInput) {
            const skills = selectedExpertSkills.filter(el => el.skill.indexOf(expertSearchInput) > -1)
            setSearchedExpertSkills(skills);
        } else {

            setSearchedExpertSkills(selectedExpertSkills);
        }
        if (advancedSearchInput) {
            const skills = selectedAdvancedSkills.filter(el => el.skill.indexOf(advancedSearchInput) > -1)
            setSearchedAdvancedSkills(skills);
        } else {

            setSearchedAdvancedSkills(selectedAdvancedSkills);
        }
        if (basicSearchInput) {
            const skills = selectedBasicSkills.filter(el => el.skill.indexOf(basicSearchInput) > -1)
            setSearchedBasicSkills(skills);
        } else {
            setSearchedBasicSkills(selectedBasicSkills);
        }
    }, [selectedExpertSkills, selectedAdvancedSkills, selectedBasicSkills]);

    useEffect(() => {
        ReactTooltip.rebuild();
    }, [searchedExpertSkills, searchedAdvancedSkills, searchedBasicSkills]);


    const onChangeSkillExperience = (e: any, skill: SelectedSkill) => {
        skill.experience = Number(e.target.value);
    }

    const onChangeExpertExperince = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        setExpertExperienceInput(target.value);
        setExperienceError({ ...experienceError, expert: false });
    }

    const onChangeAdvancedExperince = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        setAdvancedExperienceInput(target.value);
        setExperienceError({ ...experienceError, advanced: false });
    }

    const onChangeBasicExperince = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        setBasicExperienceInput(target.value);
        setExperienceError({ ...experienceError, basic: false });
    }

    const onClose = () => {
        props.onClose();
    }

    const onSaveSkills = () => {
        const userSkills: PreparedSkill[] = [];
        let hasExpertError = false;
        for (let index = 0; index < selectedExpertSkills.length; index++) {
            const element = selectedExpertSkills[index];
            const existingSkill = userSkills.find(el => el.skill === element.skill);
            if (!existingSkill) {
                if (element.matchedSklls.length > 1 && element.matchType === 'partial') {
                    if (element.skill === element.inputSkill) {
                        hasExpertError = true;
                    }
                }
                if (!hasExpertError) {
                    userSkills.push({
                        skill: element.skill,
                        experience: element.experience,
                        proficiency: 'Expert'
                    });
                }
            }
        }
        if (!hasExpertError) {
            const duplicateSkill = selectedExpertSkills.find(el => el.isDuplicate);
            if (duplicateSkill) {
                hasExpertError = true;
            }
        }

        let hasAdvancedError = false;
        for (let index = 0; index < selectedAdvancedSkills.length; index++) {
            const element = selectedAdvancedSkills[index];
            const existingSkill = userSkills.find(el => el.skill === element.skill);
            if (!existingSkill) {
                if (element.matchedSklls.length > 1) {
                    if (element.skill === element.inputSkill && element.matchType === 'partial') {
                        hasAdvancedError = true;
                    }
                }
                if (!hasAdvancedError) {

                    userSkills.push({
                        skill: element.skill,
                        experience: element.experience,
                        proficiency: 'Advanced'
                    });
                }
            }
        }
        if (!hasAdvancedError) {
            const duplicateSkill = selectedAdvancedSkills.find(el => el.isDuplicate);
            if (duplicateSkill) {
                hasAdvancedError = true;
            }
        }

        let hasBasicError = false;
        for (let index = 0; index < selectedBasicSkills.length; index++) {
            const element = selectedBasicSkills[index];
            const existingSkill = userSkills.find(el => el.skill === element.skill);
            if (!existingSkill) {
                if (element.matchedSklls.length > 1) {
                    if (element.skill === element.inputSkill && element.matchType === 'partial') {
                        hasBasicError = true;
                    }
                }
                if (!hasBasicError) {
                    userSkills.push({
                        skill: element.skill,
                        experience: element.experience,
                        proficiency: 'Basic'
                    });
                }
            }
        }
        if (!hasBasicError) {
            const duplicateSkill = selectedBasicSkills.find(el => el.isDuplicate);
            if (duplicateSkill) {
                hasBasicError = true;
            }
        }

        let hasNotAddedInput = expertSkillsInput.length > 0 || advancedSkillsInput.length > 0 || basicSkillsInput.length > 0;

        if (hasExpertError) {
            setSaveError('You have error in expert skills');
        } else if (hasAdvancedError) {
            setSaveError('You have error in advanced skills');
        } else if (hasBasicError) {
            setSaveError('You have error in basic skills');
        } else if (hasNotAddedInput) {
            setSaveError(ValidationErrorMsgs.SKILL_NOT_ADDED);
        } else {
            props.onSave(userSkills);
        }
    }

    const onExpertSkill = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        setExpertSkillsInput(target.value);
    }

    const onAdvancedSkill = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        setAdvancedSkillsInput(target.value);
    }

    const onBasicSkill = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        setBasicSkillsInput(target.value);
    }

    const updateExpertSkills = () => {
        if (expertExperienceInput === '') {
            setExperienceError({ ...experienceError, expert: true });
            return;
        }
        setExperienceError({ ...experienceError, expert: false });
        if (!expertSkillsInput.length) {
            return;
        }
        const previousSKills = [...selectedExpertSkills];
        // const skills: string[] = expertSkillsInputStr.split(',');
        const skills: string[] = expertSkillsInput.map((el: any)=>el.value);

        for (let index = 0; index < skills.length; index++) {
            // const element = skills[index].trim();
            const element:any = skills[index]
            if (element) {
                const elementLowercase = element.toLowerCase();
                // const elementLowercase = element.skill.toLowerCase()
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
                        isDuplicate = selectedAdvancedSkills.findIndex(el => el.skill.toLowerCase() === elementLowercase.toLowerCase()) > -1;
                        if (!isDuplicate) {
                            isDuplicate = selectedBasicSkills.findIndex(el => el.skill.toLowerCase() === elementLowercase.toLowerCase()) > -1;
                        }
                    } else if (existingSkills.length === 0) {
                        matchType = 'no-match';
                        tooltip = ValidationErrorMsgs.SKILL_UNRECOGNIZED;
                        // isDuplicate = selectedAdvancedSkills.findIndex(el => el.skill.toLowerCase() === element.toLowerCase()) > -1;
                        isDuplicate = selectedAdvancedSkills.findIndex(el => el.skill.toLowerCase() === elementLowercase.toLowerCase()) > -1;

                        if (!isDuplicate) {
                            isDuplicate = selectedBasicSkills.findIndex(el => el.skill.toLowerCase() === elementLowercase.toLowerCase()) > -1;
                        }
                    }
                    if (isDuplicate) {
                        tooltip = ValidationErrorMsgs.SKILL_DUPLICATE_DIFFERENT_CATEGORY;
                    }
                    previousSKills.push({
                        skill: initialSkill,
                        experience: Number(expertExperienceInput),
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
        setSelectedExpertSkills(previousSKills);
        setExpertSkillsInput('');
        setExpertExperienceInput('');
    }

    const updateAdvancedSkills = () => {
        if (advancedExperienceInput === '') {
            setExperienceError({ ...experienceError, advanced: true });
            return;
        }
        setExperienceError({ ...experienceError, advanced: false });
        // let advancedSkillsInputStr = advancedSkillsInput.trim();
        // let advancedSkillsInputStr = advancedSkillsInput
        if (!advancedSkillsInput.length) {
            return;
        }
        const previousSKills = [...selectedAdvancedSkills];
        // const skills: string[] = advancedSkillsInputStr.split(',');
        const skills: string[] = advancedSkillsInput.map((el: any)=>el.value);
        for (let index = 0; index < skills.length; index++) {
            // const element = skills[index].trim();
            const element:any = skills[index]
            const elementLowercase = element.toLowerCase();
            const existingPreviousSkill = previousSKills.find(el => el.skill.toLowerCase() === elementLowercase);
            const existingSkills = props.allSkills.filter(el => el.skill.toLowerCase().indexOf(elementLowercase) > -1);
            const fullMatchSkill = props.allSkills.find(el => el.skill.toLowerCase() === elementLowercase);
            if (!existingPreviousSkill && element) {
                let uuid = `${Math.random() * 10000}-${index}`;
                // let isNew = true;
                // const inputSkill = element.trim();
                const inputSkill = element
                let initialSkill = inputSkill;
                let matchType: "partial" | "full" | "no-match" = 'partial';
                let isDuplicate = false;
                let tooltip = ValidationErrorMsgs.SKILL_PARTIAL_MATCH;
                
                if (fullMatchSkill) {
                    matchType = 'full';
                    initialSkill = fullMatchSkill.skill;
                    isDuplicate = selectedExpertSkills.findIndex(el => el.skill.toLowerCase() === elementLowercase.toLowerCase()) > -1;
                    if (!isDuplicate) {
                        isDuplicate = selectedBasicSkills.findIndex(el => el.skill.toLowerCase() === elementLowercase.toLowerCase()) > -1;
                    }
                    tooltip = ValidationErrorMsgs.SKILL_RECOGNIZED;
                } else if (existingSkills.length === 0) {
                    matchType = 'no-match';
                    isDuplicate = selectedExpertSkills.findIndex(el => el.skill.toLowerCase() === elementLowercase.toLowerCase()) > -1;
                    if (!isDuplicate) {
                        isDuplicate = selectedBasicSkills.findIndex(el => el.skill.toLowerCase() === elementLowercase.toLowerCase()) > -1;
                    }
                    tooltip = ValidationErrorMsgs.SKILL_UNRECOGNIZED;
                }
                if (isDuplicate) {
                    tooltip = ValidationErrorMsgs.SKILL_DUPLICATE_DIFFERENT_CATEGORY;
                }
                previousSKills.push({
                    skill: initialSkill,
                    experience: Number(advancedExperienceInput),
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
        setSelectedAdvancedSkills(previousSKills);
        setAdvancedSkillsInput('');
        setAdvancedExperienceInput('');
    }

    const updateBasicSkills = () => {
        if (basicExperienceInput === '') {
            setExperienceError({ ...experienceError, basic: true });
            return;
        }
        setExperienceError({ ...experienceError, basic: false });
        // let basicSkillsInputStr = basicSkillsInput.trim();
        // let basicSkillsInputStr = basicSkillsInput
        if (!basicSkillsInput.length) {
            return;
        }
        const previousSKills = [...selectedBasicSkills];
        // const skills: string[] = basicSkillsInputStr.split(',');
        const skills: string[] = basicSkillsInput.map((el: any)=>el.value);
        for (let index = 0; index < skills.length; index++) {
            // const element = skills[index].trim();
            const element:any = skills[index]
            const elementLowercase = element.toLowerCase();
            const existingPreviousSkill = previousSKills.find(el => el.skill.toLowerCase() === elementLowercase);
            const existingSkills = props.allSkills.filter(el => el.skill.toLowerCase().indexOf(elementLowercase) > -1);
            const fullMatchSkill = props.allSkills.find(el => el.skill.toLowerCase() === elementLowercase);
            if (!existingPreviousSkill && element) {
                let uuid = `${Math.random() * 10000}-${index}`;
                // const inputSkill = element.trim();
                const inputSkill = element
                let matchType: "partial" | "full" | "no-match" = 'partial';
                let initialSkill = inputSkill;
                let isDuplicate = false;
                let tooltip = ValidationErrorMsgs.SKILL_PARTIAL_MATCH;
                if (fullMatchSkill) {
                    matchType = 'full';
                    initialSkill = fullMatchSkill.skill;
                    isDuplicate = selectedExpertSkills.findIndex(el => el.skill.toLowerCase() === elementLowercase.toLowerCase()) > -1;
                    if (!isDuplicate) {
                        isDuplicate = selectedAdvancedSkills.findIndex(el => el.skill.toLowerCase() === elementLowercase.toLowerCase()) > -1;
                    }
                    tooltip = ValidationErrorMsgs.SKILL_RECOGNIZED;
                } else if (existingSkills.length === 0) {
                    matchType = 'no-match';
                    isDuplicate = selectedExpertSkills.findIndex(el => el.skill.toLowerCase() === elementLowercase.toLowerCase()) > -1;
                    if (!isDuplicate) {
                        isDuplicate = selectedAdvancedSkills.findIndex(el => el.skill.toLowerCase() === elementLowercase.toLowerCase()) > -1;
                    }
                    tooltip = ValidationErrorMsgs.SKILL_UNRECOGNIZED;
                }
                if (isDuplicate) {
                    tooltip = ValidationErrorMsgs.SKILL_DUPLICATE_DIFFERENT_CATEGORY;
                }
                previousSKills.push({
                    skill: initialSkill,
                    experience: Number(basicExperienceInput),
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
        setSelectedBasicSkills(previousSKills);
        setBasicSkillsInput('');
        setBasicExperienceInput('');
    }

    const removeExpertSkill = (index: number) => {
        const skills = [...selectedExpertSkills];
        skills.splice(index, 1);
        refreshAdvancedSkills(skills, selectedBasicSkills);
        refreshBasicSkills(skills, selectedAdvancedSkills);
        setSelectedExpertSkills(skills);
    }

    const removeAdvancedSkill = (index: number) => {
        const skills = [...selectedAdvancedSkills];
        skills.splice(index, 1);
        refreshExpertSkills(skills, selectedBasicSkills);
        refreshBasicSkills(selectedExpertSkills, skills);
        setSelectedAdvancedSkills(skills);
    }

    const removeBasicSkill = (index: number) => {
        const skills = [...selectedBasicSkills];
        skills.splice(index, 1);
        refreshExpertSkills(selectedAdvancedSkills, skills);
        refreshAdvancedSkills(selectedExpertSkills, skills);
        setSelectedBasicSkills(skills);
    }

    const onSearchExpertSkill = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        setExpertSearchInput(value);
        const skills = selectedExpertSkills.filter(el => el.skill.toLowerCase().indexOf(value.toLocaleLowerCase()) > -1);
        setSearchedExpertSkills(skills);
    }

    const onSearchAdvanceSkill = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        setAdvancedSearchInput(value);
        const skills = selectedAdvancedSkills.filter(el => el.skill.toLowerCase().indexOf(value.toLocaleLowerCase()) > -1);
        setSearchedAdvancedSkills(skills);
    }

    const onSearchBasicSkill = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        setBasicSearchInput(value);
        const skills = selectedBasicSkills.filter(el => el.skill.toLowerCase().indexOf(value.toLocaleLowerCase()) > -1);
        setSearchedBasicSkills(skills);
    }

    const openInstructions = () => {
        setShowInstructionsPopup(true)

    }

    const onChangeExpertPartialSkill = (skillItem: SelectedSkill, event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        const skills = [...selectedExpertSkills];
        const updatedSkillItem = skills.find(el => el === skillItem);
        if (target && updatedSkillItem) {
            skillItem.skill = target.value;
            updatedSkillItem.hasError = skillItem.skill === skillItem.inputSkill;
            if (!updatedSkillItem.hasError) {
                let isDuplicate = selectedAdvancedSkills.findIndex(el => el.skill.toLowerCase() === updatedSkillItem.skill.toLowerCase()) > -1;
                if (!isDuplicate) {
                    isDuplicate = selectedBasicSkills.findIndex(el => el.skill.toLowerCase() === updatedSkillItem.skill.toLowerCase()) > -1;
                }
                updatedSkillItem.tooltip = isDuplicate ? ValidationErrorMsgs.SKILL_DUPLICATE_SAME_CATEGORY : ValidationErrorMsgs.SKILL_PARTIAL_MATCH;
                updatedSkillItem.isDuplicate = isDuplicate;
                updatedSkillItem.hasError = isDuplicate;
            } else {
                updatedSkillItem.tooltip = ValidationErrorMsgs.SKILL_RECOGNIZED;
            }
        }
        setSelectedExpertSkills(skills);
    }

    const onChangeAdvancedPartialSkill = (skillItem: SelectedSkill, event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        const skills = [...selectedAdvancedSkills];
        const updatedSkillItem = skills.find(el => el === skillItem);
        if (target && updatedSkillItem) {
            skillItem.skill = target.value;
            updatedSkillItem.hasError = skillItem.skill === skillItem.inputSkill;
            if (!updatedSkillItem.hasError) {
                let isDuplicate = selectedExpertSkills.findIndex(el => el.skill.toLowerCase() === updatedSkillItem.skill.toLowerCase()) > -1;
                if (!isDuplicate) {
                    isDuplicate = selectedBasicSkills.findIndex(el => el.skill.toLowerCase() === updatedSkillItem.skill.toLowerCase()) > -1;
                }
                updatedSkillItem.tooltip = isDuplicate ? ValidationErrorMsgs.SKILL_DUPLICATE_SAME_CATEGORY : ValidationErrorMsgs.SKILL_PARTIAL_MATCH;
                updatedSkillItem.isDuplicate = isDuplicate;
                updatedSkillItem.hasError = isDuplicate;
            } else {
                updatedSkillItem.tooltip = ValidationErrorMsgs.SKILL_RECOGNIZED;
            }
        }
        setSelectedAdvancedSkills(skills);
    }

    const onChangeBasicPartialSkill = (skillItem: SelectedSkill, event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        const skills = [...selectedBasicSkills];
        const updatedSkillItem = skills.find(el => el === skillItem);
        if (target && updatedSkillItem) {
            skillItem.skill = target.value;
            updatedSkillItem.hasError = skillItem.skill === skillItem.inputSkill;
            if (!updatedSkillItem.hasError) {
                let isDuplicate = selectedExpertSkills.findIndex(el => el.skill.toLowerCase() === updatedSkillItem.skill.toLowerCase()) > -1;
                if (!isDuplicate) {
                    isDuplicate = selectedAdvancedSkills.findIndex(el => el.skill.toLowerCase() === updatedSkillItem.skill.toLowerCase()) > -1;
                }
                updatedSkillItem.tooltip = isDuplicate ? ValidationErrorMsgs.SKILL_DUPLICATE_SAME_CATEGORY : ValidationErrorMsgs.SKILL_PARTIAL_MATCH;
                updatedSkillItem.isDuplicate = isDuplicate;
                updatedSkillItem.hasError = isDuplicate;
            } else {
                updatedSkillItem.tooltip = ValidationErrorMsgs.SKILL_RECOGNIZED;
            }
        }
        setSelectedBasicSkills(skills);
    }

    const refreshExpertSkills = (pAdvancedSkills: SelectedSkill[], pBasicSkills: SelectedSkill[]) => {
        for (let index = 0; index < selectedExpertSkills.length; index++) {
            const element = selectedExpertSkills[index];
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

    const refreshAdvancedSkills = (pExpertSkills: SelectedSkill[], pBasicSkills: SelectedSkill[]) => {
        for (let index = 0; index < selectedAdvancedSkills.length; index++) {
            const element = selectedAdvancedSkills[index];
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

    const refreshBasicSkills = (pExpertSkills: SelectedSkill[], pAdvancedSkills: SelectedSkill[]) => {
        for (let index = 0; index < selectedBasicSkills.length; index++) {
            const element = selectedBasicSkills[index];
            let isDuplicate = pExpertSkills.findIndex(el => el.skill.toLowerCase() === element.skill.toLowerCase()) > -1;
            if (!isDuplicate) {
                isDuplicate = pAdvancedSkills.findIndex(el => el.skill.toLowerCase() === element.skill.toLowerCase()) > -1;
            }
            element.isDuplicate = isDuplicate;
            element.hasError = isDuplicate;
            if (isDuplicate) {
                element.tooltip = ValidationErrorMsgs.SKILL_DUPLICATE_DIFFERENT_CATEGORY;
            } else if (!element.hasError && element.matchType === 'partial') {
                element.hasError = element.skill === element.inputSkill;
                if (element.hasError) {
                    element.tooltip = ValidationErrorMsgs.SKILL_PARTIAL_MATCH;
                } else {
                    element.tooltip = ValidationErrorMsgs.SKILL_RECOGNIZED;
                }
            }
        }
    }

    const onSelectExpertSkills=(selectedList: any)=>{
        setExpertSkillsInput(selectedList)
    }

    const onSelectAdvancedSkills=(selectedList: any)=>{
        setAdvancedSkillsInput(selectedList)
    }

    const onSelectBasicSkills=(selectedList: any)=>{
        setBasicSkillsInput(selectedList)
    }

    return <>
        <ReactTooltip place='bottom' type='light' effect='solid' border={true} borderColor={'#707070'} />
        {/* <div className='py-lg-2'> */}
            <div className='mb-3'>
                <div className='top_heading_styles'>What technical skills are you good at?</div>
                <div className='row'>
                    <div className='col-md-8'>
                        <p className="top_para_styles">You will be matched with the interview requests according to your skills</p>
                    </div>
                    <div className="col-md-4 text-lg-end mb-3 mb-lg-0 ms-lg-0 ps-1">
                        <b className="sx-text-primary pointer" onClick={() => openInstructions()}><img src={INFO_ICON} alt="info icon" className="me-1 mobile_info" /> Instructions to add skills</b>
                    </div>
                </div>
            </div>
            <div className="row mt-3 overflow-auto overflow-lg-hidden" style={ { height: 'calc(100% - 80px)' }}>
                <div className="col-12  col-lg-4 h-lg-100 pe-sm-0 pe-lg-3 pe-0 border-end border-end-sm-none overflow-auto pb-3 ">
                    <div className={`d-flex align-items-center py-3 ${experienceError.expert && 'pb-0'}`}>
                        {/* <label className="input">
                            <input type="text" className="form-control job_dis_form_control px-3 rounded input__field" onChange={onExpertSkill} value={expertSkillsInput} />
                            <span className={`input__label`}>Expert Skills</span>
                        </label> */}
                         <label className="input ">
                                    <Creatable
                                        isMulti={true}
                                        value={expertSkillsInput}
                                        className="form-control job_dis_form_control rounded input__field"
                                        onChange={(e) => onSelectExpertSkills(e)}
                                        options={props.allSkills}
                                    />
                                     <span className={`input__label`}>Expert Skills</span>
                                </label>
                        <label className="input ps-2" style={{maxWidth:"100px"}}>
                            <select value={expertExperienceInput} className="form-select job_dis_form_control ps-2 rounded down_arrow_bg_img input__field" onChange={onChangeExpertExperince}>
                                <option value="" disabled style={{ display: 'none' }}></option>
                                {props.experienceList.map((data: any, index: number) => { return <option key={index} value={data}>{data} yrs</option> })}
                            </select>
                            <span className={`input__label`}>Experience</span>
                        </label>
                        <div className="ps-3">
                            <span data-tip="Click to add skills" className=" h-100 sx-text-primary pointer ps-0 position-relative">
                                <img src={ENTER_ICON} alt="" onClick={updateExpertSkills} className=" pointer" />
                            </span>
                        </div>
                    </div>
                    {experienceError.expert &&
                        <div className="d-flex">
                            <small className="w-100"></small>
                            <small className="w-100 text-danger pt-2 pb-2">Please select experience</small>
                        </div>
                    }
                    {
                        selectedExpertSkills.length > 1 &&
                        <label className="input mt-4">
                            <input type="text" className="form-control job_dis_form_control px-3 rounded input__field" placeholder="Search Skill" onChange={onSearchExpertSkill} value={expertSearchInput} />
                            <span className={`input__label input__label_disabled`}>Search Skill
                            </span>
                            <img src={SEARCH_ICON} alt="" onClick={updateBasicSkills} className="ps-3 pointer search_skills" />

                        </label>

                    }

                    {
                        searchedExpertSkills.map((expertSkill, skill_index: number) => {
                            return <div className="d-flex align-items-center mt-4" key={expertSkill.uuid}>
                                <label className="input pe-2" data-tip={expertSkill.tooltip}>
                                    {
                                        expertSkill.matchType === 'full' &&
                                        <input type="text" className={`border-3 form-control job_dis_form_control px-3 rounded input__field ${expertSkill.isDuplicate ? 'is-invalid' : 'sx-border-clr'}`} placeholder="Skill" defaultValue={expertSkill.skill} disabled />
                                    }
                                    {
                                        expertSkill.matchType === 'partial' &&
                                        <select onChange={(e) => onChangeExpertPartialSkill(expertSkill, e)}
                                            className={`form-select job_dis_form_control ps-2 rounded down_arrow_bg_img input__field ${expertSkill.hasError ? 'is-invalid' : 'sx-border-clr border-3'}`}>
                                            <option value={expertSkill.inputSkill}>{expertSkill.inputSkill}</option>
                                            {
                                                expertSkill.matchedSklls.map(el => <option value={el.skill}>
                                                    {el.skill}
                                                </option>)
                                            }
                                        </select>
                                    }
                                    {
                                        expertSkill.matchType === 'no-match' &&
                                        <input type="text" className="border-3 form-control job_dis_form_control px-3 rounded input__field" placeholder="Skill" defaultValue={expertSkill.skill} disabled />
                                    }
                                    <span className={`input__label input__label_disabled`}>Skill</span>
                                </label>
                                <label className="input" style={{maxWidth:"100px"}}>
                                    <select defaultValue={expertSkill.experience} className="form-select job_dis_form_control ps-2 rounded down_arrow_bg_img input__field" onChange={(e) => onChangeSkillExperience(e, expertSkill)}>
                                        {props.experienceList.map((data: any, index: number) => { return <option key={index} value={data}>{data} yrs</option> })}
                                    </select>
                                    <span className={`input__label`}>Experience</span>
                                </label>
                                <img src={DELETE_ICON} alt="" onClick={() => removeExpertSkill(skill_index)} className="ps-3 pointer" />
                            </div>
                        })
                    }
                </div>
                <hr className="d-block d-lg-none my-5"></hr>
                <div className="col-12  col-lg-4 h-lg-100 pe-sm-0 pe-lg-3 pe-0 ps-0 ps-sm-0 ps-lg-3 border-end border-end-sm-none px-3 overflow-auto pb-3">
                    <div className={`d-flex align-items-center py-3 ${experienceError.advanced && 'pb-0'}`}>
                        {/* <label className="input">
                            <input type="text" className="form-control job_dis_form_control px-3 rounded input__field" onChange={onAdvancedSkill} value={advancedSkillsInput} />
                            <span className={`input__label`}>Advanced Skills</span>
                        </label> */}
                                 <label className="input ">
                                    <Creatable
                                        isMulti={true}
                                        value={advancedSkillsInput}
                                        className="form-control job_dis_form_control rounded input__field"
                                        onChange={(e) => onSelectAdvancedSkills(e)}
                                        options={props.allSkills}
                                    />
                                     <span className={`input__label`}>Advanced Skills</span>
                                </label>
                        {/* <i className="fa fa-plus pointer" onClick={updateAdvancedSkills}></i> */}
                        <label className="input ps-2" style={{maxWidth:"100px"}}>
                            <select value={advancedExperienceInput} className="form-select job_dis_form_control ps-2 rounded down_arrow_bg_img input__field" onChange={onChangeAdvancedExperince}>
                                <option value="" disabled style={{ display: 'none' }}></option>
                                {props.experienceList.map((data: any, index: number) => { return <option key={index} value={data}>{data} yrs</option> })}
                            </select>
                            <span className={`input__label`}>Experience</span>
                            {/* {experienceError.advanced && <small className="text-danger position-absolute mt-2 mb-2">Please select experience</small>} */}
                        </label>

                        <div className="ps-3">
                            <span data-tip="Click to add skills" className=" h-100 sx-text-primary pointer ps-0 position-relative">
                                <img src={ENTER_ICON} alt="" onClick={updateAdvancedSkills} className="pointer" />

                            </span>
                        </div>

                    </div>
                    {experienceError.advanced &&
                        <div className="d-flex">
                            <small className="w-100"></small>
                            <small className="w-100 text-danger pt-2 pb-2">Please select experience</small>
                        </div>
                    }


                    {
                        selectedAdvancedSkills.length > 1 &&
                        <label className="input mt-4">
                            <input type="text" className="form-control job_dis_form_control px-3 rounded input__field" placeholder="Search Skill" onChange={onSearchAdvanceSkill} value={advancedSearchInput} />
                            <span className={`input__label input__label_disabled`}>Search Skill</span>
                            <img src={SEARCH_ICON} alt="" onClick={updateBasicSkills} className="ps-3 pointer search_skills" />

                        </label>
                    }

                    {
                        searchedAdvancedSkills.map((advancedSkill, skill_index: number) => {
                            return <div className="d-flex align-items-center mt-4" key={advancedSkill.uuid}>
                                <label className="input pe-2" data-tip={advancedSkill.tooltip}>
                                    {
                                        advancedSkill.matchType === 'full' &&
                                        <input type="text" className={`border-3 form-control job_dis_form_control px-3 rounded input__field ${advancedSkill.isDuplicate ? 'is-invalid' : 'sx-border-clr'}`} placeholder="Skill" defaultValue={advancedSkill.skill} disabled />
                                    }
                                    {
                                        advancedSkill.matchType === 'partial' &&
                                        <select onChange={(e) => onChangeAdvancedPartialSkill(advancedSkill, e)}
                                            className={`form-select job_dis_form_control ps-2 rounded down_arrow_bg_img input__field ${advancedSkill.hasError ? 'is-invalid' : 'sx-border-clr border-3'}`}>
                                            <option value={advancedSkill.inputSkill}>{advancedSkill.inputSkill}</option>
                                            {
                                                advancedSkill.matchedSklls.map(el => <option value={el.skill}>
                                                    {el.skill}
                                                </option>)
                                            }
                                        </select>
                                    }
                                    {
                                        advancedSkill.matchType === 'no-match' &&
                                        <input type="text" className={`form-control job_dis_form_control px-3 rounded input__field border-3 ${advancedSkill.isDuplicate ? 'is-invalid' : ''}`} placeholder="Skill" defaultValue={advancedSkill.skill} disabled />
                                    }
                                    <span className={`input__label input__label_disabled`}>Skill</span>
                                </label>
                                <label className="input" style={{maxWidth:"100px"}}>
                                    <select defaultValue={advancedSkill.experience} className="form-select job_dis_form_control ps-2 rounded down_arrow_bg_img input__field" onChange={(e) => onChangeSkillExperience(e, advancedSkill)}>
                                        {props.experienceList.map((data: any, index: number) => { return <option key={index} value={data}>{data} yrs</option> })}
                                    </select>
                                    <span className={`input__label`}>Experience</span>
                                </label>
                                <img src={DELETE_ICON} alt="" onClick={() => removeAdvancedSkill(skill_index)} className="ps-3 pointer" />
                            </div>
                        })
                    }
                </div>
                <hr className="d-block d-lg-none my-5"></hr>
                <div className="col-12  col-lg-4 h-lg-100 pe-sm-0 pe-lg-3 pe-0 ps-0 ps-sm-0 ps-lg-3 overflow-auto pb-3">
                    <div className={`d-flex align-items-center py-3 ${experienceError.basic && 'pb-0'}`}>
                        {/* <label className="input">
                            <input type="text" className="form-control job_dis_form_control px-3 rounded input__field" onChange={onBasicSkill} value={basicSkillsInput} />
                            <span className={`input__label`}>Basic Skills</span>
                        </label> */}
                          <label className="input ">
                                    <Creatable
                                        isMulti={true}
                                        value={basicSkillsInput}
                                        className="form-control job_dis_form_control rounded input__field"
                                        onChange={(e) => onSelectBasicSkills(e)}
                                        options={props.allSkills}
                                    />
                                     <span className={`input__label`}>Basic Skills</span>
                                </label>
                        {/* <i className="fa fa-plus pointer" onClick={updateBasicSkills}></i> */}
                        <label className="input ps-2" style={{maxWidth:"100px"}}>
                            <select value={basicExperienceInput} className="form-select job_dis_form_control ps-2 rounded down_arrow_bg_img input__field" onChange={onChangeBasicExperince}>
                                <option value="" disabled style={{ display: 'none' }}></option>
                                {props.experienceList.map((data: any, index: number) => { return <option key={index} value={data}>{data} yrs</option> })}
                            </select>
                            <span className={`input__label`}>Experience</span>
                            {/* {experienceError.basic && <small className="text-danger position-absolute mt-2 mb-2">Please select experience</small>} */}
                        </label>

                        <div className="ps-3">
                            <span data-tip="Click to add skills" className=" h-100 sx-text-primary pointer ps-0 position-relative">
                                <img src={ENTER_ICON} alt="" onClick={updateBasicSkills} className="pointer" />


                            </span>
                        </div>
                    </div>
                    {experienceError.basic &&
                        <div className="d-flex">
                            <small className="w-100"></small>
                            <small className="w-100 text-danger pt-2 pb-2">Please select experience</small>
                        </div>
                    }
                    {
                        selectedBasicSkills?.length > 1 &&
                        <label className="input mt-4">
                            <input type="text" className="form-control job_dis_form_control px-3 rounded input__field" placeholder="Search Skill" onChange={onSearchBasicSkill} value={basicSearchInput} />
                            <span className={`input__label input__label_disabled`}>Search Skill</span>
                            <img src={SEARCH_ICON} alt="" onClick={updateBasicSkills} className="ps-3 pointer search_skills" />
                        </label>
                    }


                    {
                        searchedBasicSkills.map((basicSkill, skill_index: number) => {
                            return <div className="d-flex align-items-center mt-4" key={basicSkill.uuid}>
                                <label className="input pe-2" data-tip={basicSkill.tooltip}>
                                    {
                                        basicSkill.matchType === 'full' &&
                                        <input type="text" className={`form-control job_dis_form_control px-3 rounded input__field border-3 ${basicSkill.isDuplicate ? 'is-invalid' : 'sx-border-clr'}`} placeholder="Skill" defaultValue={basicSkill.skill} disabled />
                                    }
                                    {
                                        basicSkill.matchType === 'partial' &&
                                        <select onChange={(e) => onChangeBasicPartialSkill(basicSkill, e)}
                                            className={`form-select job_dis_form_control ps-2 rounded down_arrow_bg_img input__field ${basicSkill.hasError ? 'is-invalid' : 'sx-border-clr border-3'}`}>
                                            <option value={basicSkill.inputSkill}>{basicSkill.inputSkill}</option>
                                            {
                                                basicSkill.matchedSklls.map(el => <option value={el.skill}>
                                                    {el.skill}
                                                </option>)
                                            }
                                        </select>
                                    }
                                    {
                                        basicSkill.matchType === 'no-match' &&
                                        <input type="text" className={`form-control job_dis_form_control px-3 rounded input__field border-3 ${basicSkill.isDuplicate ? 'is-invalid' : ''}`} placeholder="Skill" defaultValue={basicSkill.skill} disabled />
                                    }
                                    <span className={`input__label input__label_disabled`}>Skill</span>
                                </label>
                                <label className="input" style={{maxWidth:"100px"}}>
                                    <select defaultValue={basicSkill.experience} className="form-select job_dis_form_control ps-2 rounded down_arrow_bg_img input__field" onChange={(e) => onChangeSkillExperience(e, basicSkill)}>
                                        {props.experienceList.map((data: any, index: number) => { return <option key={index} value={data}>{data} yrs</option> })}
                                    </select>
                                    <span className={`input__label`}>Experience</span>
                                </label>
                                <img src={DELETE_ICON} alt="" onClick={() => removeBasicSkill(skill_index)} className="ps-3 pointer" />
                            </div>
                        })
                    }
                </div>
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
                                                    <li>Please enter your skills per expertise category, separated by comma and click the enter button to populate the skills below.
                                                    </li>
                                                    <li>Years of experience at the expertise category level can be used to apply it to all   skills entered in that category. Experience can be edited per skill as well once added.</li>
                                                    <li>Skills recognized by the platform are highlighted with a yellow border while the rest are highlighted with a grey border. Unrecognized skills are reviewed by SiftedX team and are added to your profile once approved.</li>
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

export default AddUpdateSmeSkills;