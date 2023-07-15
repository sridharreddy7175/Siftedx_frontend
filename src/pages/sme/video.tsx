import React, { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { JobsService } from "../../app/service/jobs.service";
import { SmeService } from "../../app/service/sme.service";
import { ZoomInterviewMeeting } from "../../components/zoom-invterview-meeting";
// import LogoImg from '../../assets/images/SiftedX Logo.png';
import LogoImg from "../../assets/images/siftedx_home_logo.png";

import { CLOUDFRONT_URL } from "../../config/constant";

export const VideoPage = () => {
    let { id, interview } = useParams<{ id: string; interview: string }>();
    const [show, setShow] = useState(false);
    const [showNotePad, setShowNotePad] = useState(false);
    const [notes, setNotes] = useState("");
    const loginUserId = sessionStorage.getItem("userUuid") || "";
    const [selectedInterviewInfo, setSelectedInterviewInfo] = useState<any>({});
    const [selectedJob, setSelectedJob] = React.useState<any>({});
    const [loading, setLoading] = useState(false);
    // const [selectedJob, setSelectedJob] = useState<any>([]);
    const [jobSkills, setJobSkills] = useState<any>([]);
    const [optionalSkills, setOptionalSkills] = useState<any>([]);
    // const [loading, setLoading] = useState(false);
    let history = useHistory();
    // let jobId=selectedJob?.job_uuid
    //  console.log("jobId",interview)
    const [jobTags, setJobTags] = useState<any>([]);





    const getJobsByUuid = (jobIdstr: string) => {

        setLoading(true);
        JobsService.getJobsByUuid(jobIdstr).then((res) => {
            if (res?.error) {
                setLoading(false);
                toast.error(res?.error?.message);
            } else {
                setSelectedJob({ ...res });
                const skills = res?.job_mandatory_skills
                    ? res?.job_mandatory_skills.split(",")
                    : [];
                const optSkills = res?.job_optional_skills
                    ? res?.job_optional_skills.split(",")
                    : [];
                setJobSkills([...skills]);
                const tags = res?.tags ? res?.tags.split(",") : [];
                setJobTags([...tags]);

                setOptionalSkills([...optSkills]);
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        SmeService.interviewInfoByInterview(interview).then((res) => {
            console.log("res", res);
            if (res.error) {
                toast.error(res?.error?.message);
                // setLoading(false);
            } else {
                const data = res[0];

                data.mandatorySkills = data?.job_mandatory_skills.split(",");
                data.optionalSkills = data?.job_optional_skills
                    ? data?.job_optional_skills.split(",")
                    : [];
                setSelectedInterviewInfo(data);
                getJobsByUuid(data.job_uuid)

                // setShow(true);
                // setLoading(false);
            }
        });
        JobsService.getInterviewById(interview).then((res) => {
            if (res.error) {
                toast.error(res?.error?.message);
                setLoading(false);
            } else {
                setLoading(false);
                setSelectedJob({ ...res[0] });
                // getJobsByUuid()

            }
        });
    }, []);

    const onChangeNots = (e: any) => {
        setNotes(e.target?.value);
    };
    const saveNotes = (notes: string) => {
        setLoading(true)
        const data = {
            uuid: interview,
            notes,
        };
        SmeService.smeNotes(data).then((res) => {
            // console.log("res", res);
            if (res.error) {
                toast.error(res?.error?.message);
                setLoading(false)

            } else {
                setLoading(false)

                toast.success("Saved Successfully");
            }
        });
    };

    const onBlearNotes = (e: any) => {
        saveNotes(e.target?.value);
    };

    // console.log("id",selectedJob.job_uuid)

    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className='organization_logo navbar navbar-dark flex-md-nowrap px-3 p-lg-0"'>
                            <img src={LogoImg} alt="loading" className="ms-4" />
                        </div>
                    </div>
                </div>
                <div className="ps-3 pe-3 mt-5 mt-3 pe-lg-5 ms-3">
                    <div className="row ">
                        <div className="col-8 ps-3">
                            <h3 className="top_heading_styles">
                                {selectedJob?.candidate_firstname}{" "}
                                {selectedJob?.candidate_lastname} | Technical interview
                            </h3>
                        </div>
                        <div className="col-4 mb-4">
                            <div className="d-flex justify-content-end">
                                <button
                                    className="large_btn_apply rounded-3"
                                    onClick={() => setShow(true)}
                                >
                                    Related Info
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="row ">
                        <div className="col-9 ps-3 ">
                            <ZoomInterviewMeeting
                                zoomId={id}
                                interview={interview}
                            ></ZoomInterviewMeeting>
                        </div>
                        <div className="col-3">
                            <div className="bg-white rounded-3 p-3 ms-4">
                                <p className="top_heading_styles">Notepad</p>
                                <p className="top_para_styles">
                                    These notes will be saved to interview records
                                </p>
                                <textarea
                                    className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field textarea_padding mb-4"
                                    style={{ boxShadow: "none", height: "410px" }}
                                    id="exampleFormControlTextarea1"
                                    placeholder=""
                                    onChange={(e) => onChangeNots(e)}
                                    onBlur={(e) => onBlearNotes(e)}
                                ></textarea>
                                <div className="text-end">
                                    <button
                                        className="large_btn_apply rounded-3"
                                        onClick={() => saveNotes(notes)}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-3 mb-2 d-flex justify-content-end px-4">
                    <p className="copyright">
                        Copyright © 2022 SiftedX. All Rights Reserved.
                    </p>
                </div>
            </div>
            <Offcanvas
                show={show}
                onHide={() => setShow(false)}
                placement="end"
                className="offcanvas_width mb-3 rounded-3"
            >
                <Offcanvas.Header className="offcanvas_header">
                    <Offcanvas.Title>
                        <div className="ms-3 ms-lg-2 mt-4 mt-lg-0">
                            <h5 className="top_heading_styles m-0">Related Info</h5>
                            <p className="top_para_styles m-0">
                                Access to info related to this interview
                            </p>
                        </div>
                    </Offcanvas.Title>
                    <div className="sx-close">
                        <button className="btn-close" onClick={() => setShow(false)}>
                            {/* <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.8327 1.34166L10.6577 0.166656L5.99935 4.82499L1.34102 0.166656L0.166016 1.34166L4.82435 5.99999L0.166016 10.6583L1.34102 11.8333L5.99935 7.17499L10.6577 11.8333L11.8327 10.6583L7.17435 5.99999L11.8327 1.34166Z" fill="black" />
                    </svg> */}
                        </button>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="ms-3 ms-lg-2 mt-4 mt-lg-0">
                        {/* <div className='col-4 border-end'> */}
                        <h6 className="side_heading">Skills</h6>
                        <div className="d-flex">
                            {jobSkills.map((data: any, index: number) => {
                                return (
                                    <span key={index} className="top_para_styles rounded-3">
                                        {data} ,
                                    </span>
                                );
                            })}

                            {optionalSkills.map((data: any, index: number) => {
                                return (
                                    <span key={index} className="top_para_styles rounded-3 ">
                                        {" "}
                                        {data}
                                    </span>
                                );
                            })}
                        </div>
                        <div>
                            <h6 className="side_heading">
                                Seniority and Experience
                            </h6>
                            <span className="top_para_styles rounded-3 mt-1">
                                {" "}
                                {selectedJob?.experience} years,
                            </span>
                            {selectedJob?.seniority_code && (
                                <span className="top_para_styles rounded-3 mt-1">
                                    {selectedJob?.seniority_code}
                                </span>
                            )}
                        </div>

                        <div className="mt-3">
                            <h6 className="side_heading">Tags</h6>
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

                        {/* <button
                                className="large_btn_apply rounded-3 btn-outline-primary me-3 mt-5 mb-1"

                                onClick={() => history.push("/dashboard/interviews/opportunities")}
                            >
                                Back
                            </button> */}

                        {/* </div> */}

                        {/* <div className='row'>
                            <div className='col-4'>
                                <p className='top_heading_styles'>JD Link</p>
                            </div>
                            <div className='col-8'>
                                <p className='top_para_styles'>
                                    <a style={{ color: '#000000' }}
                                        href={`/dashboard/interviewview/description/${selectedInterviewInfo?.job_uuid}/${selectedInterviewInfo.uuid}`}

                                    >Job Description Link</a>
                                </p>
                            </div>
                            <div className='col-4'>
                                <p className='top_heading_styles'>Candidate CV</p>
                            </div>
                            <div className='col-8'>
                                <p className='top_para_styles'>
                                    <a style={{ color: '#000000' }}
                                        href={`${CLOUDFRONT_URL}/${selectedInterviewInfo?.resume_urls}`}
                                        target="_blank">Document</a>
                                </p>
                            </div>
                            <div className='col-4'>
                                <p className='top_heading_styles'>Organization</p>
                            </div>
                            <div className='col-8'>
                                <p className='top_para_styles'>
                                    {selectedInterviewInfo?.company_name}
                                </p>
                            </div>
                            <div className='col-4'>
                                <p className='top_heading_styles'>Mandatory Skills</p>
                            </div>
                            <div className='col-8'>
                                <p className='top_para_styles'>
                                    {selectedInterviewInfo?.mandatorySkills?.map((data: any, index: number) => { return <span key={index} className='skills_border_color1'>{data}</span> })}
                                </p>
                            </div>
                            <div className='col-4'>
                                <p className='top_heading_styles'>Optional Skills</p>
                            </div>
                            <div className='col-8'>
                                {selectedInterviewInfo?.optionalSkills?.length > 0 ? <p className='top_para_styles'>
                                    {selectedInterviewInfo?.optionalSkills?.map((data: any, index: number) => { return <span key={index} className='skills_border_color1'>{data}</span> })}
                                </p> : <p className='top_para_styles'>No Optional Skills </p>}
                            </div>
                        </div> */}
                        {/* <ul className='d-flex list-inline'>
                            <li>
                                <ul className='list-inline'>
                                    <li><p className='report_details_headings'>JD Link</p></li>
                                    <li><p className='report_details_headings'>Candidate CV</p></li>
                                    <li><p className='report_details_headings'>Organization</p></li>
                                    <li><p className='report_details_headings'>Mandatory Skills</p></li>
                                    <li><p className='report_details_headings'>Optional Skills</p></li>
                                </ul>
                            </li>
                            <li className='ms-3'>
                                <ul className='list-inline'>
                                    <li><p className='top_para_styles  pointer'>
                                        <a style={{ color: '#000000' }}

                                            target="_blank">Job Description Link</a>
                                    </p></li>
                                    <li><p className='top_para_styles'>
                                        <a style={{ color: '#000000' }}
                                            href={`${CLOUDFRONT_URL}/${selectedInterviewInfo?.resume_urls}`}
                                            target="_blank">Document</a>
                                    </p></li>
                                    <li><p className='top_para_styles'>{selectedInterviewInfo?.company_name}</p></li>
                                    <li><p className='top_para_styles'>
                                        {selectedInterviewInfo?.mandatorySkills?.map((data: any, index: number) => { return <span key={index} className='skills_border_color1'>{data}</span> })}
                                    </p></li>
                                    <li>
                                        {selectedInterviewInfo?.optionalSkills?.length > 0 ? <p className='report_details1'>
                                            {selectedInterviewInfo?.optionalSkills?.map((data: any, index: number) => { return <span key={index} className='skills_border_color1'>{data}</span> })}
                                        </p> : <p className='top_para_styles'>No Optional Skills </p>}
                                    </li>
                                </ul>
                            </li>
                        </ul> */}
                        <div className="mt-3">
                            <p className="side_heading">Instructions to SMEs</p>

                            <p className="top_para_styles">{selectedJob.instructions_to_sme
                                ? <>{selectedJob.instructions_to_sme}</> : <>No Instructions to sme</>


                            }</p>
                        </div>
                    </div>
                    <div className="ms-3 ms-lg-2 mt-3 mt-lg-0">
                        <h5 className="side_heading">
                            Job description
                        </h5>
                        <p className="top_para_styles">{selectedJob.job_description
                            ? <>{selectedJob.job_description}</> : <>No Job description</>
                        }
                        </p>
                        {/* <div
                            className="top_para_styles"
                            dangerouslySetInnerHTML={{
                                __html: selectedInterviewInfo?.instructions_to_sme,
                            }}
                        ></div> */}
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            <Offcanvas
                show={showNotePad}
                onHide={() => setShowNotePad(false)}
                placement="end"
                className="offcanvas_width"
            >
                <Offcanvas.Header className="offcanvas_header">
                    <Offcanvas.Title>
                        <h5 className="top_heading_styles m-0">Notepad</h5>
                        <p className="top_para_styles m-0">
                            These notes will be saved to interview records
                        </p>
                    </Offcanvas.Title>

                    <div className="sx-close">
                        <button
                            className="btn-close"
                            onClick={() => setShowNotePad(false)}
                        ></button>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div>
                        <div className="d-flex justify-content-between">
                            <div></div>
                            <div>
                                <span>
                                    <svg
                                        width="9"
                                        height="9"
                                        viewBox="0 0 9 9"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <circle cx="4.5" cy="4.5" r="4.5" fill="#00BC13" />
                                    </svg>{" "}
                                    save
                                </span>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="input">
                                <textarea
                                    className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field textarea_padding mb-4"
                                    style={{ boxShadow: "none", height: "129px" }}
                                    id="exampleFormControlTextarea1"
                                    placeholder="Record your notes *"
                                    onChange={(e) => onChangeNots(e)}
                                    onBlur={(e) => onBlearNotes(e)}
                                ></textarea>
                                <span className="input__label">Record your notes *</span>
                            </label>

                            <button
                                className="large_btn_apply rounded-3 mt-3"
                                onClick={() => saveNotes(notes)}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};
