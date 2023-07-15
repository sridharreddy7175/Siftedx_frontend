import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { emailCompanyValidations, emialValidations, validateName, linkedinValidations } from '../../app/utility/form-validations';

interface Props {
    default?: any;
    onUpdate: (value: any) => void;
    children?: any;
    showValidations?: boolean
}

export interface FormControl {
    name: string;
}

export interface FormBuilderData {
    value: any; errors: any; isValid: any;
}
const FormBuilder: React.FC<Props> = (props: Props) => {
    const validationClassName = 'm-validation';
    const [formData, setFormData] = useState<FormBuilderData>({ value: props.default || {}, errors: [], isValid: true });
    const formParent = useRef(null);
    const [showValidations, setShowValidations] = useState(false);
    useEffect(() => {
        setShowValidations(props.showValidations || false);
        if (props.showValidations) {        
            const errors: any = {};
            updateValidationErrors(errors);
            updateValidations(errors);
        }
    }, [props.showValidations])

    const updateValidations = (errors: any) => {
        if (formParent && formParent.current) {
            const formContainer = formParent.current as HTMLDivElement;
            const forms = formContainer.getElementsByTagName('form');
            if (forms[0]) {
                const errorKeys: string[] = Object.keys(errors);
                const elements = forms[0].querySelectorAll('[name]');
                for (let index = 0; index < elements.length; index++) {
                    const element = elements[index];
                    const controlName = element.attributes.getNamedItem('name')?.value || '';
                    const errorKey = errorKeys.find(el => el === controlName);
                    const previousValidationElements = element.parentElement?.querySelectorAll(`.${validationClassName}`) || [];
                    if (errorKey) {
                        const firstError = Object.keys(errors[controlName])[0];
                        const firstErrorMsg: string = errors[errorKey][firstError];
                        // console.log(firstError, firstErrorMsg);

                        const validationDiv = document.createElement('div');
                        const errorElement = document.createElement('small');
                        errorElement.className = 'text-danger';
                        const errorTextElement = document.createTextNode(firstErrorMsg);
                        errorElement.appendChild(errorTextElement);
                        validationDiv.appendChild(errorElement);
                        validationDiv.className = validationClassName;
                        validationDiv.dataset.type = firstError;

                        if (previousValidationElements.length > 0) {
                            const previousValidationElement = previousValidationElements[0] as HTMLDivElement;
                            const vDataSet = previousValidationElement.dataset;
                            const previousType = vDataSet.type || '';
                            
                            if (previousType !== firstError) {
                                previousValidationElement.replaceWith(validationDiv);
                            }
                            for (let vIndex = 1; vIndex < previousValidationElements.length; vIndex++) {
                                const vElement = previousValidationElements[vIndex];
                                vElement.remove();
                            }
                        } else {
                            element.parentElement?.appendChild(validationDiv);
                        }

                    } else {
                        for (let vIndex = 0; vIndex < previousValidationElements.length; vIndex++) {
                            const vElement = previousValidationElements[vIndex];
                            vElement.remove();
                        }
                    }
                }
            }
        }
    };

    const onUpdateForm = (event: SyntheticEvent) => {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        const { value, name } = target;
        const fieldValue = { ...formData.value, [name]: value };
        const errors: any = {};
        updateValidationErrors(errors);
        setFormData({ ...formData, value: fieldValue, errors, isValid: Object.keys(errors).length === 0 });
    };

    const updateValidationErrors = (errors: any)=>{
        if (formParent.current) {
            const formContainer = formParent.current as HTMLDivElement;
            const forms = formContainer.getElementsByTagName('form');
            if (forms[0]) {
                const elements = forms[0].querySelectorAll('[name]');
                for (let index = 0; index < elements.length; index++) {
                    const element = elements[index] as HTMLInputElement;
                    const { value, dataset, name } = element;

                    if (dataset.validateRequired) {
                        if (!value) {
                            errors[name] = {
                                required: dataset.validateRequired
                            };
                        }
                    }
                    if (dataset.validateName) {
                        if (value) {
                            let isValid = validateName(value);
                            if (!isValid) {
                                if (errors[name]) {
                                    errors[name].name = dataset.validateName;
                                } else {
                                    errors[name] = {
                                        required: dataset.validateName
                                    };
                                }
                            }
                        }
                    }
                    if (dataset.validateWorkemail) {
                        if (value) {
                            let errorStr = emailCompanyValidations(value, dataset.validateWorkemail);
                            if (errorStr) {
                                if (errors[name]) {
                                    errors[name].workemail = errorStr;
                                } else {
                                    errors[name] = {
                                        workemail: errorStr
                                    };
                                }
                            }
                        }
                    }
                    if (dataset.validateEmail) {
                        if (value) {
                            let errorStr = emialValidations(value, dataset.validateEmail);
                            if (errorStr) {
                                if (errors[name]) {
                                    errors[name].email = errorStr;
                                } else {
                                    errors[name] = {
                                        email: errorStr
                                    };
                                }
                            }
                        }
                    }
                    if (dataset.validateLinkedin) {
                        if (value) {
                            let errorStr = linkedinValidations(value, '');
                            if (errorStr) {
                                if (errors[name]) {
                                    errors[name].linked_in = errorStr;
                                } else {
                                    errors[name] = {
                                        linked_in: errorStr
                                    };
                                }
                            }
                        }
                    }
                }
                if (showValidations) {
                    updateValidations(errors);
                }
            }
        }

    }

    useEffect(() => {
        if (Object.keys(formData.value).length > 0) {
            props.onUpdate(formData);
        }
    }, [formData]);

    return (
        <div onChange={onUpdateForm} ref={formParent}>
            {props.children}
        </div>
    );
};

export default FormBuilder;
