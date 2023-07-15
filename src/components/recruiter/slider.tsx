// import { styled } from '@mui/material';
import styled from '@emotion/styled';
import React from 'react';
import STAR_ICON from "../../assets/icon_images/star.svg";
import STAR_ICON_WITH_YELLOW from "../../assets/icon_images/star_yellow.svg";
// import styled from "styled-components";

interface Props {

}

export const SliderComponent: React.FC<Props> = (props: Props) => {

    return (
        <>
            <div className='d-flex justify-content-between mx-1 mb-2'>
                <div className='side_heading'>Rate</div><div className='fs_14'>Range</div>
            </div>
            {/* <Slider className='rounded-3' type="range" /> */}

            <input className='range' type="range" />
            <input className='range' type="range" />
            
            <div className='d-flex justify-content-between mx-1 mt-2'>
                <div className='fs_14'>Min</div><div className='fs_14'>Max</div>
            </div>

            <div className='d-flex justify-content-between mx-1 mb-2 mt-4'>
                <div className='side_heading'>Experience</div><div className='fs_14'>Range</div>
            </div>
            <input className='range' type="range" />
            <input className='range' type="range" />
            <div className='d-flex justify-content-between mx-1 mt-2'>
                <div className='fs_14'>Min</div><div className='fs_14'>Max</div>
            </div>

            <div className='side_heading  mt-4'>Rating</div>
            <div className='mt-2'> <span>
                              <img src={STAR_ICON_WITH_YELLOW} alt="" />
                            </span>
                            <span>
                              <img src={STAR_ICON_WITH_YELLOW} alt="" />
                            </span>
                            <span>
                              <img src={STAR_ICON_WITH_YELLOW} alt="" />
                            </span>
                            <span>
                              <img src={STAR_ICON_WITH_YELLOW} alt="" />
                            </span>
                            <span>
                              <img src={STAR_ICON} alt="" />
                            </span></div>

        </>
    );

};


