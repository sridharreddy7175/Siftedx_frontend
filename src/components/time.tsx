import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
interface Props {
  callback: (data: any) => void;
  time?: any;
  isDisabled?: boolean;
  customClass?: string;
}

const TimePicker: React.FC<Props> = (props: Props) => {
  const [hours, setHours] = useState<any[] | []>([]);
  const [minutes, setMinutes] = useState<any[] | []>([]);
  const [hour, setHour] = useState<string>('');
  const [min, setMin] = useState<string>('');

  useEffect(() => {
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
    if (props?.time) {
      const newTime = props?.time.split(":");
      setHour(newTime[0]);
      setMin(newTime[1]);
    }
  }, [props.time]);

  const onChangeHours = (e: any) => {
    setHour(e.target.value)
    const time = `${e.target.value ? e.target.value : '00'}:${min ? min : '00'}`;
    props.callback(time);
  }

  const onChangeMinutes = (e: any) => {
    setMin(e.target.value);
    const time = `${hour ? hour : '00'}:${e.target.value ? e.target.value : '00'}`;
    props.callback(time);
  }

  const finalTime = () => {
    const time = `${hour ? hour : '00'}:${min ? min : '00'}`;
    props.callback(time);
  }
  return (
    <div className="input-group time_dropdown">
      <select disabled={props?.isDisabled} name="hours" id="hours" className={`form-control border_r_n ${props?.isDisabled && 'color_dark_gray'}`} value={hour} onBlur={finalTime} onChange={(e) => onChangeHours(e)}>
        {hours.map((data: any, index: number) => { return <option key={index} value={data}>{data}</option> })}
      </select>
      <select disabled={props?.isDisabled} name="minutes" id="minutes" className={`form-control border_l_n ${props?.isDisabled && 'color_dark_gray'}`} value={min} onBlur={finalTime} onChange={(e) => onChangeMinutes(e)}>
        {/* {minutes.map((data: any, index: number) => { return <option key={index} value={data}>{data}</option> })} */}
        <option value={'00'}>{'00'}</option>
        <option value={'15'}>{'15'}</option>
        <option value={'30'}>{'30'}</option>
        <option value={'45'}>{'45'}</option>
      </select>
    </div>
  );
};


export { TimePicker };

