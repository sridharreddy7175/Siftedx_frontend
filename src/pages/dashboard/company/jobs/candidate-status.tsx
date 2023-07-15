import React, { useEffect, useState } from 'react'

export const CandidateStatus = () => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {

    }, []);

    return (
        <div>
            <div className="row pt-2">
                <div className="col-md-10">
                    <h2>Candidate Interview Status</h2>
                </div>
            </div>
            {loading &&
                <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }

            <div className="row" style={{ marginBottom: '15px' }}>
                <div className="col-md-12">
                </div>

            </div>

            <div className="row border-bottom mx-1">
                <div className='col-9 py-3'>
                    <div className='row'>
                        <div className='col-3'>
                            <span className='fs-5 fw-bold'>recruiter</span>
                        </div>
                        <div className='col-3'>
                            <span className='fs-5 fw-bold'>schedule date</span>
                        </div>
                        <div className='col-3'>
                            <span className='fs-5 fw-bold'>comment</span>
                        </div>
                        <div className='col-3'>
                            <span className='fs-5 fw-bold'>status</span>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-3'>
                            recruiter Name
                        </div>
                        <div className='col-3'>
                            20-02-2022
                        </div>
                        <div className='col-3'>
                            so and so
                        </div>
                        <div className='col-3'>
                            Reject
                        </div>
                    </div>
                </div>
                <div className='col-3'>

                </div>
            </div>

            <div className="row mx-1 mt-3">
                <div className='col-12 py-3'>
                    <div className='row'>
                        <div className='col-3'>
                            <span className='fs-5'>recruiter</span>
                        </div>
                        <div className='col-3'>
                            <span className='fs-5'>schedule date</span>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-3'>
                            <input type="text" className="form-control w-75" placeholder="Recruiter" aria-label="Username" />
                        </div>
                        <div className='col-3'>
                            <input type="date" className="form-control w-75" placeholder="Recruiter" aria-label="Username" />
                        </div>
                        <div className='col-3'>
                            <button className="small_btn px-5 cursor-pointer" type="button">schedule</button>
                        </div>
                        <div className='col-'>

                        </div>
                    </div>
                </div>
                <div className='col-3'>

                </div>
            </div>

        </div>
    )
}