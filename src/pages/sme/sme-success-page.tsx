import React from 'react'
import { useHistory } from 'react-router-dom';
import ShiftedxLogoImg from '../../assets/images/Shifted.png';
import XLogoImg from '../../assets/images/x_logo.png';
import flagImg from '../../assets/images/flag.png';
import LogoImg from "../../assets/images/siftedx_home_logo.png";

export const SmeSuccessPage = () => {
    const history = useHistory();
    const handleInput = (data: any) => {

    }
    const onClickLogin = () => {
        history.push("/dashboard/home");
    }
    return (
        <div>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-12 text-center' style={{ backgroundColor: "#000000", paddingTop: "22px", paddingBottom: "22px" }}>
                        {/* <p className='login_header_text_style'>SiftedX</p> */}
                        <img src={LogoImg} alt="loading-logo" className='create_company_page_siftedx_log' />
                    </div>
                </div>
                <div className='row'>
                    <div className="container-fluid">
                        <div className="row" style={{ height: 'calc(100vh - 94px)' }}>
                            <div className="col-sm-12 col-md-3 col-9  sx-bg-page m-auto">
                                <div className='text-center m-auto mb-3'>
                                    <h4 className='top_heading_styles fw_7'>Success</h4>
                                </div>
                                <div className='bg-white p-4 rounded-3'>
                                        <div className='text-center mb-3'>
                                            <img src={flagImg} alt="loading" />
                                        </div>
                                    <div className='d-flex'>
                                        <div className='text-center'>
                                            <h4 className='top_heading_styles fw_6 mb-3'>Profile sent to review!</h4>
                                            <p className="top_para_styles mb-3">You will hear from SiftedX team about your application on your email. Thank you!</p>
                                        </div>
                                    </div>
                                    <div className='text-center'>
                                        <button className='small_btn rounded w-100' onClick={onClickLogin}>Go To DashBoard</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
