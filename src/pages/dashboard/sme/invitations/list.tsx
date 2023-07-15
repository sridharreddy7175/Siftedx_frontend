import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { DataTable } from '../../../../components/data-table';
import FormBuilder from '../../../../components/form-builder';
import { InvitationsDataGridCols } from './data-grid-cols';

export const InvitationsList = () => {
    let { id } = useParams<{ id: string }>();
    const companyId = parseInt(id);
    const [pageArray, setPageNumbers] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [interviewList, setinterviewList] = useState<any>([
        {
            company: 'shifted-x',
            date: '08-02-2022',
            time: '10:30',
            name: 'Uday',
            experience: '20',
            skills: 'java,js,node',
        }
    ]);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
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

    return (
        <div className=''>
            <div className="row px-5 py-4">
                <div className="col-md-10">
                    <h2>Invitations</h2>
                </div>
            </div>
            {loading &&
                <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }
            <div className="add_company_border mx-5 px-3 pt-3 pb-5" style={{ marginBottom: '15px' }}>
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
                {!loading && <DataTable TableCols={InvitationsDataGridCols} tableData={interviewList} editInfo={onEditinterview} deleteInfo={onDeleteinterview}
                    activePageNumber={activePage} searchText={onSearchText} pageNumber={onPageChange} pageNumbers={pageArray}></DataTable>}
            </div>
        </div>
    )
}