import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';

interface NavMenuTabItem {
    label: string;
    path: number | string;
}

interface Props {
    menuItems: NavMenuTabItem[];
    activeTab: number;
    onChangeTab: (tab: number | string) => void;
    type?: 'path';
    activeUrl?: string;
}

export const NavMenuTabs: React.FC<Props> = (props: Props) => {
    const tabsContainer = useRef(null);
    const [selectedTab, setSelectedTab] = useState<number | string>(props.activeTab);
    const onArrowAction = (direction: number) => {
        if (tabsContainer.current) {
            const container = tabsContainer.current as HTMLDivElement;
            const scrollOffset = container.clientWidth / 2 * direction;
            container.scrollBy({
                behavior: 'smooth',
                left: scrollOffset
            });
        }
    }

    const onChangeTab = (tab: number | string) => {
        props.onChangeTab(tab);
        setSelectedTab(tab);
    }

    useEffect(() => {
        setSelectedTab(props.activeTab);
    }, [props.activeTab]);

    useEffect(() => {
        const selectedIndex = props.menuItems.findIndex(el => el.path === props.activeUrl);
        setSelectedTab(selectedIndex);
    }, [props.activeUrl]);

    useEffect(() => {
        const selectedElement = document.getElementById(`selected_tab_${selectedTab}`);
        if (selectedElement) {
            selectedElement.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'center'
            });
        }
    }, [selectedTab]);


    return (
        <div className='nav-menu-tabs-container'>
            <div className="left-arrow nav-arrow" onClick={() => onArrowAction(-1)}></div>
            <div className='nav-menu-tabs-bar' ref={tabsContainer}>
                {
                    props.menuItems.map((el, index: number) => <>
                        {
                            props.type !== 'path' && <div id={`selected_tab_${index}`} onClick={() => onChangeTab(el.path)} className={`nav-menu-tab ${selectedTab === index && 'active'} `} style={{ padding: "0.5rem 1rem" }}>
                                <p>
                                    {el.label}
                                </p>
                            </div>
                        }
                        {
                            props.type === 'path' && <Link id={`selected_tab_${index}`} to={el.path as string} className={`nav-menu-tab d-flex ${props.activeUrl === el.path && 'active d-flex'} `}>
                                <p>
                                    {el.label}
                                </p>
                            </Link>
                        }
                    </>
                    )
                }
            </div>
            <div className="right-arrow nav-arrow" onClick={() => onArrowAction(1)}></div>
        </div>
    )
}
