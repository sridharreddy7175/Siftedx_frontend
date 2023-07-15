import React from 'react'


interface Props {
    title: string;
    subTitle: string;
    buttonName: string;
    editButtonClick: () => void;
    hideButton?: boolean;
}

const Pageheader: React.FC<Props> = (props: Props) => {
    return (
        <div className='row ps-3 pe-3 mt-4 mt-3 pe-lg-5 ms-3'>
            <div className='col-12 col-lg-12'>
                <h5 className='top_heading_styles'>{props.title}</h5>
            </div>
            <div className='col-7 col-lg-8 '>
                <p className='top_para_styles'>{props.subTitle}</p>
            </div>
            {
                !props.hideButton && <div className='col-5 col-lg-4 text-end'>
                    <button className={`large_btn_apply rounded`} onClick={() => props.editButtonClick()}>{props.buttonName}</button>
                </div>
            }


        </div>
    )
}

export default Pageheader;