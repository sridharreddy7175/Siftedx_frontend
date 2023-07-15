import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom';
import FormBuilder from '../../../components/form-builder';
import { FormControlError, FormField, FormValidators } from '../../../components/form-builder/model/form-field';
import { FormValidator, GetControlIsValid } from '../../../components/form-builder/validations';
import { ToastContainer, toast } from 'react-toastify';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';

export const ObjectForm = () => {
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [roleData, setRoleData] = useState<any>({});
    const [adminvalidationErrors, setRolevalidationErrors] = useState<FormControlError[]>([]);
    const [currentRoleData, setCurrentRoleData] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const history = useHistory();
    let { id } = useParams<{ id: string }>();
    const roleId = parseInt(id);

    const roleFormValidations = [
        new FormField('code', [FormValidators.REQUIRED]),
        new FormField('name', [FormValidators.REQUIRED]),
        new FormField('description', []),
        new FormField('status', []),
    ];


    useEffect(() => {
        if (roleId > 0) {
            setLoading(true);
        }
    }, [roleId]);

    function createRole() {
        const rolesData = roleData.value ? { ...roleData.value } : { ...currentRoleData };
        setIsFormSubmitted(true);
        const errors: FormControlError[] = FormValidator(roleFormValidations, rolesData);
        setRolevalidationErrors(errors);
        if (errors.length < 1) {
            setLoading(true);
        }
    }

    function updateRole() {
        const rolesData = { ...roleData.value };
        rolesData.id = roleId;
        setLoading(true);
    }

    const getRoleInputValid = (control: string) => {
        const value = GetControlIsValid(adminvalidationErrors, control);
        return value;
    }

    const handleRoleInput = (data: any) => {
        data.value = { ...currentRoleData, ...data.value };
        setRoleData(data);
        const errors: any = FormValidator(roleFormValidations, data.value);
        setRolevalidationErrors(errors);
    };


    return (

        <div>
            {loading &&
                <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }
            {!loading && <div>
                <div className="row border-top border-primary pt-5 pb-3 mx-5">
                    {roleId === 0 && <h5>Create Role</h5>}
                    {roleId > 0 && <h5>Update Role</h5>}
                </div>
                <div className='siftedx-table mx-5 my-3 p-5'>
                    <FormBuilder onUpdate={handleRoleInput}>
                        <form>
                            <div className="row custom-form">

                                <div className="col-md-6 px-3">
                                    <div className="mb-4">
                                        <label className="form-label job_dis_form_label">Code</label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                        <input className="form-control job_dis_form_control px-3 rounded" type="text" name="code" defaultValue={currentRoleData.code} placeholder="Enter code" />
                                        {isFormSubmitted && !getRoleInputValid('code') && <p className="text-danger">Please enter code</p>}
                                    </div>
                                </div>
                                <div className="col-md-6 px-3">
                                    <div className="mb-4">
                                        <label className="form-label job_dis_form_label">Name</label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                        <input className="form-control job_dis_form_control px-3 rounded" type="text" name="name" defaultValue={currentRoleData.name} placeholder="Enter name" />
                                        {isFormSubmitted && !getRoleInputValid('name') && <p className="text-danger">Please enter name</p>}
                                    </div>
                                </div>
                                <div className="col-md-6 px-3">
                                    <div className="mb-4">
                                        <label className="form-label job_dis_form_label">Description</label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                        <input className="form-control job_dis_form_control px-3 rounded" type="text" name="description" defaultValue={currentRoleData.description} placeholder="Enter description" />
                                        {isFormSubmitted && !getRoleInputValid('description') && <p className="text-danger">Please enter description</p>}
                                    </div>
                                </div>
                                <div className="col-md-6 px-3">
                                    <div className="mb-4">
                                        <label className="form-label">Status</label>
                                        <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                        <div>
                                            <BootstrapSwitchButton checked={true} onstyle="primary" />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </form>
                    </FormBuilder>
                    <div className="form-footer text-center py-3 text-end mt-4">
                        {roleId === 0 && < a className="small_btn px-5 rounded-12 cursor-pointer" onClick={() => createRole()}>Create</a>}
                        {roleId > 0 && <a className="small_btn px-5 rounded-12 cursor-pointer" onClick={() => updateRole()}>Update</a>}
                        <Link className="btn btn-danger px-5 rounded-12 text-decoration-none ms-2" to={`/dashboard/objects`}>Cancel</Link>
                    </div>
                </div>
            </div>}
        </div >
    )
}
