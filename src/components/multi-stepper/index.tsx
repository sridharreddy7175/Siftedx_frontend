import React, { useState } from 'react';

interface FormStep {
    name: string;
    disabled?: boolean;
}

interface Props {
    steps: FormStep[];
    updateTab: (tab: number) => void;
    default?: number;
    selectedTab: number;
}

const MultiStepperNavbar: React.FC<Props> = (props: Props) => {
    function updateSelectedTab(tab: number) {
        if(props.steps[tab].disabled){
            return;
        }
        props.updateTab(tab);
    }


    return (
        <ul className='multi-step-navbar'>
            {props.steps.map((el, index) => <li onClick={() => updateSelectedTab(index)} className={`step ${index === props.selectedTab ? 'active' : ''} ${el.disabled?'disabled':''}`} key={index}>
                <div className="circle">{index + 1}</div>
                <h5 className="info">{el.name}</h5>
                {index > 0 && <div className="connector-left"></div>}
                {index < props.steps.length - 1 && <div className="connector-right"></div>}
            </li>)}
        </ul>
    );
};

export default MultiStepperNavbar;