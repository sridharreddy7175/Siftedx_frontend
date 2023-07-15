import React from "react";
import { Spinner } from "react-bootstrap";
import PasswordNo from "../assets/icon_images/Password No.png"
import PasswordOk from "../assets/icon_images/Password Ok.png"

interface Props {
  isShow?: boolean;
  errors?: any;
  customClass?: string;
}

const PasswordValidation: React.FC<Props> = (props) => {
  return (
    <>
      {props.isShow && (<div className={props?.customClass}>
        <div>
          <div>
            <span>- At least one upper case letter {props?.errors?.upper ? <img src={PasswordNo} /> : <img src={PasswordOk} />}</span>
          </div>
          <div>
            <span>- At least one lower case letter {props?.errors?.lower ? <img src={PasswordNo} /> : <img src={PasswordOk} />}</span>
          </div>
          <div>
            <span>- At least one Number {props?.errors?.number ? <img src={PasswordNo} /> : <img src={PasswordOk} />}</span>
          </div>
          <div>
            <span>- At least one special character {props?.errors?.specialChar ? <img src={PasswordNo} /> : <img src={PasswordOk} />}</span>
          </div>
          <div>
            <span>- Should be between 6 and 16 </span>
          </div>
          <div style={{ marginLeft: "12px" }}>
            characters {props?.errors?.strLength ? <img src={PasswordNo} /> : <img src={PasswordOk} />}
          </div>
        </div>
        <div className="chat_arrow"></div>
      </div>)
      }
    </>
  );
};


export { PasswordValidation };
