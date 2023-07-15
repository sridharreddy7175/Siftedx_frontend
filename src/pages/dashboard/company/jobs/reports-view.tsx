import React, { useEffect, useState } from 'react'
import { Offcanvas } from 'react-bootstrap';
import { DataTable } from '../../../../components/data-table';
import { JobsReportsGridCols } from './data-grid-cols';

export const JobReportView = () => {
    const [loading, setLoading] = useState(false);
    const [jobsList, setjobsList] = useState<any>([]);
    const [activePage, setActivePage] = useState(1);
    const [pageArray, setPageNumbers] = useState(1);
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    useEffect(() => {

    }, []);
    const onEditjobs = (data: any) => {
        if (data.type === 'ReportView') {
            handleShow();
        }
    }
    const onDeletejobs = (data: any) => {
        const id = data.id;
    }
    const onSearchText = (data: any) => {
    };

    const onPageChange = (data: any) => {
        setActivePage(data);
    }

    const handleClose = () => {
        setShow(false);
    }

    const handleShow = () => {
        setShow(true);
    }
    const handleCloseCanves = () => {
        setShow(false);
    }
    const handleShowQuickState = () => {
        setShow2(true);
    }
    const handleCloseCanves2 = () => {
        setShow2(false);
    }
    return (
        <div>
            <div className='border_color rounded-3 p-3 bg-white'>
                <p className='text-center'>Report not generated</p>
                
                <div className=''>
                    <Offcanvas show={show2} onHide={handleClose} placement={'end'}>
                        <Offcanvas.Body>
                            <div className=''>
                                <div className='bg-white p-4'>
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <h5 className='download_heading'>Rohan N Krishnamurthi - Clerra Hyatt</h5>
                                            <p className='download_para'>Report by SME based on the interview</p>
                                        </div>
                                        <div>
                                            <button className='large_btn rounded'>View Full Profile</button>
                                            <button className='dashboard_happy_monday_dot_btn px-2 py-1 rounded mx-2' onClick={() => handleCloseCanves2()}><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.8327 1.34167L10.6577 0.166668L5.99935 4.825L1.34102 0.166668L0.166016 1.34167L4.82435 6L0.166016 10.6583L1.34102 11.8333L5.99935 7.175L10.6577 11.8333L11.8327 10.6583L7.17435 6L11.8327 1.34167Z" fill="black" />
                                            </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <h6 className='mb-4 report_heading'>Quick Stats</h6>
                                        <ul className='d-flex list-inline'>
                                            <li>
                                                <ul className='list-inline'>
                                                    <li><p className='report_details_headings'>Added on</p></li>
                                                    <li><p className='report_details_headings'>Added by</p></li>
                                                    <li><p className='report_details_headings'>Availability</p></li>
                                                    <li><p className='report_details_headings'>Experience</p></li>
                                                    <li><p className='report_details_headings'>Competency</p></li>
                                                    <li><p className='report_details_headings'>Skills</p></li>
                                                </ul>
                                            </li>

                                            <li className='ms-5'>
                                                <ul className='list-inline'>
                                                    <li><p className='report_details'>31 jan 2022</p></li>
                                                    <li><p className='report_details text-decoration-underline'>Recruiter Name</p></li>
                                                    <li><p className='report_details'>28 Feb, 4pm</p></li>
                                                    <li><p className='report_details'>4.2 <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                    </svg>
                                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                        </svg>
                                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                        </svg>
                                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                        </svg>
                                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#A9A9A9" />
                                                        </svg>
                                                    </p></li>
                                                    <li><p className='report_details'>3.0 <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                    </svg>
                                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                        </svg>
                                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                        </svg>
                                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#A9A9A9" />
                                                        </svg>
                                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#A9A9A9" />
                                                        </svg>
                                                    </p></li>
                                                    <li><p className='report_details'>
                                                        <span className='skills_border_color'>Photogrammetry</span>
                                                        <span className='mx-3 skills_border_color'>Satellite analytics</span>
                                                        <span className='mx-3 skills_border_color'>Python</span>
                                                    </p></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Offcanvas.Body>
                    </Offcanvas>
                </div>

                <div>
                    <Offcanvas show={show} onHide={handleClose} placement={'end'}>
                        <Offcanvas.Body>
                            <div className=''>
                                <div className='bg-white p-4'>
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <h5 className='download_heading'>Rohan N Krishnamurthi - Clerra Hyatt</h5>
                                            <p className='download_para'>Report by SME based on the interview</p>
                                        </div>
                                        <div>
                                            <button className='large_btn rounded'>Download</button>
                                            <button className='dashboard_happy_monday_dot_btn px-2 py-1 rounded mx-2' onClick={() => handleCloseCanves()}><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.8327 1.34167L10.6577 0.166668L5.99935 4.825L1.34102 0.166668L0.166016 1.34167L4.82435 6L0.166016 10.6583L1.34102 11.8333L5.99935 7.175L10.6577 11.8333L11.8327 10.6583L7.17435 6L11.8327 1.34167Z" fill="black" />
                                            </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <h6 className='mb-4 report_heading'>Report</h6>
                                        <ul className='d-flex list-inline'>
                                            <li>
                                                <ul className='list-inline'>
                                                    <li><p className='report_details_headings'>Interview ID</p></li>
                                                    <li><p className='report_details_headings'>Interviewer</p></li>
                                                    <li><p className='report_details_headings'>Interview date </p></li>
                                                    <li><p className='report_details_headings'>Experience</p></li>
                                                    <li><p className='report_details_headings'>Competency</p></li>
                                                    <li><p className='report_details_headings'>Skills</p></li>
                                                </ul>
                                            </li>

                                            <li className='ms-5'>
                                                <ul className='list-inline'>
                                                    <li><p className='report_details'>name@mail.com</p></li>
                                                    <li><p className='report_details text-decoration-underline'>Clerra Hyatt</p></li>
                                                    <li><p className='report_details'>31 Jan 2022</p></li>
                                                    <li><p className='report_details'>4.2 <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                    </svg>
                                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                        </svg>
                                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                        </svg>
                                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                        </svg>
                                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#A9A9A9" />
                                                        </svg>
                                                    </p></li>
                                                    <li><p className='report_details'>3.0 <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                    </svg>
                                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                        </svg>
                                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#FFA800" />
                                                        </svg>
                                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#A9A9A9" />
                                                        </svg>
                                                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.99935 8.04439L9.29713 10.4444L8.0349 6.56883L11.3327 4.22217H7.28824L5.99935 0.222168L4.71046 4.22217H0.666016L3.96379 6.56883L2.70157 10.4444L5.99935 8.04439Z" fill="#A9A9A9" />
                                                        </svg>
                                                    </p></li>
                                                    <li><p className='report_details'>
                                                        <span className='skills_border_color'>Photogrammetry</span>
                                                        <span className='mx-3 skills_border_color'>Satellite analytics</span>
                                                        <span className='skills_border_color'>Python</span>
                                                    </p></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h6 className='report_details_headings'>Comments</h6>
                                        <p className='report_details'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
                                    </div>
                                    <div>
                                        <h6 className='report_details_headings'>Short Summary</h6>
                                        <p className='report_details'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</p>
                                    </div>
                                    <div>
                                        <h6 className='report_details_headings'>Detailed Summary</h6>
                                        <p className='report_details'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                    </div>
                                    <div>
                                        <h6 className='report_details_headings'>Audio Summary</h6>
                                        <p><audio src="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3" controls /></p>
                                    </div>
                                    <div className='my-5 text-end px-5'>
                                        <p className='right_side_para_links m-0 p-0 my-2'>Video link</p>
                                        <p className='right_side_para_links m-0 p-0'>Full Report</p>
                                    </div>
                                </div>
                            </div>
                        </Offcanvas.Body>
                    </Offcanvas>
                </div>
                {/* <DataTable TableCols={JobsReportsGridCols} tableData={jobsList} editInfo={onEditjobs} deleteInfo={onDeletejobs}
                    activePageNumber={activePage} searchText={onSearchText} pageNumber={onPageChange} pageNumbers={pageArray}></DataTable> */}
            </div>
        </div>
    )
}