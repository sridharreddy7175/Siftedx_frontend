import moment from 'moment';
import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect, useState } from 'react'
import { Form, Modal, Offcanvas } from 'react-bootstrap';
import Calendar from 'react-calendar';
import TimezoneSelect from 'react-timezone-select';
import { toast } from 'react-toastify';
import { CandidatesService } from '../../../../app/service/candidates.service';
import { JobsService } from '../../../../app/service/jobs.service';
import { LookUpService } from '../../../../app/service/lookup.service';
import { UsersService } from '../../../../app/service/users.service';
import { countryCodeValidations, emialValidations, linkedinValidations, mobileNumberValidations, nameValidations } from '../../../../app/utility/form-validations';
import { S3Helper } from '../../../../app/utility/s3-helper';
import ChipInput from '../../../../components/chip-input';
import { DataTable } from '../../../../components/data-table';
import FormBuilder from '../../../../components/form-builder';
import { FormControlError, FormField, FormValidators } from '../../../../components/form-builder/model/form-field';
import { FormValidator } from '../../../../components/form-builder/validations';
import { AppLoader } from '../../../../components/loader';
import NoData from '../../../../components/no-data';
import { TimePicker } from '../../../../components/time';
import { CLOUDFRONT_URL } from '../../../../config/constant';
import { JobsCandidateGridCols } from './data-grid-cols';
import Select from 'react-select';
import { useHistory,useParams } from 'react-router-dom';
import Add from "../../../../assets/icon_images/Add.png";
import Delete from "../../../../assets/icon_images/delete.png";
import ADD_ICON from '../../../../assets/icon_images/Add.svg';
import DELETE_ICON from '../../../../assets/icon_images/delete.svg';
import Addcandidate from '../../../../components/add-candidate/addcandidate';
import { Candidates } from '../../../../components/recruiter/candidates';


