import { FormControlError, FormField, FormValidators } from "./model/form-field";

export const FormValidator = (formFields: FormField[], data: any): FormControlError[] => {

    const errors: FormControlError[] = [];
    for (let index = 0; index < formFields.length; index++) {
        const element = formFields[index];
        for (let j = 0; j < element.validators.length; j++) {
            const validatorElement = element.validators[j];
            switch (validatorElement) {
                case FormValidators.REQUIRED:
                    if (!data?.hasOwnProperty(element.control)) {
                        errors.push(new FormControlError(element.control, FormValidators.REQUIRED));
                    } else {
                        if (!data[element.control]) {
                            errors.push(new FormControlError(element.control, FormValidators.REQUIRED));
                        }
                    }
                    break;

                default:
                    break;
            }
        }
    }
    return errors;
}

export const GetControlIsValid = (errors: FormControlError[], control: string) => {
    const isInvalid = errors.find(el => el.control === control) ? true : false;
    return !isInvalid;
}

export const GetEmailControlIsValid = (errors: FormControlError[], control: string, data: any) => {
    const pattern = new RegExp(/[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/);
    const isInvalid = errors.find(el => el.control === control) ? true : false;
    if (!isInvalid) {
        if (!pattern.test(data.email)) {
            return true;
        } else {
            return false;
        }
    }

}

export const GetMobileControlIsValid = (errors: FormControlError[], control: string, data: any) => {
    const pattern = new RegExp(/^[0-9]\d*(\.\d+)?$/);
    const isInvalid = errors.find(el => el.control === control) ? true : false;
    let mobile_number_length = 0;
    if (!isInvalid) {
        if (data.mobile_number) {
            mobile_number_length = (data.mobile_number).length;
        }
        if (!pattern.test(data.mobile_number)) {
            return true;
        } else if (mobile_number_length != 10) {
            return true;
        } else {
            return false;
        }
    }
}
