import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Add from "../../assets/icon_images/Add.png";
import DELETE_ICON from "../../assets/icon_images/delete.svg";
import Calendar from "react-calendar";
import moment from "moment";
import { TimePicker } from "../time";
import ValidationErrorMsgs from "../../app/utility/validation-error-msgs";
import { toast } from "react-toastify";
import { CandidatesService } from "../../app/service/candidates.service";
import TimezoneSelect from "react-timezone-select";
import { AppLoader } from "../loader";

interface Props {
  handleClose: any;
  candidateUuid: string;
}

const AvailabilityTime: React.FC<Props> = (props) => {
  const [selectedDate, onChangeDate] = useState<any>(new Date());
  const [calenderTimes, setCalenderTimes] = useState<any[]>([
    {
      time_from: "",
      time_to: "",
      availability_date: moment(selectedDate).format("YYYY-MM-DD"),
    },
  ]);
  const [selectedUserData, setSelectedUserData] = useState<any>({});
  let daysData = [
    { day: "Mondays", is_recurring: false, availability_day: 2, times: [] },
    { day: "Tuesdays", is_recurring: false, availability_day: 3, times: [] },
    { day: "Wednesdays", is_recurring: false, availability_day: 4, times: [] },
    { day: "Thursdays", is_recurring: false, availability_day: 5, times: [] },
    { day: "Fridays", is_recurring: false, availability_day: 6, times: [] },
    { day: "Saturdays", is_recurring: false, availability_day: 7, times: [] },
    { day: "Sundays", is_recurring: false, availability_day: 1, times: [] },
  ];
  const [days, setDaya] = useState<any[]>(daysData);
  const [avalableCalenderTimes, setAvalableCalenderTimes] = useState<any[]>([]);
  const [selectedDateTimes, setSelectedDateTimes] = useState<any[]>([]);
  const [selectedTimeZone, setSelectedTimeZone] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [availabilityFormError, setAvailabilityFormError] = useState<any>("");
  const [timeZoneError, setTimeZoneError] = useState("");
  const [timeZones, setTimeZones] = useState<any[]>([]);

  useEffect(() => {
    getAvailability(props.candidateUuid);
  }, []);

  const onSelectDate = (e: any) => {
    onChangeDate(e);
    handleonCalenderTime(e);
  };

  const getTimeInMins = (timeStr: string): number => {
    let timeInMins = 0;
    if (timeStr) {
      const timeHrsMins = timeStr.split(":");
      timeInMins = Number(timeHrsMins[0]) * 60 + Number(timeHrsMins[1]);
    }

    return timeInMins;
  };

  const handleonCalenderTime = (selectedDate: any) => {
    const times: any = calenderTimes;

    if (times.length > 0 ) {
      times.push({
        time_from: "",
        time_to: "",
        availability_date: moment(selectedDate).format("YYYY-MM-DD"),
        availability_day: 0,
        is_recurring: false,
      });
    } else {
      times[0].availability_date = moment(selectedDate).format("YYYY-MM-DD");
    }
    setCalenderTimes([...times]);
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
    if (!isTimeExist && times[index].time_from && times[index].time_to) {
      const availabilityDay =
        moment(times[index].availability_date, "YYYY-MM-DD").day() + 1;
      const recurringDay = days.find(
        (el) => el.availability_day === availabilityDay
      );
      if (recurringDay) {
        const recurringTimes = recurringDay.times;
        for (let tIndex = 0; tIndex < recurringTimes.length; tIndex++) {
          const timeSlot = recurringTimes[tIndex];
          if (
            (times[index].time_from < timeSlot.time_from &&
              times[index].time_to <= timeSlot.time_from) ||
            (times[index].time_from >= timeSlot.time_to &&
              times[index].time_to > timeSlot.time_to)
          ) {
          } else {
            isExistInRecurring = true;
          }
        }
      }
    }
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
    if (!isTimeExist) {
      const availabilityDay =
        moment(times[index].availability_date, "YYYY-MM-DD").day() + 1;
      const recurringDay = days.find(
        (el) => el.availability_day === availabilityDay
      );
      if (recurringDay) {
        const recurringTimes = recurringDay.times;
        for (let tIndex = 0; tIndex < recurringTimes.length; tIndex++) {
          const timeSlot = recurringTimes[tIndex];
          if (
            (times[index].time_from < timeSlot.time_from &&
              times[index].time_to <= timeSlot.time_from) ||
            (times[index].time_from >= timeSlot.time_to &&
              times[index].time_to > timeSlot.time_to)
          ) {
          } else {
            isExistInRecurring = true;
          }
        }
      }
    }
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
    const data: any = [];
    const calenderTimes: any = [];
    CandidatesService.getCandidateAvailability(candidateUuid).then((res) => {
      setSelectedTimeZone(res[0]?.timezone_name);
      res.forEach((element: any, index: number) => {
        if (res.error) {
          toast.error(res?.error?.message);
        } else {
          if (data.length > 0) {
            data.forEach((dataElement: any) => {
              if (
                element.is_recurring &&
                element?.availability_day === dataElement?.availability_day
              ) {
                dataElement.is_recurring = element.is_recurring;
                dataElement.times.push({
                  time_from: element?.time_from,
                  time_to: element?.time_to,
                });
              }
            });
          }
          if (calenderTimes.length > 0) {
            calenderTimes.forEach((dataElement: any) => {
              const isExist = calenderTimes.find(
                (newTime: any) =>
                  element?.availability_date === newTime?.availability_date
              );
              if (
                isExist &&
                !element.is_recurring &&
                element?.availability_day === 0
              ) {
                const isTimeExist = dataElement.times.find(
                  (newTime: any) =>
                    newTime?.time_from === element?.time_from &&
                    newTime?.time_to === element?.time_to
                );
                if (
                  !isTimeExist &&
                  element?.availability_date === dataElement?.availability_date
                ) {
                  dataElement.times.push({
                    time_from: element?.time_from,
                    time_to: element?.time_to,
                  });
                }
              } else {
                if (!element.is_recurring && element?.availability_day === 0) {
                  element.times = [
                    {
                      time_from: element?.time_from,
                      time_to: element?.time_to,
                    },
                  ];
                  calenderTimes.push(element);
                }
              }
            });
          } else {
            if (!element.is_recurring && element?.availability_day === 0) {
              element.times = [
                { time_from: element?.time_from, time_to: element?.time_to },
              ];
              calenderTimes.push(element);
            }
          }
        }
      });
      setAvalableCalenderTimes([...calenderTimes]);
    });
  };

  const onSaveWithDate = () => {
    if (selectedTimeZone !== -1) {
      setLoading(true);
      const data: any = calenderTimes;
      let timeZoneValue = selectedTimeZone?.value;
      let timeZoneValueoffset = selectedTimeZone?.offset * 60 * 60;
    //   const filterData: any = data.filter(
    //     (times: any) => times?.time_from && times?.time_to
    //   );

      const newData: any = [];
      const allDates = [...calenderTimes, ...newData,...avalableCalenderTimes];
      const isValidTimes = allDates.find((el: any) => el.error);
        
    //   data.push(time_from)
      allDates.forEach((element: any) => {
        element.time_from =  element.time_from? element.time_from:'00:00'
        element.to_from =  element.to_from? element.to_from:'00:00'
        element.timezone_offset = timeZoneValueoffset;
        element.timezone_name = timeZoneValue;
        element.is_recurring = false;
        delete element.error;
      });
      if (!isValidTimes && selectedTimeZone) {
        CandidatesService.availability(props.candidateUuid, allDates).then(
          (res) => {
            if (res.error) {
              setLoading(false);
              toast.error(res?.error?.message);
            } else {
              setLoading(false);
              props.handleClose();
              toast.success("Saved Successfully");
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

  return (
    <>
      {loading && <AppLoader loading={loading}></AppLoader>}

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
            <p className="text-danger job_dis_form_label">{timeZoneError}</p>
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
        <hr />
        <p className="top_para_styles">
          What hours are you available on this date?
        </p>
        <div className="row align-items-center week-availabity border-0">
          {calenderTimes.length > 0 ? (
            <div className="col-md-10 col-10">
              {calenderTimes.map((data: any, index: number) => {
                return (
                  <div key={index} className="px-0">
                    <div className="d-flex align-items-center">
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
                      <div className="w-md-25 text-center  me-3 me-lg-0 mt-2">
                        <img
                          src={DELETE_ICON}
                          alt="Delete"
                          className="pointer mt-1 ms-4"
                          onClick={() => handleDelete(index)}
                        />
                      </div>
                    </div>

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
            <div className="col-md-10 top_para_styles">Not available</div>
          )}
          <div className="col-1">
            {selectedUserData && (
              <img
                src={Add}
                alt="add"
                className="pointer mt-2 ms-5 ms-lg-0"
                onClick={() => handleonCalenderTime(selectedDate)}
              />
            )}
          </div>
        </div>

        <div className="mt-3">
          {avalableCalenderTimes?.map((data: any, index: number) => {
            return (
              <div className="row " key={index}>
                <div className="col-md-11">
                  <div>
                    <h6 className="side_heading mb-0 mt-3">
                      {moment(data?.availability_date).format("DD MMMM YYYY")}
                    </h6>
                  </div>
                  <div>
                    {data?.times?.map((time: any, timeIndex: number) => {
                      return (
                        <div key={timeIndex} className="top_para_styles fw_4">
                          {time?.time_from} - {time?.time_to}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="col-md-1">
                  {/* <button className='border-0 bg-transparent mt-3' onClick={() => onDeleteSelectedDateTime(index)}> */}

                  <img
                    src={DELETE_ICON}
                    alt="delete"
                    className="pointer py-1 mt-1"
                    onClick={() => onDeleteSelectedDateTime(index)}
                  />
                  {/* </button> */}
                </div>
              </div>
            );
          })}
        </div>

        <div className="row">
          <div className="col-md-6 mt-4 col-6 ">
            <button
              type="button"
              className="large_btn_apply btn-outline-primary mt-3"
              onClick={() => props.handleClose()}
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
            <br/>
            {availabilityFormError && (
              <span className="text-danger job_dis_form_label">
                {availabilityFormError}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AvailabilityTime;
