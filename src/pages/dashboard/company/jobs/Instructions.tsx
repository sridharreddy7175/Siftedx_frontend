import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { JobsService } from '../../../../app/service/jobs.service';
import { AppLoader } from '../../../../components/loader';

export const JobInstructions = () => {
    const [loading, setLoading] = useState(false);
    const [selectedJob, setSelectedJob] = useState<any>([]);
    let { id, jobId } = useParams<{ id: string, jobId: string }>();
    const [mandatorySkills, setMandatorySkills] = useState<any>([]);
    const [hrMembers, setHrMembers] = useState<any>([]);
    const [teamMembers, setTeamMembers] = useState<any>([]);
    const history = useHistory();
    const companyId = id || sessionStorage.getItem('company_uuid') || '';

    useEffect(() => {
        setLoading(true);
        JobsService.getJobsByUuid(jobId).then(
            res => {
                if (res.error) {
                    setLoading(false);
                    toast.error(res?.error?.message);
                } else {
                    setSelectedJob({ ...res });
                    if (res?.job_mandatory_skills) {
                        setMandatorySkills([...res?.job_mandatory_skills.split(',')]);
                    }
                    setLoading(false);
                }
            }
        )

        JobsService.getJobsTeamMembers(jobId).then(
            res => {
                if (res?.error) {
                    toast.error(res?.error?.message);
                } else {
                    const team = res?.filter((data: any) => data?.type === 1);
                    const hr = res?.filter((data: any) => data?.type === 2);
                    setTeamMembers([...team]);
                    setHrMembers([...hr])
                }
            }
        )
    }, []);

    const onViewInterviews = () => {
        const job = sessionStorage.getItem('selectedJob');
        history.push(`/dashboard/companies/info/${companyId}/jobs/info/${job}/interviews`);
    }
    return (
        <div>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }

            <div className='border_color rounded-3 bg-white px-5 py-4'>
                <div className='row'>
                    <div className='col-10'>
                        <div className=''>
                            <h6 className='second_heading'>Top Skills to test during interview</h6>
                            {mandatorySkills.map((data: any, index: number) => { return <div key={index}><span className='skills_border_style mx-1 px-3 py-1 rounded-3'>{data}</span></div> })}

                        </div>
                        <div className='my-5'>
                            <h6 className='second_heading'>Instructions to SMEs to ask during the interview</h6>
                            {/* <p className='para_style'>{selectedJob?.instructions_to_sme}</p> */}
                            <div dangerouslySetInnerHTML={{ __html: selectedJob?.instructions_to_sme }}>
                            </div>
                        </div>
                        <div>
                            <h6 className='second_heading'>Team Members</h6>
                            <div className='row'>
                                {teamMembers.length > 0 ? <div className='col-6'>
                                    {teamMembers?.map((data: any, index: number) => {
                                        return <div key={index} className='border border-2 rounded-3'>
                                            <ul className='border-bottom d-flex list-inline p-3 mb-0'>
                                                <li><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="40" height="40" rx="20" fill="#C4C4C4" />
                                                </svg>
                                                </li>
                                                <li>
                                                    <ul className='list-inline mx-3'>
                                                        <li className='team_members_name_style'>{data?.user_firstname} {data?.user_lastname}</li>
                                                        <li className='team_members_below_name_style'>{data?.role}</li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    })}

                                </div> : <p>No Members</p>}
                            </div>
                        </div>
                        <div className='mt-3'>
                            <h6 className='second_heading'>HR Members</h6>
                            <div className='row'>
                                <div className='col-6'>
                                    {hrMembers.length > 0 ? <div className='border border-2 rounded-3'>
                                        {hrMembers?.map((data: any, index: number) => {
                                            return <ul key={index} className='border-bottom d-flex list-inline p-3 mb-0'>
                                                <li><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="40" height="40" rx="20" fill="#C4C4C4" />
                                                </svg>
                                                </li>
                                                <li>
                                                    <ul className='list-inline mx-3'>
                                                        <li className='team_members_name_style'>{data?.user_email}</li>
                                                        <li className='team_members_below_name_style'>{data?.role}</li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        })}
                                    </div> : <p>No members</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-2 text-end'>
                        <button className='all_members_add_members_btn px-4 py-2 rounded-2' onClick={onViewInterviews}>View Interviews</button>
                    </div>
                </div>
            </div>
        </div>
    )
}