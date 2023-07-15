import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import moment from "moment";
import { Modal } from "react-bootstrap";
import INFO_ICON from "../../assets/icon_images/info icon.svg";
import { Link, useHistory } from "react-router-dom";
import { DataTable } from "../data-table";
import { CandidateGridCols } from "./data-grid-cols";
import { CandidatesService } from "../../app/service/candidates.service";
import Addcandidate from "../add-candidate/addcandidate";
import { UsersService } from "../../app/service/users.service";
import { toast } from "react-toastify";
import { S3Helper } from "../../app/utility/s3-helper";
import Select from "react-select";
import { AppLoader } from "../loader";
import ValidationErrorMsgs from "../../app/utility/validation-error-msgs";
import { TimePicker } from "../time";
import TimezoneSelect from "react-timezone-select";
import Calendar from "react-calendar";
import ADD_ICON from "../../assets/icon_images/Add.png";
import DELETE_ICON from "../../assets/icon_images/delete.svg";
import { Utility } from "../../app/utility";

interface TimeSlot {
  time_from: string;
  time_to: string;
  availability_date: string;
  error: string;
}
interface Props {
  tableData?: any;
  onClose: () => void;
  saveCandidate: () => void;
  jobId: string;
  isbutton: boolean;
}

export const Candidates: React.FC<Props> = (props: Props) => {
  const [candidateShow, setcandidateShow] = React.useState(false);
  const companyId = sessionStorage.getItem("company_uuid") || "";
  const [candidatesList, setcandidatesList] = useState<any>([]);
  const [activePage, setActivePage] = useState(1);
  const [searchStr, setSearchStr] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCategorie, setSelectedCategorie] = useState<any>("");
  const [skills, setSkills] = useState<any[]>([]);
  const [fromDate, setFromDate] = useState<any>("");
  const [toDate, setToDate] = useState<any>("");
  const [selectedskill, setSelectedSkill] = useState<any>("");
  const [pageArray, setPageNumbers] = useState<any>(1);
  const [openCandidate, setOpenCandidate] = React.useState(false);
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const userUuid = sessionStorage.getItem("userUuid") || [];
  const selectedJobId = sessionStorage.getItem("selectedJob") || "";
  const [selectedCandidatesList, setSelectedCandidatesList] = useState<any[]>(
    []
  );
  const [multiCandidatesList, setMultiCandidatesList] = useState<any>([]);
  const [addCandidateToJobError, setAddCandidateToJobError] = useState("");
  const [calenderModalShow, setCalenderModalShow] = React.useState(false);
  const [selectedDate, onChangeDate] = useState<any>(new Date());
  // const [calenderTimes, setCalenderTimes] = useState<any[]>([
  //   {
  //     time_from: "",
  //     time_to: "",
  //     availability_date: moment(selectedDate).format("YYYY-MM-DD"),
  //   },
  // ]);
  const [calenderTimes, setCalenderTimes] = useState<any[]>([]);
  const [selectedUserData, setSelectedUserData] = useState<any>({});
  // let daysData = [
  //   { day: "Mondays", is_recurring: false, availability_day: 2, times: [] },
  //   { day: "Tuesdays", is_recurring: false, availability_day: 3, times: [] },
  //   { day: "Wednesdays", is_recurring: false, availability_day: 4, times: [] },
  //   { day: "Thursdays", is_recurring: false, availability_day: 5, times: [] },
  //   { day: "Fridays", is_recurring: false, availability_day: 6, times: [] },
  //   { day: "Saturdays", is_recurring: false, availability_day: 7, times: [] },
  //   { day: "Sundays", is_recurring: false, availability_day: 1, times: [] },
  // ];
  // const [days, setDaya] = useState<any[]>(daysData);
  const [avalableCalenderTimes, setAvalableCalenderTimes] = useState<any[]>([]);
  const [selectedDateTimes, setSelectedDateTimes] = useState<any[]>([]);
  const [selectedTimeZone, setSelectedTimeZone] = useState<any>("");
  const [availabilityFormError, setAvailabilityFormError] = useState<any>("");
  const [timeZoneError, setTimeZoneError] = useState("");
  const [timeZones, setTimeZones] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>({});
  const [newTimeSlot, setNewTimeSlot] = useState<TimeSlot>({
    time_from: '00:00', time_to: '00:00', availability_date: '', error: ''
  });
  const [isNewTimeSlotAdded, setIsNewTimeSlotAdded] = useState(false);

  const [showAvailabilityNotifications, setShowAvailabilityNotifications] = useState(false);
  const [candidatesInfo, setCandidatesInfo] = useState(false);
  const notificationref = useRef<any>(null);
  const [availabilityRes, setAvailabilityRes] = useState<any[]>([])

  useEffect(() => {
    if (props.jobId) {
      getJobCandidate("");
    }
  }, []);

  useEffect(() => {
    // getAvailability(props.jobId);
  }, [newTimeSlot]);

  const onClose = (): void => {
    props.onClose();
  };

  const saveCandidate = (): void => {
    let  availabilityEmpty = candidatesList.every((ele:any) => !ele.availabilities.length)
  
    if (availabilityEmpty) {
      toast.error('Please provide availability of the candidate')
    }
    else {
      props.saveCandidate();
    }

  };

  const getJobCandidate = (status: string) => {
    setcandidatesList([]);
    setLoading(true);
    CandidatesService.getJobCandidates(props.jobId, status).then((res) => {
      console.log("res",res)

      res.records.forEach((element: any) => {
        element.interview_status = Utility.getInterviewStatus(element.interview_status)

      });
      setcandidatesList([...res.records]);
      getAvailability(selectedCandidate.uuid);
      setLoading(false);
    });
  };

  const getCandidatesData = () => {
    CandidatesService.getCandidates(companyId).then((res) => {
      res?.records.forEach((element: any) => {
        element.label = `${element?.user_firstname} ${element?.user_lastname}`;
        element.value = element?.uuid;
      });
      setMultiCandidatesList(res?.records);
      setLoading(false);
    });
  };

  const addCandidateJob = (): void => {
    setcandidateShow(true);
    setAddCandidateToJobError("");
    setSelectedCandidatesList([]);
    getCandidatesData();
    // getJobCandidate("");
    // getAvailability(props.jobId);
  };
  const history = useHistory();

  const uploadNewCandidate = (): void => {
    setOpenCandidate(true);
    // getJobCandidate("");
  };

  const onPageChange = (data: any) => {
    setActivePage(data);
  };

  const onSearchText = (event: any) => {
    if (event.key === "Enter") {
      // getCandidates(1, event.target.value);
    }
  };

  const onSelectCandidate = (selectedList: any) => {
    setSelectedCandidatesList(selectedList);
    setAddCandidateToJobError("");
  };

  const onUploadResume = async (event: any) => {
    setResumeUrl("");
    setLoading(true);
    if (event.target.files && event.target.files[0]) {
      UsersService.candidateResumeuploadurl(companyId).then(async (res) => {
        if (res?.error) {
          toast.error(res?.error?.message);
          setLoading(false);
        } else {
          const result = await S3Helper.uploadFilesToS3BySigned(
            res.presignedUrl,
            event.target.files[0],
            event.target.files[0]?.type
          );
          setResumeUrl(`${res.fileUrl}`);
          setLoading(false);
          toast.success("Uploaded Successfully");
        }
      });
    }
  };

  const addCandidate = () => {
    setLoading(true);
    const condidates: any[] = [];
    selectedCandidatesList.forEach((element) => {
      condidates.push(element.uuid);
    });
    const data = {
      job_uuid: props.jobId,
      candidate_uuids: condidates,
    };
    if (selectedCandidatesList.length > 0) {
      CandidatesService.jobmapping(data).then((res) => {
        console.log("res", res)
        if (res.error) {
          toast.error(res?.error?.message);
          setLoading(false);

        }
        else {
          setLoading(false);
          setcandidateShow(false);
          getJobCandidate("");
          // 
        }
      });
    } else {
      setLoading(false);
      setAddCandidateToJobError("Please select candidate");
    }
  };

  const createCandidate = (candidate: any) => {
    setLoading(true);
    candidate.company_uuid = companyId;
    candidate.resume_urls = resumeUrl;
    candidate.photo_url = "";
    // candidate.skills_codes = selectedSkills.toString();
    candidate.availability_time = "";
    // candidate.total_experience = Number(candidate.total_experience);
    // candidate.availability_time = '';
    candidate.recruiter_uuid = userUuid;
    candidate.job_uuid = props.jobId;
    CandidatesService.addCandidate(candidate).then((res) => {
      if (res.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        setLoading(false);
        toast.success("Saved Successfully");
        setOpenCandidate(false);
        setcandidateShow(false);
        getJobCandidate("");
      }
    });

    // props.onSave(candidate);
  };

  useEffect(() => { }, []);

  const onSelectDate = (e: any) => {
    onChangeDate(e);
    const timeslot = { ...newTimeSlot };
    timeslot.availability_date = moment(e).format("YYYY-MM-DD");
    setNewTimeSlot(timeslot);
  };

  const getTimeInMins = (timeStr: string): number => {
    let timeInMins = 0;
    if (timeStr) {
      const timeHrsMins = timeStr.split(":");
      timeInMins = Number(timeHrsMins[0]) * 60 + Number(timeHrsMins[1]);
    }

    return timeInMins;
  };

  const handleonCalenderTime = () => {

    const times: any = calenderTimes;
    const timeFrom_Mins = getTimeInMins(newTimeSlot.time_from);
    const timeTo_Mins = getTimeInMins(newTimeSlot.time_to);
    if (timeTo_Mins - timeFrom_Mins >= 60) {
      const timesOnDate = calenderTimes.filter((el: any) => el.availability_date === moment(selectedDate).format("YYYY-MM-DD"));
      const availability_date = moment(selectedDate).format("YYYY-MM-DD");
      let isTimeExist = false;
      for (let tIndex = 0; tIndex < timesOnDate.length; tIndex++) {
        const timeSlot = timesOnDate[tIndex];
        if (availability_date === timeSlot.availability_date) {
          if (
            (newTimeSlot.time_from < timeSlot.time_from &&
              newTimeSlot.time_to <= timeSlot.time_from) ||
            (newTimeSlot.time_from >= timeSlot.time_to &&
              newTimeSlot.time_to > timeSlot.time_to)
          ) {
          } else {
            isTimeExist = true;
          }
        }
      }
      const newSlotTimeValue = moment(selectedDate);
      newSlotTimeValue.set({ 'hours': 0, 'minutes': 0 });
      newSlotTimeValue.set('minutes', timeFrom_Mins - 60);
      const currentTimeInMillis = moment().valueOf();
      const fromTimeInMillis = newSlotTimeValue.valueOf() - moment().valueOf();

      if (fromTimeInMillis < 0) {
        setIsNewTimeSlotAdded(true);
        const timeslot = { ...newTimeSlot };
        timeslot.error = ValidationErrorMsgs.TIMESLOT_PAST_TIME;
        setNewTimeSlot(timeslot);
        return;
      }
      if (!isTimeExist) {
        setIsNewTimeSlotAdded(false);
        times.push({
          time_from: newTimeSlot.time_from,
          time_to: newTimeSlot.time_to,
          availability_date: moment(selectedDate).format("YYYY-MM-DD"),
          availability_day: 0,
          is_recurring: false,
        });
        resetNewTimeSlot();
        times.sort((a: any, b: any) => a.availability_date.localeCompare(b.availability_date));
        setCalenderTimes([...times]);
      } else {
        setIsNewTimeSlotAdded(true);
        const timeslot = { ...newTimeSlot };
        timeslot.error = ValidationErrorMsgs.TIMESLOT_ALREADY_EXISTS;
        setNewTimeSlot(timeslot);
      }
    } else {
      setIsNewTimeSlotAdded(true);
      const timeslot = { ...newTimeSlot };
      timeslot.error = ValidationErrorMsgs.TIMESLOT_MINIMUM;
      setNewTimeSlot(timeslot);
    }

  };

  const resetNewTimeSlot = () => {
    const timeslot = { ...newTimeSlot };
    timeslot.time_from = "00:00";
    timeslot.time_to = "00:00";
    setNewTimeSlot(timeslot);
  }

  const onActiveTimeFrom = (e: any) => {
    const timeslot = { ...newTimeSlot };
    timeslot.time_from = e;
    setNewTimeSlot(timeslot);
    setIsNewTimeSlotAdded(false);
  };

  const onActiveTimeTo = (e: any) => {
    const timeslot = { ...newTimeSlot };
    timeslot.time_to = e;
    setNewTimeSlot(timeslot);
    setIsNewTimeSlotAdded(false);
  };

  const onSelectDateTimeFrom = (e: any, index: number) => {
    const times: any = calenderTimes;
    times[index].error = "";
    times[index].time_from = e;
    let isTimeExist = false;
    let isExistInRecurring = false;
    for (let tIndex = 0; tIndex < times.length; tIndex++) {
      const timeSlot = times[tIndex];
      if (times[index].availability_date === timeSlot.availability_date) {
        if (tIndex !== index) {
          if (
            (times[index].time_from < timeSlot.time_from &&
              times[index].time_to <= timeSlot.time_from) ||
            (times[index].time_from >= timeSlot.time_to &&
              times[index].time_to > timeSlot.time_to)
          ) {
          } else {
            isTimeExist = true;
          }
        }
      }
    }
    // if (!isTimeExist && times[index].time_from && times[index].time_to) {
    //   const availabilityDay =
    //     moment(times[index].availability_date, "YYYY-MM-DD").day() + 1;
    //   const recurringDay = days.find(
    //     (el) => el.availability_day === availabilityDay
    //   );
    //   if (recurringDay) {
    //     const recurringTimes = recurringDay.times;
    //     for (let tIndex = 0; tIndex < recurringTimes.length; tIndex++) {
    //       const timeSlot = recurringTimes[tIndex];
    //       if (
    //         (times[index].time_from < timeSlot.time_from &&
    //           times[index].time_to <= timeSlot.time_from) ||
    //         (times[index].time_from >= timeSlot.time_to &&
    //           times[index].time_to > timeSlot.time_to)
    //       ) {
    //       } else {
    //         isExistInRecurring = true;
    //       }
    //     }
    //   }
    // }
    let timeFrom_Mins = getTimeInMins(times[index].time_from);
    let timeTo_Mins = getTimeInMins(times[index].time_to);
    if (timeTo_Mins - timeFrom_Mins < 60 && timeTo_Mins !== 0) {
      times[index].error = "Minimum slot should be 1hour";
    } else if (isTimeExist) {
      times[index].error = "Time period already selected";
    } else if (isExistInRecurring) {
      times[index].error = ValidationErrorMsgs.AVAILABILITY_EXIST_IN_RECURRING;
    }
    setCalenderTimes([...times]);
  };

  const onSelectDateTimeTo = (e: any, index: number) => {
    const times: any = calenderTimes;
    times[index].error = "";
    times[index].time_to = e;
    let isTimeExist = false;
    let isExistInRecurring = false;
    for (let tIndex = 0; tIndex < times.length; tIndex++) {
      const timeSlot = times[tIndex];
      if (times[index].availability_date === timeSlot.availability_date) {
        if (tIndex !== index) {
          if (
            (times[index].time_from < timeSlot.time_from &&
              times[index].time_to <= timeSlot.time_from) ||
            (times[index].time_from >= timeSlot.time_to &&
              times[index].time_to > timeSlot.time_to)
          ) {
          } else {
            isTimeExist = true;
          }
        }
      }
    }
    // if (!isTimeExist) {
    //   const availabilityDay =
    //     moment(times[index].availability_date, "YYYY-MM-DD").day() + 1;
    //   const recurringDay = days.find(
    //     (el) => el.availability_day === availabilityDay
    //   );
    //   if (recurringDay) {
    //     const recurringTimes = recurringDay.times;
    //     for (let tIndex = 0; tIndex < recurringTimes.length; tIndex++) {
    //       const timeSlot = recurringTimes[tIndex];
    //       if (
    //         (times[index].time_from < timeSlot.time_from &&
    //           times[index].time_to <= timeSlot.time_from) ||
    //         (times[index].time_from >= timeSlot.time_to &&
    //           times[index].time_to > timeSlot.time_to)
    //       ) {
    //       } else {
    //         isExistInRecurring = true;
    //       }
    //     }
    //   }
    // }
    let timeFrom_Mins = getTimeInMins(times[index].time_from);
    let timeTo_Mins = getTimeInMins(times[index].time_to);
    if (timeTo_Mins - timeFrom_Mins < 60) {
      times[index].error = "Minimum slot should be 1hour";
    } else if (isTimeExist) {
      times[index].error = "Time period already selected";
    } else if (isExistInRecurring) {
      times[index].error = ValidationErrorMsgs.AVAILABILITY_EXIST_IN_RECURRING;
    }
    setCalenderTimes([...times]);
  };

  const handleDelete = (index: number) => {
    const data = calenderTimes;
    data.splice(index, 1);
    setCalenderTimes([...data]);
  };

  const onSelectTimeZone = (event: any) => {
    setTimeZoneError("");
    setSelectedTimeZone(event);
  };

  const onDeleteSelectedDateTime = (index: number) => {
    const data = avalableCalenderTimes;
    data.splice(index, 1);
    setAvalableCalenderTimes([...data]);
  };

  const getAvailability = (candidateUuid: string) => {
    // const data: any = [];
    // const calenderTimes: any = [];
    CandidatesService.getCandidateAvailability(candidateUuid).then((res) => {
      console.log("res", res)
      console.log("avaivlity",avalableCalenderTimes)
      // setAvailabilityRes(res)
      setSelectedTimeZone(res[0]?.timezone_name);
      // res.forEach((element: any, index: number) => {
      if (res.error) {
        toast.error(res?.error?.message);
      } else {
        const times = res.map((el: any) => {
          return {
            time_from: el.time_from,
            time_to: el.time_to,
            availability_date: moment(el.availability_date).format("YYYY-MM-DD"),
            availability_day: 0,
            is_recurring: false,
          }
        });

        setCalenderTimes(times);
        // if (data.length > 0) {
        //   data.forEach((dataElement: any) => {
        //     if (
        //       element.is_recurring &&
        //       element?.availability_day === dataElement?.availability_day
        //     ) {
        //       dataElement.is_recurring = element.is_recurring;
        //       dataElement.times.push({
        //         time_from: element?.time_from,
        //         time_to: element?.time_to,
        //       });
        //     }
        //   });
        // }
        // if (calenderTimes.length > 0) {
        //   calenderTimes.forEach((dataElement: any) => {
        //     const isExist = calenderTimes.find(
        //       (newTime: any) =>
        //         element?.availability_date === newTime?.availability_date
        //     );
        //     if (
        //       isExist &&
        //       !element.is_recurring &&
        //       element?.availability_day === 0
        //     ) {
        //       const isTimeExist = dataElement.times.find(
        //         (newTime: any) =>
        //           newTime?.time_from === element?.time_from &&
        //           newTime?.time_to === element?.time_to
        //       );
        //       if (
        //         !isTimeExist &&
        //         element?.availability_date === dataElement?.availability_date
        //       ) {
        //         dataElement.times.push({
        //           time_from: element?.time_from,
        //           time_to: element?.time_to,
        //         });
        //       }
        //     } else {
        //       if (!element.is_recurring && element?.availability_day === 0) {
        //         element.times = [
        //           {
        //             time_from: element?.time_from,
        //             time_to: element?.time_to,
        //           },
        //         ];
        //         calenderTimes.push(element);
        //       }
        //     }
        //   });
        // } else {
        //   if (!element.is_recurring && element?.availability_day === 0) {
        //     element.times = [
        //       { time_from: element?.time_from, time_to: element?.time_to },
        //     ];
        //     calenderTimes.push(element);
        //   }
        // }
      }
      // });
      setAvalableCalenderTimes([...calenderTimes]);
    });
  };

  const onSaveWithDate = () => {
    console.log("hello", selectedTimeZone)
    if (selectedTimeZone !== -1) {
      setLoading(true);
      const data: any = calenderTimes;
      let timeZoneValue = selectedTimeZone?.value;
      let timeZoneValueoffset = selectedTimeZone?.offset * 60 * 60;
      //   const filterData: any = data.filter(
      //     (times: any) => times?.time_from && times?.time_to
      //   );

      const newData: any = [];
      const allDates = calenderTimes;//[...calenderTimes, ...newData, ...avalableCalenderTimes];
      const isValidTimes = allDates.find((el: any) => el.error);
      allDates.forEach((element: any) => {
        element.time_from = element.time_from ? element.time_from : "00:00";
        element.to_from = element.to_from ? element.to_from : "00:00";
        element.timezone_offset = timeZoneValueoffset;
        element.timezone_name = timeZoneValue;
        element.is_recurring = false;
        delete element.error;
      });
      // console.log("allDays", allDates)
      if (!isValidTimes && selectedTimeZone) {
        CandidatesService.availability(selectedCandidate?.uuid, allDates).then(
          (res) => {
            console.log("res", res)
            if (res.error) {
              setLoading(false);
              toast.error(res?.error?.message);
            }
            // else if (res === "Server error") {
            //   setLoading(false)
            // }
            else {
              setLoading(false);
              toast.success("Saved Successfully");
              setCalenderModalShow(false);
              getJobCandidate("");
            }
          }
        );
      } else {
        setAvailabilityFormError("Mandatory fields are not filled");
        setTimeout(() => {
          setAvailabilityFormError("");
        }, 2000);
        setLoading(false);
        if (allDates.length < 0) {
          // toast.error('Please select your available times');
          toast.error("Invalid times slots automatically removed");
        }
        if (!selectedTimeZone) {
          setTimeZoneError("Please select the time zone");
        }
      }
    } else {
      setAvailabilityFormError("Mandatory fields are not filled");
      setTimeout(() => {
        setAvailabilityFormError("");
      }, 2000);
      setLoading(false);
      if (selectedTimeZone === -1) {
        setTimeZoneError("Please select the time zone");
      }
    }
  };

  const saveNext = () => {

  }

  const onEditjobs = (data: any) => {
    // setAvalableCalenderTimes([]);
    if (data?.type === "calender") {
      onChangeDate(new Date());
      // setCalenderTimes([]);
      setCalenderModalShow(true);
      getAvailability(data.item.uuid);
      setSelectedCandidate(data?.item);
      // getAvailability(data?.item?.uuid);
    } else if (data?.type === "link") {
      // getAvailability(props.jobId);
      getAvailability(data.item.uuid);
    }
    else if (data?.type === "delete") {
      console.log("delete")
      setLoading(true);
      CandidatesService.deleteJobCandidate(data?.item.uuid).then(
        res => {
          if (res.error) {
            toast.error(res?.error?.message);
          } else {
            setLoading(false);
            getJobCandidate("");
            toast.success('Deleted successfully');
          }
        }
      )
    }
  };

  const onShowAvailabilityNotification = () => {
    setShowAvailabilityNotifications(!showAvailabilityNotifications);

  }
  const uploadcandidates = () => {
    setCandidatesInfo(!candidatesInfo);

  }

  return (
    <>
      {loading && <AppLoader loading={loading}></AppLoader>}

      <div className="col-12 text-end mt-3">
        <button className="large_btn_apply me-3" onClick={addCandidateJob}>
          Add Candidate
        </button>
      </div>
      <div className="mt-4">
        {candidatesList.length > 0 ? (
          <DataTable
            TableCols={CandidateGridCols}
            tableData={candidatesList}
            activePageNumber={activePage}
            searchText={onSearchText}
            pageNumber={onPageChange}
            pageNumbers={pageArray}
            editInfo={onEditjobs}
          ></DataTable>
        ) : (
          <p className="f_12 ">No Records Found.</p>
        )}
      </div>
      {props.isbutton === false && (
        <div
          className={`row position-absolute px-3 px-lg-5 bottom-30 bottom-sm-20`}
          style={{ width: "100%", left: 0 }}
        >
          <div className="col-md-6 col-6  mt-5 mt-lg-0 mt-sm-4">
            <button
              className="btn-signup rounded ms-3"
              type="button"
              onClick={onClose}
            >
              Previous
            </button>
          </div>
          <div className="col-md-6 col-6 text-end mt-5 mt-lg-0 mt-sm-4 pe-2">
            <button
              className="large_btn_apply rounded me-4"
              type="button"
              onClick={saveCandidate}
            >
              Save & Next
            </button>
          </div>
        </div>
      )}

      <Modal
        show={candidateShow}
        onHide={() => setcandidateShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="sx-close  "
        backdropClassName='z-index-1055'
        centered
      >
        <Modal.Header closeButton className="ms-2">
          <Modal.Title id="contained-modal-title-vcenter">
            <div className="invite_team_heading">
              Add Candidates to this job
            </div>
            <p className="invite_team_content mb-0">
              There are two ways to add candidates
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="mt-0 ms-2">
          <form>
            <div>
              <label className="fs_14 mb-1 mt-2">
                Choose Candidates from SiftedX talent pool{" "}
              </label>

              <img
                src={INFO_ICON}
                alt="info icon"
                className="ms-2 sx-text-primary pointer  position-relative mb-1"
                onClick={() => onShowAvailabilityNotification()}
                onMouseLeave={() => setShowAvailabilityNotifications(false)}
                onMouseEnter={onShowAvailabilityNotification}
              />


              <div className="position-relative ms-md-5 ms-sm-0 " >
                {showAvailabilityNotifications && (
                  <div
                    onMouseEnter={() => setShowAvailabilityNotifications(true)}
                    className="rounded-3 availability_modal px-3 opacity-none "
                    style={{
                      zIndex: 999,
                    }}
                    ref={notificationref}
                    onMouseLeave={() => setShowAvailabilityNotifications(false)}
                  >
                    <div className="row">
                      <div className="col-md-12 fs_14 my-1 py-1   ">
                        <p className="fs_14 mb-0">
                          Start typing the first name or last name of the candidates you have already added to your SiftedX account under Candidates  page
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>


              <Select
                isMulti={true}
                value={selectedCandidatesList}
                onChange={(e) => onSelectCandidate(e)}
                options={multiCandidatesList}
                className="search_dropdown"
              />
              {addCandidateToJobError && (
                <p className="text-danger job_dis_form_label">
                  {addCandidateToJobError}
                </p>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className=" px-2 my-4 ms-3  d-flex justify-content-between">
            {/* <div className="  d-flex justify-content-between"> */}
            <div className="">
              <button
                className="large_btn_filter w-auto px-2"
                onClick={uploadNewCandidate}
              >
                Upload New Candidate Details
              </button>

              <img src={INFO_ICON} alt="info icon"
                className="ms-2 sx-text-primary pointer  position-relative mb-1"
                onClick={() => uploadcandidates()}
                onMouseLeave={() => setCandidatesInfo(false)}
                onMouseEnter={() => setCandidatesInfo(true)}
              />


            </div>

            <div className="">
              <button
                className="large_btn_apply login_btn rounded me-1"
                onClick={addCandidate}
              >
                Add Candidate
              </button>
            </div>
          </div>
          <div className="position-relative ms-md-5 ms-sm-0" >
            {candidatesInfo && (
              <div
                onMouseEnter={() => setCandidatesInfo(true)}
                className="rounded-3 availability_modal px-3 opacity-none "
                style={{
                  zIndex: 999, top: "-22px"
                }}
                ref={notificationref}
                onMouseLeave={() => setCandidatesInfo(false)}
              >
                <div className="row">
                  <div className="col-md-12 fs_14 my-1 py-1   ">
                    <p className="fs_14 mb-0">
                      Start typing the first name or last name of the candidates you have already added to your SiftedX account under Candidates  page
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* </div> */}

        </Modal.Footer>
      </Modal>

      <Modal
        show={openCandidate}
        onHide={() => setOpenCandidate(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="xl"
        className="sx-close w-100"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div
            className="my-2 px-lg-5 pb-3 px-3"
          // style={{ height: "80vh", overflow: "hidden", position: "relative" }}
          >
            <>
              <div
                className="mb-3 mt-5 mt-lg-0 pe-2"
              // style={{ height: "calc(100% - 140px)", overflow: "auto" }}
              >
                <p className="side_heading px-2 m-0">Add Candidate</p>
                <p className="top_para_styles pt-1 px-2">
                  Enter the candidate details
                </p>
                <Addcandidate
                  onUploadResume={onUploadResume}
                  resumeUrl={resumeUrl}
                  onSave={createCandidate}
                />
              </div>
            </>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={calenderModalShow}
        onHide={() => setCalenderModalShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        className="sx-close px-4"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <div className="invite_team_heading">
              Set Availability for {selectedCandidate?.user_firstname}{" "}
              {selectedCandidate?.user_lastname}
            </div>
            <p className="invite_team_content">
              He will be matched with available SMEs automatically
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="mb-4">
              <label className="input">
                <TimezoneSelect
                  value={selectedTimeZone ? selectedTimeZone : ""}
                  onChange={(e: any) => onSelectTimeZone(e)}
                  className="input__field"
                />
                <span className={`input__label input__label_disabled`}>
                  Time Zone
                </span>
              </label>
              {timeZoneError && (
                <p className="text-danger job_dis_form_label">
                  {timeZoneError}
                </p>
              )}
            </div>
            <div style={{ fontSize: "12px" }}>
              Set availablity on a particular date
            </div>
            <Calendar
              minDate={new Date()}
              calendarType="US"
              onChange={(e: any) => onSelectDate(e)}
              value={selectedDate}
              className="border-0"
            />
          </div>
          <div className="my-4 px-3">
            <p className="top_para_styles">
              What hours the candidate is available on &nbsp;
              <strong>{moment(selectedDate).format("YYYY-MM-DD")}</strong>
              &nbsp; date?
            </p>
            <div className="row align-items-center week-availabity border-0">
              <div className="col-md-10 col-10">
                <div className="px-0">
                  <div className="d-flex align-items-center">
                    <div className="w-md-25 me-3 me-lg-3 mt-2">
                      <TimePicker
                        callback={(e) => onActiveTimeFrom(e)}
                        time={newTimeSlot.time_from}
                      ></TimePicker>
                    </div>
                    <div className="w-md-25 text-center  me-3 me-lg-3 mt-2 ">
                      To
                    </div>
                    <div className="w-md-25 me-3 me-lg-3 mt-2">
                      <TimePicker
                        time={newTimeSlot.time_to}
                        callback={(e) => onActiveTimeTo(e)}
                      ></TimePicker>
                    </div>
                  </div>
                  {isNewTimeSlotAdded && <div className="text-left">
                    {newTimeSlot.error && (
                      <p className="text-danger job_dis_form_label">
                        {newTimeSlot.error}
                      </p>
                    )}
                  </div>}
                </div>
              </div>
              <div className="col-1">
                {selectedUserData && (
                  <img
                    src={ADD_ICON}
                    alt="add"
                    className="pointer mt-2 ms-5 ms-lg-0"
                    onClick={() => handleonCalenderTime()}
                  />
                )}
              </div>
            </div>
            <div className="">
              {calenderTimes.length > 0 ? (
                <div className="">
                  {calenderTimes.map((data: any, index: number) => {
                    return (
                      <div key={index} className="px-0">


                        {(index === 0 || (index > 0 && calenderTimes[index - 1].availability_date !== data.availability_date)) &&
                          <h5 className='top_heading_styles pt-3 mb-0 mt-2'>{data.availability_date}</h5>
                        }



                        {/* <div className="row"> */}
                        {/* <div className="col-12 col-md-10"> */}
                        {/* <div className="d-flex align-items-center">
                              <div className="w-md-25 me-3 me-lg-3 mt-2">
                                <TimePicker
                                  callback={(e) => onSelectDateTimeFrom(e, index)}
                                  time={data?.time_from}
                                ></TimePicker>
                              </div>
                              <div className="w-md-25 text-center  me-3 me-lg-3 mt-2 ">
                                To
                              </div>
                              <div className="w-md-25 me-3 me-lg-3 mt-2">
                                <TimePicker
                                  callback={(e) => onSelectDateTimeTo(e, index)}
                                  time={data?.time_to}
                                ></TimePicker>
                              </div>

                            </div> */}
                        <div className="d-flex justify-content-between">
                          <div className="top_para_styles fw_4 mb-0 mt-2" >
                            {data?.time_from} - {data?.time_to}
                          </div>
                          <div className="me-5">
                            <img
                              src={DELETE_ICON}
                              alt="Delete"
                              className="pointer me-1"
                              onClick={() => handleDelete(index)}
                            />
                          </div>
                        </div>
                        {/* </div> */}
                        {/* <div className="col-1">
                            <img
                              src={DELETE_ICON}
                              alt="Delete"
                              className="pointer mt-2"
                              onClick={() => handleDelete(index)}
                            />
                          </div> */}
                        {/* </div> */}
                        <div className="text-left">
                          {data?.error && (
                            <p className="text-danger job_dis_form_label">
                              {data?.error}
                            </p>
                          )}
                        </div>
                      </div>

                    );
                  })}
                </div>
              ) : (
                <div className="col-md-10 top_para_styles mt-2">Not available</div>
              )}
              {/* <div className="col-1">
                {selectedUserData && (
                  <img
                    src={ADD_ICON}
                    alt="add"
                    className="pointer mt-2 ms-5 ms-lg-0"
                    onClick={() => handleonCalenderTime()}
                  />
                )}
              </div> */}
            </div>

            {/* <div className="mt-3">
              {avalableCalenderTimes?.map((data: any, index: number) => {
                return (
                  <div className="row " key={index}>
                    <div className="col-md-11">
                      <div>
                        <h6 className="side_heading mb-0 mt-3">
                          {moment(data?.availability_date).format(
                            "DD MMMM YYYY"
                          )}
                        </h6>
                      </div>
                      <div>
                        {data?.times?.map((time: any, timeIndex: number) => {
                          return (
                            <div
                              key={timeIndex}
                              className="top_para_styles fw_4"
                            >
                              {time?.time_from} - {time?.time_to}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="col-md-1">

                      <img
                        src={DELETE_ICON}
                        alt="delete"
                        className="pointer py-1 mt-5"
                        onClick={() => onDeleteSelectedDateTime(index)}
                      />
                    </div>
                  </div>
                );
              })}
            </div> */}

            <div className="row">
              <div className="col-md-6 mt-4 col-6 ">
                <button
                  type="button"
                  className="large_btn_apply btn-outline-primary mt-3"
                  onClick={() => setCalenderModalShow(false)}
                >
                  Cancel
                </button>
              </div>

              <div className="col-md-6 mt-4 text-end col-6 ">
                <button
                  className="large_btn_apply rounded-3 mt-3"
                  onClick={onSaveWithDate}
                >
                  Save
                </button>
                <br />
                {availabilityFormError && (
                  <span className="text-danger job_dis_form_label">
                    {availabilityFormError}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};
