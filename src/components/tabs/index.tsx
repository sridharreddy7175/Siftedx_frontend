import React from 'react';
import { NavLink } from 'react-router-dom';
interface Props {
    tabsData?: any;
    active?: string;
}
const Tabs: React.FC<Props> = (props: Props) => {

    return (
        <ul className="nav ms-2">
            {props.tabsData.map((data: any, index: number) => {
                return <li key={index} className={`nav-item tab ${data?.path === props?.active ? 'active' : ''}`}>
                    <NavLink className="nav-link text-white all_members_nav_link_font_size nav-hover" to={data?.path}>{data?.label} {data?.count ? (data?.count) : ''}</NavLink>
                </li>
            })}
        </ul>
    );
}


export default Tabs;