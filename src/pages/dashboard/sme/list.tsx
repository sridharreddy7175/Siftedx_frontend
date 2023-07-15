import React, { useEffect, useRef, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify';
import { SmeService } from '../../../app/service/sme.service';
import { AppLoader } from '../../../components/loader';
import NoData from '../../../components/no-data';

export const SmeList = () => {
    const [allSmes, setAllSmes] = useState<any[] | []>([]);
    const [loading, setLoading] = useState(false);
    const company = sessionStorage.getItem('company_uuid') || '';
    const [showSmeProfile, setShowSmeProfile] = useState(false);
    const [selectedSmeProfile, setSelectedSmeProfile] = useState<any>({});
    const [addAnotherCategory, setAddAnotherCategory] = useState<any>([{
        category: '',
        skills: [],
        candidateSkills: [
            {
                skill: '',
                experience: '',
                proficiency: ''
            }
        ]
    }]);
    useEffect(() => {
        setLoading(true);
        SmeService.getAllSme().then(res => {
            if (res?.errror) {
                setLoading(false);
                toast.error(res?.error?.message);
            } else {
                setLoading(false);
                res.forEach((element: any) => {
                    element.rate = 1;
                });
                setAllSmes([...res]);
            }
        })
    }, []);

    const onSeleteExperienceRate = (index: any, expIndex: number) => {
        const data = allSmes;
        data[index].rate = expIndex;
        setAllSmes([...data])
    }
    const onSelectBookMark = (sme: any, index: number, isMark: boolean) => {
        setLoading(true);
        const data = allSmes;
        data[index].isBookMark = isMark;
        const bookMarkData = {
            sme_uuid: sme?.uuid,
            company_uuid: company
        }
        SmeService.smeBookMark(bookMarkData).then(res => {
            if (res.error) {
                toast.error(res?.error?.message);
                setLoading(false);
            } else {
                setLoading(false);
                setAllSmes([...data]);
            }
        })
    }

    const onProfileView = (data: any) => {
        setShowSmeProfile(true);
        getSMESkills(data?.uuid);
        SmeService.getSmeProfileById(data?.uuid).then(res => {
            if (res.error) {
                toast.error(res?.error?.message);
                setLoading(false);
            } else {
                setSelectedSmeProfile(res);
            }
        })
    }

    const getSMESkills = (uuid: string) => {
        setLoading(true);
        const data: any = [];
        SmeService.getSmeSkillsById(uuid).then(res => {
            if (res.error) {
                toast.error(res?.error?.message);
                setLoading(false);
            } else {
                if (res.length > 0) {
                    setAddAnotherCategory([])
                    res.forEach((element: any, index: number) => {
                        if (data.length > 0) {
                            const isExist = data.find((innerElement: any, innerIndex: number) => element.category === innerElement.category)
                            if (isExist) {
                                isExist.candidateSkills.push(
                                    {
                                        skill: element?.skill,
                                        experience: parseInt(element?.experience),
                                        proficiency: element?.proficiency
                                    }
                                )
                            } else {
                                data.push({
                                    category: element?.category,
                                    candidateSkills: [
                                        {
                                            skill: element?.skill,
                                            experience: parseInt(element?.experience),
                                            proficiency: element?.proficiency
                                        }
                                    ]
                                })
                            }
                        } else {
                            data.push({
                                category: element?.category,
                                candidateSkills: [
                                    {
                                        skill: element?.skill,
                                        experience: parseInt(element?.experience),
                                        proficiency: element?.proficiency
                                    }
                                ]
                            })
                        }
                        setAddAnotherCategory([...data])
                    })
                }
                setLoading(false);
            }
        })
    }
    return (
        <div>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }
            <div className="border-top border-primary py-3 px-5">
                <div className="row">
                    <div className="col-md-10">
                        <h2>Sme</h2>
                    </div>
                </div>
                <div>
                    <div className='row my-3'>
                        <div className='border_color rounded-3'>
                            <div className="tab-content bg-white py-3" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="recommended" role="tabpanel" aria-labelledby="recommended-tab">
                                    <div className='row px-4 py-4'>
                                        <div className='col-12'>
                                            <div>
                                                <div className="input-group search_bar_border">
                                                    <span className="input-group-text input_group_text" id="basic-addon1"><i className="fa fa-search pointer" aria-hidden="true"></i></span>
                                                    <input type="text" className="form-control form_control_border py-2" placeholder="Search" aria-label="Username" aria-describedby="basic-addon1" />
                                                </div>
                                            </div>
                                            {allSmes.length > 0 ? <div className='row my-3'>
                                                {allSmes.map((data: any, index: number) => {
                                                    return <div key={index} className='col-4 mt-2'>
                                                        <div className='me-3'>
                                                            <div className='border rounded' style={{ position: 'relative' }}>
                                                                <div style={{ position: 'absolute', top: "20px", right: "20px" }}>
                                                                    {data?.isBookMark && <svg className='pointer' width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => onSelectBookMark(data, index, false)}>
                                                                        <path d="M12 0H2C0.9 0 0.0100002 0.9 0.0100002 2L0 18L7 15L14 18V2C14 0.9 13.1 0 12 0Z" fill="black" />
                                                                    </svg>}
                                                                    {!data?.isBookMark && <svg onClick={() => onSelectBookMark(data, index, true)} className='pointer' width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M0.51 2.00031V2C0.51 1.17287 1.1794 0.5 2 0.5H12C12.8239 0.5 13.5 1.17614 13.5 2V17.2417L7.19696 14.5404L7 14.456L6.80304 14.5404L0.500474 17.2415L0.51 2.00031Z" fill="#EDEDED" stroke="#BBBBBB" />
                                                                    </svg>}
                                                                </div>
                                                                <div className='border-bottom text-center' style={{ backgroundColor: "#EDEDED" }} >
                                                                    {data?.user_image ? <img src={data?.user_image} width="96" height="96" className='img_position' style={{ borderRadius: '50%', objectFit: 'fill' }} /> : <svg width="96" height="96" className='img_position' viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <rect width="96" height="96" rx="48" fill="#C4C4C4" />
                                                                    </svg>}
                                                                </div>
                                                                <div className='py-4 bg-white text-center mt-5'>
                                                                    <p className='m-0 card_heading'>{data?.user_firstname} {data?.user_lastname}</p>
                                                                    <p className='m-0 card_third_line'>{data?.sme_fee_currency === 'INR' ? '₹' : '$'}{data?.sme_fee} Per Interview</p>
                                                                    <p>
                                                                        <ul className='d-inline-flex list-inline rounded-3 mb-0'>
                                                                            {Array.apply(null, Array(5)).map((exp: any, expIndex: number) => {
                                                                                return <div key={expIndex}>
                                                                                    {(expIndex + 1) <= data?.sme_rating &&
                                                                                        <li style={{ padding: "1px 10px 5px 10px" }}>
                                                                                            <svg onClick={() => onSeleteExperienceRate(index, (expIndex + 1))} className='pointer' width="18" height="18" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#FFA800" />
                                                                                            </svg>
                                                                                        </li>}
                                                                                    {!((expIndex + 1) <= data?.sme_rating) && <li style={{ padding: "1px 10px 5px 10px" }}>
                                                                                        <svg onClick={() => onSeleteExperienceRate(index, (expIndex + 1))} className='pointer' width="18" height="18" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M6.00033 8.04439L9.2981 10.4444L8.03588 6.56883L11.3337 4.22217H7.28921L6.00033 0.222168L4.71144 4.22217H0.666992L3.96477 6.56883L2.70255 10.4444L6.00033 8.04439Z" fill="#A9A9A9" />
                                                                                        </svg>
                                                                                    </li>
                                                                                    }
                                                                                </div>
                                                                            })}
                                                                        </ul>
                                                                    </p>
                                                                    <p>
                                                                        <div className='row'>
                                                                            <div className='col-4 font_bolder'>Skill</div>
                                                                            <div className='col-4 font_bolder'>Experience</div>
                                                                            <div className='col-4 font_bolder'>Proficiency</div>
                                                                            {data?.skills.map((skillData: any, skillIndex: number) => {
                                                                                return <div className='row' key={skillIndex}>
                                                                                    <div className='col-4'>{skillData?.skill}</div>
                                                                                    <div className='col-4'>{skillData?.experience}</div>
                                                                                    <div className='col-4'>{skillData?.proficiency}</div>
                                                                                </div>
                                                                            })}
                                                                        </div>
                                                                    </p>
                                                                    <p>
                                                                        <button className='large_btn rounded' onClick={() => onProfileView(data)}>View</button>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                })}
                                            </div> : <NoData message=""></NoData>}
                                        </div>
                                        <div className="col*3">

                                        </div>
                                    </div>
                                </div>

                                <div className="tab-pane fade" id="Selected" role="tabpanel" aria-labelledby="Selected-tab">Selected</div>

                                <div className="tab-pane fade" id="Organization" role="tabpanel" aria-labelledby="Organization-tab">Organization Fav</div>

                                <div className="tab-pane fade" id="your-fav" role="tabpanel" aria-labelledby="your-fav-tab">Your Fav</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={showSmeProfile}
                onHide={() => setShowSmeProfile(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <div>
                            <div className='invite_team_heading'>Sme Profile</div>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='border rounded-3 p-2'>
                        <div className='row'>
                            <div className='col-8 mt-2'>
                                <div className='row'>
                                    <div className='col-6'>First Name</div>
                                    <div className='col-6'>{selectedSmeProfile?.user_firstname}</div>
                                    <div className='col-6 mt-2'>Last Name</div>
                                    <div className='col-6 mt-2'>{selectedSmeProfile?.user_lastname}</div>
                                    <div className='col-6 mt-2'>Email</div>
                                    <div className='col-6 mt-2'>{selectedSmeProfile?.user_email}</div>
                                    <div className='col-6 mt-2'>Expert Title</div>
                                    <div className='col-6 mt-2'>{selectedSmeProfile?.expert_title}</div>
                                    <div className='col-6 mt-2'>Fee</div>
                                    <div className='col-6 mt-2'>{selectedSmeProfile?.sme_fee}</div>
                                    <div className='col-6 mt-2'>Currency</div>
                                    <div className='col-6 mt-2'>{selectedSmeProfile?.sme_fee_currency}</div>
                                    <div className='col-6 mt-2'>Total Experience</div>
                                    <div className='col-6 mt-2'>{selectedSmeProfile?.total_experience}</div>
                                    {/* <div className='col-6 mt-2'>country</div>
                                    <div className='col-6 mt-2'>{selectedSmeProfile?.country_code}</div> */}
                                </div>
                            </div>
                            <div className='col-4'>
                                <div className='row'>
                                    <div className='col-12'>Profile</div>
                                    <div className='col-12' style={{ height: "150px", width: "150px" }}>
                                        <img style={{ height: '100%', width: '100%' }} src={selectedSmeProfile?.user_image} alt="profile" />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-4 mt-2'>LinkedIn</div>
                                <div className='col-8 mt-2'>
                                    <a style={{ color: '#000000' }} href={selectedSmeProfile?.linkedin_url} target="_blank">{selectedSmeProfile?.linkedin_url}</a>
                                </div>
                                <div className='col-4 mt-2'>
                                    CV
                                </div>
                                <div className='col-8 mt-2'>
                                    <a className='pointer' style={{ color: '#000000' }} href={selectedSmeProfile?.resume_url} target="_blank">Document</a>
                                </div>
                            </div>
                            <div className='col-md-12 mt-2'>
                                <div className='font_bolder'>Skills</div>
                            </div>
                            {addAnotherCategory.map((smeSkills: any, index: number) => {
                                return <div className='row border rounded-3 p-2' key={index}>
                                    <div className='font_bolder'>{smeSkills?.category}</div>
                                    <div className='row'>
                                        <div className='col-4 font_bolder'>Skill</div>
                                        <div className='col-4 font_bolder'>Experience</div>
                                        <div className='col-4 font_bolder'>Proficiency</div>
                                        {smeSkills?.candidateSkills.map((skillData: any, skillIndex: number) => {
                                            return <div className='row' key={skillIndex}>
                                                <div className='col-4'>{skillData?.skill}</div>
                                                <div className='col-4'>{skillData?.experience}</div>
                                                <div className='col-4'>{skillData?.proficiency}</div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            })}

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className='text-center'>
                        <button className='large_btn rounded me-3' onClick={() => setShowSmeProfile(false)}>Close</button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div >
    )
}
