import React from "react";
import { Spinner } from "react-bootstrap";
interface Props {
  loading?: boolean;
}

const AppLoader: React.FC<Props> = (props) => {
  return (
    <div>
      {props.loading && (<div className="spinner-container">
        <div className="spinner">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>)}
    </div>
  );
};


export { AppLoader };
