import React from 'react'

export const dashboardFigmaPage = () => {
    return (
        <div className='dashboard_happy_monday'>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-2 bg-white'>
                    </div>
                    <div className='col-10'>
                        <div className='happy_monday_heading p-4'>
                            <h5 className='top_heading_styles'>Happy Monday, John</h5>
                            <p className='top_para_styles'>Welcome to your dashboard</p>
                        </div>
                        <div className='row ps-4 pe-5'>
                            <div className='col-lg-8 col-md-6 col-12 mx-auto'>
                                <div className='row gy-4'>
                                    <div className='col-lg-4 col-md-4 col-12 mx-auto'>
                                        <div className='border_color bg-white rounded-3 py-4 px-3'>
                                            <h6 className='dashboard_happy_monday_card_heading'><span className='fs-4 text_color'>3</span> Open jobs</h6>
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-md-4 col-12 mx-auto'>
                                        <div className='border_color bg-white rounded-3 py-4 px-3'>
                                            <h6 className='dashboard_happy_monday_card_heading'><span className='fs-4 text_color'>7</span> Upcoming Interviews</h6>
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-md-4 col-12 mx-auto'>
                                        <div className='border_color bg-white rounded-3 py-4 px-3'>
                                            <h6 className='dashboard_happy_monday_card_heading'><span className='fs-4 text_color'>2</span> New assesment reports</h6>
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-12 mx-auto'>
                                        <h6 className='dashboard_happy_monday_third_line mt-5'>Open Job Positions</h6>
                                        <div className='rounded-3 mb-4'>
                                            <div className='bg-white d-flex justify-content-between px-3 py-3 rounded-top' style={{ borderBottom: "2px solid #BBBBBB" }}>
                                                <ul className='list-inline my-auto'>
                                                    <li className='dashboard_happy_monday_fourth_line'>Senior AI Engineer</li>
                                                    <li className='dashboard_happy_monday_fifth_line'>NY, USA • Artificial Inteligence</li>
                                                </ul>
                                                <ul className='d-flex list-inline my-auto'>
                                                    <li className=''><svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7.99958 12.0232L3.05515 15L4.39935 9.44444L0 5.72968L5.77467 5.27363L7.99958 0L10.2245 5.27363L16 5.72968L11.5998 9.44444L12.944 15L7.99958 12.0232Z" fill="#FFA800" />
                                                    </svg>
                                                    </li>
                                                    <li className='mx-2'><button className='large_btn rounded'>Open</button></li>
                                                    <li className=''><button className='large_btn rounded'><svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM14 4C15.1 4 16 3.1 16 2C16 0.9 15.1 0 14 0C12.9 0 12 0.9 12 2C12 3.1 12.9 4 14 4ZM8 0C6.9 0 6 0.9 6 2C6 3.1 6.9 4 8 4C9.1 4 10 3.1 10 2C10 0.9 9.1 0 8 0Z" fill="black" />
                                                    </svg>
                                                    </button></li>
                                                </ul>
                                            </div>
                                            <div className='bg_gray d-flex justify-content-between px-3 py-3 rounded-bottom '>
                                                <h6 className='dashboard_happy_monday_candidates_text'><span className='fs-4'>10</span> Candidates</h6>
                                                <div>
                                                    <ul className='d-flex list-inline'>
                                                        <li className='mx-3 dashboard_happy_monday_number'><span className='me-1'><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M16 0H1.99C0.88 0 0.00999999 0.9 0.00999999 2L0 16C0 17.1 0.88 18 1.99 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM16 12H12C12 13.66 10.65 15 9 15C7.35 15 6 13.66 6 12H1.99V2H16V12ZM13 7H11V4H7V7H5L9 11L13 7Z" fill="#757575" />
                                                        </svg>
                                                        </span> 4</li>
                                                        <li className='mx-3 dashboard_happy_monday_number'><span className='me-1'><svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M16 2H15V0H13V2H5V0H3V2H2C0.89 2 0 2.9 0 4V18C0 19.1 0.89 20 2 20H16C17.1 20 18 19.1 18 18V4C18 2.9 17.1 2 16 2ZM9 5C10.66 5 12 6.34 12 8C12 9.66 10.66 11 9 11C7.34 11 6 9.66 6 8C6 6.34 7.34 5 9 5ZM15 17H3V16C3 14 7 12.9 9 12.9C11 12.9 15 14 15 16V17Z" fill="#757575" />
                                                        </svg>
                                                        </span> 3</li>
                                                        <li className='mx-3 dashboard_happy_monday_number'><span className='me-1'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#757575" />
                                                        </svg>
                                                        </span> 2</li>
                                                        <li className='mx-3 dashboard_happy_monday_number'><span className='me-1'><svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.4 2L9 0H0V17H2V10H7.6L8 12H15V2H9.4Z" fill="#757575" />
                                                        </svg>
                                                        </span> 1</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='border_color rounded-3 mb-4'>
                                            <div className='bg-white d-flex justify-content-between px-3 py-3 rounded-top' style={{ borderBottom: "2px solid #BBBBBB" }}>
                                                <ul className='list-inline my-auto'>
                                                    <li className='dashboard_happy_monday_fourth_line'>Senior AI Engineer</li>
                                                    <li className='dashboard_happy_monday_fifth_line'>NY, USA • Artificial Inteligence</li>
                                                </ul>
                                                <ul className='d-flex list-inline my-auto'>
                                                    <li className=''><svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7.99958 12.0232L3.05515 15L4.39935 9.44444L0 5.72968L5.77467 5.27363L7.99958 0L10.2245 5.27363L16 5.72968L11.5998 9.44444L12.944 15L7.99958 12.0232Z" fill="#FFA800" />
                                                    </svg>
                                                    </li>
                                                    <li className='mx-2'><button className='large_btn rounded'>open</button></li>
                                                    <li className=''><button className='large_btn rounded'><svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM14 4C15.1 4 16 3.1 16 2C16 0.9 15.1 0 14 0C12.9 0 12 0.9 12 2C12 3.1 12.9 4 14 4ZM8 0C6.9 0 6 0.9 6 2C6 3.1 6.9 4 8 4C9.1 4 10 3.1 10 2C10 0.9 9.1 0 8 0Z" fill="black" />
                                                    </svg>
                                                    </button></li>
                                                </ul>
                                            </div>
                                            <div className='bg_gray d-flex justify-content-between px-3 py-3 rounded-bottom '>
                                                <h6 className='dashboard_happy_monday_candidates_text'><span className='fs-4'>10</span> Candidates</h6>
                                                <div>
                                                    <ul className='d-flex list-inline'>
                                                        <li className='mx-3 dashboard_happy_monday_number'><span className='me-1'><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M16 0H1.99C0.88 0 0.00999999 0.9 0.00999999 2L0 16C0 17.1 0.88 18 1.99 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM16 12H12C12 13.66 10.65 15 9 15C7.35 15 6 13.66 6 12H1.99V2H16V12ZM13 7H11V4H7V7H5L9 11L13 7Z" fill="#757575" />
                                                        </svg>
                                                        </span> 4</li>
                                                        <li className='mx-3 dashboard_happy_monday_number'><span className='me-1'><svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M16 2H15V0H13V2H5V0H3V2H2C0.89 2 0 2.9 0 4V18C0 19.1 0.89 20 2 20H16C17.1 20 18 19.1 18 18V4C18 2.9 17.1 2 16 2ZM9 5C10.66 5 12 6.34 12 8C12 9.66 10.66 11 9 11C7.34 11 6 9.66 6 8C6 6.34 7.34 5 9 5ZM15 17H3V16C3 14 7 12.9 9 12.9C11 12.9 15 14 15 16V17Z" fill="#757575" />
                                                        </svg>
                                                        </span> 3</li>
                                                        <li className='mx-3 dashboard_happy_monday_number'><span className='me-1'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#757575" />
                                                        </svg>
                                                        </span> 2</li>
                                                        <li className='mx-3 dashboard_happy_monday_number'><span className='me-1'><svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.4 2L9 0H0V17H2V10H7.6L8 12H15V2H9.4Z" fill="#757575" />
                                                        </svg>
                                                        </span> 1</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='border_color rounded-3 mb-4'>
                                            <div className='bg-white d-flex justify-content-between px-3 py-3 rounded-top' style={{ borderBottom: "2px solid #BBBBBB" }}>
                                                <ul className='list-inline my-auto'>
                                                    <li className='dashboard_happy_monday_fourth_line'>Senior AI Engineer</li>
                                                    <li className='dashboard_happy_monday_fifth_line'>NY, USA • Artificial Inteligence</li>
                                                </ul>
                                                <ul className='d-flex list-inline my-auto'>
                                                    <li className=''><svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7.99958 12.0232L3.05515 15L4.39935 9.44444L0 5.72968L5.77467 5.27363L7.99958 0L10.2245 5.27363L16 5.72968L11.5998 9.44444L12.944 15L7.99958 12.0232Z" fill="#FFA800" />
                                                    </svg>
                                                    </li>
                                                    <li className='mx-2'><button className='large_btn rounded'>open</button></li>
                                                    <li className=''><button className='large_btn rounded'><svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM14 4C15.1 4 16 3.1 16 2C16 0.9 15.1 0 14 0C12.9 0 12 0.9 12 2C12 3.1 12.9 4 14 4ZM8 0C6.9 0 6 0.9 6 2C6 3.1 6.9 4 8 4C9.1 4 10 3.1 10 2C10 0.9 9.1 0 8 0Z" fill="black" />
                                                    </svg>
                                                    </button></li>
                                                </ul>
                                            </div>
                                            <div className='bg_gray d-flex justify-content-between px-3 py-3 rounded-bottom '>
                                                <h6 className='dashboard_happy_monday_candidates_text'><span className='fs-4'>10</span> Candidates</h6>
                                                <div>
                                                    <ul className='d-flex list-inline'>
                                                        <li className='mx-3 dashboard_happy_monday_number'><span className='me-1'><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M16 0H1.99C0.88 0 0.00999999 0.9 0.00999999 2L0 16C0 17.1 0.88 18 1.99 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM16 12H12C12 13.66 10.65 15 9 15C7.35 15 6 13.66 6 12H1.99V2H16V12ZM13 7H11V4H7V7H5L9 11L13 7Z" fill="#757575" />
                                                        </svg>
                                                        </span> 4</li>
                                                        <li className='mx-3 dashboard_happy_monday_number'><span className='me-1'><svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M16 2H15V0H13V2H5V0H3V2H2C0.89 2 0 2.9 0 4V18C0 19.1 0.89 20 2 20H16C17.1 20 18 19.1 18 18V4C18 2.9 17.1 2 16 2ZM9 5C10.66 5 12 6.34 12 8C12 9.66 10.66 11 9 11C7.34 11 6 9.66 6 8C6 6.34 7.34 5 9 5ZM15 17H3V16C3 14 7 12.9 9 12.9C11 12.9 15 14 15 16V17Z" fill="#757575" />
                                                        </svg>
                                                        </span> 3</li>
                                                        <li className='mx-3 dashboard_happy_monday_number'><span className='me-1'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#757575" />
                                                        </svg>
                                                        </span> 2</li>
                                                        <li className='mx-3 dashboard_happy_monday_number'><span className='me-1'><svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.4 2L9 0H0V17H2V10H7.6L8 12H15V2H9.4Z" fill="#757575" />
                                                        </svg>
                                                        </span> 1</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-4 col-md-6 col-12 mx-auto'>
                                <div className='border_color rounded-3 bg-white' >
                                    calender design
                                </div>
                                <div className='border_color mt-4 rounded-3 bg-white px-3 py-4'>
                                    <div className='notifications d-flex justify-content-between'>
                                        <p className='notifications_left_line'>3 New Notifications</p>
                                        <p className='notifications_right_line'>Mark all as read</p>
                                    </div>
                                    <div className='notifications_list'>
                                        <ul className='d-flex list-inline'>
                                            <li className=''><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="16" cy="16" r="16" fill="#F4F4F4" />
                                            </svg></li>
                                            <li className='ms-2'>
                                                <ul className='list-inline'>
                                                    <li className='notifications_third_line'><span className='fw-bold'>Navin Kulkarni</span> has accepted to interview candidate</li>
                                                    <li className='d-flex justify-content-between notifications_fourth_line'>A few seconds ago <span><svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="5" cy="5" r="5" fill="#6DC02A" />
                                                    </svg>
                                                    </span></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className='notifications_list'>
                                        <ul className='d-flex list-inline'>
                                            <li className=''><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="16" cy="16" r="16" fill="#F4F4F4" />
                                            </svg></li>
                                            <li className='ms-2'>
                                                <ul className='list-inline'>
                                                    <li className='notifications_third_line'><span className='fw-bold'>Navin Kulkarni</span> has accepted to interview candidate</li>
                                                    <li className='d-flex justify-content-between notifications_fourth_line'>A few seconds ago <span><svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="5" cy="5" r="5" fill="#6DC02A" />
                                                    </svg>
                                                    </span></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className='notifications_list'>
                                        <ul className='d-flex list-inline'>
                                            <li className=''><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="16" cy="16" r="16" fill="#F4F4F4" />
                                            </svg></li>
                                            <li className='ms-2'>
                                                <ul className='list-inline'>
                                                    <li className='notifications_third_line'><span className='fw-bold'>Navin Kulkarni</span> has accepted to interview candidate</li>
                                                    <li className='d-flex justify-content-between notifications_fourth_line'>A few seconds ago <span><svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="5" cy="5" r="5" fill="#6DC02A" />
                                                    </svg>
                                                    </span></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className='notifications_list'>
                                        <ul className='d-flex list-inline'>
                                            <li className=''><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="16" cy="16" r="16" fill="#F4F4F4" />
                                            </svg></li>
                                            <li className='ms-2'>
                                                <ul className='list-inline'>
                                                    <li className='notifications_third_line'><span className='fw-bold'>Navin Kulkarni</span> has accepted to interview candidate</li>
                                                    <li className='d-flex justify-content-between notifications_fourth_line'>A few seconds ago <span><svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="5" cy="5" r="5" fill="#6DC02A" />
                                                    </svg>
                                                    </span></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className='notifications_list'>
                                        <ul className='d-flex list-inline'>
                                            <li className=''><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="16" cy="16" r="16" fill="#F4F4F4" />
                                            </svg></li>
                                            <li className='ms-2'>
                                                <ul className='list-inline'>
                                                    <li className='notifications_third_line'><span className='fw-bold'>Navin Kulkarni</span> has accepted to interview candidate</li>
                                                    <li className='d-flex justify-content-between notifications_fourth_line'>A few seconds ago <span><svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="5" cy="5" r="5" fill="#6DC02A" />
                                                    </svg>
                                                    </span></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
