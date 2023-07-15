import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from '../../../../components/data-table';
import FormBuilder from '../../../../components/form-builder';
import { FormField, FormValidators } from '../../../../components/form-builder/model/form-field';
import { SmeReportsDataGridCols } from './data-grid-cols';

export const SmeReports = () => {
    const [loading, setLoading] = useState(false);
    const [handleCompanyData, setHandleCompanyData] = useState<any>({});
    const [pageArray, setPageNumbers] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [interviewList, setinterviewList] = useState<any>([]);
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

    const handleSmeInput = (data: any) => {
        setHandleCompanyData(data);
    };

    const onSearchText = (data: any) => {
    };
    const onPageChange = (data: any) => {
        setActivePage(data);
    }
    return (
        <div className="row py-3 mx-5">
            {loading &&
                <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }
            <div className="row">
                <div className="col-md-10">
                    <h2>Reports</h2>
                </div>
            </div>
            {!loading && <div>
                <FormBuilder onUpdate={handleSmeInput}>
                    <form>
                        <div className="row custom-form">
                            <div className='col-md-3'>
                                <div className='sme_reports bg_yellow me-3'>
                                    <h4 className='text-center'>Total Invitations</h4>
                                    <h4 className='text-center'>5</h4>
                                </div>
                            </div>
                            <div className='col-md-3'>
                                <div className='sme_reports bg_blue me-3'>
                                    <h4 className='text-center'>Total Interviews</h4>
                                    <h4 className='text-center'>5</h4>
                                </div>
                            </div>
                            <div className='col-md-3'>
                                <div className='sme_reports bg_green me-3'>
                                    <h4 className='text-center'>Completed Interviews</h4>
                                    <h4 className='text-center'>3</h4>
                                </div>
                            </div>
                            <div className='col-md-3'>
                                <div className='sme_reports bg_red me-3'>
                                    <h4 className='text-center'>Rejected Interviews</h4>
                                    <h4 className='text-center'>2</h4>
                                </div>
                            </div>
                        </div>
                    </form>
                </FormBuilder >
            </div >}
            <div className="row mt-5 mb-3">
                <div className="col-md-10">
                    <h2>Payments</h2>
                </div>
            </div>
            {loading &&
                <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }

            <div className="add_company_border px-3 pt-3 pb-5" style={{ marginBottom: '15px' }}>
                <div className='row px-3'>
                    <div className='px-3 d-flex mb-3 justify-content-between'>
                        <div className='d-flex'>
                            <div className="form-check mt-2">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label className="form-check-label text-black" style={{ fontSize: "13px" }}>
                                    Select All
                                </label>
                            </div>
                            <button className='dashboard_happy_monday_dot_btn px-3 rounded ms-3'>More</button>
                        </div>
                        <div className='d-flex'>
                            <div className="input-group search_bar_border">
                                <span className="input-group-text input_group_text" id="basic-addon1"><i className="fa fa-search pointer" aria-hidden="true"></i></span>
                                <input type="text" className="form-control form_control_border py-2" placeholder="Search" aria-label="Username" aria-describedby="basic-addon1" />
                            </div>
                            <button className='dashboard_happy_monday_dot_btn px-4 rounded ms-3 d-flex my-auto py-2'><svg width="17" height="11" className='my-auto mx-1' viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.75 10.75H10.25V9H6.75V10.75ZM0.625 0.25V2H16.375V0.25H0.625ZM3.25 6.375H13.75V4.625H3.25V6.375Z" fill="#1D2851" />
                            </svg> Filter</button>
                        </div>
                    </div>
                </div>
                {!loading && <DataTable TableCols={SmeReportsDataGridCols} tableData={interviewList}
                    activePageNumber={activePage} searchText={onSearchText} pageNumber={onPageChange} pageNumbers={pageArray}></DataTable>}
            </div>
        </div >
    )
}
