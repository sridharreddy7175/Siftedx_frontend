export enum FormValidators {
    REQUIRED = 1
}
export class FormField {
    constructor(public control: string,
        public validators: FormValidators[]) {

    }
}

export class FormControlError {
    constructor(public control: string,
        public error: FormValidators) {
    }
}