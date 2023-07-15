import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UsersService } from '../../app/service/users.service';
import LogoImg from '../../assets/images/SiftedX Logo.svg';

export const VerifyEmailCode = () => {
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    let { code } = useParams<{ code: string }>();

    useEffect(() => {
        setLoading(true);
        onVerifingEmailCode();
    }, []);

    const onVerifingEmailCode = () => {
        UsersService.verifyEmail(code ? code : '').then(res => {
            if (res.error) {
                setLoading(false);
                toast.error(res.error.message);
            } else {
                sessionStorage.setItem('isEmailverified', 'done');
                setLoading(false);
            }
        })
    }

    return (
        <div>
            <div className="container-fluid">
                <div className="row vh-100-all">
                    <div className="col-sm-12 col-md-5 bg-black mobile_hide rigth_image d-none d-lg-block">
                        <div className="left_side_circle_div">
                            <p className="circle_text" style={{ top: "50%" }}>
                                Technical screening done at scale, by<br /> expert interviewers.
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-lg-7 sx-bg-page position-relative">
                        <div className="d-flex align-items-center justify-content-center h-100 flex-column">
                            <div className="">
                                <img
                                    src={LogoImg}
                                    alt="logo"
                                    className="right_side_profile_img"
                                />
                            </div>
                            <div className="bg-white p-4 rounded shadow w-350">
                                {loading ?
                                    <div className='text-center'>
                                        <p>Verifing Email...</p>
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div> :
                                    <div className='text-center mb-3  mb-lg-0 mb-sm-2'>
                                        <p style={{ color: 'green' }}>Email verified successfully.</p>
                                        <p>Please login with your email and password to start using SiftedX</p>
                                        <NavLink to={`/`} className='large_btn_apply rounded text-decoration-none clolr_black w-100'>OK</NavLink>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="mt-5 text-center position-absolute bottom-0 w-100">
                            <p className="copyright ms-3">Copyright © 2022 SiftedX. All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className='col-md-6 bg_blue height_100vh d-flex justify-content-center align-items-center rigth_image'>
                <div className='text-center'>
                    <p className='text-center circle_text mt-3'>Technical screening done at scale, by expert interviewers.</p>
                </div>
            </div>
            <div className='col-md-6'>
                <div className='row'>
                    <div className='col-12 height_100vh d-flex justify-content-center align-items-center'>
                        {loading ?
                            <div className='text-center'>
                                <p>Verifing Email...</p>
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div> :
                            <div className='text-center'>
                                <p style={{ color: 'green' }}>Email verified successfully.</p>
                                <p>Please login with your email and password to start using SiftedX</p>
                                <NavLink to={`/`} className='small_btn rounded text-decoration-none'>OK</NavLink>
                            </div>
                        }
                    </div>
                </div>
            </div> */}
        </div >
    )
}