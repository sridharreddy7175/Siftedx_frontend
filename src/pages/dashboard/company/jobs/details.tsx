import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useHistory, useLocation, useParams } from 'react-router-dom'
import { JobsService } from '../../../../app/service/jobs.service';
import { DataTable } from '../../../../components/data-table'
import FormBuilder from '../../../../components/form-builder';
import { JobsCandidateGridCols } from './data-grid-cols';

export const JobsDetails = () => {
    let { id, companyCode } = useParams<{ id: string, companyCode: string }>();
    const companyId = id || sessionStorage.getItem('company_uuid') || '';
    const [pageArray, setPageNumbers] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [jobsList, setjobsList] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation().pathname;
    const history = useHistory();
    const companyForm = useRef<any>({});
    const [searchData, setSearchData] = useState<any>({});

    useEffect(() => {
        JobsService.getJobs(companyId).then(
            res => {
                setjobsList(res);
            }
        )
    }, []);


    const onSearchText = (data: any) => {
    };

    const onPageChange = (data: any) => {
        setActivePage(data);
    }

    const onEditjobs = (data: any) => {
        if (data.item && data.type === 'jobDetails') {
            history.push(`/dashboard/companies/info/${companyId}/candidate_status/${companyCode}/${data.item.id}`);
        }
    }

    const onDeletejobs = (data: any) => {
        const id = data.id;
    }

    const handleInput = (data: any) => {
        setSearchData(data);
    };

    return (
        <div>
            <div className="row">
                <div className="col-md-12 my-3">
                    <div className='row d-flex justify-content-between'>
                        <div className="col-9">
                            <span className='fs-2 fw-bold'>Java Developers</span> - <span className='fs-2 fw-bold'>Candidates List</span>
                        </div>
                        <div className="col-3 text-end pt-2">
                            {location === '/dashboard/candidates' ?
                                <Link to={`/dashboard/candidates/${companyId}/form/0`} className="small_btn px-5 rounded-12">Add</Link> : <Link to={`/dashboard/companies/info/${companyId}/candidateform/0`} className="small_btn px-5 rounded-12">Add</Link>}
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

            <div>
                <NavLink to={`/dashboard/companies/info/${id}/description/1/1`} style={{ color: "#1A356F", margin: "0px 10px", fontWeight: 600, cursor: "pointer", textDecoration: "none", borderBottom: "2px solid #1A356F" }}>Description</NavLink>
                <NavLink to={`/dashboard/companies/info/${id}/job_details/1/1`} style={{ color: "#1A356F", margin: "0px 10px", fontWeight: 600, textDecoration: "none" }}>Candidates (10)</NavLink>
                <NavLink to={''} style={{ color: "#1A356F", margin: "0px 10px", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>SMEs</NavLink>
                <NavLink to={''} style={{ color: "#1A356F", margin: "0px 10px", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>Interviews</NavLink>
                <NavLink to={''} style={{ color: "#1A356F", margin: "0px 10px", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>Reports</NavLink>
            </div>
            <div style={{ border: "1px solid #1A356F", borderRadius: "5px", }}>
                <div style={{ display: "flex", marginBottom: "10px" }}>
                    <div style={{ width: "100px", fontSize: "20px", padding: "0px 20px" }}>
                        <span>
                            <i className="bi bi-list me-2"></i>{10}
                        </span>
                        <p>All</p>
                    </div>
                    <div style={{ display: "flex", border: "1px solid #1A356F", background: "#F4F4F4", width: "100%" }}>
                        <div style={{ width: "100px", fontSize: "20px", padding: "0px 20px" }}>
                            <span>
                                <i className="bi bi-box-arrow-in-down me-2"></i>{4}
                            </span>
                            <p>Added</p>
                        </div>
                        <div style={{ width: "110px", fontSize: "20px", padding: "0px 20px" }}>
                            <span>
                                <i className="bi bi-calendar2-check me-2"></i>{4}
                            </span>
                            <p>Scheduled</p>
                        </div>
                        <div style={{ width: "210px", fontSize: "20px", padding: "0px 20px" }}>
                            <span>
                                <i className="bi bi-exclamation-circle-fill me-2"></i>{4}
                            </span>
                            <p>To be re-scheduled</p>
                        </div>
                        <div style={{ width: "100px", fontSize: "20px", padding: "0px 20px" }}>
                            <span>
                                <i className="bi bi-flag-fill me-2"></i>{4}
                            </span>
                            <p>Screened</p>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ marginBottom: '15px', padding: "0px 10px " }}>
                    <div className="col-md-12 mb-2">
                        <FormBuilder onUpdate={handleInput}>
                            <form ref={companyForm}>
                                <div className="row">
                                    <div className="col-md-3 mt-2">
                                        <input type="text" className="form-control ft-14" placeholder="Custom Search" name="search_name" />
                                    </div>
                                </div>
                            </form>
                        </FormBuilder>
                    </div>
                </div>
                <div style={{ padding: "0px 10px " }}>
                    {
                        !loading && <DataTable TableCols={JobsCandidateGridCols} tableData={jobsList} editInfo={onEditjobs} deleteInfo={onDeletejobs}
                            activePageNumber={activePage} searchText={onSearchText} pageNumber={onPageChange} pageNumbers={pageArray}></DataTable>
                    }
                </div>
            </div>
        </div >
    )
}