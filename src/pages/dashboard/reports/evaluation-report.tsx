import React from 'react'

export const EvaluationReport = () => {
    return (
        <div>
            <div className='evaluation_report'>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <h5 className='top_heading_styles'>Create Evaluation Report</h5>
                                    <p className='top_para_styles'>You are creating a new evaluation report which will be submitted to the organization</p>
                                </div>
                                <div>
                                    <button className='small_btn rounded-3'>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-9 col-12 evaluation_report_left_side_col_9'>
                            <div className='border_color rounded-3'>
                                <div className='evaluation_report_left_side_row_one'>
                                    <div className='row'>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label className="form-label job_dis_form_label">Interview ID
                                            </label>
                                            <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding" id="interviewId" name="company_name" placeholder="Prefilled ID - Can Edit" />
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label job_dis_form_label">Job Title
                                            </label>
                                            <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding" id="jobTitle" name="company_name" placeholder="Fetched Job Title" />
                                        </div>
                                        <div className="col-md-6 col-12 mb-3 padding_right">
                                            <label className="form-label job_dis_form_label">Candidate
                                            </label>
                                            <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding" id="candidate" name="company_name" placeholder="Fetched Candidate Name" />
                                        </div>
                                        <div className="col-md-6 col-12 mb-3 padding_left">
                                            <label className="form-label job_dis_form_label">Date &amp; Time
                                            </label>
                                            <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding" id="dateTime" name="company_name" placeholder="Fetched Data and Time" />
                                        </div>
                                    </div>
                                </div>
                                <div className='evaluation_report_left_side_row_two'>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <div className=''>
                                                <label className='para_style'>Did you evaluate the candidate for <span className='fw-bold'>Photogrammetry</span><span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                            </div>
                                            <div className='d-flex'>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                                    <label className="form-check-label para_style">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="form-check mx-3">
                                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                                    <label className="form-check-label para_style">
                                                        No
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mb-3 mt-3">
                                                <label className="form-label para_style">Comments<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                                <textarea className="form-control text_style text_area_width" id="exampleFormControlTextarea1" placeholder='Enter your comments about the candidate for this skill'></textarea>
                                            </div>
                                            <div className='mt-3'>
                                                <label className='para_style'>Rate Candidate�s <span className='fw-bold'>Experience</span> for this skill<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                                <div className='d-lg-flex mt-2'>
                                                    <ul className='d-inline-flex list-inline rounded-3' style={{ border: "1px solid #BBBBBB" }}>
                                                        <li className='' style={{ padding: "1px 10px 5px 10px", borderRight: "1px solid #BBBBBB" }}><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#FFA800" />
                                                        </svg>
                                                        </li>
                                                        <li style={{ padding: "1px 10px 5px 10px", borderRight: "1px solid #BBBBBB" }}><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#FFA800" />
                                                        </svg>
                                                        </li>
                                                        <li style={{ padding: "1px 10px 5px 10px", borderRight: "1px solid #BBBBBB" }}><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#FFA800" />
                                                        </svg>
                                                        </li>
                                                        <li style={{ padding: "1px 10px 5px 10px", borderRight: "1px solid #BBBBBB" }}>
                                                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#A9A9A9" />
                                                            </svg>
                                                        </li>
                                                        <li style={{ padding: "1px 10px 5px 10px" }}>
                                                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#A9A9A9" />
                                                            </svg>
                                                        </li>
                                                    </ul>
                                                    <p className='md_experience'><span className='fw-bold'>Moderate Experience</span>: Completes assignments with reasonable supervision.</p>
                                                </div>
                                            </div>
                                            <div className='mt-3'>
                                                <label className='para_style'>Rate Candidate�s <span className='fw-bold'>Competency </span>for this skill<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                                <div className='d-lg-flex mt-2'>
                                                    <ul className='d-inline-flex list-inline rounded-3' style={{ border: "1px solid #BBBBBB" }}>
                                                        <li className='' style={{ padding: "1px 10px 5px 10px", borderRight: "1px solid #BBBBBB" }}><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#FFA800" />
                                                        </svg>
                                                        </li>
                                                        <li style={{ padding: "1px 10px 5px 10px", borderRight: "1px solid #BBBBBB" }}><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#FFA800" />
                                                        </svg>
                                                        </li>
                                                        <li style={{ padding: "1px 10px 5px 10px", borderRight: "1px solid #BBBBBB" }}><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#FFA800" />
                                                        </svg>
                                                        </li>
                                                        <li style={{ padding: "1px 10px 5px 10px", borderRight: "1px solid #BBBBBB" }}>
                                                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#A9A9A9" />
                                                            </svg>
                                                        </li>
                                                        <li style={{ padding: "1px 10px 5px 10px" }}>
                                                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#A9A9A9" />
                                                            </svg>
                                                        </li>
                                                    </ul>
                                                    <p className='md_experience'><span className='fw-bold'>Superior Performer</span>: : Above-average ability is apparent in this competency.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='evaluation_report_left_side_row_one'>
                                    <label className='para_style'>Did you evaluate the candidate for <span className='fw-bold'>Satellite Analytics</span><span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                    <div className='d-flex'>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                            <label className="form-check-label para_style">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check mx-3">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <label className="form-check-label para_style">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className='evaluation_report_left_side_row_one'>
                                    <label className='para_style'>Did you evaluate the candidate for <span className='fw-bold'>Scikit-learn</span><span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                    <div className='d-flex'>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                            <label className="form-check-label para_style">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check mx-3">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <label className="form-check-label para_style">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className='evaluation_report_left_side_row_one'>
                                    <label className='para_style'>Did you evaluate the candidate for <span className='fw-bold'>Python</span><span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                    <div className='d-flex'>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                            <label className="form-check-label para_style">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check mx-3">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <label className="form-check-label para_style">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                    <div className='mt-2'>
                                        <label className="form-label job_dis_form_label">Select a reason for not evaluating
                                            <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                                        </label>
                                        <select className="form-select job_dis_form_control w-md-50 px-3 rounded manual_profile_padding down_arrow_bg_img text_area_width1" aria-label="Default select example">
                                            <option selected>Lack of time</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='evaluation_report_left_side_row_one' style={{ borderBottom: "none" }}>
                                    <div className="mb-3">
                                        <label className="form-label para_style">Detailed Summary<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                        <textarea className="form-control text_style text_area_width1" style={{ boxShadow: "none", height: "129px" }} id="exampleFormControlTextarea1" placeholder='Enter short Summary'></textarea>
                                    </div>
                                    <div className="mb-3 mt-3">
                                        <label className="form-label para_style">Short Summary<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                        <textarea className="form-control text_style text_area_width1" style={{ boxShadow: "none", height: "59px" }} id="exampleFormControlTextarea1" placeholder='Enter short Summary'></textarea>
                                    </div>
                                    <div>
                                        <label className="form-label para_style fw-bold">Your comments on the screening instructions which were added by organization:<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                        <p className='para_style mb-4 text_area_width1'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</p>
                                        <textarea className="form-control text_style text_area_width1" style={{ boxShadow: "none", height: "129px" }} id="exampleFormControlTextarea1" placeholder='Enter your comments based on above'></textarea>
                                    </div>
                                    <div className='mt-4'>
                                        <label className="form-label para_style">Audio Summary<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                        <ul className='d-sm-flex list-inline'>
                                            <li><button className='upload_audio'>Upload Audio</button></li>
                                            <li className='para_style mx-sm-3' style={{ padding: "10px 0px", color: "#777F8A" }}>Record and upload an Mp3 file from your  device</li>
                                        </ul>
                                    </div>
                                    <div className='mt-4'>
                                        <button className='large_btn rounded-3'>Submit Report</button>
                                        <button className='large_btn rounded-3 mx-4'>Save as draft</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-3 evaluation_report_right_side_col_3'>
                            <div className='rounded-3 evaluation_report_right_side'>
                                <h6 className='related_links'>Related links</h6>
                                <ul className='list-inline' style={{ marginTop: "18px" }}>
                                    <li className='para_style'>Job Description</li>
                                    <li className='para_style'>Candidate Profile</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
