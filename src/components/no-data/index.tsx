import React from 'react';
import { NavLink } from 'react-router-dom';
import NoDataImg from '../../assets/images/no-data.png'
interface Props {
    message?: string;
    isButton?: boolean;
    buttonObject?: any;
}

const NoData: React.FC<Props> = (props: Props) => {
    let userData = sessionStorage.getItem("userRole")
    return (
        <>
            {/* <div className='bg-white rounded-3 ms-3 ' style={{
                height:"490px"
            }}>
                <div className='d-flex justify-content-start' style={{
                    position: "absolute",
                    marginTop: "-4%"
                }}>
               
                    <p className='m-0 mx-2 f12'>No Records Found.</p>
                    <p className='m-0 mx-2 f12 mb-3'>{props?.message}</p>
                    {props?.isButton &&
                        <NavLink to={props.buttonObject?.path} className='small_btn rounded text-white text-decoration-none' >{props.buttonObject?.name}</NavLink>}
                </div>
            </div> */}

            {
                userData==="CompanyAdmin"
                ?
                <div className='height_100vh d-flex justify-content-center align-items-center bg-white p-4 mt-1 rounded-3'>
                <div className='text-center'>
                    <img src={NoDataImg} alt="" />
                    <p className='m-0 mx-2 f12'>No Records Found.</p>
                    <p className='m-0 mx-2 f12 mb-3'>{props?.message}</p>
                    {props?.isButton &&
                        <NavLink to={props.buttonObject?.path} className='large_btn_apply rounded text-black text-decoration-none' >{props.buttonObject?.name}</NavLink>}
                </div>
            </div>
            :
             <div className='bg-white rounded-3 ms-3 ' style={{
                height:"490px"
            }}>
                <div className='d-flex justify-content-start' style={{
                    position: "absolute",
                    // marginTop: "-%"
                }}>
               
                    <p className='m-0 mx-2 top_para_styles'>No Records Found.</p>
                    <p className='m-0 mx-2 f12 mb-3'>{props?.message}</p>
                    {props?.isButton &&
                        <NavLink to={props.buttonObject?.path} className='large_btn_apply rounded text-black text-decoration-none' >{props.buttonObject?.name}</NavLink>}
                </div>
            </div>

            }
        </>
    );
}

export default NoData;