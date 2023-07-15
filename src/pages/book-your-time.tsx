import React, { useState } from 'react'
import Calendar from 'react-calendar';

export const BookYourTime = () => {
    const [value, onChange] = useState(new Date());
    return (
        <div className=''>
            <div className='bg-white text-center py-3'>
                <h6 className='logo_organization_heading'><span className='logo_organization_logo'>Logo</span> Organization</h6>
            </div>
            <div className='text-center my-5'>
                <h4 className='book_your_time_heading'>Book your time for a technical interview</h4>
                <p className='book_your_time_para'>60 Mins - Video Call</p>
            </div>
            <div className='row'>
                <div className='col-7 mx-auto'>
                    <div className='add_company_border mb-5'>
                        <div className='content_padding border_bottom pt-5 pb-4'>
                            <p className='pb-4 book_your_time_para2'>Dear Candidate,Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                            <ul className='list-inline'>
                                <li className='book_your_time_para2'>Sincerly,</li>
                                <li className='book_your_time_para_recruiter'>Recruiter Name</li>
                            </ul>
                        </div>

                        <div className='content_padding pt-5 pb-4'>
                            <div className='row pb-3'>
                                <div className='col-6 mx-auto modal_card_width'>
                                    <Calendar minDate={new Date()} calendarType="US" onChange={onChange} value={value} className="w-100 border-0" />
                                </div>
                                <div className='col-6 mx-auto modal_card_width'>
                                    <div className='me-3'>
                                        <div className="mb-3">
                                            <label className="form-label job_dis_form_label">Date</label>
                                            <input type="text" className="form-control job_dis_form_control" id="date" placeholder="27 Feb 2022" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label job_dis_form_label">Choose a Time</label>
                                            <input type="text" className="form-control job_dis_form_control" id="chooseTime" placeholder="Select Time" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label job_dis_form_label">Timezone</label>
                                            <input type="text" className="form-control job_dis_form_control" id="timeZone" placeholder="(-05:00) Easter Time - USA and Canada" />
                                        </div>
                                        <div>
                                            <button className='large_btn rounded w-100'>Submit interview request at this time</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
