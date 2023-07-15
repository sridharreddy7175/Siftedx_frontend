import React, { useEffect, useRef, useState } from "react";
import { Modal, Offcanvas } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { LookUpService } from "../../../../app/service/lookup.service";
import { SmeService } from "../../../../app/service/sme.service";
import { AppLoader } from "../../../../components/loader";
import NoData from "../../../../components/no-data";
import { Smes } from "../../../../components/recruiter/smes";
import { CLOUDFRONT_URL } from "../../../../config/constant";
// import INFO_ICON from "../../assets/icon_images/info icon.svg";
import INFO_ICON from "../../../../assets/icon_images/info icon.svg";
import ReactTooltip from "react-tooltip";

export const JobSmes = () => {
  const [loading, setLoading] = useState(false);
  let { id, jobId } = useParams<{ id: string; jobId: string }>();
  const [recommendedSmes, setRecommendedSmes] = useState<any>([]);
  const [selectedSmes, setSelectedSmes] = useState<any>([]);
  const [searchKey, setSearchkey] = useState("");
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [showSmeProfile, setShowSmeProfile] = useState(false);
  const [showSmeNotmatched, setShowSmeNotmatched] = useState(false);
  const [selectedSmeProfile, setSelectedSmeProfile] = useState<any>({});
  const company = sessionStorage.getItem("company_uuid") || "";
  const history = useHistory();

  const [showAvailabilityNotifications, setShowAvailabilityNotifications] =
    useState(false);
    const notificationref = useRef<any>(null);

  const [addAnotherCategory, setAddAnotherCategory] = useState<any>([
    {
      category: "",
      skills: [],
      candidateSkills: [
        {
          skill: "",
          experience: "",
          proficiency: "",
        },
      ],
    },
  ]);
  const [selectedTab, setSelectedTab] = useState("recommended");

  const onShowAvailabilityNotification = () => {
    setShowAvailabilityNotifications(true);
  };

  useEffect(() => {
    loadRecommendedSMES();
  }, []);

  const loadRecommendedSMES = () => {
    setLoading(true);
    const data = {
      job_uuid: jobId,
      search_key: searchKey,
    };
    SmeService.recommendedSmes(data).then((res) => {
      if (res.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        if (res?.smes) {
          res?.smes?.forEach((element: any) => {
            const isSelectedSme = selectedSmes.find(
              (data: string) => data === element.uuid
            );
            if (isSelectedSme) {
              element.selected = true;
            }
            if (element.user_image) {
              element.user_image = element.user_image.replace(
                CLOUDFRONT_URL + "/",
                ""
              );
            }
          });
          setRecommendedSmes([...res.smes]);
        }
        setSearchkey(res.search_key);
        setCanLoadMore(res.can_load_more);
        setLoading(false);
      }
    });
  };
  const onScheduleInterviews = () => {
    setLoading(true);
    const data = {
      job_uuid: jobId,
      smes: selectedSmes,
    };
    SmeService.scheduleInterviews(data).then((res) => {
      if (res.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        if (res.length < 1) {
          setShowSmeNotmatched(true);
        } else {
          toast.success("Scheduled interview successfully");
          const job = sessionStorage.getItem("selectedJob");
          history.push(
            `/dashboard/companies/info/${company}/jobs/info/${job}/interviews`
          );
        }
        setLoading(false);
      }
    });
  };
  const onSelectSme = (data: any, index: number) => {
    const selectedSme: any = [];
    recommendedSmes[index].selected = !data?.selected;
    recommendedSmes.forEach((element: any) => {
      if (element?.selected) {
        selectedSme.push(element?.uuid);
      }
    });
    setRecommendedSmes([...recommendedSmes]);
    setSelectedSmes([...selectedSme]);
    if (selectedTab === "selected") {
      const data: any = [];
      recommendedSmes.forEach((element: any) => {
        if (element.selected) {
          data.push(element);
        }
      });
      setRecommendedSmes([...data]);
    }
  };

  const onSeleteExperienceRate = (index: any, expIndex: number) => {
    const data = recommendedSmes;
    data[index].sme_rating = expIndex;
    setRecommendedSmes([...data]);
  };
  const onProfileView = (data: any) => {
    setShowSmeProfile(true);
    getSMESkills(data?.uuid);
    SmeService.getSmeProfileById(data?.uuid).then((res) => {
      if (res.error) {
        toast.error(res?.error?.message);
        setLoading(false);
      } else {
        setSelectedSmeProfile(res);
      }
    });
  };

  const getSMESkills = (uuid: string) => {
    setLoading(true);
    const data: any = [];
    SmeService.getSmeSkillsById(uuid).then((res) => {
      if (res.error) {
        toast.error(res?.error?.message);
        setLoading(false);
      } else {
        if (res.length > 0) {
          setAddAnotherCategory([]);
          res.forEach((element: any, index: number) => {
            if (data.length > 0) {
              const isExist = data.find(
                (innerElement: any, innerIndex: number) =>
                  element.category === innerElement.category
              );
              if (isExist) {
                isExist.candidateSkills.push({
                  skill: element?.skill,
                  experience: parseInt(element?.experience),
                  proficiency: element?.proficiency,
                });
              } else {
                data.push({
                  category: element?.category,
                  candidateSkills: [
                    {
                      skill: element?.skill,
                      experience: parseInt(element?.experience),
                      proficiency: element?.proficiency,
                    },
                  ],
                });
              }
            } else {
              data.push({
                category: element?.category,
                candidateSkills: [
                  {
                    skill: element?.skill,
                    experience: parseInt(element?.experience),
                    proficiency: element?.proficiency,
                  },
                ],
              });
            }
            setAddAnotherCategory([...data]);
          });
        }
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [selectedSmes]);

  const onSelectBookMark = (sme: any, index: number, isMark: boolean) => {
    setLoading(true);
    const data = recommendedSmes;
    data[index].isBookMark = isMark;
    const bookMarkData = {
      sme_uuid: sme?.uuid,
      company_uuid: company,
    };
    SmeService.smeBookMark(bookMarkData).then((res) => {
      if (res.error) {
        toast.error(res?.error?.message);
        setLoading(false);
      } else {
        setLoading(false);
        setRecommendedSmes([...data]);
      }
    });
  };

  const onSeeCompanyFav = () => {
    setLoading(true);
    SmeService.getCompanyFavSmes(company).then((res) => {
      if (res.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        res.forEach((element: any) => {
          element.matchedSkills = element.skills;
          element.uuid = element.user_uuid;
          if (element.user_image) {
            element.user_image = element.user_image.replace(
              CLOUDFRONT_URL + "/",
              ""
            );
          }
        });
        setRecommendedSmes([...res]);
        setLoading(false);
      }
    });
  };

  const onSeeUserFav = () => {
    setLoading(true);
    SmeService.getUserFavSmes().then((res) => {
      if (res.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        res.forEach((element: any) => {
          element.matchedSkills = element.skills;
          element.uuid = element.user_uuid;
          if (element.user_image) {
            element.user_image = element.user_image.replace(
              CLOUDFRONT_URL + "/",
              ""
            );
          }
        });
        setRecommendedSmes([...res]);
        setLoading(false);
      }
    });
  };

  const onSelectTab = (type: string) => {
    setSelectedTab(type);
    if (type === "recommended") {
      setSelectedSmes([]);
      loadRecommendedSMES();
    } else if (type === "orgFav") {
      setSelectedSmes([]);
      onSeeCompanyFav();
    } else if (type === "yourFav") {
      setSelectedSmes([]);
      onSeeUserFav();
    } else if (type === "selected") {
      const data: any = [];
      recommendedSmes.forEach((element: any) => {
        if (element.selected) {
          data.push(element);
        }
      });
      setRecommendedSmes([...data]);
    }
  };
  const onViewInstructions = () => {
    const job = sessionStorage.getItem("selectedJob");
    history.push(
      `/dashboard/companies/info/${company}/jobs/info/${job}/instructions`
    );
  };
  return (
    <div>
      {loading && <AppLoader loading={loading}></AppLoader>}
      <ReactTooltip
        place="bottom"
        type="light"
        effect="solid"
        border={true}
        borderColor={"#707070"}
      />

      <div className="d-flex ">
        <span className="side_heading m-0">21 SMEs matched for this job</span>
        {/* <img src={INFO_ICON} alt="info icon" className="me-1 ms-2" 
          data-tip=" These SMEs are matched based on their skills and experience corresponding to the job description. SMEs are ordered based on how strong their skills match the job, with stronger profiles at the top to weaker ones down the order for the information icon next to 21 SMES recommended. "
        /> */}
        <div className="d-inline-block" style={{width:"60%"}}>
          <img
            src={INFO_ICON}
            alt="info icon"
            className="ms-2 sx-text-primary pointer  position-relative mobile_info"
            onClick={() => onShowAvailabilityNotification()}
            onMouseLeave={() => setShowAvailabilityNotifications(false)}
            onMouseEnter={onShowAvailabilityNotification}
          />

          <div className="position-relative " >
            {showAvailabilityNotifications && (
              <div
                onMouseEnter={onShowAvailabilityNotification}
                className="rounded-3 availability_modal mt-2 opacity-none"
                style={{
                  zIndex: 999,
                }}
                ref={notificationref}
                onMouseLeave={() => setShowAvailabilityNotifications(false)}
              >
                <div className="row">
                  <div className="col-md-12 fs_14 mt-2 pt-1  px-lg-3 ">
                    <p className="fs_14 ">
                      These SMEs are matched based on their skills and
                      experience corresponding to the job description. SMEs are
                      ordered based on how strong their skills match the job,
                      with stronger profiles at the top to weaker ones down the
                      order for the information icon next to 21 SMES
                      recommended.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Smes
        jobId={jobId}
        onClose={() => {}}
        // onSave={() => {}}
        isbutton={true}
        // smeError={""}
      />

      {/* <div className='border_color rounded-3'>
                <nav>
                    <div className='row'>
                        <div className='col-9'>
                            <div className="nav nav-tabs nav_tabs_border" id="nav-tab" role="tablist">
                                <button className={`nav-link senior_ai_nav_item text-start ${selectedTab === 'recommended' && 'active'}`} id="recommended-tab" type="button" onClick={() => onSelectTab('recommended')}>
                                    <span><svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 9H4V5H0V9ZM0 14H4V10H0V14ZM0 4H4V0H0V4ZM5 9H17V5H5V9ZM5 14H17V10H5V14ZM5 0V4H17V0H5Z" fill="#757575" />
                                    </svg>
                                    </span><br />
                                    <span>Recommended</span>
                                </button>
                                <button className={`nav-link senior_ai_nav_item text-start ${selectedTab === 'selected' && 'active'}`} onClick={() => onSelectTab('selected')} type="button" >
                                    <span><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 0H1.99C0.88 0 0.00999999 0.9 0.00999999 2L0 16C0 17.1 0.88 18 1.99 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM16 12H12C12 13.66 10.65 15 9 15C7.35 15 6 13.66 6 12H1.99V2H16V12ZM13 7H11V4H7V7H5L9 11L13 7Z" fill="#757575" />
                                    </svg>
                                    </span><br />
                                    <span>Selected</span>
                                </button>
                                <button className={`nav-link senior_ai_nav_item text-start ${selectedTab === 'orgFav' && 'active'}`} onClick={() => onSelectTab('orgFav')} type="button" >
                                    <span><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 0H1.99C0.88 0 0.00999999 0.9 0.00999999 2L0 16C0 17.1 0.88 18 1.99 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM16 12H12C12 13.66 10.65 15 9 15C7.35 15 6 13.66 6 12H1.99V2H16V12ZM13 7H11V4H7V7H5L9 11L13 7Z" fill="#757575" />
                                    </svg>
                                    </span><br />
                                    <span>Organization Fav</span>
                                </button>
                                <button className={`nav-link senior_ai_nav_item text-start ${selectedTab === 'yourFav' && 'active'}`} onClick={() => onSelectTab('yourFav')} type="button">
                                    <span><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 0H1.99C0.88 0 0.00999999 0.9 0.00999999 2L0 16C0 17.1 0.88 18 1.99 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM16 12H12C12 13.66 10.65 15 9 15C7.35 15 6 13.66 6 12H1.99V2H16V12ZM13 7H11V4H7V7H5L9 11L13 7Z" fill="#757575" />
                                    </svg>
                                    </span><br />
                                    <span>Your Fav</span>
                                </button>
                            </div>
                        </div>
                        <div className='col-3 text-end pe-4 nav_tabs_border'>
                            <button className='all_members_add_members_btn px-4 py-2 rounded-2 pull-right mt-3' onClick={() => onViewInstructions()} >View Instructions</button>
                        </div>
                    </div>

                </nav>
                <div className="tab-content bg-white py-3">
                    <div className="active">
                        <div className='row px-4 py-4'>
                            <div className='co-md-12 col-sm-12'>
                              
                                {recommendedSmes.length > 0 ?
                                    <div className='row my-3'>
                                        {recommendedSmes.map((data: any, index: number) => {
                                            return <div key={index} className='col-md-4 mt-2'>
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
                                                            {data?.user_image ?
                                                                <img src={`${CLOUDFRONT_URL}/${data?.user_image}`} width="96" height="96" className='img_position' style={{ borderRadius: '50%', objectFit: 'fill' }} /> :
                                                                <svg width="96" height="96" className='img_position' viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect width="96" height="96" rx="48" fill="#C4C4C4" />
                                                                </svg>
                                                            }
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
                                                                    <div className='col-4 col-sm-4 font_bolder'>Skill</div>
                                                                    <div className='col-4 col-sm-4 font_bolder'>Experience</div>
                                                                    <div className='col-4 col-sm-4 font_bolder'>Proficiency</div>
                                                                    {data?.matchedSkills.map((skillData: any, skillIndex: number) => {
                                                                        return <div className='row' key={skillIndex}>
                                                                            {skillIndex < 4 && <div className='row'>
                                                                                <div className='col-4 col-sm-4'>{skillData?.skill}</div>
                                                                                <div className='col-4 col-sm-4'>{skillData?.experience}</div>
                                                                                <div className='col-4 col-sm-4'>{skillData?.proficiency}</div>
                                                                            </div>}
                                                                        </div>
                                                                    })}
                                                                </div>
                                                            </p>
                                                            <p>
                                                                {(data?.matchedSkills?.length > 4) && <p className='ft-14'>Click on view button to see more skills </p>}
                                                                <button className={`${data?.selected ? 'large_btn' : 'btn_white'} rounded me-3`} onClick={() => onSelectSme(data, index)}>{data?.selected ? 'Unselect' : 'Select'}</button>
                                                                <button className='large_btn rounded' onClick={() => onProfileView(data)}>View</button>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                    : <NoData message=""></NoData>
                                }
                            </div>
                            <div className="col*3">

                            </div>
                        </div>
                        {canLoadMore && selectedTab === 'recommended' && <button className='large_btn rounded ms-3' onClick={loadRecommendedSMES}>Load More</button>}
                        {selectedSmes.length > 0 && <button className='large_btn rounded ms-3' onClick={onScheduleInterviews}>Schedule Interviews</button>}
                    </div>
                </div>
            </div> */}

      {/* <Offcanvas show={showSmeProfile} onHide={() => setShowSmeProfile(false)} placement={'end'}>
                <Offcanvas.Body>
                    <div>
                        <div className='bg-white p-4'>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <h5 className='download_heading'>Candidate Details</h5>
                                </div>
                                <div>
                                    <button className='dashboard_happy_monday_dot_btn px-2 py-1 rounded mx-2' onClick={() => setShowSmeProfile(false)}><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.8327 1.34167L10.6577 0.166668L5.99935 4.825L1.34102 0.166668L0.166016 1.34167L4.82435 6L0.166016 10.6583L1.34102 11.8333L5.99935 7.175L10.6577 11.8333L11.8327 10.6583L7.17435 6L11.8327 1.34167Z" fill="black" />
                                    </svg>
                                    </button>
                                </div>
                            </div>
                            <div className='border rounded-3 p-2 mt-3'>
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
                                      
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='row'>
                                            <div className='col-12'>Profile</div>
                                            <div className='col-12' style={{ height: "150px", width: "150px" }}>
                                                <img style={{ height: '100%', width: '100%' }} src={`${CLOUDFRONT_URL}/${selectedSmeProfile?.user_image}`} alt="profile" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-md-4 mt-2'>LinkedIn</div>
                                        <div className='col-8 mt-2'>
                                            <a style={{ color: '#000000' }} href={selectedSmeProfile?.linkedin_url} target="_blank">{selectedSmeProfile?.linkedin_url}</a>
                                        </div>
                                        <div className='col-md-4 mt-2'>
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
                                                <div className='col-4 col-sm-4 font_bolder'>Skill</div>
                                                <div className='col-4 col-sm-4 font_bolder'>Experience</div>
                                                <div className='col-4 col-sm-4 font_bolder'>Proficiency</div>
                                                {smeSkills?.candidateSkills.map((skillData: any, skillIndex: number) => {
                                                    return <div className='row' key={skillIndex}>
                                                        <div className='col-4 col-sm-4'>{skillData?.skill}</div>
                                                        <div className='col-4 col-sm-4'>{skillData?.experience}</div>
                                                        <div className='col-4 col-sm-4'>{skillData?.proficiency}</div>
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                    })}

                                </div>
                            </div>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas > */}

      {/* <Modal
                show={showSmeNotmatched}
                onHide={() => setShowSmeNotmatched(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <div>
                            <div className='invite_team_heading'>Alert</div>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='border rounded-3 p-2'>
                        <h6>Could not schedule as availability timings did not matched, please try with other SME's</h6>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className='text-center'>
                        <button className='large_btn rounded me-3' onClick={() => setShowSmeNotmatched(false)}>Close</button>
                    </div>
                </Modal.Footer>
            </Modal> */}
    </div>
  );
};
