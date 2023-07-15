import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router'
const LogoutComp = (props: any) => {
    const [canShowPopup, setCanShowPopup] = useState(false);
    const history = useHistory();

    const handleSubmit = () => {
        setCanShowPopup(false);
        history.push("/home");
        localStorage.setItem('rememberMeData', '');
        sessionStorage.clear();
    }
    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} aria-labelledby="contained-modal-title-vcenter"
                className='sx-close w-100'
                size='sm'

                centered >
                <Modal.Header closeButton>
                    <Modal.Title>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <p className='top_para_styles p-0 m-0 text-center mt-3'>Are you sure you want to logout?</p>
                    <div className='row'>
                        <div className='col-6 px-3 py-3 mt-3'>
                            <button type="button" className="rounded text-decoration-none open_cv ps-3 pt-1 pb-1 pe-3 ms-2 ms-lg-0 ms-sm-2 fw-normal bg-transparent" onClick={() => props.handleClose()}>Cancel</button>

                        </div>
                        <div className='col-6 text-end px-3 py-3 mt-3'>
                            <button type="button" className="rounded text-decoration-none ps-4 pt-1 pb-1 pe-4 fw-normal upload_cv" onClick={handleSubmit}>Yes</button>

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>
        </>
    )
}

export default LogoutComp