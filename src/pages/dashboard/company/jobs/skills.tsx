import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { JobsService } from '../../../../app/service/jobs.service';
import { DataTable } from '../../../../components/data-table';
import { AppLoader } from '../../../../components/loader';
import { SkillDataGridCols } from './data-grid-cols';


export const JobsSkills = () => {
    let { id, jobId } = useParams<{ id: string, jobId: string }>();
    const [selectedJob, setSelectedJob] = useState<any>({});
    const [jobSkills, setJobSkills] = useState<any>([]);
    const [jobOptionalSkills, setJobOptionalSkills] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [activePage, setActivePage] = useState(1)


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
                    const mandatorySkillsData: any[] = [];
                    const mandatoryskills = res?.job_mandatory_skills ? res?.job_mandatory_skills.split(',') : [];
                    const mandatorySkillsExp = res?.job_mandatory_skills_exp ? res?.job_mandatory_skills_exp.split(',') : [];
                    mandatoryskills.forEach((element: string, index: number) => {
                        mandatorySkillsData.push({ skill: element, experienceDisplay: mandatorySkillsExp[index] })
                    });

                    const optionalSkillsData: any[] = [];
                    const optionalSkills = res?.job_optional_skills ? res?.job_optional_skills.split(',') : [];
                    const optionalSkillsExp = res?.job_optional_skills_exp ? res?.job_optional_skills_exp.split(',') : [];
                    optionalSkills.forEach((element: string, index: number) => {
                        optionalSkillsData.push({ skill: element, experienceDisplay: optionalSkillsExp[index] })
                    });
                    setJobSkills(mandatorySkillsData);
                    setJobOptionalSkills(optionalSkillsData)
                    setLoading(false);
                }
            }
        )
    }, [])

    const onCandidates = () => {
        sessionStorage.setItem('isFromJobForm', 'yes');
        const job = sessionStorage.getItem('selectedJob');
        history.push(`/dashboard/companies/info/${companyId}/jobs/info/${job}/candidates/candidates`);
    }


    const onPageChange = (data: any) => {
        setActivePage(data);
    }
    return (
        <div>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }

            <div className='row  mt-4 mb-2'>
                <div className="col-6">
                    <h5 className="side_heading px-lg-3 mb-3">Mandatory Skills</h5>
                    <div className='border-end border-end-sm-none'>
                        {jobSkills.length > 0 ?
                            <DataTable TableCols={SkillDataGridCols} tableData={jobSkills}
                                activePageNumber={activePage} pageNumber={onPageChange} isHidePagination={true}
                            ></DataTable>
                            : <p className='px-3 f_12'>No mandatory skills</p>}
                    </div>
                </div>
                <div className="col-6">
                    <h5 className="side_heading px-lg-3 mb-3">Optional Skills</h5>
                    <div className='border-end border-end-sm-none'>
                        {jobOptionalSkills.length > 0 ?
                            <DataTable TableCols={SkillDataGridCols} tableData={jobOptionalSkills}
                                activePageNumber={activePage} pageNumber={onPageChange} isHidePagination={true}
                            ></DataTable>
                            : <p className='px-3 f_12'>No optional skills</p>}
                    </div>
                </div>

            </div>
        </div>
    )
}