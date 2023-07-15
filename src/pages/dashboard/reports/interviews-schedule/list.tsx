import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { DataTable } from '../../../../components/data-table';
import FormBuilder from '../../../../components/form-builder';
import { InterviewsDataGridCols } from './data-grid-cols';

export const InterviewScheduleList = () => {
    let { id } = useParams<{ id: string }>();
    const companyId = parseInt(id);
    const [pageArray, setPageNumbers] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [interviewList, setinterviewList] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const companyForm = useRef<any>({});
    const [searchData, setSearchData] = useState<any>({});
    const [statesData, setStatesData] = useState<any>([]);
    const [cityData, setCityData] = useState<any>([]);

    const history = useHistory();
    const filteredData = [
        { name: 'Contact Number', value: 'contact_number' },
        { name: 'Address', value: 'address' },
        { name: 'District', value: 'district' },
        { name: 'Pincode', value: 'pin_code' },
    ];
    useEffect(() => {
    }, []);


    const onSearchText = (data: any) => {
    };

    const onPageChange = (data: any) => {
        setActivePage(data);
    }

    const onEditinterview = (data: any) => {
        history.push(`/dashboard/sme/info/${companyId}/interviewsform/${data.id}`);
    }

    const onDeleteinterview = (data: any) => {
        const id = data.id;
    }
    const handleStateChange = (e: any) => {
    }

    const handleCityChange = (e: any) => {
    }

    const handleInput = (data: any) => {
        setSearchData(data);
    };

    const handleFilterChange = (e: any) => {
        const data = { ...searchData.value };
        setSearchData(data);
    }

    function handleSearch() {
        const data = { ...searchData.value };
    }

    function handleRefresh() {
        companyForm.current.reset();
        setSearchData({});
    }
    return (
        <div className='siftedx-table mt-2 pb-3 mx-5'>
            {loading &&
                <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }
            <div className="row py-3" style={{ marginBottom: '15px' }}>
                <div className="col-md-10 my-2 px-3">
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
            {!loading && <DataTable TableCols={InterviewsDataGridCols} tableData={interviewList} editInfo={onEditinterview} deleteInfo={onDeleteinterview}
                activePageNumber={activePage} searchText={onSearchText} pageNumber={onPageChange} pageNumbers={pageArray}></DataTable>}
        </div>
    )
}