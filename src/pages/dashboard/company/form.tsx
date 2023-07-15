import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom';
import FormBuilder from '../../../components/form-builder';
import { FormField, FormValidators } from '../../../components/form-builder/model/form-field';
import { CompanyService } from '../../../app/service/company.service';
import { LookUpService } from '../../../app/service/lookup.service';

interface Props {
    companyId: (value: any) => void;
}

const CompanyForm: React.FC<any> = (props: Props) => {
    let { id } = useParams<{ id: string }>();
    const [countryesData, setCountryesData] = useState<any[] | []>([]);
    const [statesData, setStatesData] = useState<any[] | []>([]);

    const [isFormEdit, setIsFormEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<any>({});
    const [handleCompanyData, setHandleCompanyData] = useState<any>({});
    const history = useHistory();
    const formValidations = [
        new FormField('company_name', [FormValidators.REQUIRED]),
        new FormField('contact_person', [FormValidators.REQUIRED]),
        new FormField('contact_number', [FormValidators.REQUIRED]),
        new FormField('contact_number', [FormValidators.REQUIRED]),
        new FormField('address_line_1', [FormValidators.REQUIRED]),
        new FormField('address_line_2', []),
        new FormField('city_uuid', [FormValidators.REQUIRED]),
        new FormField('state_uuid', [FormValidators.REQUIRED]),
        new FormField('postal_code', [FormValidators.REQUIRED]),
        new FormField('display_name', [FormValidators.REQUIRED]),
        new FormField('category_code', [FormValidators.REQUIRED]),
        new FormField('country_uuid', [FormValidators.REQUIRED])
    ];

    useEffect(() => {
        setIsFormEdit(id ? true : false);
        if (id) {
            getSelectedCom();
        }
        getCountry();
    }, []);

    const getSelectedCom = () => {
        CompanyService.getCompanyById(id).then(
            res => {
                setSelectedCompany(res);
            }
        )
    }

    const getCountry = () => {
        LookUpService.getCountry().then(
            res => {
                setCountryesData(res);
            }
        )
    }

    const getState = (country: string) => {
        LookUpService.getState(country).then(
            res => {
                setStatesData(res);
            }
        )
    }


    const handleInput = (data: any) => {
        setHandleCompanyData(data);
    };

    const handleSubmit = () => {
        if (handleCompanyData.isValid) {
            const newData = { ...handleCompanyData.value };
            const payload = {
                company_name: newData.company_name ? newData.company_name : '',
                contact_person: newData.contact_person ? newData.contact_person : '',
                contact_number: newData.contact_number ? newData.contact_number : '',
                address_line_1: newData.address1 ? newData.address1 : '',
                address_line_2: newData.address2 ? newData.address2 : '',
                category_code: newData.category_code ? newData.category_code : '',
                city_uuid: newData.city ? newData.city : '',
                country_uuid: newData.country ? newData.country : '',
                display_name: newData.display_name ? newData.display_name : '',
                postal_code: newData.postal_code ? newData.postal_code : '',
                state_uuid: newData.state ? newData.state : '',
            }
            CompanyService.addCompany(payload).then((res: any) => {
                history.push('/dashboard/companies/list');
            })
        }
    }

    const handleUpdate = () => {
        setHandleCompanyData({ ...selectedCompany })
        const newData = { ...selectedCompany, ...handleCompanyData.value };
        const payload = {
            company_name: newData.company_name ? newData.company_name : '',
            contact_person: newData.contact_person ? newData.contact_person : '',
            contact_number: newData.contact_number ? newData.contact_number : '',
            address_line_1: newData.address1 ? newData.address1 : '',
            address_line_2: newData.address2 ? newData.address2 : '',
            category_code: newData.category_code ? newData.category_code : '',
            city_uuid: newData.city ? newData.city : '',
            country_uuid: newData.country ? newData.country : '',
            display_name: newData.display_name ? newData.display_name : '',
            postal_code: newData.postal_code ? newData.postal_code : '',
            state_uuid: newData.state ? newData.state : '',
            uuid: selectedCompany.uuid
        }
        CompanyService.updateCompany(payload).then((res: any) => {
            history.push('/dashboard/companies/list');
        })
    }

    const onSelectCountry = (e: any) => {
        getState(e.target.value);
    }
    return (
        <div className="row background-gray">
            {loading &&
                <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }
            <div className="row px-5 pt-5" style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {isFormEdit ? 'Edit Company' : 'Add Company'}
            </div>
            {!loading && <div className='py-3 px-5'>
                <div className="row add_company_border p-5">
                    <FormBuilder onUpdate={handleInput}>
                        <form>
                            <div className='col-12'>
                                <div className='row'>
                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">Company name</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <input className="form-control job_dis_form_control" placeholder="Enter company name" type="text" defaultValue={selectedCompany?.company_name} name='company_name' />
                                        </div>
                                    </div>
                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">Contact person</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <input className="form-control job_dis_form_control" placeholder="Enter contact person" type="text" defaultValue={selectedCompany?.contact_person} name='contact_person' />
                                        </div>
                                    </div>

                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">Contact number</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <input className="form-control job_dis_form_control" placeholder="Enter contact number" type="text" defaultValue={selectedCompany?.contact_number} name='contact_number' />
                                        </div>
                                    </div>
                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">Address 1</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <input className="form-control job_dis_form_control" placeholder="Enter address 1" type="text" defaultValue={selectedCompany?.address_line_1} name='address1' />
                                        </div>
                                    </div>
                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">Address 2</label>
                                            <input className="form-control job_dis_form_control" placeholder="Enter address 2" type="text" defaultValue={selectedCompany?.address_line_2} name='address2' />
                                        </div>
                                    </div>
                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">Country</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <select className="form-control job_dis_form_control" name="country" id="country" onChange={(e) => onSelectCountry(e)} >
                                                <option value="">Select Country</option>
                                                {countryesData.map((data: any, index: number) => { return <option key={index} value={data?.code}>{data?.name}</option> })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">State</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <select className="form-control job_dis_form_control" name="state" id="">
                                                <option value="">Select state</option>
                                                {statesData.map((data: any, index: number) => { return <option key={index} value={data?.state_code}>{data?.name}</option> })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">Postal code</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <input className="form-control job_dis_form_control" placeholder="Enter postal code" type="text" defaultValue={selectedCompany?.postal_code} name='postal_code' />
                                        </div>
                                    </div>
                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">Display name</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <input className="form-control job_dis_form_control" placeholder="Enter display name" type="text" defaultValue={selectedCompany?.display_name} name='display_name' />
                                        </div>
                                    </div>
                                    <div className="col-md-6 px-3">
                                        <div className="mb-4">
                                            <label className="form-label job_dis_form_label mb-0">Category code</label>
                                            <span style={{ color: 'red', fontSize: '15px', paddingLeft: '5px' }}>*</span>
                                            <input className="form-control job_dis_form_control" placeholder="Enter category code" type="text" defaultValue={selectedCompany?.category_code} name='category_code' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </FormBuilder>
                    <div className='col-12'>
                        <div className="form-footer text-center py-3">
                            {!isFormEdit && <a className="small_btn px-5 rounded-12 cursor-pointer" onClick={() => handleSubmit()}>Save</a>}
                            {isFormEdit && <a className="small_btn px-5 rounded-12 cursor-pointer" onClick={handleUpdate}>Update</a>}
                            <Link className="btn btn-danger px-5 rounded-12 text-decoration-none ms-2 cursor-pointer" to="/dashboard/companies/list">Cancel</Link>
                        </div>
                    </div>
                </div>
            </div>}
        </div >
    )
}

export default CompanyForm;