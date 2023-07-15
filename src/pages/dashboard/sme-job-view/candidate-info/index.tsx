import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify';
import { CandidatesService } from '../../../../app/service/candidates.service';
import { JobsService } from '../../../../app/service/jobs.service';
import { AppLoader } from '../../../../components/loader';
// import { CLOUDFRONT_URL, linkedInClientId } from '../../../../config/constant';
import { CLOUDFRONT_URL, linkedInClientId } from '../../../../config/constant';
// import OpenCV from "../../../../assets/icon_images/Open CV.png";
import OpenCV from "../../../../assets/icon_images/Open CV.png";





export const SmeJobCandidateInfo = () => {
    let history = useHistory()
    let { jobId, interview } = useParams<{ jobId: string, interview: string }>();
    const [selectedCandidateData, setSelectedCandidateData] = useState<any>({});
    const [candidateSkills, setCandidateSkills] = useState<any>([]);
    const companyId = sessionStorage.getItem('selectedInterviewCompany') || '';
    const [loading, setLoading] = useState(false);
    // const [jobTags, setJobTags] = useState<any>([]);


    useEffect(() => {
        setLoading(true);
        CandidatesService.getCandidateInterview(interview).then(
            res => {
                if (res?.error) {
                    setLoading(false);
                    toast.error(res?.error?.message);
                } else {
                    console.log("res", res)
                    setSelectedCandidateData(res);
                    const skillsExp: any = [];
                    const skills = res.skills_codes.split(',');
                    const exp = res.skills_exp.split(',');
                    skills.forEach((element: any, index: number) => {
                        skillsExp.push({ skill: element, exp: exp[index] })
                    });
                    const tags = res?.tags ? res?.tags.split(",") : [];
                    // setJobTags([...tags]);
                    setCandidateSkills([...skillsExp]);
                    setLoading(false);
                }
            }
        )
    }, [])

    const back = (): void => {
        history.goBack()
      }

    return (
        <div className=''>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }
            <div className='rounded-3 bg-white p-3'>
                <div>
                    <div className='px-4 pb-4'>
                        <div>
                            <div className='col-md-9 mt-4'>
                                <div className='row me-5'>
                                    <div className="col-md-6 col-12 padding_rm">
                                        <div className="first_name_container">
                                            <span className="first_name_title">First Name</span>
                                            <p className="first_name_value">{selectedCandidateData?.user_firstname}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 padding_lm">
                                        <div className="first_name_container">
                                            <span className="first_name_title">Last Name</span>
                                            <p className="first_name_value">{selectedCandidateData?.user_lastname}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 padding_rm">
                                        <div className='row'>
                                            <div className="first_name_container">
                                                <span className="first_name_title">Phone Number</span>
                                                <p className="first_name_value">{selectedCandidateData?.mobile_no}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-12 padding_lm">
                                        <div className="first_name_container">
                                            <span className="first_name_title">Email</span>
                                            <p className="first_name_value">{selectedCandidateData?.user_email}</p>
                                        </div>
                                    </div>


                                    <div className="col-md-12 col-12 padding_rm">
                                        <div className="first_name_container">
                                            <span className="first_name_title">LinkedIn URL</span>
                                            {
                                                selectedCandidateData?.linkedin_url ?
                                                    <p className="first_name_value">{selectedCandidateData?.linkedin_url}</p>
                                                    :
                                                    <p className="first_name_value">No Linkedin</p>

                                            }
                                        </div>
                                    </div>

                                    <div className='col-md-12 col-12 padding_rm'>
                                        <div className="first_name_container">
                                            <span className="first_name_title">Skills</span>
                                            <br />
                                            {
                                                candidateSkills.length >0 
                                                ?
                                                candidateSkills.map((data: any, index: number) => {
                                                    return <span key={index} className='skills_border_style me-1 px-3 py-1 rounded-pill text-black d-inline-block mb-2'>{data?.skill} - {data?.exp} </span>
                                                })
                                                :<p className="first_name_value">No Skills</p>
                                            }
                                            
                                            <div className='mt-4 mb-3'>
                                                {selectedCandidateData?.resume_urls &&
                                                    <a href={`${CLOUDFRONT_URL}/${selectedCandidateData?.resume_urls}`} className="open_cv ps-3 pt-1 pb-1 pe-3 ms-2 ms-lg-0 ms-sm-2" target="_blank">Open CV <img src={OpenCV} className="ps-3 pb-1" alt="opencv" /> </a>}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="col-md-12 col-12 padding_rm">
                                        <div className="first_name_container">
                                            <span className="first_name_title">Tags</span>
                                            {jobTags.length > 0 ? (
                                jobTags.map((data: any, index: number) => {
                                    return (
                                        <span
                                            key={index}
                                            className="text-black fs_14  me-1 d-inline-block mb-1"
                                            style={{ borderRadius: "10px" }}
                                        >
                                            {data},
                                        </span>
                                    );
                                })
                            ) : (
                                <span className="top_para_styles">No Tags</span>
                            )}
                                        </div>
                                    </div> */}
                                </div>
                            </div>

                            <button
                                className="large_btn_apply rounded-3 btn-outline-primary top_side_heading_styles  me-3 mt-5 mb-1"
                                // onClick={() => history.push(`/dashboard/interviewview/description/${selectedCandidateData?.job_uuid}/${selectedCandidateData?.uuid}`)}
                                onClick={back}
                            >
                                Back
                            </button>
                            <div className='col-md-3 text-lg-center'>

                            </div>

                        </div>
                    </div>
                </div >

                {/* <div className='row ms-3'>
                    <div className='col-12'>
                        <h5 className='top_heading_styles'>Basic Info</h5>
                        <div className='row'>
                            <div className='col-md-1'>
                                <h6 className='top_right_styles'>Name</h6>
                            </div>
                            <div className='col-md-11'>
                                <p className='top_para_styles'>{selectedCandidateData?.user_firstname} {selectedCandidateData?.user_lastname}</p>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-1'>
                                <h6 className='top_right_styles'>Email</h6>
                            </div>
                            <div className='col-md-11'>
                                <p className='top_para_styles'>{selectedCandidateData?.user_email}</p>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-1'>
                                <h6 className='top_right_styles'>Mobile</h6>
                            </div>
                            <div className='col-md-11'>
                                <p className='top_para_styles'>{selectedCandidateData?.mobile_no}</p>
                            </div>
                        </div>
                        <div className='row linkedin_style'>
                            <div className='col-md-1'>
                                <h6 className='top_right_styles'>LinkedIn</h6>
                            </div>
                            <div className='col-md-11' >
                                <a className='top_para_styles' style={{ color: '#000000' }} href={selectedCandidateData?.linkedin_url} target="_blank">{selectedCandidateData?.linkedin_url} {' '}</a>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-1'>
                                <h6 className='top_right_styles'>Added</h6>
                            </div>
                            <div className='col-md-11'>
                                <p className='top_para_styles'>{moment(selectedCandidateData?.created_dt).format('DD MMM YYYY')}</p>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-1'>
                                <h6 className='top_right_styles'>CV</h6>
                            </div>
                            <div className='col-md-11'>
                                <a className='top_para_styles' style={{ color: '#000000' }}

                                    href={`${CLOUDFRONT_URL}/${selectedCandidateData?.resume_urls}`}
                                    target="_blank">Document</a>


                            </div>
                        </div>
                    </div>
                    <div className='col-6 skil_styles'>
                        <h6 className='top_right_styles'>Skills</h6>
                        {candidateSkills.map((data: any, index: number) => {
                            return <span key={index} className='skills_border_style mx-1 px-3 py-1 rounded-3'>{data?.skill} - {data?.exp} </span>
                        })}
                    </div>
                </div> */}
            </div>
        </div>
    )
}
