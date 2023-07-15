import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { JobsService } from '../../../../app/service/jobs.service';
import { AppLoader } from '../../../../components/loader';

export const SmeJobInstructions = () => {
    let { jobId } = useParams<{ jobId: string }>();
    const [selectedJob, setSelectedJob] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        JobsService.getJobsByUuid(jobId).then(
            res => {
                if (res?.error) {
                    setLoading(false);
                    toast.error(res?.error?.message);
                } else {
                    setSelectedJob({ ...res });
                    setLoading(false);
                }
            }
        )
    }, [])

    return (
        <div>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }
            <div className='rounded-3 bg-white p-3'>
                <div className='my-3 ms-3'>
                    <h6 className='top_heading_styles'>Instructions to SMEs to ask during the interview</h6>
                    <div  dangerouslySetInnerHTML={{ __html: selectedJob?.instructions_to_sme }} >
                    </div>
                </div>
            </div>
        </div>
    )
}