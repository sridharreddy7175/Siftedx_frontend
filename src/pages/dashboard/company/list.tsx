import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { DataTable } from '../../../components/data-table'
import FormBuilder from '../../../components/form-builder';
import { CompanyDataGridCols } from './data-grid-cols';
import { CompanyService } from '../../../app/service/company.service';

export const CompanyList = () => {
    const [companyData, setCompanyData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageArray, setPageNumbers] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const companyForm = useRef<any>({});
    const filteredData = [
        { name: 'Contact Number', value: 'contact_number' },
        { name: 'Address', value: 'address' },
        { name: 'District', value: 'district' },
        { name: 'Pincode', value: 'pin_code' },
    ];
    const history = useHistory();

    useEffect(() => {
        setLoading(true);
        // getCompanys();
    }, []);

    const getCompanys = () => {
        CompanyService.getCompany().then(
            res => {
                setLoading(false);
                setCompanyData(res?.records);
            }
        )
    }
    const onSearchText = (data: any) => {
        if (data.value.search) {
            history.push(`/dashboard/companies?search=${data.value.search}`);
        }
    };

    const onPageChange = (data: any) => {
        if (data) {
            history.push(`/dashboard/companies/list?page=${data}`);
        }
        setActivePage(data);
        const pageNumber = data - 1;
    }

    const onEditCompany = (data: any) => {
        if (data) {
            history.push(`/dashboard/companies/new/${data?.item?.uuid}`);
        }
    }

    const onDeleteCompany = (data: any) => {
        setLoading(true);
        CompanyService.deleteCompany(data?.uuid).then(
            res => {
                setLoading(false);
                getCompanys();
            }
        )
    }
    return (
        <div className='background-gray'>
            <div className="border-top border-primary py-3 px-5">
                <div className="row">
                    <div className="col-md-10">
                        <h5>Companies</h5>
                    </div>
                    <div className="border-primary text-end col-md-2">
                        <Link to="new" className="small_btn px-5 rounded-12">Add</Link>
                    </div>
                </div>
                <div className='siftedx-table mt-2'>
                    <div className="row px-3 py-3">
                        <div className="col-md-12">
                            <div className='px-2 d-flex justify-content-between'>
                                <div className='d-flex'>
                                    <div className="form-check mt-2">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                        <label className="form-check-label text-black" style={{ fontSize: "13px" }}>
                                            Select All
                                        </label>
                                    </div>
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
                    </div>
                    {loading &&
                        <div className="text-center p-5">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    }
                    {!loading && <DataTable TableCols={CompanyDataGridCols} tableData={companyData} searchText={onSearchText}
                        editInfo={onEditCompany} deleteInfo={onDeleteCompany}
                        pageNumber={onPageChange} activePageNumber={activePage} pageNumbers={pageArray}></DataTable>}
                </div>
            </div>
        </div >
    )
}
