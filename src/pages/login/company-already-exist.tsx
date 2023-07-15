import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UsersService } from '../../app/service/users.service';
import LogoImg from '../../assets/images/SiftedX Logo.svg';

export const CompanyAlreadyExist = () => {
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    let { email } = useParams<{ email: string }>();

    useEffect(() => {
    }, []);

    const onClickLogin = () => {
        UsersService.sendEmailVerification(email ? email : '').then(res => {
            history.push('/')
        })
        toast.success('Please login with your email and password to start using SiftedX')
    }

    return (
        <div>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-sm-12 col-md-5 bg_blue mobile_hide rigth_image'>
                        <div className='left_side_circle_div'>
                            {/* <div className='profile_img_div'>
                                <img src={LogoImg} alt="loading-pic" className='img_fluid w-100' />
                            </div> */}
                            <p className='circle_text'>Technical screening done at scale, by<br /> expert interviewers.</p>
                        </div>
                    </div>
                    <div className='col-12 col-lg-7'>
                        <div className='row'>
                            <div className='col-sm-6 col-12 align-items-center verify_email_form_main_div'>
                                <div className='logo_div text-center'>
                                    <img src={LogoImg} alt="logo" className="right_side_profile_img" />
                                </div>
                                <div className='log_page_border text-center w-350 fs_14 p-4'>

                                    <p className='Log_text_style mb-4'>Company Already Exists</p>
                                    <p className='m-2 fs_14'>This Company already exists please contact the administrator.</p>
                                    {loading ?
                                        <div className='text-center'>
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div> :
                                        <div className="text-center mt-3">
                                            <button className='small_btn rounded w-100' onClick={onClickLogin}>Request</button>
                                        </div>
                                    }
                                </div>
                                <div className='d-flex justify-content-center pt-3'>
                                    <NavLink to={'/create-company'} className='login_page_below_content_style pointer'><span className='top_para_styles'>Wrong email?</span> Create an account again</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className='row'>
                <div className='col-md-6 bg_blue height_100vh d-flex justify-content-center align-items-center'>
                    <div className='text-center'>
                        <div className='bg_darkBlue bg_darkBlue_circle align-middle mx-auto'></div>
                        <p className='text-center circle_text mt-3'>Technical screening done at scale, by expert interviewers.</p>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='row'>
                        <div className='col-12 height_100vh d-flex justify-content-center align-items-center'>
                            <div>
                                <div className='text-center m-3'>
                                    <img src={LogoImg} alt="logo" />
                                </div>
                                <div className='log_page_border p-4' style={{ width: "420px" }}>

                                    <p className='Log_text_style'>Company Already Exists</p>
                                    <p className='m-2 f12'>This Company already exists please contact the administrator.</p>
                                    {loading ?
                                        <div className='text-center'>
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div> :
                                        <div>
                                            <button className='small_btn rounded' onClick={onClickLogin}>Request</button>
                                        </div>
                                    }
                                </div>
                                <div className='d-flex justify-content-between pt-2'>
                                    <NavLink to={'/create-company'} className='login_page_below_content_style pointer'>Wrong email? Create an account again</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </div >
    )
}