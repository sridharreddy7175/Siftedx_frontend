import React, { useEffect, useState } from 'react'
import FormBuilder from '../../components/form-builder'
import { FormControlError, FormField, FormValidators } from '../../components/form-builder/model/form-field'
import { FormValidator, GetControlIsValid } from '../../components/form-builder/validations'
import { useParams } from 'react-router-dom';
import LogoImg from '../../assets/images/logo.png';

export const SetPasswordPage = () => {
    const [loginValidationErrors, setLoginValidationErrors] = useState<FormControlError[]>([]);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [loginData, setLoginData] = useState<any>({});
    const [formData, setFormData] = useState<any>({});
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState(false);
    const [newPassword, setNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [usersName, setUsersName] = useState("");
    let { userName } = useParams<{ userName: string }>();

    const formValidations = [
        new FormField('user_name', []),
        new FormField('new_password', [FormValidators.REQUIRED]),
        new FormField('confirm_password', [FormValidators.REQUIRED])
    ];

    useEffect(() => {
        if (userName) {
            setUsersName(userName);
        }
    }, []);


    const handleInput = (data: any) => {
        setLoginData(data);
        setFormData({ ...data.value });
        const errors: any = FormValidator(formValidations, data.value);
        setLoginValidationErrors(errors);
    };

    function onClickLogin() {
        setIsFormSubmitted(true);
        const loginsData = { ...loginData.value };
        const errors: FormControlError[] = FormValidator(formValidations, loginsData);
        setLoginValidationErrors(errors);
        if (errors.length < 1) {
            setLoading(true);
            if (loginsData.new_password === loginsData.confirm_password) {
                const payload = {
                    user_name: usersName,
                    password: loginsData.new_password
                }

            } else {
                setPasswordErrorMessage(true);
                setLoading(false);
            }

        }
    }



    const getInputValid = (control: string) => {
        const value = GetControlIsValid(loginValidationErrors, control);
        return value;
    }

    function onClickNewPasswordEyeIcon() {
        setNewPassword(!newPassword);
    }

    function onClickConfirmPasswordEyeIcon() {
        setShowConfirmPassword(!showConfirmPassword);
    }

    return (
        <div>
            <section className="d-flex justify-content-md-center align-items-center login-block-wraper forgot-password">
                <div>
                    <div className="bg-white border border-gray rounded-16 p-3 p-lg-5 shadow-sm login-block">
                        <div className="row justify-content-md-center login-row">
                            <div className="col col-md-5 text-center text-lg-start" style={{ paddingTop: '100px' }}>
                                <img src={LogoImg} alt="" className="login-logo" />
                            </div>
                            {loading &&
                                <div className="text-center p-5">
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            }
                            {!loading && <div className="col-md-7 login-fileds">
                                <FormBuilder onUpdate={handleInput}>
                                    <form>
                                        <h2 className="login-hd mt-3 mb-1 mb-md-2 text-center text-lg-start">Set Password</h2>
                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control fw-light" disabled defaultValue={usersName} name="user_name" placeholder="Please enter User ID" />
                                            <label htmlFor="floatingInput">User Name</label>
                                        </div>
                                        <div className="form-floating">
                                            <input type={newPassword ? "text" : "password"} className="form-control fw-light" name="new_password" placeholder="New Password" />
                                            <span className="eye-icon cursor-pointer" onClick={() => onClickNewPasswordEyeIcon()}>
                                                <i className={newPassword ? "bi bi-eye-slash" : "bi bi-eye-fill"}></i>
                                            </span>
                                            <label htmlFor="floatingPassword">New Password</label>
                                            {isFormSubmitted && !getInputValid('new_password') && <p className="text-danger">Please Enter Password</p>}
                                        </div>
                                        <div className="form-floating">
                                            <input type={showConfirmPassword ? "text" : "password"} className="form-control fw-light" name="confirm_password" placeholder="Confirm Password" />
                                            <span className="eye-icon cursor-pointer" onClick={() => onClickConfirmPasswordEyeIcon()}>
                                                <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye-fill"}></i>
                                            </span>
                                            <label htmlFor="floatingPassword">Confirm Password</label>
                                            {isFormSubmitted && !getInputValid('confirm_password') && <p className="text-danger">Please Enter Confirm Password</p>}
                                        </div>
                                    </form>
                                </FormBuilder>
                                <div className="text-center mb-1 mt-2" style={{ color: 'red' }}>{errorMessage}</div>
                                {passwordErrorMessage && <div className="text-center mb-1 mt-2" style={{ color: 'red' }}>
                                    Confirm password not matching.</div>}
                                <div className="mt-4 mb-3 text-center text-lg-start">
                                    <a className="small_btn btn-sm px-5 rounded-12 fw-light cursor-pointer" onClick={() => onClickLogin()}>
                                        Set Password
                                    </a><br />
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}