import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { CandidatesService } from '../../../../app/service/candidates.service';
import { DataTable } from '../../../../components/data-table'
import FormBuilder from '../../../../components/form-builder';
import NoData from '../../../../components/no-data';
import { CandidatesDataGridCols } from './data-grid-cols';

export const CandidatesList = () => {
    let { id, code } = useParams<{ id: string, code: string }>();
    const companyId = id || sessionStorage.getItem('company_uuid') || '';
    const location = useLocation().pathname;
    const companyCode = code;
    const [pageArray, setPageNumbers] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [candidatesList, setcandidatesList] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const companyForm = useRef<any>({});
    const [searchData, setSearchData] = useState<any>({});

    const history = useHistory();
    const filteredData = [
        { name: 'Contact Number', value: 'contact_number' },
        { name: 'Address', value: 'address' },
        { name: 'District', value: 'district' },
        { name: 'Pincode', value: 'pin_code' },
    ];

    useEffect(() => {
        setLoading(true);
        getCandidates();
    }, []);

    const getCandidates = () => {
        CandidatesService.getCandidates(id).then(
            res => {
                setcandidatesList([...res]);
                setLoading(false);
            }
        )
    }
    const onSearchText = (data: any) => {
    };

    const onPageChange = (data: any) => {
        setActivePage(data);
    }

    const onEditcandidates = (data: any) => {
        if (data.item && data.type === 'Edit') {
            history.push(`/dashboard/companies/info/${companyId}/candidateform/${data.item?.uuid}`);
        } else if (data.type === 'link') {
            history.push(`/dashboard/companies/info/${companyId}/view/${data.item?.uuid}`);
        } else {
            history.push(`/dashboard/companies/info/0/mapcandidates/0/0`);
        }
    }

    const onDeletecandidates = (data: any) => {
        setLoading(true);
        CandidatesService.deleteCandidate(data?.uuid).then(
            res => {
                getCandidates();
                setLoading(false);
            }
        )
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
        <div className={`${location === '/dashboard/candidates' ? 'px-5 py-2' : ''}`}>
            {location === '/dashboard/candidates' && <div className="row py-4">
                <div className="col-md-8">
                    <h4>Candidates</h4>
                </div>
                <div className="border-primary text-end col-md-4">
                    {location === '/dashboard/candidates' &&
                        <Link to={`/dashboard/candidates/${companyId}/form/0`} className="small_btn px-5 rounded-12">Add</Link>}
                </div>
            </div>}
            {loading ?
                <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
                :
                <div className='siftedx-table pb-3'>
                    <div className="row py-3 px-3">
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
                    {candidatesList.length > 0 ?
                        <DataTable TableCols={CandidatesDataGridCols} tableData={candidatesList} editInfo={onEditcandidates} deleteInfo={onDeletecandidates}
                            activePageNumber={activePage} searchText={onSearchText} pageNumber={onPageChange} pageNumbers={pageArray}></DataTable> : <div className="tab-pane" id="nav-profile">
                            <NoData message=""></NoData>
                        </div>
                    }
                </div>}
        </div>
    )
}