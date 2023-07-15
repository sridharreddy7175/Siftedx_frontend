import React from 'react'
import ChipInput from '../chip-input'

export const JobDiscription = () => {
    const onChipData = (data: any) => {

    }
    return (
        <div className='job_discription'>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-2 bg-white'>

                    </div>
                    <div className='col-10'>
                        <div className='job_discription_heading d-flex justify-content-between py-5 ps-4 pe-5'>
                            <div className='my-auto'>
                                <h5 className='top_heading_styles'>Job Description and Details</h5>
                                <p className='top_para_styles'>Here's where you can add and edit the general information for this job</p>
                            </div>
                            <div className='my-auto'>
                                <button className='large_btn rounded'>Status</button>
                                <button className='large_btn rounded ms-3'><svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM14 4C15.1 4 16 3.1 16 2C16 0.9 15.1 0 14 0C12.9 0 12 0.9 12 2C12 3.1 12.9 4 14 4ZM8 0C6.9 0 6 0.9 6 2C6 3.1 6.9 4 8 4C9.1 4 10 3.1 10 2C10 0.9 9.1 0 8 0Z" fill="black" />
                                </svg>
                                </button>
                            </div>
                        </div>
                        <div className='row ps-4 pe-5 mb-5'>
                            <div className='col-lg-8 col-md-6 col-12 mx-auto'>
                                <div className='bg-white rounded-3 p-4 border_color'>
                                    <div className='border-bottom'>
                                        <div className='row'>
                                            <div className='col-9'>
                                                <div className="mb-3">
                                                    <label className="form-label job_dis_form_label">Job Title *</label>
                                                    <input type="text" className="form-control job_dis_form_control" id="jobTitle" placeholder="Title of the job" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-9'>
                                                <div className="mb-3">
                                                    <label className="form-label job_dis_form_label">Description *</label>
                                                    <textarea className="form-control job_dis_form_control form_control_height" id="exampleFormControlTextarea1" placeholder='Enter the detail description of the job'></textarea>
                                                </div>
                                            </div>
                                            <div className='col-3'>
                                                <p className='dis_side_content'>Here is how we can have assisting text to help recruiters.</p>
                                            </div>
                                        </div>
                                        <div className='row mb-3'>
                                            <div className='col-9'>
                                                <div className='row'>
                                                    <div className='col-6'>
                                                        <label className="form-label job_dis_form_label">Category *</label>
                                                        <select className="form-select job_dis_form_control" aria-label="Default select example">
                                                            <option selected>Select category</option>
                                                            <option value="1">One</option>
                                                            <option value="2">Two</option>
                                                            <option value="3">Three</option>
                                                        </select>
                                                    </div>
                                                    <div className='col-6'>
                                                        <label className="form-label job_dis_form_label">Seniority *</label>
                                                        <select className="form-select job_dis_form_control" aria-label="Default select example">
                                                            <option selected>Select Seniority level</option>
                                                            <option value="1">One</option>
                                                            <option value="2">Two</option>
                                                            <option value="3">Three</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row mb-3'>
                                            <div className='col-9'>
                                                <div className='row'>
                                                    <div className='col-6'>
                                                        <label className="form-label job_dis_form_label">Experience *</label>
                                                        <select className="form-select job_dis_form_control" aria-label="Default select example">
                                                            <option selected>Select experience needed</option>
                                                            <option value="1">One</option>
                                                            <option value="2">Two</option>
                                                            <option value="3">Three</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-9'>
                                                <div className="mb-3">
                                                    <label className="form-label job_dis_form_label">Skills *</label>
                                                    <ChipInput type={'text'} placeholder="Type the name of Skill" isInline={true} getChipsFieldData={(data) => onChipData(data)}></ChipInput>
                                                </div>
                                            </div>
                                            <div className='col-3'>
                                                <p className='dis_side_content'>Help text shows on active</p>
                                            </div>
                                        </div>
                                        <div className='row mb-3'>
                                            <div className='col-9'>
                                                <div className='row'>
                                                    <div className='col-6'>
                                                        <label className="form-label job_dis_form_label">Due Date</label>
                                                        <input type="text" className="form-control job_dis_form_control" id="dueDate" placeholder="When this job should be completed" />
                                                    </div>
                                                    <div className='col-6'>
                                                        <label className="form-label job_dis_form_label">Status *</label>
                                                        <select className="form-select job_dis_form_control" aria-label="Default select example">
                                                            <option selected>Select status</option>
                                                            <option value="1">One</option>
                                                            <option value="2">Two</option>
                                                            <option value="3">Three</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-9'>
                                                <div className="mb-3">
                                                    <label className="form-label job_dis_form_label">Instructions to SMEs to ask during the interview *</label>
                                                    <textarea className="form-control job_dis_form_control form_control_height" id="exampleFormControlTextarea1" placeholder='Enter the instructions here'></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-9'>
                                                <div className='mb-3'>
                                                    <label className="form-label job_dis_form_label">Top Skills to test during interview *</label>
                                                    <input type="text" className="form-control job_dis_form_control" id="duration" placeholder="Type the name of Skill" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-9'>
                                                <div className='mb-3'>
                                                    <label className="form-label job_dis_form_label">Add team members to this project</label>
                                                    <input type="text" className="form-control job_dis_form_control" id="teamMember" placeholder="Start typing name of team members to add" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='btns_row'>
                                            <button className='large_btn rounded'>Save Job Description</button>
                                            <button className='large_btn rounded mx-3'>Save as draft</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-4 col-md-6 col-12 mx-auto'>
                                <div className='bg-white rounded-3'>
                                    form
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
