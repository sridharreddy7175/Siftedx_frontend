import React, { useEffect, useState } from 'react'
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { JobsService } from '../../../app/service/jobs.service';
import { SmeService } from '../../../app/service/sme.service';
import { S3Helper } from '../../../app/utility/s3-helper';
import { AppLoader } from '../../../components/loader';
import { CLOUDFRONT_URL } from '../../../config/constant';
import INFO_ICON from '../../../assets/icon_images/info icon.svg';
import CALENDER_ICON from '../../../assets/icon_images/Group 3507.svg'
import STAR_ICON from '../../../assets/icon_images/star.svg';
import STAR_ICON_WITH_YELLOW from '../../../assets/icon_images/star_yellow.svg';
import { Form, Modal, Offcanvas } from 'react-bootstrap';

export const InterviewEvaluationReport = () => {
    let { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [interview, setInterview] = useState<any>({});
    const [skills, setSkills] = useState<any>([]);
    const [audioUrl, setAudioUrl] = useState<any>('');
    const [totalComment, setTotalComment] = useState<any>('');
    const [shortSummary, setShortSummary] = useState<any>('');
    const [detailedSummary, setDetailedSummary] = useState<any>('');
    const [experience, setExperience] = useState<any>(0);
    const [competency, setCompetency] = useState<any>(0)
    const [showNotes, setShowNotes] = React.useState(false);


    const history = useHistory();

    useEffect(() => {
        getInterviews();
    }, []);

    const getInterviews = () => {
        setLoading(true);
        JobsService.getInterviewById(id).then(res => {
            if (res.error) {
                toast.error(res?.error?.message);
                setLoading(false);
            } else {
                setLoading(false);
                const data: any = [];
                const strSkills = res[0]?.job_mandatory_skills.split(',');
                strSkills.forEach((element: any) => {
                    data.push({ skill: element, isEvaluate: 'NO', experience: 0, competency: 0, comment: '' })
                });
                setSkills([...data]);
                // res.forEach((element: any) => {
                //     element.candidate_name = `${element?.candidate_firstname} ${element?.candidate_lastname}`
                //     element.skills = element?.job_mandatory_skills?.split(',');
                // });
                setInterview(res[0])
            }
        })
    }

    const onChangeEvaluate = (e: any, index: number) => {
        const data = skills;
        data[index].isEvaluate = e;
        setSkills([...data])
    }
    const onSeleteExperienceRate = (expIndex: number) => {
        setExperience(expIndex)
        // const data = skills;
        // data[index].experience = expIndex;
        // setSkills([...data])
    }
    const onSeleteCompetency = (expIndex: number) => {
        // const data = skills;
        // data[index].competency = expIndex;
        // setSkills([...data])
        setCompetency(expIndex)
    }

    const onSubmitReport = (type: string) => {
        const data: any = {};
        data.feedback = JSON.stringify(skills);
        data.interview_uuid = id;
        data.detailed_summary = detailedSummary;
        data.short_summary = shortSummary;
        data.comments = totalComment;
        data.audio_summary_url = audioUrl;
        data.save_status = type === 'save' ? 1 : 0;
        SmeService.getSmeInterviewsEvalution(data).then(res => {
            if (res.error) {
                toast.error(res?.error?.message);
                setLoading(false);
            } else {
                setLoading(false);
                toast.success("Saved Successfully");
                history.push(`/dashboard/interviews/completedlist`);
            }
        })
    }

    const onDescription = (e: any, index: number) => {
        const data = skills;
        data[index].comment = e.target.value;
        setSkills([...data])
    }

    const onUploadAudio = async (event: any) => {
        setAudioUrl('');
        setLoading(true);
        if (event.target.files && event.target.files[0]) {
            const data = {
                interview_uuid: id,
                type: "mp3"
            }
            SmeService.audioSummaryUrl(data).then(async res => {
                if (res?.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    const result = await S3Helper.uploadFilesToS3BySigned(res.presignedUrl,
                        event.target.files[0],
                        event.target.files[0]?.type
                    );
                    setAudioUrl(`${res.fileUrl}`);
                    setLoading(false);
                    toast.success("Uploaded Successfully");
                }
            })
        }
    };

    const onChangeTotalComment = (e: any) => {
        setTotalComment(e?.target?.value)
    }
    const onChangeShortSummary = (e: any) => {
        setShortSummary(e?.target?.value)
    }

    const onChangeDetailedSummary = (e: any) => {
        setDetailedSummary(e?.target?.value)
    }

    const onChangeReasonForEvalution = (e: any, index: number) => {
        const data = skills;
        data[index].comment = e.target.value;
        setSkills([...data])
    }

    return (
        <div>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }
            <div className='evaluation_report'>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='d-flex ps-md-4 me-2 me-lg-0'>
                                <div className="ms-4 me-2 ms-lg-0 me-lg-0 mt-lg-0 mb-lg-0  mt-5 mb-3">
                                    <h5 className='top_heading_styles'>Create Evaluation Report</h5>
                                    <p className='top_para_styles'>You are creating a new evaluation report which will be submitted to the organization</p>
                                </div>
                                {/* <div className="ms-2 me-2 ms-lg-0 me-lg-0 mt-lg-0 mb-lg-0  mt-5 mb-3">
                                    <button className='small_btn rounded-3' onClick={() => onSubmitReport('save')}>Save</button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-12 col-12 '>
                            <div className='row border_color rounded-3 ms-2 me-2 ms-lg-0 me-lg-0 '>
                                <div className='col-md-12'>
                                    <div className="row bg-white rounded-3 p-4 mx-2 mx-md-0">
                                        <div className='col-12 d-flex justify-content-end'>
                                            <b className='sx-text-primary mb-2 fs_14 me-3 pointer' onClick={() => setShowNotes(true)}>Notes</b>
                                            <b className='sx-text-primary mb-2 fs_14'>Job Description</b>
                                        </div>
                                        <div className="col-md-6 pe-md-4 border-end border-end-sm-none">
                                            <div className=''>
                                                <div className='row'>
                                                    <div className="col-12 mb-3">
                                                        {/* <label className="form-label job_dis_form_label">Interview ID
                                                    </label>
                                                    <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding" id="interviewID" name="company_name" defaultValue={interview?.id} disabled placeholder="Prefilled ID - Can Edit" /> */}
                                                        <div>
                                                            <label className="input">
                                                                <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="interviewID" name="company_name" defaultValue={interview?.id} disabled placeholder="Prefilled ID - Can Edit" />
                                                                <span className="input__label input__label_disabled">Interview ID</span>
                                                            </label>
                                                        </div>

                                                    </div>
                                                    <div className="col-12 mb-3">
                                                        {/* <label className="form-label job_dis_form_label">Job Title
                                                    </label>
                                                    <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding" id="jobTitle" name="company_name" defaultValue={interview?.job_title} disabled placeholder="Fetched Job Title" /> */}
                                                        <label className="input">
                                                            <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="jobTitle" name="company_name" defaultValue={interview?.job_title} disabled placeholder="Fetched Job Title" />
                                                            <span className="input__label input__label_disabled">Job Title</span>
                                                        </label>
                                                    </div>
                                                    <div className="col-12 mb-3 ">
                                                        {/* <label className="form-label job_dis_form_label">Candidate
                                                    </label>
                                                    {interview?.candidate_firstname && <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding" id="candidate" name="company_name" defaultValue={`${interview?.candidate_firstname} ${interview?.candidate_lastname} `} disabled placeholder="Fetched Candidate Name" />} */}
                                                        <label className="input">
                                                            {interview?.candidate_firstname && <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="candidate" name="company_name" defaultValue={`${interview?.candidate_firstname} ${interview?.candidate_lastname} `} disabled placeholder="Fetched Candidate Name" />}
                                                            <span className="input__label input__label_disabled">Candidate</span>
                                                        </label>
                                                    </div>
                                                    <div className="col-12 mb-3 ">
                                                        {/* <label className="form-label job_dis_form_label">Date &amp; Time
                                                    </label>
                                                    <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding" id="dateTime" name="company_name" defaultValue={interview?.interview_schedule} disabled placeholder="Fetched Data and Time" /> */}
                                                        <label className="input">
                                                            <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field" id="dateTime" name="company_name" defaultValue={interview?.interview_schedule} disabled placeholder="Fetched Data and Time" />
                                                            <span className="position-absolute" style={{ left: "92%", bottom: '12px' }}>
                                                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="17.572" height="18.186" viewBox="0 0 17.572 18.186">
                                                                <g id="Group_3507" data-name="Group 3507" transform="translate(0.25 0.258)">
                                                                    <g id="Group_363" data-name="Group 363">
                                                                    <path id="Path_557" data-name="Path 557" d="M18.915,16.747A1.15,1.15,0,0,1,19.866,16,1.131,1.131,0,0,1,21,16.668a2.734,2.734,0,0,1,.112,1.111h2.276a4.824,4.824,0,0,1,.037-.9,1.185,1.185,0,0,1,.608-.776,1.1,1.1,0,0,1,.959-.013,1.193,1.193,0,0,1,.659.92c.024.254.007.51.012.764H27.94a3.942,3.942,0,0,1,.053-.956,1.17,1.17,0,0,1,.767-.786,1.1,1.1,0,0,1,.858.1,1.2,1.2,0,0,1,.593.972c.009.224,0,.449,0,.674H31.6a1.413,1.413,0,0,1,.619.132,1.5,1.5,0,0,1,.838,1.361q0,3.84,0,7.68a.423.423,0,0,1-.052.245.277.277,0,0,1-.4.073.318.318,0,0,1-.12-.279q0-2.517,0-5.035H16.56q0,4.624,0,9.248a.881.881,0,0,0,.853.893q3.966,0,7.932,0a.3.3,0,0,1,.316.336.294.294,0,0,1-.314.26h-7.9a1.4,1.4,0,0,1-.987-.383,1.533,1.533,0,0,1-.473-1.144V19.308a1.542,1.542,0,0,1,.382-1.052,1.393,1.393,0,0,1,1.04-.476c.475,0,.949,0,1.424,0A3.2,3.2,0,0,1,18.915,16.747Zm.959-.151a.589.589,0,0,0-.469.582c0,.56,0,1.121,0,1.682a.89.89,0,0,0,.04.33.572.572,0,0,0,.606.374.591.591,0,0,0,.491-.588q0-.9,0-1.8A.581.581,0,0,0,19.874,16.6Zm4.552,0a.591.591,0,0,0-.469.584c0,.56,0,1.12,0,1.68a.876.876,0,0,0,.041.331.571.571,0,0,0,.6.373.592.592,0,0,0,.494-.591q0-.9,0-1.791A.582.582,0,0,0,24.426,16.6Zm4.553,0a.59.59,0,0,0-.47.585q0,.9,0,1.8a.569.569,0,1,0,1.136,0q0-.9,0-1.792A.582.582,0,0,0,28.98,16.595ZM16.636,18.9a1.041,1.041,0,0,0-.077.445c0,.67,0,1.341,0,2.012H32.492c0-.71,0-1.419,0-2.128a.877.877,0,0,0-.813-.852c-.486-.006-.974,0-1.461,0-.006.263.015.526-.016.788a1.166,1.166,0,0,1-1.017,1,1.137,1.137,0,0,1-1.143-.7,2.875,2.875,0,0,1-.1-1.085H25.664c0,.246.01.493-.009.739a1.184,1.184,0,0,1-.786.994,1.122,1.122,0,0,1-1.344-.569,2.508,2.508,0,0,1-.138-1.164H21.112c0,.225.005.451,0,.676a1.19,1.19,0,0,1-.744,1.041,1.121,1.121,0,0,1-1.392-.554,2.51,2.51,0,0,1-.137-1.163c-.475,0-.949,0-1.424,0A.856.856,0,0,0,16.636,18.9Z" transform="translate(-15.99 -15.989)" fill="#9c9c9c" stroke="#9c9c9c" stroke-width="0.5"/>
                                                                    </g>
                                                                    <g id="Group_364" data-name="Group 364" transform="translate(1.945 7.535)">
                                                                    <path id="Path_558" data-name="Path 558" d="M80.381,215.965c.352-.017.706,0,1.059-.007a.488.488,0,0,1,.483.482c0,.255,0,.51,0,.765a.487.487,0,0,1-.482.453q-.488,0-.976,0a.487.487,0,0,1-.483-.451c-.005-.255,0-.511,0-.766A.486.486,0,0,1,80.381,215.965Zm.084.479v.73h.973v-.73Z" transform="translate(-79.978 -215.956)" fill="#9c9c9c" stroke="#9c9c9c" stroke-width="0.5"/>
                                                                    </g>
                                                                    <g id="Group_365" data-name="Group 365" transform="translate(5.816 7.535)">
                                                                    <path id="Path_559" data-name="Path 559" d="M176.349,215.965c.352-.017.7,0,1.057-.007a.488.488,0,0,1,.484.482q0,.367,0,.733a.49.49,0,0,1-.307.452.784.784,0,0,1-.3.035c-.284,0-.568,0-.852,0a.489.489,0,0,1-.477-.4c-.015-.292-.01-.585,0-.876A.484.484,0,0,1,176.349,215.965Zm.083.479v.73h.973v-.73Z" transform="translate(-175.943 -215.956)" fill="#9c9c9c" stroke="#9c9c9c" stroke-width="0.5"/>
                                                                    </g>
                                                                    <g id="Group_366" data-name="Group 366" transform="translate(9.306 7.534)">
                                                                    <path id="Path_560" data-name="Path 560" d="M272.346,215.96c.352-.017.706,0,1.058-.007a.487.487,0,0,1,.483.454c.005.254,0,.508,0,.762a.488.488,0,0,1-.485.485q-.487,0-.975,0a.49.49,0,0,1-.477-.4c-.015-.291-.009-.584,0-.875A.484.484,0,0,1,272.346,215.96Zm.084.479v.73h.973v-.73Z" transform="translate(-271.942 -215.951)" fill="#9c9c9c" stroke="#9c9c9c" stroke-width="0.5"/>
                                                                    </g>
                                                                    <g id="Group_367" data-name="Group 367" transform="translate(13.179 7.535)">
                                                                    <path id="Path_561" data-name="Path 561" d="M368.383,215.963c.353-.018.707,0,1.061-.007a.488.488,0,0,1,.483.484c0,.254,0,.509,0,.763a.487.487,0,0,1-.483.454q-.488,0-.975,0a.487.487,0,0,1-.483-.453c-.005-.255,0-.51,0-.765A.486.486,0,0,1,368.383,215.963Zm.085.478v.73h.973v-.73Z" transform="translate(-367.982 -215.953)" fill="#9c9c9c" stroke="#9c9c9c" stroke-width="0.5"/>
                                                                    </g>
                                                                    <g id="Group_368" data-name="Group 368" transform="translate(1.945 10.248)">
                                                                    <path id="Path_562" data-name="Path 562" d="M80.375,287.965c.353-.017.706,0,1.059-.007a.488.488,0,0,1,.483.482c0,.255,0,.511,0,.766a.486.486,0,0,1-.481.453q-.489,0-.978,0a.487.487,0,0,1-.481-.452c-.007-.193,0-.387,0-.58a.9.9,0,0,1,.043-.384A.486.486,0,0,1,80.375,287.965Zm.084.479v.73h.973v-.73Z" transform="translate(-79.972 -287.956)" fill="#9c9c9c" stroke="#9c9c9c" stroke-width="0.5"/>
                                                                    </g>
                                                                    <g id="Group_369" data-name="Group 369" transform="translate(5.816 10.247)">
                                                                    <path id="Path_563" data-name="Path 563" d="M176.36,287.963c.352-.018.706,0,1.059-.007a.488.488,0,0,1,.484.483c0,.255,0,.509,0,.764a.487.487,0,0,1-.482.454q-.487,0-.975,0a.488.488,0,0,1-.481-.425c-.008-.284-.008-.569,0-.852A.484.484,0,0,1,176.36,287.963Zm.085.478v.73h.973v-.73Z" transform="translate(-175.958 -287.953)" fill="#9c9c9c" stroke="#9c9c9c" stroke-width="0.5"/>
                                                                    </g>
                                                                    <path id="Path_564" data-name="Path 564" d="M272.263,288.022a.792.792,0,0,1,.352-.044c.275,0,.55,0,.825,0a.242.242,0,0,1,0,.483c-.325,0-.65,0-.974,0v.722a.291.291,0,0,1,.21.129.244.244,0,0,1-.15.356.481.481,0,0,1-.544-.444c-.005-.256,0-.512,0-.767A.485.485,0,0,1,272.263,288.022Z" transform="translate(-262.699 -277.73)" fill="#9c9c9c" stroke="#9c9c9c" stroke-width="0.5"/>
                                                                    <g id="Group_370" data-name="Group 370" transform="translate(10.749 11.356)">
                                                                    <path id="Path_565" data-name="Path 565" d="M290.82,288.046a3.159,3.159,0,1,1-1.444.556A3.15,3.15,0,0,1,290.82,288.046Zm.028.486a2.674,2.674,0,1,0,1.651.315A2.683,2.683,0,0,0,290.848,288.532Z" transform="translate(-288.038 -288.023)" fill="#9c9c9c" stroke="#9c9c9c" stroke-width="0.5"/>
                                                                    </g>
                                                                    <path id="Path_566" data-name="Path 566" d="M337.261,356.364c.066-.065.132-.147.232-.154a.244.244,0,0,1,.267.237.27.27,0,0,1-.093.2q-.973.973-1.946,1.946c-.067.065-.133.149-.232.16a.265.265,0,0,1-.234-.1c-.333-.337-.671-.669-1-1.006a.242.242,0,0,1,.022-.352.245.245,0,0,1,.336.025c.283.281.565.565.847.847Q336.36,357.267,337.261,356.364Z" transform="translate(-322.035 -342.78)" fill="#9c9c9c" stroke="#9c9c9c" stroke-width="0.5"/>
                                                                    <g id="Group_371" data-name="Group 371" transform="translate(1.945 12.961)">
                                                                    <path id="Path_567" data-name="Path 567" d="M80.378,359.965c.353-.017.707,0,1.06-.007a.488.488,0,0,1,.482.484q0,.366,0,.732a.489.489,0,0,1-.306.451.793.793,0,0,1-.3.035c-.284,0-.568,0-.853,0a.487.487,0,0,1-.481-.453c-.007-.193,0-.387,0-.58a.889.889,0,0,1,.044-.384A.486.486,0,0,1,80.378,359.965Zm.084.479v.73h.973v-.73Z" transform="translate(-79.975 -359.956)" fill="#9c9c9c" stroke="#9c9c9c" stroke-width="0.5"/>
                                                                    </g>
                                                                    <g id="Group_372" data-name="Group 372" transform="translate(5.817 12.961)">
                                                                    <path id="Path_568" data-name="Path 568" d="M176.377,359.967c.342-.018.685,0,1.028-.008a.492.492,0,0,1,.471.285.882.882,0,0,1,.045.384c0,.194,0,.387,0,.581a.486.486,0,0,1-.482.452q-.487,0-.974,0a.488.488,0,0,1-.484-.453c-.007-.193,0-.387,0-.58a.993.993,0,0,1,.034-.36A.486.486,0,0,1,176.377,359.967Zm.085.478v.73h.973v-.73Z" transform="translate(-175.975 -359.958)" fill="#9c9c9c" stroke="#9c9c9c" stroke-width="0.5"/>
                                                                    </g>
                                                                </g>
                                                            </svg> */}

                                                                <img src={CALENDER_ICON} alt="" />
                                                            </span>
                                                            <span className="input__label input__label_disabled">Date &amp; Time</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className=''>
                                                        <div className="d-flex">
                                                            <h1 className="download_heading me-3">Experience&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </h1>


                                                            {Array.apply(null, Array(5)).map((exp: any, expIndex: number) => {
                                                                return <div>
                                                                    {(expIndex + 1) <= experience &&
                                                                        <span onClick={() => onSeleteExperienceRate((expIndex + 1))}><img src={STAR_ICON_WITH_YELLOW} alt="" /></span>}
                                                                    {!((expIndex + 1) <= experience) &&
                                                                        <span onClick={() => onSeleteExperienceRate((expIndex + 1))}><img src={STAR_ICON} alt="" /></span>
                                                                    }
                                                                </div>
                                                            })}
                                                            <span>
                                                                <img src={INFO_ICON} alt="info icon" className="ms-2" />
                                                            </span>
                                                        </div>

                                                    </div>
                                                    <div className='mt-1'>
                                                        <div className='d-flex'>
                                                            <h1 className="download_heading me-3">Competency : </h1>

                                                            {Array.apply(null, Array(5)).map((exp: any, expIndex: number) => {
                                                                return <div>
                                                                    {(expIndex + 1) <= competency &&
                                                                        <span onClick={() => onSeleteCompetency((expIndex + 1))}><img src={STAR_ICON_WITH_YELLOW} alt="" /></span>}
                                                                    {!((expIndex + 1) <= competency) &&
                                                                        <span onClick={() => onSeleteCompetency((expIndex + 1))}><img src={STAR_ICON} alt="" /></span>
                                                                    }
                                                                </div>
                                                            })}
                                                            <span>
                                                                <img src={INFO_ICON} alt="info icon" className="ms-2" />
                                                            </span>
                                                        </div>
                                                        <div className=''>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="my-3">
                                                        <label className="input">
                                                            <textarea className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field textarea_padding" placeholder='' ></textarea>
                                                            <span className="input__label">Comments</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6 ps-md-3">
                                            <div className='' style={{ borderBottom: "none" }}>
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <div className="mb-2">
                                                            <label className="input">
                                                                <textarea className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field textarea_padding" style={{ boxShadow: "none", height: "99px" }} id="exampleFormControlTextarea1" placeholder='' onChange={(e) => onChangeShortSummary(e)}></textarea>
                                                                <span className="input__label">Detailed Summary </span>
                                                            </label>
                                                            {/* <label className="form-label para_style">Detailed Summary<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                                        <textarea className="form-control text_style text_area_width1" style={{ boxShadow: "none", height: "129px" }} id="exampleFormControlTextarea1" placeholder='Enter short Summary' onChange={(e) => onChangeDetailedSummary(e)}></textarea> */}
                                                        </div>
                                                        <div className="mb-3 mt-3">
                                                            <label className="input">
                                                                <textarea className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field textarea_padding" style={{ boxShadow: "none", height: "99px" }} id="exampleFormControlTextarea1" placeholder='' onChange={(e) => onChangeShortSummary(e)}></textarea>
                                                                <span className="input__label">Short Summary</span>
                                                            </label>
                                                            {/* <label className="form-label para_style">Short Summary<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                                            <textarea className="form-control text_style text_area_width1" style={{ boxShadow: "none", height: "59px" }} id="exampleFormControlTextarea1" placeholder='Enter short Summary' onChange={(e) => onChangeShortSummary(e)}></textarea> */}
                                                        </div>
                                                        <div>
                                                            {/* <label className="form-label para_style fw_6">Your comments on the screening instructions which were added by organization:<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                                        <p className='para_style mb-4 text_area_width1'></p> */}
                                                            {/* <textarea className="form-control text_style text_area_width1" style={{ boxShadow: "none", height: "129px" }} id="exampleFormControlTextarea1" placeholder='Enter your comments based on above' onChange={(e) => onChangeTotalComment(e)}></textarea> */}
                                                            {/* <textarea className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field textarea_padding" style={{ boxShadow: "none", height: "129px" }} id="exampleFormControlTextarea1" placeholder='Enter your comments based on above' onChange={(e) => onChangeTotalComment(e)}></textarea> */}


                                                            <label className="input">
                                                                <textarea className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field textarea_padding" style={{ boxShadow: "none", height: "99px" }} id="exampleFormControlTextarea1" placeholder='' onChange={(e) => onChangeTotalComment(e)}></textarea>
                                                                <span className="input__label">Your comments on the screening instructions</span>
                                                            </label>
                                                        </div>
                                                        <div className='mt-4'>
                                                            {/* <label className="form-label para_style">Audio Summary<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                                        <ul className='d-sm-flex list-inline'>
                                                             <li><button className='upload_audio'>Upload Audio</button></li>
                                                              <li className='para_style mx-sm-3' style={{ padding: "10px 0px", color: "#777F8A" }}>Record and upload an Mp3 file from your  device</li>
                                                         </ul> */}
                                                            {/* <label className="form-label job_dis_form_label mb-0">Audio Summary</label>
                                                        <span className='text-danger'>*</span> */}
                                                            <div className="mb-4">
                                                                <div className="file px-3  rounded-5  d-inline-block large_btn_apply text-dark">Upload Audio
                                                                    <span className='ms-2'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17">
                                                                            <g id="_1" data-name="1" transform="translate(-54.13 -50.139)">
                                                                                <path id="Path_1605" data-name="Path 1605" d="M109.3,64.414H103.45a.634.634,0,0,1-.634-.634V57.99H100.44a.634.634,0,0,1-.471-1.059l5.934-6.582a.634.634,0,0,1,.943,0l5.933,6.582a.634.634,0,0,1-.471,1.059h-2.375v5.789A.634.634,0,0,1,109.3,64.414Zm-5.214-1.269h4.58V57.356a.634.634,0,0,1,.634-.634h1.583l-4.508-5-4.508,5h1.585a.634.634,0,0,1,.634.634Z" transform="translate(-43.744)" />
                                                                                <path id="Path_1606" data-name="Path 1606" d="M68.369,338.69H56.891a2.764,2.764,0,0,1-2.761-2.761v-1.614a.634.634,0,0,1,1.269,0v1.614a1.494,1.494,0,0,0,1.493,1.493H68.369a1.494,1.494,0,0,0,1.492-1.493v-1.614a.634.634,0,0,1,1.269,0v1.614A2.764,2.764,0,0,1,68.369,338.69Z" transform="translate(0 -271.55)" />
                                                                            </g>
                                                                        </svg>
                                                                    </span>
                                                                    <input type="file" accept="audio/mp3" onChange={(e) => onUploadAudio(e)} />
                                                                </div>
                                                                <span>
                                                                    <img src={INFO_ICON} alt="info icon" className="ms-3 mb-4" />
                                                                </span>
                                                                {/* <span className='mx-3 text_style'>Record and upload an Mp3 file from your  device</span> */}
                                                                {audioUrl && <audio src={`${CLOUDFRONT_URL}/${audioUrl}`} controls ></audio>}
                                                                {audioUrl && <i className="bi bi-trash-fill btn btn-danger cursor-pointer upload_delete" onClick={() => setAudioUrl('')} ></i>}

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                        <div className='col-12 d-flex justify-content-between mt-4'>
                                            <button className='large_btn_apply btn-outline-primary rounded-3 ' onClick={() => onSubmitReport('draft')}>Save as draft</button>
                                            <button className='large_btn_apply rounded-3' onClick={() => onSubmitReport('save')}>Submit Report</button>
                                        </div>
                                    </div>
                                </div>


                                {/* {skills?.map((data: any, index: number) => {
                                    return <div key={index}>
                                        <div className='evaluation_report_left_side_row_two'>
                                            <div className='row'>
                                                <div className='col-12'>
                                                    <div className=''>
                                                        <label className='para_style'>Did you evaluate the candidate for <span className='fw_6'>{data?.skill}</span><span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio" value={data?.isEvaluate} checked={data?.isEvaluate === 'YES' ? true : false} onChange={(e) => onChangeEvaluate('YES', index)} id="flexRadioDefault1" placeholder=' ' />
                                                            <label className="form-check-label para_style">
                                                                Yes
                                                            </label>
                                                        </div>
                                                        <div className="form-check mx-3">
                                                            <input className="form-check-input" type="radio" value={data?.isEvaluate} checked={data?.isEvaluate === 'NO' ? true : false} id="flexRadioDefault2" onChange={(e) => onChangeEvaluate('NO', index)} placeholder=' ' />
                                                            <label className="form-check-label para_style">
                                                                No
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {data?.isEvaluate === 'YES' && <div>
                                                        <div className="mb-3 mt-3">
                                                            {/* <label className="form-label para_style">Comments<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                                            <textarea className="form-control text_style text_area_width" id="exampleFormControlTextarea1" placeholder='Enter your comments about the candidate for this skill' onChange={(e) => onDescription(e, index)}></textarea> */}

                                {/* <label className="input">
                                                                <textarea className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field textarea_padding" placeholder=' ' onChange={(e) => onDescription(e, index)}></textarea>
                                                                <span className="input__label">Comments<span style={{ color: 'red', fontSize: '15px' }}>*</span></span>
                                                            </label>
                                                        </div>
                                                        <div className='mt-3'>
                                                            <label className='para_style'>Rate Candidate`s <span className='fw-bold'>Experience</span> for this skill<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                                            <div className='d-lg-flex mt-2'>
                                                                <ul className='d-inline-flex list-inline rounded-3' style={{ border: "1px solid #BBBBBB" }}>
                                                                    {Array.apply(null, Array(5)).map((exp: any, expIndex: number) => {
                                                                        return <div>
                                                                            {(expIndex + 1) <= data?.experience &&
                                                                                <li style={{ padding: "1px 10px 5px 10px", borderRight: "1px solid #BBBBBB" }}>
                                                                                    <svg onClick={() => onSeleteExperienceRate(index, (expIndex + 1))} className='pointer' width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#FFA800" />
                                                                                    </svg>
                                                                                </li>}
                                                                            {!((expIndex + 1) <= data?.experience) && <li style={{ padding: "1px 10px 5px 10px", borderRight: "1px solid #BBBBBB" }}>
                                                                                <svg onClick={() => onSeleteExperienceRate(index, (expIndex + 1))} className='pointer' width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#A9A9A9" />
                                                                                </svg>
                                                                            </li>
                                                                            }
                                                                        </div>
                                                                    })}
                                                                </ul>
                                                                <p className='md_experience'><span className='fw-bold'>Moderate Experience</span>: Completes assignments with reasonable supervision.</p>
                                                            </div>
                                                        </div>
                                                        <div className='mt-3'>
                                                            <label className='para_style'>Rate Candidate`s <span className='fw-bold'>Competency </span>for this skill<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                                            <div className='d-lg-flex mt-2'>
                                                                <ul className='d-inline-flex list-inline rounded-3' style={{ border: "1px solid #BBBBBB" }}>
                                                                    {Array.apply(null, Array(5)).map((exp: any, comIndex: number) => {
                                                                        return <div>
                                                                            {(comIndex + 1) <= data?.competency &&
                                                                                <li style={{ padding: "1px 10px 5px 10px", borderRight: "1px solid #BBBBBB" }}>
                                                                                    <svg onClick={() => onSeleteCompetency(index, (comIndex + 1))} className='pointer' width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#FFA800" />
                                                                                    </svg>
                                                                                </li>}
                                                                            {!((comIndex + 1) <= data?.competency) && <li style={{ padding: "1px 10px 5px 10px", borderRight: "1px solid #BBBBBB" }}>
                                                                                <svg onClick={() => onSeleteCompetency(index, (comIndex + 1))} className='pointer' width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#A9A9A9" />
                                                                                </svg>
                                                                            </li>
                                                                            }
                                                                        </div>
                                                                    })}
                                                                </ul>
                                                                <p className='md_experience'><span className='fw-bold'>Superior Performer</span>: : Above-average ability is apparent in this competency.</p>
                                                            </div>
                                                        </div>
                                                    </div>}
                                                    {data?.isEvaluate === 'NO' && <div>
                                                        <div className='mt-2'>
                                                            <label className="input">
                                                                <input type="text" className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field " name="detailed_summary" id="detailed_summary" onChange={(e) => onChangeReasonForEvalution(e, index)} placeholder=" " />
                                                                <span className="input__label">Select a reason for not evaluating <span style={{ color: 'red', fontSize: '15px' }}>*</span></span>
                                                            </label> */}
                                {/* <label className="form-label job_dis_form_label">Select a reason for not evaluating
                                                                <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                                                            </label>
                                                            <input type="text" name="detailed_summary" className="form-control job_dis_form_control px-3 rounded manual_profile_padding" id="detailed_summary" onChange={(e) => onChangeReasonForEvalution(e, index)} /> */}
                                {/* <select className="form-select job_dis_form_control w-md-50 px-3 rounded manual_profile_padding down_arrow_bg_img text_area_width1" aria-label="Default select example">
                                                                <option value={'lakeOfTime'}>Lack of time</option>
                                                            </select> */}
                                {/* </div>
                                                    </div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })} */}
                            </div>



                            <div className='d-none col-md-6 evaluation_report_left_side_row_one' style={{ borderBottom: "none" }}>
                                <div className='row'>
                                    <div className='col-12'>
                                        <div className="mb-3">
                                            <label className="input">
                                                <textarea className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field textarea_padding" style={{ boxShadow: "none", height: "129px" }} id="exampleFormControlTextarea1" placeholder=' ' onChange={(e) => onChangeShortSummary(e)}></textarea>
                                                <span className="input__label">Detailed Summary <span style={{ color: 'red', fontSize: '15px' }}>*</span></span>
                                            </label>
                                            {/* <label className="form-label para_style">Detailed Summary<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                        <textarea className="form-control text_style text_area_width1" style={{ boxShadow: "none", height: "129px" }} id="exampleFormControlTextarea1" placeholder='Enter short Summary' onChange={(e) => onChangeDetailedSummary(e)}></textarea> */}
                                        </div>
                                        <div className="mb-3 mt-3">
                                            <label className="input">
                                                <textarea className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field textarea_padding" style={{ boxShadow: "none", height: "100px" }} id="exampleFormControlTextarea1" placeholder=' ' onChange={(e) => onChangeShortSummary(e)}></textarea>
                                                <span className="input__label">Short Summary<span style={{ color: 'red', fontSize: '15px' }}>*</span></span>
                                            </label>
                                            {/* <label className="form-label para_style">Short Summary<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                        <textarea className="form-control text_style text_area_width1" style={{ boxShadow: "none", height: "59px" }} id="exampleFormControlTextarea1" placeholder='Enter short Summary' onChange={(e) => onChangeShortSummary(e)}></textarea> */}
                                        </div>
                                        <div>
                                            {/* <label className="form-label para_style fw_6">Your comments on the screening instructions which were added by organization:<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                        <p className='para_style mb-4 text_area_width1'></p> */}
                                            {/* <textarea className="form-control text_style text_area_width1" style={{ boxShadow: "none", height: "129px" }} id="exampleFormControlTextarea1" placeholder='Enter your comments based on above' onChange={(e) => onChangeTotalComment(e)}></textarea> */}
                                            {/* <textarea className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field textarea_padding" style={{ boxShadow: "none", height: "129px" }} id="exampleFormControlTextarea1" placeholder='Enter your comments based on above' onChange={(e) => onChangeTotalComment(e)}></textarea> */}


                                            <label className="input">
                                                <textarea className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field textarea_padding" style={{ boxShadow: "none", height: "100px" }} id="exampleFormControlTextarea1" placeholder='Enter your comments based on above' onChange={(e) => onChangeTotalComment(e)}></textarea>
                                                <span className="input__label">Your comments on the screening instructions which were added by organization:<span style={{ color: 'red', fontSize: '15px' }}>*</span></span>
                                            </label>
                                        </div>
                                        <div className='mt-4'>
                                            {/* <label className="form-label para_style">Audio Summary<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                                        <ul className='d-sm-flex list-inline'>
                                            <li><button className='upload_audio'>Upload Audio</button></li>
                                            <li className='para_style mx-sm-3' style={{ padding: "10px 0px", color: "#777F8A" }}>Record and upload an Mp3 file from your  device</li>
                                        </ul> */}
                                            <label className="form-label job_dis_form_label mb-0">Audio Summary</label>
                                            <span className='text-danger'>*</span>
                                            <div className="mb-4">
                                                <div className="file px-3  rounded-5  d-inline-block large_btn_apply text-dark">Upload Audio
                                                    <input type="file" accept="audio/mp3" onChange={(e) => onUploadAudio(e)} />
                                                </div>
                                                <span className='mx-3 text_style'>Record and upload an Mp3 file from your  device</span>
                                                {audioUrl && <audio src={`${CLOUDFRONT_URL}/${audioUrl}`} controls ></audio>}
                                                {audioUrl && <i className="bi bi-trash-fill btn btn-danger cursor-pointer upload_delete" onClick={() => setAudioUrl('')} ></i>}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <button className='large_btn_apply rounded-3' onClick={() => onSubmitReport('save')}>Submit Report</button>
                                    <button className='large_btn_apply rounded-3 mx-4' onClick={() => onSubmitReport('draft')}>Save as draft</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className='col-3 evaluation_report_right_side_col_3'>
                            <div className='rounded-3 evaluation_report_right_side'>
                                <h6 className='related_links'>Related links</h6>
                                <ul className='list-inline' style={{ marginTop: "18px" }}>
                                    <li className='para_style'><NavLink to={`/dashboard/interviewview/description/${interview?.job_uuid}/${interview?.uuid}`}>Job Description</NavLink></li>
                                    {/* <li className='para_style'>Candidate Profile</li> */}
                    {/* </ul>
                            </div>
                        </div> */}
                </div>
            </div>
            <Offcanvas show={showNotes} onHide={() => setShowNotes(false)} placement={'end'}>
                <Offcanvas.Body>

                    <div className="bg-white p-4">

                        <div className="d-flex justify-content-between">
                            <div>
                                <h5 className="download_heading">
                                    {interview?.candidate_firstname}{" "}
                                    {interview?.candidate_lastname}
                                </h5>
                            </div>
                            <button
                                className="dashboard_happy_monday_dot_btn px-2 py-1 rounded mx-2"
                                onClick={() => setShowNotes(false)}
                            >
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M11.8327 1.34167L10.6577 0.166668L5.99935 4.825L1.34102 0.166668L0.166016 1.34167L4.82435 6L0.166016 10.6583L1.34102 11.8333L5.99935 7.175L10.6577 11.8333L11.8327 10.6583L7.17435 6L11.8327 1.34167Z"
                                        fill="black"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div>
                            <p className='top_para_styles'>{interview?.notes}</p>

                        </div>



                    </div>
                </Offcanvas.Body>
            </Offcanvas >
        </div>


    )
}