export const JobCandidateList = () => {
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [pageArray, setPageNumbers] = useState(1);
  const [showDiv, setShowDiv] = useState(false);
  const companyId = sessionStorage.getItem('company_uuid') || '';
  const [selectedCnadidate, setSelectedCnadidate] = useState('');
  const [modalShow, setModalShow] = React.useState(false);
  const [addCandidateModalShow, setAddCandidateModalShow] = React.useState(false);
  const [candidatesList, setcandidatesList] = useState<any[]>([]);
  const [selectedCandidatesList, setSelectedCandidatesList] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>({});
  const [timeZoneError, setTimeZoneError] = useState('');
  const [jobCandidatesList, setJobCandidatesList] = useState<any[]>([]);
  const [timeZones, setTimeZones] = useState<any[]>([]);
  const [calenderModalShow, setCalenderModalShow] = React.useState(false);
  const [showFirstCandidate, setShowFirstCandidate] = React.useState(false);
  const [calenderTimes, setCalenderTimes] = useState<any[]>([]);
  const [selectTab, setSelectTab] = useState('');
  const [addCandidateToJobError, setAddCandidateToJobError] = useState('');
  const [availabilityFormError, setAvailabilityFormError] = useState<any>('');
  const [selectedDate, onChangeDate] = useState<any>('');
  const userUuid = sessionStorage.getItem('userUuid') || [];
  const [avalableCalenderTimes, setAvalableCalenderTimes] = useState<any[]>([]);
  const [selectedTimeZone, setSelectedTimeZone] = useState<any>('');
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const selectedJobId = sessionStorage.getItem('selectedJob') || '';
  const [selectedJob, setSelectedJob] = useState<any>({});
  const history = useHistory();
  let { id, jobId } = useParams<{ id: string, jobId: string }>();


  useEffect(() => {
    let isFromJobCreation = sessionStorage.getItem('isFromJobForm');
    if (isFromJobCreation) {
      setModalShow(true);
    }
    getCandidates();
    JobsService.getJobsByUuid(selectedJobId).then(res => {
      if (res?.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        setSelectedJob(res);
      }
    })
    getJobCandidate('');
    LookUpService.timezones().then(res => {
      res.forEach((element: any) => {
        element.label = `${element?.zoneName} (${element?.tzName})`
        element.value = element?.zoneName
      });
      setTimeZones(res)
    })
    return () => {
      sessionStorage.setItem('isFromJobForm', '');
    }
  }, []);

  const getJobCandidate = (status: string) => {
    setJobCandidatesList([])
    setLoading(true);
    CandidatesService.getJobCandidates(selectedJobId, status).then(
      res => {
        res?.records?.forEach((element: any) => {
          element.skills = element?.skills_codes.split(',');
          element.exp = element?.skills_exp.split(',');
          element.interviewStatus = element?.interview_status === 'WAITING_FOR_SME_ACCEPT' ? 'Wating for SME to accept'
            : element?.interview_status === 'INTERVIEW_SCHEDULED' ? 'Interview Scheduled'
              : element?.interview_status === 'INTERVIEW_TAKEN' ?
                'Interview Taken' : element?.interview_status === 'COMPLETED' ?
                  'Interview Completed' : element?.interview_status === 'CANCELLED_BY_SME' ?
                    'Cancelled by SME' : element?.interview_status === 'CANDIDATE_NOT_ATTENDED' ?
                      'Candidate Not Attended' : '';
        });
        setJobCandidatesList([...res?.records]);
        setLoading(false);
      }
    )
  }

  const getJobReScheduled = () => {
    setLoading(true);
    setJobCandidatesList([])
    CandidatesService.getReScheduled(selectedJobId).then(
      res => {
        res.forEach((element: any) => {
          element.skills = element?.skills_codes.split(',');
          element.exp = element?.skills_exp.split(',');
          element.interviewStatus = element?.interview_status === 'WAITING_FOR_SME_ACCEPT' ? 'Wating for SME to accept'
            : element?.interview_status === 'INTERVIEW_SCHEDULED' ? 'Interview Scheduled'
              : element?.interview_status === 'INTERVIEW_TAKEN' ?
                'Interview Taken' : element?.interview_status === 'COMPLETED' ?
                  'Interview Completed' : element?.interview_status === 'CANCELLED_BY_SME' ?
                    'Cancelled by SME' : element?.interview_status === 'CANDIDATE_NOT_ATTENDED' ?
                      'Candidate Not Attended' : '';
        });
        setJobCandidatesList([...res]);
        setLoading(false);
      }
    )
  }
  const getJobNotScheduled = () => {
    setLoading(true);
    setJobCandidatesList([])
    CandidatesService.getNotScheduled(selectedJobId).then(
      res => {
        res.forEach((element: any) => {
          element.skills = element?.skills_codes.split(',');
          element.exp = element?.skills_exp.split(',');
          element.interviewStatus = element?.interview_status === 'WAITING_FOR_SME_ACCEPT' ? 'Wating for SME to accept'
            : element?.interview_status === 'INTERVIEW_SCHEDULED' ? 'Interview Scheduled'
              : element?.interview_status === 'INTERVIEW_TAKEN' ?
                'Interview Taken' : element?.interview_status === 'COMPLETED' ?
                  'Interview Completed' : element?.interview_status === 'CANCELLED_BY_SME' ?
                    'Cancelled by SME' : element?.interview_status === 'CANDIDATE_NOT_ATTENDED' ?
                      'Candidate Not Attended' : '';
        });
        setJobCandidatesList([...res]);
        setLoading(false);
      }
    )
  }
  const getCandidates = () => {
    CandidatesService.getCandidates(companyId).then(
      res => {
        res?.records.forEach((element: any) => {
          element.label = `${element?.user_firstname} ${element?.user_lastname}`
          element.value = element?.uuid
        });
        setcandidatesList(res?.records);
        setLoading(false);
      }
    )
  }
  const onEditjobs = (data: any) => {
    setSelectedCandidate({});
    setAvalableCalenderTimes([]);
    if (data?.type === 'calender') {
      onChangeDate(new Date());
      setCalenderTimes([{ time_from: '', time_to: '', availability_date: moment().format('YYYY-MM-DD'), availability_day: 0, is_recurring: false }]);
      setCalenderModalShow(true);
      setSelectedCandidate(data?.item);
      getAvailability(data?.item?.uuid);
    } else if (data?.type === 'link') {
      getAvailability(data?.item?.uuid);
      setSelectedCandidate(data?.item);
      setShowFirstCandidate(true);
    }
  }
  const onDeletejobs = (data: any) => {
    setLoading(true);
    CandidatesService.deleteJobCandidate(data?.uuid).then(
      res => {
        if (res.error) {
          toast.error(res?.error?.message);
        } else {
          setLoading(false);
          getJobCandidate(selectTab);
          toast.success('Deleted successfully');
        }
      }
    )
  }
  const onSearchText = (data: any) => {
  };

  const onPageChange = (data: any) => {
    setActivePage(data);
  }

  const onSelectCandidate = (selectedList: any) => {
    setSelectedCandidatesList(selectedList)
    // const candidates: any = [];
    // selectedList.map((candidate: any) => {
    //   candidates.push(candidate.uuid);
    // })
    // if (candidates.length > 0) {
    //   setSelectedCandidatesList(candidates);
    // }
  }

  const onRemoveCandidate = (selectedList: any, selectedItem: any) => {
    const candidates: any = [];
    selectedList.map((candidate: any) => {
      candidates.push(candidate.uuid);
    })
    if (candidates.length > 0) {
      setSelectedCandidatesList(candidates);
    }
  }

  const mapJobToCandidate = () => {
    setLoading(true);
    const condidates: any[] = []
    selectedCandidatesList.forEach(element => {
      condidates.push(element.uuid)
    });
    const data = {
      job_uuid: selectedJobId,
      candidate_uuids: condidates,
    }
    if (selectedCandidatesList.length > 0) {
      CandidatesService.jobmapping(data).then(
        res => {
          if (res.error) {
            setLoading(false);
            toast.error(res?.error?.message);
          } else {
            setLoading(false);
            setModalShow(false)
            setSelectedCnadidate('');
            getJobCandidate('');
          }
        }
      )
    } else {
      setLoading(false);
      setAddCandidateToJobError('Please select candidate');
    }
  }

  const onShowUploadNewCandidate = () => {
    setModalShow(false);
    setAddCandidateModalShow(true);
  }

  // const createCandidate = (candidate: any) => {
  //   setLoading(true);
  //   candidate.company_uuid = companyId;
  //   candidate.resume_urls = resumeUrl;
  //   candidate.photo_url = '';
 
  //   candidate.availability_time = '';

  //   candidate.recruiter_uuid = userUuid;
  //   candidate.job_uuid = selectedJobId;
  //   CandidatesService.addCandidate(candidate).then(
  //     res => {
  //       setLoading(false);
  //       if (res.error) {
  //         toast.error(res?.error?.message);
  //       } else {
  //         setAddCandidateModalShow(false);
  //         toast.success('Saved Successfully');
  //         getJobCandidate('');
  //       }
  //     }
  //   );
  // }
  const createCandidate=(candidate: any)=>{
    setLoading(true)
    CandidatesService.addCandidate(candidate).then((res) => {
      if (res.error) {
      setLoading(false);
        toast.error(res?.error?.message);
      } else {
        setLoading(false);
   
        toast.success("Saved Successfully");
      }
    });

  }

  const onUploadResume = async (event: any) => {
    setResumeUrl('');
    setLoading(true);
    if (event.target.files && event.target.files[0]) {
      UsersService.candidateResumeuploadurl(companyId).then(async res => {
        if (res?.error) {
          toast.error(res?.error?.message);
          setLoading(false);
        } else {
          const result = await S3Helper.uploadFilesToS3BySigned(res.presignedUrl,
            event.target.files[0],
            event.target.files[0]?.type
          );
          setResumeUrl(`${res.fileUrl}`);
          setLoading(false);
          toast.success("Uploaded Successfully");
        }
      })
    }
  };
  const onSelectDateTimeFrom = (e: any, index: number) => {
    const times: any = calenderTimes;
    times[index].time_from = e;
    times[index].availability_date = moment(selectedDate).format('YYYY-MM-DD');
    setCalenderTimes([...times])
  }

  const onSelectDateTimeTo = (e: any, index: number) => {
    const times: any = calenderTimes;
    times[index].time_to = e;
    setCalenderTimes([...times]);
  }
  const handleDelete = (item: any, index: number) => {
    const data = calenderTimes;
    data.splice(index, 1);
    setCalenderTimes([...data]);
  }

  const handleonCalenderTime = () => {
    const times: any = calenderTimes;
    if (times.length > 0 && times[0]?.time_from && times[0]?.time_to) {
      times.push({ time_from: '', time_to: '', availability_date: moment(selectedDate).format('YYYY-MM-DD'), availability_day: 0, is_recurring: false })
    } else {
      times[0].availability_date = moment(selectedDate).format('YYYY-MM-DD');
    }
    setCalenderTimes([...times])
  }

  const onSelectDate = (e: any) => {
    onChangeDate(e)
    handleonCalenderTime()
  }

  const onSaveWithDate = () => {
    if (selectedTimeZone !== -1) {
      setLoading(true);
      const dateTimes: any = avalableCalenderTimes;
      const data: any = calenderTimes;
      const filterData: any = data.filter((times: any) => times?.time_from && times?.time_to)
      filterData.forEach((element: any) => {
        element.timezone_offset = selectedTimeZone ? selectedTimeZone?.gmtOffset : null;
        element.timezone_name = selectedTimeZone ? selectedTimeZone?.zoneName : '';
      });
      const newData: any = [];
      if (dateTimes.length > 0) {
        dateTimes.forEach((element: any) => {
          element.times.forEach((innerElement: any) => {
            if (innerElement?.time_from && innerElement?.time_to) {
              newData.push(
                {
                  is_recurring: false,
                  availability_day: 0,
                  time_from: innerElement?.time_from,
                  time_to: innerElement?.time_to,
                  availability_date: element?.availability_date,
                  timezone_offset: selectedTimeZone ? selectedTimeZone?.gmtOffset : null,
                  timezone_name: selectedTimeZone ? selectedTimeZone?.zoneName : '',
                })
            }
          });
        });
      }
      const allDates = [...filterData, ...newData];
      if (allDates.length > 0 && selectedTimeZone) {
        CandidatesService.availability(selectedCandidate?.uuid, allDates).then(res => {
          if (res.error) {
            setLoading(false);
            toast.error(res?.error?.message);
          } else {
            setLoading(false);
            setCalenderModalShow(false);
            toast.success('Saved Successfully');
          }
        })
      } else {
        setAvailabilityFormError('Mandatory fields are not filled');
        setTimeout(() => {
          setAvailabilityFormError('');
        }, 2000);
        setLoading(false);
        if (allDates.length < 0) {
          // toast.error('Please select your available times');
          toast.error("Invalid times slots automatically removed")

        }
        if (!selectedTimeZone) {
          setTimeZoneError('Please select the time zone');
        }
      }
    } else {
      setAvailabilityFormError('Mandatory fields are not filled');
      setTimeout(() => {
        setAvailabilityFormError('');
      }, 2000);
      setLoading(false);
      if (selectedTimeZone === -1) {
        setTimeZoneError('Please select the time zone');
      }
    }
  }

  const getAvailability = (candidateUuid: string) => {
    const data: any = [];
    const calenderTimes: any = [];
    CandidatesService.getCandidateAvailability(candidateUuid).then(res => {
      const timezone = timeZones.find((p: any) => p.zoneName === res[0]?.timezone_name);
      setSelectedTimeZone(timezone);
      res.forEach((element: any, index: number) => {
        if (res.error) {
          toast.error(res?.error?.message);
        } else {
          if (data.length > 0) {
            data.forEach((dataElement: any) => {
              if (element.is_recurring && element?.availability_day === dataElement?.availability_day) {
                dataElement.is_recurring = element.is_recurring;
                dataElement.times.push({ time_from: element?.time_from, time_to: element?.time_to })
              }
            });
          }
          if (calenderTimes.length > 0) {
            calenderTimes.forEach((dataElement: any) => {
              const isExist = calenderTimes.find((newTime: any) => element?.availability_date === newTime?.availability_date);
              if (isExist && !element.is_recurring && element?.availability_day === 0) {
                const isTimeExist = dataElement.times.find((newTime: any) => newTime?.time_from === element?.time_from && newTime?.time_to === element?.time_to);
                if (!isTimeExist && element?.availability_date === dataElement?.availability_date) {
                  dataElement.times.push({ time_from: element?.time_from, time_to: element?.time_to })
                }
              } else {
                if (!element.is_recurring && element?.availability_day === 0) {
                  element.times = [{ time_from: element?.time_from, time_to: element?.time_to }];
                  calenderTimes.push(element);
                }
              }
            });
          } else {
            if (!element.is_recurring && element?.availability_day === 0) {
              element.times = [{ time_from: element?.time_from, time_to: element?.time_to }];
              calenderTimes.push(element);
            }
          }
        }
      });
      setAvalableCalenderTimes([...calenderTimes])
    })
  }

  const onDeleteSelectedDateTime = (index: number) => {
    const data = avalableCalenderTimes;
    data.splice(index, 1);
    setAvalableCalenderTimes([...data]);
  }

  const onSelectTimeZone = (event: any) => {
    setTimeZoneError('');
    setSelectedTimeZone(event);
  }


  const onSelectTab = (type: string) => {
    setSelectTab(type);
    setJobCandidatesList([]);
    if (type === 'all') {
      getJobCandidate('');
    } else if (type === 'notScheduled') {
      getJobNotScheduled();
    } else if (type === 'scheduled') {
      getJobCandidate('INTERVIEW_SCHEDULED');
    } else if (type === 'toBeReScheduled') {
      getJobCandidate('COMPLETED');
    } else if (type === 'screened') {
      getJobReScheduled()
    }
  }


  // const onChipData = (data: any) => {
  //   setTags(data);
  // }
  const onCandidateEdit = () => {
    sessionStorage.setItem('selectedCandidate', JSON.stringify(selectedCandidate));
    history.push(`/dashboard/candidates/form/${selectedCandidate?.uuid}`);
  }

  // const onChangeJoiningAvailability = (type: number) => {
  //   setSelectedJoiningAvailability(type);
  // }

  const onShowAddCandidate = () => {
    setSelectedCandidatesList([]);
    setAddCandidateToJobError('');
    setModalShow(true);
  }

  const onSeeSmes = () => {
    const job = sessionStorage.getItem('selectedJob');
    history.push(`/dashboard/companies/info/${companyId}/jobs/info/${job}/sme`);
  }

  return (
    <div className='row'>
      {loading &&
        <AppLoader loading={loading}></AppLoader>
      }
      <Candidates
        onClose={() => { }}
        saveCandidate={() => { }}
        jobId={jobId}
        isbutton={true}
      />
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <div className='invite_team_heading'>Add Candidate to this job</div>
            <p className='invite_team_content'>There are two ways to add candidates</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label add_candidate_records">Add candidate you have already in your SiftedX talent pool</label>
            <Select
              isMulti={true}
              value={selectedCandidatesList}
              onChange={(e) => onSelectCandidate(e)}
              options={candidatesList}
              className="search_dropdown"
            />
            {addCandidateToJobError && <p className="text-danger job_dis_form_label">{addCandidateToJobError}</p>}
          </div>
          <div>
            <button className='small_btn rounded' onClick={() => mapJobToCandidate()}>Add These Candidates</button>
          </div>
          <div className='horizontal_line_text'>
            <span style={{ fontSize: "12px", fontFamily: 'Roboto', fontWeight: "400", color: "#000000" }}>Or</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='px-3 py-4'>
            <div>
              <p className='add_candidate_records'>Add candidate from your own records</p>
            </div>
            <div>
              <button className='small_btn rounded' onClick={() => onShowUploadNewCandidate()}>Upload New Candidate Details</button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={addCandidateModalShow}
        onHide={() => setAddCandidateModalShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <div className='fs_14'>Add candidate from your own records</div>
            <p className='fs_14'>Enter the candidate details</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='col-12'>
            <Addcandidate
              onUploadResume={onUploadResume}
              resumeUrl={resumeUrl}
              onSave={createCandidate} />
          </div>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

      <Modal
        show={calenderModalShow}
        onHide={() => setCalenderModalShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        className="sx-close"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="px-3" id="contained-modal-title-vcenter">
            <div className='invite_team_heading side_heading mt-2'>Set Availability for {selectedCandidate?.user_firstname} {selectedCandidate?.user_lastname}</div>
            <p className='invite_team_content'>He will be matched with available SMEs automatically</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="row">
              <div className="col-md-12">
                <div className="availablity-interview-part bg-white p-4 border-0">
                  <div className="col-md-12">
                    <div className="mb-4">
                      {/* <label className="form-label job_dis_form_label">Time Zone<span style={{ color: 'red', fontSize: '15px' }}>*</span></label>
                      <Select
                        value={selectedTimeZone}
                        onChange={(e) => onSelectTimeZone(e)}
                        options={timeZones}
                        className="search_dropdown"
                      /> */}
                      <label className="input">
                        <TimezoneSelect
                          value={selectedTimeZone ? selectedTimeZone : ''}
                          onChange={(e: any) => onSelectTimeZone(e)}
                          // isDisabled={selectedUserData?.availability_status !== 1}
                          className="input__field"
                        />
                        <span className={`input__label input__label_disabled`}>Time Zone</span>
                      </label>
                      {timeZoneError && <p className="text-danger job_dis_form_label">{timeZoneError}</p>}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-12">
                      <div style={{ fontSize: '12px' }} >
                        Set availablity on a particular date
                      </div>
                      <div>
                        <div>
                          <Calendar minDate={new Date()} calendarType="US" onChange={onSelectDate} value={selectedDate} className="w-100 border-0" />
                        </div>
                        <div className="my-4">
                          <p className='invite_team_content'>What hours are you available on this date?</p>
                          <div className="row week-availabity border-0">
                            {calenderTimes.length > 0 ? <div className="col-md-10">
                              {calenderTimes.map((data: any, index: number) => {
                                return <div key={index} className="row mt-2">
                                  <div className="col-md-4">
                                    <TimePicker callback={(e) => onSelectDateTimeFrom(e, index)}></TimePicker>
                                    {/* <input type="time" className="form-control" onChange={(e) => onSelectDateTimeFrom(e, index)} /> */}
                                  </div>
                                  <div className="col-md-2 px-4 mt-1">
                                    To
                                  </div>
                                  <div className="col-md-4">
                                    <TimePicker callback={(e) => onSelectDateTimeTo(e, index)}></TimePicker>

                                    {/* <input type="time" className="form-control" onChange={(e) => onSelectDateTimeTo(e, index)} /> */}
                                  </div>
                                  <div className="col-md-2 px-2">
                                    <img src={DELETE_ICON} alt="delete" className='pointer py-1 mt-1' onClick={() => handleDelete(data, index)} />
                                    {/* <button className="btn btn-outline-secondary py-1" onClick={() => handleDelete(data, index)}>
                                      <i className="bi bi-trash"></i>
                                    </button> */}
                                  </div>
                                </div>
                              })}
                            </div> :
                              <div className="col-md-10">
                                Not available
                              </div>
                            }
                            <div className="col-md-2 ps-3 py-1">
                              {/* <i className="bi bi-plus plus-icon" onClick={handleonCalenderTime}></i> */}
                              <img src={ADD_ICON} alt="add" className='pointer py-1 mt-2' onClick={handleonCalenderTime} />

                            </div>
                          </div>
                          <div className='mt-4'>
                            <button className='large_btn rounded-3' onClick={onSaveWithDate}>Save</button>
                            {availabilityFormError && <span className="text-danger job_dis_form_label">{availabilityFormError}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        {avalableCalenderTimes?.map((data: any, index: number) => {
                          return <div className='row ' key={index}>
                            <div className="col-md-11">
                              <div>
                                <h6 className='side_heading mb-0 mt-3'>{moment(data?.availability_date).format("DD MMMM YYYY")}</h6>
                              </div>
                              <div>
                                {data?.times?.map((time: any, timeIndex: number) => {
                                  return <div key={timeIndex} className='top_para_styles fw_4'>{time?.time_from} - {time?.time_to}</div>
                                })}

                              </div>
                            </div>
                            <div className="col-md-1">
                              <button className='border-0 bg-transparent mt-3' onClick={() => onDeleteSelectedDateTime(index)}>
                                {/* <svg width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.75 10.875C0.75 11.5625 1.3125 12.125 2 12.125H7C7.6875 12.125 8.25 11.5625 8.25 10.875V3.375H0.75V10.875ZM2 4.625H7V10.875H2V4.625ZM6.6875 1.5L6.0625 0.875H2.9375L2.3125 1.5H0.125V2.75H8.875V1.5H6.6875Z" fill="black" />
                              </svg> */}
                                <img src={DELETE_ICON} alt="delete" className='pointer py-1 mt-1' onClick={() => handleDelete(data, index)} />
                              </button>
                            </div>
                          </div>
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

      <Offcanvas show={showFirstCandidate} onHide={() => setShowFirstCandidate(false)} placement={'end'}>
        <Offcanvas.Body>
          <div>
            <div className="bg-white p-4">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="download_heading">
                    {selectedCandidate?.user_firstname}{" "}
                    {selectedCandidate?.user_lastname}
                  </h5>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <div>
                  <p>
                    Added on{" "}
                    <b className="download_heading_name">
                      {moment(selectedCandidate?.created_at).format(
                        "DD MMM YYYY"
                      )}
                    </b>
                    &nbsp; by &nbsp;
                    <b className="download_heading_name">Recruiter Name</b>
                  </p>
                </div>
                <div>
                  <button
                    className="large_btn rounded"
                    onClick={() => onCandidateEdit()}
                  >
                    Edit
                  </button>
                  <button
                    className="dashboard_happy_monday_dot_btn px-2 py-1 rounded mx-2"
                    onClick={() => setShowFirstCandidate(false)}
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
              </div>
              <div className="d-flex justify-content-between">
                <div className="mt-3">
                  <h5 className="download_heading">Basic Details</h5>
                </div>
              </div>

              <div className="row">
                <div className="col-12 p-2">
                  <div className="row">
                    <div className="col-md-2">
                      <h6 className="download_heading_title">Name</h6>
                    </div>
                    <div className="col-md-10">
                      <p>
                        {selectedCandidate?.user_firstname}{" "}
                        {selectedCandidate?.user_lastname}
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                      <h6 className="download_heading_title">Email</h6>
                    </div>
                    <div className="col-md-10">
                      <p>{selectedCandidate?.user_email}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                      <h6 className="download_heading_title">Mobile</h6>
                    </div>
                    <div className="col-md-10">
                      <p>{selectedCandidate?.mobile_no}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                      <h6 className="download_heading_title">LinkedIn</h6>
                    </div>
                    <div className="col-md-10">
                      <p>
                        {" "}
                        <a
                          style={{
                            color: "#000000",
                            textDecoration: "none",
                            cursor: "pointer",
                          }}
                          href={selectedCandidate?.linkedin_url}
                          target="_blank"
                        >
                          {
                            selectedCandidate?.linkedin_url ? (
                              selectedCandidate?.linkedin_url
                            ) : (
                              <>&nbsp;</>
                            )
                          }
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                      <h6 className="download_heading_title">Added</h6>
                    </div>
                    <div className="col-md-10">
                      <p>
                        {moment(selectedCandidate?.created_at).format(
                          "DD MMM YYYY"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                      <h6 className="download_heading_title">CV</h6>
                    </div>
                    <div className="col-md-10">
                      <a
                        style={{ color: "#000000" }}
                        href={selectedCandidate?.resume_urls}
                        target="_blank"
                      >
                        Document
                      </a>
                    </div>
                  </div>
                </div>
                <div className="my-1 w-75">
                  <hr />
                </div>
                <div className="col-12 mt-3 p-2">
                  <h6 className="download_heading_title">Availability</h6>
                  {avalableCalenderTimes.length > 0 ? (
                    <div>
                      {avalableCalenderTimes?.map(
                        (data: any, index: number) => {
                          return (
                            <div className="row " key={index}>
                              <div className="col-md-10">
                                <div>
                                  <h6 className="top_para_styles fw_7 mb-0 mt-1">
                                    {moment(data?.availability_date).format(
                                      "DD MMMM YYYY"
                                    )}
                                  </h6>
                                </div>
                                <div>
                                  {data?.times?.map(
                                    (time: any, timeIndex: number) => {
                                      return (
                                        <div
                                          key={timeIndex}
                                          className="top_para_styles fw_4"
                                        >
                                          {time?.time_from} - {time?.time_to}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div>No Availability</div>
                  )}
                </div>
                {/* <div className="my-1 w-75">
                  <hr />
                </div>
                <div className="col-12 mt-3 p-2">
                  <h6 className="download_heading_title">Interviews</h6>
                  <div>No Interviews</div>
                </div> */}
                <div className="my-1 w-75">
                  <hr />
                </div>
                <div className="col-12 mt-3 p-2">
                  <h6 className="download_heading_title">Report</h6>
                  <div>
                    <div className="row">
                      <div className="col-6 font_bolder p-2">Experience</div>
                      <div className="col-6 font_bolder p-2">Skills</div>
                    </div>
                    {selectedCandidate.skills?.map(
                      (data: any, index: number) => {
                        return (
                          <div className="row " key={index}>
                            <div className="col-6 p-2">{data}</div>
                            <div className="col-6 p-2">
                              {selectedCandidate.exp[index]}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas >
    </div>
  )
}