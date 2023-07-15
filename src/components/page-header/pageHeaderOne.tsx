import React from 'react'
import HAMBURGER_ICON from "../../assets/icon_images/hamburger_list_menu.svg";




interface Props {
    title: string;
    subTitle: string;
    buttonName: string;
    editButtonClick: () => void;
    hideButton?: boolean;
}

const PageHeaderOne: React.FC<Props> = (props: Props) => {
    return (
        <div className='row ps-3 pe-3 mt-4 mt-3 pe-lg-5 ms-3'>
            <div className='col-12 col-lg-12'>
                <h5 className='top_heading_styles'>{props.title}</h5>
            </div>
            <div className='col-8 col-lg-8 '>
                <p className='top_para_styles'>{props.subTitle}</p>
            </div>
            {
                !props.hideButton &&
                <div className='col-4 col-lg-4 text-end'>
                    <button className={`large_btn_apply btn-outline-primary rounded me-4`} onClick={() => props.editButtonClick()}>{props.buttonName}</button>
                    {/* <span><img src={HAMBURGER_ICON} alt="menu-icon" /></span> */}
                </div>
            }


        </div>
    )
}

export default PageHeaderOne;