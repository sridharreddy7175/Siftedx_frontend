import React, { useEffect, useRef, useState } from "react";
import ADD_ICON from "../../assets/icon_images/Add.svg";

interface Props {
  type?: string;
  placeholder?: string;
  getChipsFieldData?: (data: any) => void;
  isInline?: boolean;
  isOutside?: boolean;
  outSideText?: string;
  items?: string;
  isAdd?: boolean;
}

const ChipInput: React.FC<Props> = (props: Props) => {
  const [state, setState] = useState<any>({
    items: [],
    value: "",
    error: null,
  });
  const inputRef = useRef<any>(null);

  useEffect(() => {
    let data: any = props?.items;
    if (data) {
      data = data.split(",");
      setState({
        items: [...data],
        value: "",
      });
    }
  }, []);

  const handleKeyDown = (evt: any) => {
    if (["Enter", "Tab", ","].includes(evt.key)) {
      evt.preventDefault();

      var value = state?.value?.trim();

      if (value && isValid(value)) {
        setState({
          items: [...state.items, state.value],
          value: "",
        });
        if (props?.getChipsFieldData) {
          props?.getChipsFieldData([...state.items, state.value]);
        }
      }
    }
  };

  const handleChange = (evt: any) => {
    setState({ value: evt.target.value, error: null, items: state.items });
    if (props?.getChipsFieldData) {
      props?.getChipsFieldData(state?.items);
    }
  };

  const handleDelete = (item: any) => {
    setState({
      items: state.items.filter((i: any) => i !== item),
    });
    if (props?.getChipsFieldData) {
      props?.getChipsFieldData(state?.items);
    }
  };

  const handlePaste = (evt: any) => {
    evt.preventDefault();
    var paste = evt.clipboardData.getData("text");
    var emails = paste.match(/[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/g);
    if (emails) {
      var toBeAdded = emails.filter((email: any) => !isInList(email));
      setState({
        items: [...state.items, ...toBeAdded],
      });
      if (props?.getChipsFieldData) {
        props?.getChipsFieldData([...state.items, ...toBeAdded]);
      }
    }
  };

  const onMouseLeave = (evt: any) => {
    evt.preventDefault();
    var paste = evt.target.value;
    var emails = paste.match(/[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/g);
    if (emails) {
      var toBeAdded = emails.filter((email: any) => !isInList(email));
      setState({
        items: [...state.items, ...toBeAdded],
        value: "",
      });
      if (props?.getChipsFieldData) {
        props?.getChipsFieldData([...state.items, ...toBeAdded]);
      }
    }
  };

  const isValid = (email: any) => {
    let error = null;
    if (isInList(email)) {
      error = `${email} has already been added.`;
    }
    if (props.type === "email") {
      if (!isEmail(email)) {
        error = `${email} is not a valid email address.`;
      }
    }
    if (error) {
      setState({ error, items: state.items });
      return false;
    }
    return true;
  };

  const isInList = (email: any) => {
    const items = state.items.find((data: any) => {
      return data === email;
    });
    if (items) {
      return true;
    } else {
      return false;
    }
  };

  const isEmail = (email: any) => {
    const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w+)+$/g;
    if (!reg.test(email)) {
      return false;
    } else {
      return true;
    }
  };

  const onAddClick = () => {
    // var paste = inputRef.current.value;
    var value = state?.value?.trim();
    if (value && isValid(value)) {
      setState({
        items: [...state.items, state.value],
        value: "",
      });
      if (props?.getChipsFieldData) {
        props?.getChipsFieldData([...state.items, state.value]);
      }
    }
  };
  return (
    <>
      <div className={`chips_box ${props?.isInline && "d-flex"} ${props?.isAdd&&'position-relative'}`}>
        <input
          className={`input  ${state?.error && " has-error"} form-control`}
          style={{ width: ` ${props?.isInline && "35%"}` }}
          value={state?.value}
          placeholder={props?.placeholder}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          onPaste={handlePaste}
          onBlur={onMouseLeave}
          ref={inputRef}
        />
        {props?.isAdd && (
          <img
            src={ADD_ICON}
            alt="info icon"
            className=" pointer position-absolute" 
            style={{top:"6px", right:"-37px"}}
            onClick={onAddClick}
          />
        )}
        {!props?.isOutside && (
          <div>
            {state?.items?.map((item: any) => (
              <div className="tag-item" key={item}>
                {item}
                <button
                  type="button"
                  className="button"
                  onClick={() => handleDelete(item)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {props?.outSideText && (
        <p className="dis_side_content pt-2">{props?.outSideText}</p>
      )}
      {props?.isOutside && (
        <div className="mt-2">
          {state?.items?.map((item: any) => (
            <div className="tag-item" key={item}>
              {item}
              <button
                type="button"
                className="button"
                onClick={() => handleDelete(item)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
      {state.error && <p className="error px-3">{state.error}</p>}
    </>
  );
};

export default ChipInput;
