import moment from 'moment';
import React, { useEffect, useState, useRef } from 'react'
import { Form, Modal } from 'react-bootstrap';
import Calendar from 'react-calendar';
import { toast } from 'react-toastify';
import { SmeService } from '../../../app/service/sme.service';
import { AppLoader } from '../../../components/loader';
import { TimePicker } from '../../../components/time';
import { NotificationsService } from '../../../app/service/notifications.service';
import { connect, useDispatch } from 'react-redux';
import { UserData } from '../../../redux/actions';
import { UsersService } from '../../../app/service/users.service';
import TimezoneSelect from 'react-timezone-select';
import Add from "../../../assets/icon_images/Add.png";
import Delete from "../../../assets/icon_images/delete.png";
import INFO_ICON from '../../../assets/icon_images/info icon.svg';
import ReactTooltip from 'react-tooltip';
import { useLocation } from 'react-router-dom';
import spacetime from 'spacetime';
import ValidationErrorMsgs from '../../../app/utility/validation-error-msgs';

interface Props {
    UserDataReducer: any;
    userData?: (data: any) => void;
}

const Availability = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const [timeZones, setTimeZones] = useState<any[]>([]);
    const [calenderTimes, setCalenderTimes] = useState<any[]>([]);
    const [avalableCalenderTimes, setAvalableCalenderTimes] = useState<any[]>([]);
    const [selectedDateTimes, setSelectedDateTimes] = useState<any[]>([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [selectedDate, onChangeDate] = useState<any>('');
    const [selectedTimeZone, setSelectedTimeZone] = useState<any>('');
    let daysData = [
        { day: 'Mondays', is_recurring: false, availability_day: 2, times: [] },
        { day: 'Tuesdays', is_recurring: false, availability_day: 3, times: [] },
        { day: 'Wednesdays', is_recurring: false, availability_day: 4, times: [] },
        { day: 'Thursdays', is_recurring: false, availability_day: 5, times: [] },
        { day: 'Fridays', is_recurring: false, availability_day: 6, times: [] },
        { day: 'Saturdays', is_recurring: false, availability_day: 7, times: [] },
        { day: 'Sundays', is_recurring: false, availability_day: 1, times: [] }
    ]
    const [days, setDaya] = useState<any[]>(daysData);
    const [hours, setHours] = useState<any[] | []>([]);
    const [minutes, setMinutes] = useState<any[] | []>([]);
    const [formError, setFormError] = useState<any>('');
    const loginUserId = sessionStorage.getItem('userUuid') || '';
    const [accountStatus, setAccountStatus] = useState<any>();
    const [selectedUserData, setSelectedUserData] = useState<any>({});
    const [selectedTimeZoneData, setSelectedTimeZoneData] = useState<any>({});
    const [oneTimeZoneData, setOneTimeZoneData] = useState<any>({});
    const [isShowCopyIcon, setIsShowCopyIcon] = useState(false);
    const [showAvailabilityNotifications, setShowAvailabilityNotifications] = useState(false);
    const notificationref = useRef<any>(null);
    const [isCopyToAll, setIsCopyToAll] = useState(false);
    const [showCopyAll, setShowCopyAll] = useState(false);
    const copyref = useRef<any>(null);
    const { search } = useLocation<any>();
    const [selectedTimezoneOffset, setSelectedTimezoneOffset] = useState(0);
    const [showAvailabilitySolts, setShowAvailabilitySolts] = useState(false);
    const availabilitySoltsref = useRef<any>(null);
    const [hasValidationErrors, setHasValidationErrors] = useState(false);
    const [isCalendarSaveClicked, setIsCalendarSaveClicked] = useState(false);

    useEffect(() => {
        // setLoading(true);
        const h = [];
        for (let index = 0; index <= 23; index++) {
            h.push(index <= 9 ? '0' + index : index);
            setHours([...h])
        }
        const min = [];
        for (let index = 0; index <= 59; index++) {
            min.push(index <= 9 ? '0' + index : index);
            setMinutes([...min])
        }
        const searchParams = new URLSearchParams(search);
        setSelectedTimeZone(props?.UserDataReducer?.time_zone);
        if (Number(searchParams.get('step')) == 2) {
            removeAllTimeslots();
        } else {
            getAvailability('');
        }
        getLoginUserData();
    }, []);

    useEffect(() => {
        ReactTooltip.rebuild();
    }, [isShowCopyIcon, days]);
    useEffect(() => {
        setSelectedTimeZoneData({ value: props.UserDataReducer.time_zone, offset: spacetime.now(props.UserDataReducer.time_zone).offset() })
        setSelectedTimeZone(props.UserDataReducer.time_zone);
    }, [props?.UserDataReducer?.time_zone]);

    useEffect(() => {
        setFormError('');
    }, [days]);


    const getAvailability = (timezone: any) => {
        setLoading(true);
        setIsShowCopyIcon(false);
        setOneTimeZoneData({});
        const data: any = daysData;
        const calenderTimes: any = [];
        SmeService.getAvailability().then(res => {
            if (res.length > 0) {
                /** This will be useful to update the timezone based on the first availability record */
                if (res[0]?.timezone_name) {
                    setSelectedTimeZone(res[0]?.timezone_name);
                    setSelectedTimeZoneData({ value: res[0]?.timezone_name, offset: ((res[0]?.timezone_offset / 60) / 60) })
                }
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
            }
            const isTimeForOneDay = data.filter((timesData: any) => timesData.times.length > 0);
            if (isTimeForOneDay.length === 1) {
                setIsShowCopyIcon(true);
                setOneTimeZoneData(isTimeForOneDay[0])
            }
            setDaya([...data]);
            setAvalableCalenderTimes([...calenderTimes]);
            setLoading(false);
        })
    }

    const onMonday = (index: number) => {
        const data = days;
        data[index].times.push({ time_from: '00:00', time_to: '00:00' })
        setDaya([...data]);
    }

    const onChangeTimeFrom = (event: any, index: number, timeIndex: number) => {
        const data = days;
        data[index].times[timeIndex].error = "";
        data[index].is_recurring = true;
        data[index].times[timeIndex].time_from = event;
        // let isTimeExist = false;
        // for (let tIndex = 0; tIndex < data[index].times.length; tIndex++) {
        //     const timeSlot = data[index].times[tIndex];
        //     if (tIndex !== timeIndex) {
        //         if ((data[index].times[timeIndex].time_from < timeSlot.time_from && data[index].times[timeIndex].time_to <= timeSlot.time_from)
        //             || (data[index].times[timeIndex].time_from >= timeSlot.time_to && data[index].times[timeIndex].time_to > timeSlot.time_to)) {
        //         } else {
        //             isTimeExist = true;
        //         }
        //     }
        // }
        // let timeFrom_Mins = getTimeInMins(data[index].times[timeIndex].time_from);
        // let timeTo_Mins = getTimeInMins(data[index].times[timeIndex].time_to);
        // if ((timeTo_Mins - timeFrom_Mins < 60) && timeTo_Mins !== 0) {
        //     data[index].times[timeIndex].error = "Minimum slot should be 1hour";
        // }
        // if (isTimeExist && timeTo_Mins !== 0) {
        //     data[index].times[timeIndex].error = "Time period already selected";
        // }
        // if (timeTo_Mins !== 0 && timeFrom_Mins !== 0) {
        //     const isTimeForOneDay = data.filter((timesData: any) => timesData.times.length > 0);
        //     if (isTimeForOneDay.length === 1) {
        //         setIsShowCopyIcon(true);
        //         setOneTimeZoneData(isTimeForOneDay[0])
        //     }
        // }
        validateAllTimes(data);
        setDaya([...data]);
    }
    const onChangeTimeTo = (event: any, index: number, timeIndex: number) => {
        const data = days;
        data[index].times[timeIndex].error = "";
        data[index].is_recurring = true;
        data[index].times[timeIndex].time_to = event;
        // let isTimeExist = false;
        // for (let tIndex = 0; tIndex < data[index].times.length; tIndex++) {
        //     const timeSlot = data[index].times[tIndex];
        //     if (tIndex !== timeIndex) {
        //         if ((data[index].times[timeIndex].time_from < timeSlot.time_from && data[index].times[timeIndex].time_to <= timeSlot.time_from)
        //             || (data[index].times[timeIndex].time_from >= timeSlot.time_to && data[index].times[timeIndex].time_to > timeSlot.time_to)) {
        //         } else {
        //             isTimeExist = true;
        //         }
        //     }
        // }
        // let timeFrom_Mins = getTimeInMins(data[index].times[timeIndex].time_from);
        // let timeTo_Mins = getTimeInMins(data[index].times[timeIndex].time_to);
        // if (timeTo_Mins - timeFrom_Mins < 60) {
        //     data[index].times[timeIndex].error = "Minimum slot should be 1hour";
        // }
        // if (isTimeExist && timeTo_Mins !== 0) {
        //     data[index].times[timeIndex].error = "Time period already selected";
        // }
        // if (timeTo_Mins !== 0 && timeFrom_Mins !== 0) {
        //     const isTimeForOneDay = data.filter((timesData: any) => timesData.times.length > 0);
        //     if (isTimeForOneDay.length === 1) {
        //         setIsShowCopyIcon(true);
        //         setOneTimeZoneData(isTimeForOneDay[0])
        //     }
        // }

        validateAllTimes(data);
        setDaya([...data]);
    }

    const handlePopup = () => {
        setShow(true);
        setIsCalendarSaveClicked(false);
        setCalenderTimes([{ time_from: '', time_to: '', availability_date: moment().format('YYYY-MM-DD'), availability_day: 0, is_recurring: false, error: 'Minimum slot should be 1hour' }]);
        onChangeDate(new Date());
    }

    const handleonCalenderTime = (selectedDate: any, isDefault: boolean) => {
        const times: any = calenderTimes;
        // if (times.length > 0 && times[0]?.time_from && times[0]?.time_to) {
        if (times.length > 0) {
            const formatedSelectedDate = moment(selectedDate).format('YYYY-MM-DD');
            const existingDate = times?.find((el: any) => el.availability_date === formatedSelectedDate);
            if (!existingDate || isDefault) {
                times.push({ time_from: '', time_to: '', availability_date: formatedSelectedDate, availability_day: 0, is_recurring: false, error: 'Minimum slot should be 1hour' })
            }
        } else {
            times[0].availability_date = moment(selectedDate).format('YYYY-MM-DD');
        }
        times.sort((a: any, b: any) => a.availability_date.localeCompare(b.availability_date));
        setCalenderTimes([...times])
    }

    const handleDelete = (index: number) => {
        const data = calenderTimes;
        data.splice(index, 1);
        setCalenderTimes([...data]);
    }

    const validateAllTimes = (data: any[]): void => {
        // const data = days;
        // let hasError = false;
        for (let index = 0; index < data.length; index++) {
            if (data[index].times && data[index].times.length > 0) {
                for (let timeIndex = 0; timeIndex < data[index].times.length; timeIndex++) {
                    data[index].times[timeIndex].error = "";
                    let isTimeExist = false;
                    for (let tIndex = 0; tIndex < data[index].times.length; tIndex++) {
                        const timeSlot = data[index].times[tIndex];
                        if (tIndex < timeIndex) {
                            if ((data[index].times[timeIndex].time_from < timeSlot.time_from && data[index].times[timeIndex].time_to <= timeSlot.time_from)
                                || (data[index].times[timeIndex].time_from >= timeSlot.time_to && data[index].times[timeIndex].time_to > timeSlot.time_to)) {
                            } else {
                                isTimeExist = true;
                            }
                        }
                    }
                    let timeFrom_Mins = getTimeInMins(data[index].times[timeIndex].time_from);
                    let timeTo_Mins = getTimeInMins(data[index].times[timeIndex].time_to);
                    if (!timeFrom_Mins && !timeTo_Mins) {
                        data[index].times[timeIndex].error = 'This is invalid timeslot';
                    } else if (timeTo_Mins - timeFrom_Mins < 60) {
                        data[index].times[timeIndex].error = "Minimum slot should be 1hour";
                        // hasError = true;
                    } else if (isTimeExist && timeTo_Mins !== 0) {
                        data[index].times[timeIndex].error = "Time period already selected";
                        // hasError = true;
                    }
                }
            }
        }
        // setDaya([...data]);
        // return hasError;
    }

    const onSave = () => {
        if (selectedTimeZoneData) {

            const data: any = [];
            let hasInvalidTimeslots = false;
            let hasErrorslot = false;
            days.forEach(element => {
                if (element.availability_day !== 0) {
                    element.times.forEach((timeElement: any) => {
                        if (timeElement?.error) {
                            hasErrorslot = true;
                        }
                        if (element.is_recurring && timeElement?.time_from && timeElement?.time_to) {
                            let timeFrom_Mins = getTimeInMins(timeElement.time_from);
                            let timeTo_Mins = getTimeInMins(timeElement.time_to);
                            if (timeTo_Mins - timeFrom_Mins >= 60) {
                                data.push({
                                    is_recurring: element?.is_recurring,
                                    availability_day: element?.availability_day,
                                    time_from: timeElement?.time_from,
                                    time_to: timeElement?.time_to,
                                    availability_date: "",
                                    timezone_offset: selectedTimeZoneData ? ((selectedTimeZoneData?.offset * 60) * 60) : null,
                                    timezone_name: selectedTimeZoneData ? selectedTimeZoneData?.value : '',
                                });
                            } else if (!timeFrom_Mins && !timeTo_Mins) {
                                timeElement.error = 'This is invalid timeslot';
                                hasInvalidTimeslots = true;
                            }
                        } else {
                            // toast.error('Please select your available times');
                            // toast.error("Invalid times slots automatically removed")
                            timeElement.error = 'This is invalid timeslot';
                            hasInvalidTimeslots = true;
                        }
                    });
                }
            });
            selectedDateTimes.forEach((element: any) => {
                element.times.forEach((time: any) => {
                    if (time?.time_from && time?.time_to) {
                        let timeFrom_Mins = getTimeInMins(time.time_from);
                        let timeTo_Mins = getTimeInMins(time.time_to);
                        if (timeTo_Mins - timeFrom_Mins >= 60) {
                            data.push({
                                is_recurring: element?.is_recurring,
                                availability_day: element?.availability_day,
                                time_from: time?.time_from,
                                time_to: time?.time_to,
                                availability_date: element?.availability_date,
                                timezone_offset: selectedTimeZoneData ? ((selectedTimeZoneData?.offset * 60) * 60) : null,
                                timezone_name: selectedTimeZoneData ? selectedTimeZoneData?.value : '',
                            })
                        }
                    } else {
                        // toast.error('Please select your available times');
                        toast.error("Invalid times slots automatically removed")

                    }
                })
            });

            if (hasInvalidTimeslots) {
                setDaya([...days]);
                return;
            }
            // check for validation errors
            if (hasErrorslot) {
                // setHasValidationErrors(true);
                setFormError('Please remove the invalid slots')
                return;
            }
            if (data.length > 0) {
                setLoading(true);
                SmeService.availability(data).then(res => {
                    if (res.error) {
                        toast.error(res?.error?.message);
                        setLoading(false);
                    } else {
                        setDaya([]);
                        setAvalableCalenderTimes([]);
                        getAvailability(timeZones);
                        setLoading(false);
                        toast.success('Saved Successfully');
                        if (hasInvalidTimeslots) {
                            toast.error("Invalid times slots automatically removed");
                        }
                    }
                })
            }

        } else {
            setFormError('Mandatory fields are not filled');
            setTimeout(() => {
                setFormError('');
            }, 2000);
            setLoading(false);
            toast.error('Please select your time zone');
        }
    }

    const onSaveWithDate = () => {
        const dateTimes: any = avalableCalenderTimes;
        const data = [...calenderTimes, ...selectedDateTimes];
        const isValidTimes = calenderTimes.find((el: any) => el.error);
        setIsCalendarSaveClicked(true);
        if (!isValidTimes) {
            // setSelectedDateTimes([...data]);
            data.forEach(element => {
                if (dateTimes.length > 0) {
                    dateTimes.forEach((dateTime: any) => {
                        if (element.availability_date === dateTime?.availability_date) {
                            const isExist = dateTime.times.find((newData: any) => newData.time_from === element?.time_from && newData.time_to === element?.time_to);
                            if (!isExist) {
                                dateTime.times.push({ time_from: element?.time_from, time_to: element?.time_to });
                            }
                        } else {
                            element.times = [{ time_from: element?.time_from, time_to: element?.time_to }];
                            dateTimes.push(element);
                        }
                    });
                } else {
                    element.times = [{ time_from: element?.time_from, time_to: element?.time_to }];
                    dateTimes.push(element);
                }
            });
            const newDates = dateTimes.filter((ele: any, ind: number) => ind === dateTimes.findIndex((elem: any) => elem.availability_date === ele.availability_date))
            setSelectedDateTimes([...newDates])
            setAvalableCalenderTimes([...newDates]);
            handleClose();
        } else {
            toast.error('Please select valid times');
        }
    }

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
                    if ((times[index].time_from < timeSlot.time_from && times[index].time_to <= timeSlot.time_from)
                        || (times[index].time_from >= timeSlot.time_to && times[index].time_to > timeSlot.time_to)) {
                    } else {
                        isTimeExist = true;
                    }
                }
            }
        }
        if (!isTimeExist && times[index].time_from && times[index].time_to) {
            const availabilityDay = moment(times[index].availability_date, 'YYYY-MM-DD').day() + 1;
            const recurringDay = days.find(el => el.availability_day === availabilityDay);
            if (recurringDay) {
                const recurringTimes = recurringDay.times;
                for (let tIndex = 0; tIndex < recurringTimes.length; tIndex++) {
                    const timeSlot = recurringTimes[tIndex];
                    if ((times[index].time_from < timeSlot.time_from && times[index].time_to <= timeSlot.time_from)
                        || (times[index].time_from >= timeSlot.time_to && times[index].time_to > timeSlot.time_to)) {
                    } else {
                        isExistInRecurring = true;
                    }
                }
            }
        }
        let timeFrom_Mins = getTimeInMins(times[index].time_from);
        let timeTo_Mins = getTimeInMins(times[index].time_to);
        if ((timeTo_Mins - timeFrom_Mins < 60) && timeTo_Mins !== 0) {
            times[index].error = "Minimum slot should be 1hour";
        } else if (isTimeExist) {
            times[index].error = "Time period already selected";
        } else if (isExistInRecurring) {
            times[index].error = ValidationErrorMsgs.AVAILABILITY_EXIST_IN_RECURRING;
        }
        setCalenderTimes([...times])
    }

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
                    if ((times[index].time_from < timeSlot.time_from && times[index].time_to <= timeSlot.time_from)
                        || (times[index].time_from >= timeSlot.time_to && times[index].time_to > timeSlot.time_to)) {
                    } else {
                        isTimeExist = true;
                    }
                }
            }
        }
        if (!isTimeExist) {
            const availabilityDay = moment(times[index].availability_date, 'YYYY-MM-DD').day() + 1;
            const recurringDay = days.find(el => el.availability_day === availabilityDay);
            if (recurringDay) {
                const recurringTimes = recurringDay.times;
                for (let tIndex = 0; tIndex < recurringTimes.length; tIndex++) {
                    const timeSlot = recurringTimes[tIndex];
                    if ((times[index].time_from < timeSlot.time_from && times[index].time_to <= timeSlot.time_from)
                        || (times[index].time_from >= timeSlot.time_to && times[index].time_to > timeSlot.time_to)) {
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
    }

    const onDeleteDayTime = (index: number, timeIndex: number) => {
        const data = days;
        data[index].times.splice(timeIndex, 1);
        const isTimeForOneDay = data.filter((timesData: any) => timesData.times.length > 0);
        if (isTimeForOneDay.length === 1) {
            setIsShowCopyIcon(true);
            setOneTimeZoneData(isTimeForOneDay[0])
        }
        setDaya([...data]);
    }

    const onDeleteDateTimes = (index: number) => {
        const data = avalableCalenderTimes;
        data.splice(index, 1);
        setAvalableCalenderTimes([...data]);
    }

    const onSelectTimeZone = (event: any) => {

        setSelectedTimeZone(event);
        setSelectedTimeZoneData(event)
    }

    const onSelectDate = (e: any) => {
        onChangeDate(e)
        handleonCalenderTime(e, false)
    }

    const onChangeAccountStatus = (e: any) => {
        setAccountStatus(e.target.checked);
        setLoading(true);
        // setAccountStatus(status);
        NotificationsService.updateSmeAvailability(e.target.checked ? 1 : 2).then((res: any) => {
            if (res?.error) {
                setLoading(false);
                toast.error(res?.error?.message);
            } else {
                setLoading(false);
                getLoginUserData();
            }
        })
    }

    const getLoginUserData = () => {
        UsersService.getUserByUuid(loginUserId).then(res => {
            setAccountStatus(res?.availability_status === 1 ? true : false);
            setSelectedUserData({ ...res })
            // if (props.userData) {
            //     dispatch(props.userData(res));
            // }
        });
    }

    const getTimeInMins = (timeStr: string): number => {
        let timeInMins = 0;
        if (timeStr) {
            const timeHrsMins = timeStr.split(':');
            timeInMins = Number(timeHrsMins[0]) * 60 + Number(timeHrsMins[1]);
        }

        return timeInMins;
    }

    const onCopyData = (data: any, isCopied: boolean) => {
        const allDays = days;
        setIsCopyToAll(isCopied);
        if (isCopied) {
            allDays.forEach((element: any) => {
                if (data?.day !== element?.day) {
                    element.times = [];
                }
            });
            data?.times?.forEach((times: any) => {
                for (let index = 0; index < allDays.length; index++) {
                    const element = allDays[index];
                    if (data?.day !== element?.day) {
                        element.is_recurring = true;
                        element.times.push({ time_from: times?.time_from, time_to: times?.time_to });
                    }
                }
            });
        } else {
            data?.times?.forEach((times: any) => {
                for (let index = 0; index < allDays.length; index++) {
                    const element = allDays[index];
                    if (data?.day !== element?.day) {
                        element.is_recurring = true;
                        element.times = [];
                    }
                }
            });
        }
        setDaya([...allDays]);
    }

    const onShowAvailabilityNotification = () => {
        setShowAvailabilityNotifications(true)
        // setShowNotifications(true);
        // setShowProfile(false);
    }

    const onShowAvailabilitySolts = () => {
        setShowAvailabilitySolts(true)
    }

    const onShowCopyAll = () => {
        setShowCopyAll(true)
        // setIsCopyToAll(true)
    }

    const removeAllTimeslots = () => {
        setLoading(true);
        SmeService.availability([]).then(res => {
            setDaya([]);
            setAvalableCalenderTimes([]);
            getAvailability(timeZones);
            setLoading(false);
        })
    }
    return (
        <div>
            <ReactTooltip place='bottom' type='light' effect='solid' border={true} borderColor={'#707070'} />
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }
            <div className='px-4 happy_monday_heading '>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-md-8 mt-5 mt-lg-0 mt-sm-5 ms-3'>
                            <div>
                                <h5 className='top_heading_styles'>Availability</h5>
                                <p className='top_para_styles'>When are you available to conduct interviews?</p>
                            </div>
                        </div>
                    </div>
                    <div className='rounded-3 bg-white mb-4 py-3 w-100'>
                        <div className='row flex-column-reverse flex-lg-row'>
                            <div className="col-md-8">
                                <div className='row'>
                                    {/* <div className='col-md-2'>
                                        <label className="form-label job_dis_form_label ps-3 font_bolder opacity_6">Time Zone</label>
                                    </div> */}
                                    <div className='col-lg-6 ps-2 pe-3 mt-lg-2 mb-3 d-flex align-items-center'>
                                        {/* <label className={`input color_dark_gray`}>
                                            <TimezoneSelect
                                                value={selectedTimeZone ? selectedTimeZone : ''}
                                                isDisabled={true}
                                                className="input__field"
                                            />
                                            <span className={`input__label input__label_disabled`}>Time Zone</span>
                                        </label> */}
                                        <div className="first_name_container">
                                            <span className="first_name_title">TimeZone</span>
                                            <p className="time_zone_margin pt-1">
                                                <TimezoneSelect
                                                    value={selectedTimeZone}
                                                    isDisabled={true}
                                                    className="first_name_value"
                                                /></p>
                                        </div>
                                        <div className='ps-3'>
                                            <span data-tip="If you need to change the time zone, it can be done in the profile" className="d-flex align-items-center h-100 sx-text-primary pointer position-relative"><img src={INFO_ICON} alt="info icon" className="mt-3 mobile_info" /></span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 account_settings_right_side pe-3 mt-2">
                                {/* <div className="col-md-4  ps-5 mt-2"> */}
                                <div>
                                    <div className="text-lg-center ms-lg-5 ms-4 mt-4 mb-3">
                                        <span className='me-2 top_para_styles'>Not Available</span>
                                        <label className="switch d-inline-flex">
                                            <input type="checkbox" onChange={(e) => onChangeAccountStatus(e)} checked={accountStatus} />
                                            <span className={`${accountStatus ? 'enabled' : 'disable'} slider round`}></span>
                                        </label>
                                        <span className='ms-2 top_para_styles'>Available

                                            <span className=" sx-text-primary pointer ps-3 position-relative" onClick={() => onShowAvailabilityNotification()} onMouseLeave={() => setShowAvailabilityNotifications(false)} onMouseEnter={onShowAvailabilityNotification}><img src={INFO_ICON} alt="info icon" className="mobile_info" /></span>

                                            <div className='position-relative'>
                                                {/* <i className="bi bi-info-circle sx-text-primary me-2" style={{ fontSize: '1.3rem' }} onClick={() => onShowNotification()} onMouseEnter={onShowNotification} style={{ color: "white" }} ></i> */}
                                                {showAvailabilityNotifications && <div onMouseEnter={onShowAvailabilityNotification} className='rounded-3 availability_modal mt-2' ref={notificationref} onMouseLeave={() => setShowAvailabilityNotifications(false)}>
                                                    <div className='row '>
                                                        <div className='col-md-12 top_para_styles mt-2 mb-2 pt-3 ps-4 px-lg-3'>
                                                            <p className='availability_tooltip_fontsize'> If you are not available to take any interview please select accordingly</p>
                                                        </div>
                                                    </div>


                                                </div>}

                                            </div>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='rounded-3 bg-white mb-3 pt-4 pb-4' style={{
                        width: "100%",
                        height: "100%"
                    }}>
                        <div className='row'>
                            <div className="col-md-8 px-2">
                                <div className=' pb-3 ps-md-2 ps-3 '>
                                    <span className='top_regular opacity_6 p-0'>Set your regular availability hours</span>
                                    <span className=" sx-text-primary pointer ps-3 position-relative" onClick={() => onShowAvailabilitySolts()} onMouseLeave={() => setShowAvailabilitySolts(false)} onMouseEnter={onShowAvailabilitySolts}><img src={INFO_ICON} alt="info icon" className="mobile_info" /></span>

                                    <div className='position-relative'>
                                        {showAvailabilitySolts && <div onMouseEnter={onShowAvailabilitySolts} className='rounded-3 availability_modal mt-2 opacity-none' style={{
                                            zIndex: 999
                                        }} ref={availabilitySoltsref} onMouseLeave={() => setShowAvailabilitySolts(false)}>
                                            <div className='row '>
                                                <div className='col-md-12 top_para_styles mt-2 mb-2 pt-3 ps-4 px-lg-3'>
                                                    <p className='availability_tooltip_fontsize'> As soon as you enter your first time slots for a day, you will see a button to copy those slots to all days
                                                    </p>
                                                    <p className='availability_tooltip_fontsize'>
                                                        You will  be able to edit the slots once they are copied to other days
                                                    </p>
                                                </div>
                                            </div>


                                        </div>}

                                    </div>
                                </div>
                                <div className='' style={{
                                    overflowY: "auto",
                                    maxHeight: "450px",
                                    overflowX: "hidden"
                                }}
                                >
                                    {days.map((data: any, index: number) => {
                                        return <div key={index} className={`${index === 0 ? 'pb-3' : 'py-3'} ${(days.length - 1) === index && 'mb-1'} ${selectedUserData?.availability_status !== 1 && 'color_dark_gray'} border-bottom`}>
                                            <div className="row align-items-center">
                                                <div className="col-md-3 ms-4 ms-lg-0 ms-md-0 ms-lg-0 d-flex  flex-lg-column justify-content-between position-relative">
                                                    <span className={`px-lg-2 top_para_styles mb-0 fw_4 ${selectedUserData?.availability_status !== 1 && 'color_dark_gray'}`}>{data?.day}</span>
                                                    {/* <img src={CopyIcon} alt="copy" title="Copy" /> */}
                                                    {isShowCopyIcon && oneTimeZoneData?.day === data?.day && <div className='px-2 position-absolute top-100 right-sm-0 top-sm-0 pe-5'>
                                                        {selectedUserData?.availability_status !== 1 ?
                                                            <> <i className="bi bi-clipboard"></i><span className='ps-1 fs-12'>Copy to all</span></> :
                                                            <span className="pointer  position-relative me-5 me-lg-0" onClick={() => onShowCopyAll()} onMouseLeave={() => setIsCopyToAll(false)} onMouseEnter={onShowCopyAll}>
                                                                <span className='top_para_styles d-flex align-items-center' onClick={() => onCopyData(data, !isCopyToAll)}>
                                                                    <i style={{ lineHeight: 0 }} className="bi bi-clipboard pointer" ></i>

                                                                    <span className='ps-1 fs-12'>
                                                                        Copy to all
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        }

                                                    </div>}
                                                </div>
                                                {data?.times.length > 0 ?
                                                    <div className="col-10 col-md-8 ms-4 ms-lg-0 ms-md-0 ms-lg-0">
                                                        {data?.times.map((time: any, timeIndex: number) => {
                                                            return <div key={timeIndex} className="my-2">
                                                                <div className='d-flex align-items-center'>
                                                                    <div className='w-25 me-4 me-lg-0'>
                                                                        <TimePicker isDisabled={selectedUserData?.availability_status !== 1 ? true : false} callback={(e: any) => onChangeTimeFrom(e, index, timeIndex)} time={time?.time_from}></TimePicker>
                                                                    </div>
                                                                    <div className="w-25 text-center ms-2 ms-lg-0">
                                                                        To
                                                                    </div>
                                                                    <div className='w-25 me-5 me-lg-0'>
                                                                        <TimePicker isDisabled={selectedUserData?.availability_status !== 1 ? true : false} callback={(event) => onChangeTimeTo(event, index, timeIndex)} time={time?.time_to}></TimePicker>
                                                                    </div>
                                                                    <div className='w-25 text-center px-3 px-lg-0'>
                                                                        {selectedUserData?.availability_status === 1 && <img src={Delete} alt="Delete" className='pointer' onClick={() => onDeleteDayTime(index, timeIndex)} />}
                                                                    </div>
                                                                </div>
                                                                <div className='text-center'>
                                                                    {time?.error && <p className={`text-danger job_dis_form_label `}>{time?.error}</p>}
                                                                </div>
                                                            </div>
                                                        })}
                                                    </div> :
                                                    <div className={`col-8 text_style_available ms-4 ms-lg-0 ms-md-0 ms-lg-0 ${selectedUserData?.availability_status !== 1 && 'color_dark_gray'}`}>
                                                        Not available
                                                    </div>
                                                }
                                                <div className="col-1 px-3 px-lg-0">
                                                    {selectedUserData?.availability_status === 1 && <img src={Add} alt="add" className='pointer ' onClick={() => onMonday(index)} />}
                                                </div>
                                            </div>
                                        </div>
                                    })}
                                </div>

                            </div>

                            <div className="col-md-4 px-2 ms-4 mt-5 ms-lg-0 ms-sm-0">
                                <div className='particular-date opacity_6'>
                                    Set availablity on a particular date
                                </div>
                                <div className="mt-3">
                                    <button disabled={selectedUserData?.availability_status !== 1} className={`large_btn_particular date rounded-3 ${selectedUserData?.availability_status !== 1 && 'color_dark_gray'}`} onClick={handlePopup}>Select particular date</button>
                                </div>
                                <div className="row mt-3 me-5" style={{
                                    overflowY: "auto",
                                    maxHeight: "400px",
                                    overflowX: "hidden"
                                }}>
                                    <div >
                                        {avalableCalenderTimes?.map((data: any, index: number) => {
                                            return <div key={index} className='d-flex'>
                                                <div className="col-md-10 col-10 mt-2" key={index}>
                                                    <div>
                                                        <h6 className='top_para_styles fw_7'>{moment(data?.availability_date).format("dddd, DD MMMM YYYY")}</h6>
                                                    </div>
                                                    {data?.times?.map((time: any, timeIndex: number) => {
                                                        return <div key={timeIndex} className='top_para_styles fw_4'>{time?.time_from} {time?.time_from && time?.time_to && "-"} {time?.time_to}</div>
                                                    })}
                                                    {(avalableCalenderTimes.length - 1) !== index && <hr />}
                                                    {/* <div className=''>
                                                    <hr />
                                                </div> */}
                                                </div>
                                                <div className="col-md-1">
                                                    {selectedUserData?.availability_status === 1 && <img src={Delete} alt="Delete" className='pointer' onClick={() => onDeleteDateTimes(index)} />}
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end align-items-center mt-4 pb-5 pb-lg-0 me-5">
                            {formError && <small className="text-danger me-2">{formError}</small>}
                            <button disabled={selectedUserData?.availability_status !== 1} className="large_btn_apply rounded-3 me-2" type="button" onClick={onSave}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter"
                    className="sx-close px-4"
                    centered>
                    <Modal.Header closeButton>
                        <Modal.Title className='px-3'>
                            <h5 className='top_heading_styles pt-2'>Select a date to add your availability</h5>
                            {/* <p className='top_para_styles mb-0'>You will be notified if opportunities </p> */}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body >

                        <div>
                            <Calendar minDate={new Date()} calendarType="US" onChange={(e: any) => onSelectDate(e)} value={selectedDate} className="border-0" />
                        </div>
                        <div className="my-4 px-3">
                            <hr />
                            <p className='top_para_styles'>What hours are you available on this date?</p>
                            <div className="row align-items-center week-availabity border-0">
                                {calenderTimes.length > 0 ?
                                    <div className="col-md-10 col-12">
                                        {calenderTimes.map((data: any, index: number) => {
                                            return <div key={index} className="px-0">
                                                {(index === 0 || (index > 0 && calenderTimes[index - 1].availability_date !== data.availability_date)) &&
                                                    <>
                                                         <div className='d-flex justify-content-between  '>
                                                            <div className=''>
                                                            <h5 className='top_heading_styles pt-3 mb-0'>{data.availability_date}</h5>
                                                            </div>
                                                            <div className='ms-5 ms-lg-0 me-2 me-lg-0 ps-5 ps-lg-0 pe-2 pe-lg-0'>
                                                            <img src={Add} alt="add" className='pointer mt-3 ms-5 ms-lg-0 ps-5 ps-lg-0' onClick={() => handleonCalenderTime(selectedDate, true)} />
                                                            </div>
                                                         </div>

                                                        {/* <div className='d-flex justify-content-between'>
                                                            <h5 className='top_heading_styles pt-3 mb-0'>{data.availability_date}</h5>
                                                            <div className='ms-5 ps-5 me-md-5 pe-md-1' >
                                                                <img src={Add} alt="add" className='pointer mt-2 ms-5 ms-lg-0' onClick={() => handleonCalenderTime(selectedDate, true)} />
                                                            </div>
                                                        </div> */}
                                                    </>
                                                }
                                                <div className='d-flex align-items-center justify-content-between '>
                                                    <div className='w-md-25 me-3 me-lg-3 mt-2'>
                                                        <TimePicker isDisabled={selectedUserData?.availability_status !== 1 ? true : false} callback={(e) => onSelectDateTimeFrom(e, index)} time={data?.time_from}></TimePicker>
                                                    </div>
                                                    <div className="w-md-25 text-center  me-3 me-lg-3 mt-2 ">
                                                        To
                                                    </div>
                                                    <div className='w-md-25 me-3 me-lg-3 mt-2'>
                                                        <TimePicker isDisabled={selectedUserData?.availability_status !== 1 ? true : false} callback={(e) => onSelectDateTimeTo(e, index)} time={data?.time_to}></TimePicker>
                                                    </div>
                                                    <div className='w-md-25 text-center  me-3 me-lg-0 mt-2 '>
                                                        <img src={Delete} alt="Delete" className='pointer mt-1 ms-4' onClick={() => handleDelete(index)} />
                                                    </div>
                                                    {/* {(calenderTimes.length - 1) === index && <div>
                                                        <img src={Add} alt="add" className='pointer mt-3 me-4' onClick={() => handleonCalenderTime(selectedDate)} />
                                                    </div>} */}
                                                </div>


                                                <div className='text-left'>
                                                    {data?.error && <p className="text-danger job_dis_form_label">{data?.error}</p>}
                                                </div>

                                            </div>

                                        })}
                                    </div> :
                                    <div className="col-md-10 top_para_styles">
                                        Not available
                                    </div>
                                }
                                {/* <div className="col-1">
                                    <img src={Add} alt="add" className='pointer mt-2 ms-5 ms-lg-0' onClick={() => handleonCalenderTime(selectedDate, true)} />
                                </div> */}

                            </div>
                            {/* <div className="row align-items-center">
                                {calenderTimes?.length > 0 ?
                                    <div className="col-10 col-md-8 ms-4 ms-lg-0 ms-md-0 ms-lg-0">
                                        {calenderTimes.map((data: any, index: number) => {
                                            return <div key={index} className="my-2">
                                                <div className='d-flex align-items-center'>
                                                    <div className='w-25 me-5 me-lg-0'>
                                                        <TimePicker callback={(e) => onSelectDateTimeFrom(e, index)} time={data?.time_from}></TimePicker>

                                                    </div>
                                                    <div className="w-25 text-center">
                                                        To
                                                    </div>
                                                    <div className='w-25 me-5 me-lg-0'>
                                                        <TimePicker callback={(e) => onSelectDateTimeTo(e, index)} time={data?.time_to}></TimePicker>

                                                    </div>
                                                    <div className='w-25 text-center'>
                                                        <img src={Delete} alt="Delete" className='pointer mt-1' onClick={() => handleDelete(index)} />

                                                    </div>
                                                </div>
                                                <div className='text-center'>
                                                    {data?.error && <p className="text-danger job_dis_form_label">{data?.error}</p>}

                                                </div>
                                            </div>
                                        })}
                                    </div> :
                                    <div className={`col-8 text_style_available ms-4 ms-lg-0 ms-md-0 ms-lg-0 ${selectedUserData?.availability_status !== 1 && 'color_dark_gray'}`}>
                                        Not available
                                    </div>
                                }
                                <div className="col-1">
                                    {selectedUserData?.availability_status === 1 && <img src={Add} alt="add" className='pointer' onClick={() => handleonCalenderTime(selectedDate)} />}
                                </div>
                            </div> */}
                            <div className='row'>
                                <div className='col-md-6 mt-4 col-6 '>
                                    <button type="button" className="large_btn_apply btn-outline-primary mt-3"
                                        onClick={() => handleClose()}
                                    >Cancel</button>

                                </div>

                                <div className='col-md-6 mt-4 text-end col-6 '>
                                    <button disabled={selectedUserData?.availability_status !== 1} className='large_btn_apply rounded-3 mt-3' onClick={onSaveWithDate}>Save</button>
                                    {/* <button disabled={selectedUserData?.availability_status !== 1} className="large_btn_apply rounded-3 " type="button" onClick={onSave}>Save</button> */}
                                    {/* {formError && <span className="text-danger job_dis_form_label ms-3">{formError}</span>} */}

                                </div>
                            </div>

                        </div>
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>


            </div>
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        UserDataReducer: state.UserDataReducer,
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        userData: (data: any) => dispatch(UserData(data)),
    }
}

const connectedNavBar = connect(mapStateToProps, mapDispatchToProps)(Availability);
export { connectedNavBar as Availability };
