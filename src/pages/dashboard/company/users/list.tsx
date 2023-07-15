import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { UsersService } from '../../../../app/service/users.service';
import { DataTable } from '../../../../components/data-table'
import FormBuilder from '../../../../components/form-builder';
import NoData from '../../../../components/no-data';
import { UsersDataGridCols } from './data-grid-cols';

export const UsersList = () => {
    let { id } = useParams<{ id: string }>();
    const companyUuid = id || sessionStorage.getItem('company_uuid') || '1';
    const [pageArray, setPageNumbers] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [userList, setuserList] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const location = useLocation().pathname;
    const companyForm = useRef<any>({});
    const [searchData, setSearchData] = useState<any>({});
    const [statesData, setStatesData] = useState<any>([]);
    const [cityData, setCityData] = useState<any>([]);

    const history = useHistory();
    useEffect(() => {
        setLoading(true);
        getUsers();
    }, []);
    const getUsers = () => {
        UsersService.getUsers(companyUuid, '').then(
            res => {
                setuserList(res);
                setLoading(false);
            }
        )
    }

    const onSearchText = (data: any) => {
    };

    const onPageChange = (data: any) => {
        setActivePage(data);
    }

    const onEdituser = (data: any) => {
        history.push(`/dashboard/companies/info/${id}/userform/${data?.item?.uuid}`);
    }

    const onDeleteuser = (data: any) => {
        UsersService.deleteUser(data.uuid).then(
            res => {
                setLoading(true);
                getUsers();
            }
        )
    }
    return (
        <div className={`background-gray ${location === '/dashboard/users' ? 'px-5 py-4' : ''}`} >
            {location === '/dashboard/users' && <div className="row px-2">
                <div className="col-md-10">
                    <h4 className='mt-3 top_heading_styles'>Users</h4>
                </div>
                <div className="col-md-2 text-end mt-2">
                    {location === '/dashboard/users' &&
                        <Link to={`/dashboard/users/${companyUuid}/form/0`} className="large_btn rounded-3">Add</Link>}
                </div>
            </div>}
            {loading ?
                <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div> :
                <div className='siftedx-table mx-2'>
                    <div className="row m-3" style={{ marginBottom: '15px' }}>
                        <div className="col-md-12">
                            <div className='px-lg-3 d-sm-flex justify-content-sm-between'>
                                <div className='d-flex select_all_left_side mb-sm-0 mb-3'>
                                    <div className="form-check mt-2">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                        <label className="form-check-label text-black" style={{ fontSize: "13px" }}>
                                            Select All
                                        </label>
                                    </div>
                                    {/*<button className='small_btn rounded ms-3 move_padding'>Move</button>*/}
                                </div>
                                <div className='d-flex search_and_filter_right_side'>
                                    <div className="input-group candidate_search_bar_border mt-1">
                                        <span className="input-group-text input_group_text" id="basic-addon1"><i className="fa fa-search pointer" aria-hidden="true"></i></span>
                                        <input type="text" className="form-control form_control_border" placeholder="Search candidates by name" aria-label="Username" aria-describedby="basic-addon1" />
                                    </div>
                                    <button className='large_btn rounded ms-3 d-flex my-auto'><svg width="17" height="11" className='my-auto mx-1' viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.75 10.75H10.25V9H6.75V10.75ZM0.625 0.25V2H16.375V0.25H0.625ZM3.25 6.375H13.75V4.625H3.25V6.375Z" fill="white" />
                                    </svg> Filter</button>
                                </div>
                            </div>
                            {/* <div className='px-2 d-flex justify-content-between'>
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
                            </div> */}
                        </div>
                    </div>
                    {userList.length > 0 ?
                        <DataTable TableCols={UsersDataGridCols} tableData={userList} editInfo={onEdituser} deleteInfo={onDeleteuser}
                            activePageNumber={activePage} searchText={onSearchText} pageNumber={onPageChange} pageNumbers={pageArray}></DataTable> : <div className="tab-pane" id="nav-profile">
                            <NoData message=""></NoData>
                        </div>
                    }
                </div>}
        </div>
    )
}