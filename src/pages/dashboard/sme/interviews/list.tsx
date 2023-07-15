import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { DataTable } from '../../../../components/data-table';
import FormBuilder from '../../../../components/form-builder';
import { InterviewsDataGridCols } from './data-grid-cols';

export const InterviewList = () => {
    let { id } = useParams<{ id: string }>();
    const companyId = parseInt(id);
    const [pageArray, setPageNumbers] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [interviewList, setinterviewList] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const companyForm = useRef<any>({});
    const [searchData, setSearchData] = useState<any>({});
    const pathname = window.location.href.split('/')[6];
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
    return (
        <div>
            {interviewList.length === 0 && pathname !== 'interviews' && <div className="border-primary py-3 text-end">
                <Link to={`/dashboard/sme/info/${companyId}/interviewsform/0`} className="small_btn px-5 rounded-12">Add</Link>
            </div>}
            {pathname === 'interviews' && <div className="row px-5 py-4">
                <div className="col-md-10">
                    <h2>Interviews</h2>
                </div>
            </div>}
            {loading &&
                <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }
            <div className="add_company_border mx-5 px-3 pt-3 pb-5" style={{ marginBottom: '15px' }}>
                <div className='row px-3'>
                    <div className="col-md-10">
                        <FormBuilder onUpdate={handleInput}>
                            <form ref={companyForm}>
                                <div className="row">
                                    <div className="col-md-3" >
                                        <label htmlFor="">Company</label>
                                        <select name="state" id="state" className="form-select ft-14" onChange={(e) => { handleStateChange(e) }}>
                                            <option value="">Select Company</option>
                                            <option value="shifted-x">shifted-x</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="">From Date</label>
                                        <input type="date" id="area" className="form-control ft-14" placeholder="" name="area" />
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="">To Date</label>

                                        <input type="Date" id="area" className="form-control ft-14" placeholder="Search Location" name="area" />
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="">Search</label>
                                        <input type="text" className="form-control ft-14" placeholder="Custom Search" name="search_name" />
                                    </div>
                                </div>
                            </form>
                        </FormBuilder>
                    </div>
                    <div className="col-md-2 text-end" style={{ marginTop: "20px" }}>
                        <button className="small_btn px-3 cursor-pointer" type="button" onClick={() => handleSearch()}>Search</button>&nbsp;
                        <button className="btn clear-btn cursor-pointer" type="button" onClick={() => handleRefresh()}>
                            Clear
                        </button>
                    </div>
                </div>
                {!loading && <DataTable TableCols={InterviewsDataGridCols} tableData={interviewList} editInfo={onEditinterview} deleteInfo={onDeleteinterview}
                    activePageNumber={activePage} searchText={onSearchText} pageNumber={onPageChange} pageNumbers={pageArray}></DataTable>}
            </div>
        </div>
    )
}