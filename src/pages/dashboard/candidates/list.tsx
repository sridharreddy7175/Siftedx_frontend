import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom'
import { CompanyListItem } from '../../../app/model/company/company-list';
import { DataTable } from '../../../components/data-table'
import FormBuilder from '../../../components/form-builder';
import { SmeDataGridCols } from './data-grid-cols';
import { ToastContainer, toast } from 'react-toastify';
import { AppLoader } from '../../../components/loader';

export const SmeList = () => {
    const smeList = [{
        user_uuid: 'uday',
        linked_in_url: '',
        resume_url: '',
        introduction_video_url: '',
        total_experience: '',
        expert_title: '',
        subject_experience: '',
        sme_rating: '',
        sme_fee: '',
        skype_id: '',
        stripe_account_id: '',
        start_day_time: '',
        end_day_time: '',
        time_zone: '',
    }]
    const [loading, setLoading] = useState(false);
    const [pageArray, setPageNumbers] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [cityData, setCityData] = useState<any>([]);
    const [statesData, setStatesData] = useState<any>([]);
    const [searchData, setSearchData] = useState<any>({});
    const companyForm = useRef<any>({});
    const filteredData = [
        { name: 'Contact Number', value: 'contact_number' },
        { name: 'Address', value: 'address' },
        { name: 'District', value: 'district' },
        { name: 'Pincode', value: 'pin_code' },
    ];
    const history = useHistory();

    useEffect(() => {

    }, []);

    const onSearchText = (data: any) => {
        if (data.value.search) {
            history.push(`/dashboard/sme?search=${data.value.search}`);
        }
    };

    const onPageChange = (data: any) => {
        if (data) {
            history.push(`/dashboard/sme/list?page=${data}`);
        }
        setActivePage(data);
        const pageNumber = data - 1;
    }

    const onEditCompany = (data: any) => {
        if (data) {
            history.push(`/dashboard/sme/form/${data.id}`);
        }
    }

    const onDeleteCompany = (data: any) => {

    }

    const handleStateChange = (e: any) => {
        if (e.target.value) {
            const preparedData = statesData.filter((el: any) => el.state === e.target.value);
            setCityData(preparedData[0].cities);
        }
    }

    const handleCityChange = (e: any) => {
    }

    const handleInput = (data: any) => {
        setSearchData(data);
    };

    function handleSearch() {
        const data = { ...searchData.value };
    }

    function handleRefresh() {
        companyForm.current.reset();
        setSearchData({});
    }

    const handleFilterChange = (e: any) => {
        const data = { ...searchData.value };
        setSearchData(data);
    }
    return (
        <div>
            <div className="border-top border-primary py-3">
                <div className="row">
                    <div className="col-md-10">
                        <h2>Sme</h2>
                    </div>
                </div>
                <div>
                </div>
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-10">
                        <FormBuilder onUpdate={handleInput}>
                            <form ref={companyForm}>
                                <div className="row">
                                    <div className="col-md-3" style={{ display: 'flex' }}>
                                        <input type="text" id="name" className="form-control ft-14" placeholder="Search Name" name="name_of_company" />
                                    </div>
                                    <div className="col-md-3" style={{ display: 'flex' }}>
                                        <select name="state" id="state" className="form-select ft-14" onChange={(e) => { handleStateChange(e) }}>
                                            <option value="">Select State</option>
                                            {statesData.map((name: any, i: number) => (
                                                <option key={i} value={name.state}>
                                                    {name.state}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3" style={{ display: 'flex' }}>
                                        <select name="taluka" id="taluka" className="form-select ft-14" onChange={(e) => { handleCityChange(e) }}>
                                            <option value="">Select City</option>
                                            {cityData.map((name: any, i: number) => (
                                                <option key={i} value={name}>
                                                    {name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3" style={{ display: 'flex' }}>
                                        <input type="text" id="area" className="form-control ft-14" placeholder="Search Location" name="area" />
                                    </div>
                                    <div className="col-md-3 mt-2">
                                        <input type="text" className="form-control ft-14" placeholder="Custom Search" name="search_name" />
                                    </div>
                                    <div className="col-md-3 mt-2">
                                        <select name="searchFilter" className="form-select ft-14" onChange={(e) => { handleFilterChange(e) }}>
                                            <option value="">Select Filter</option>
                                            {filteredData.map((name: any, i: number) => (
                                                <option key={i} value={name.value}>
                                                    {name.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </FormBuilder>
                    </div>
                    <div className="col-md-2 mt-5">
                        <button className="small_btn px-3 cursor-pointer" type="button" onClick={() => handleSearch()}>Search</button>&nbsp;
                        <button className="btn clear-btn cursor-pointer" type="button" onClick={() => handleRefresh()}>
                            Clear
                        </button>
                    </div>
                </div>
                {loading &&
                    <AppLoader loading={loading}></AppLoader>
                }
                {!loading && <DataTable TableCols={SmeDataGridCols} tableData={smeList} searchText={onSearchText}
                    editInfo={onEditCompany} deleteInfo={onDeleteCompany}
                    pageNumber={onPageChange} activePageNumber={activePage} pageNumbers={pageArray}></DataTable>}
            </div>
        </div >
    )
}
