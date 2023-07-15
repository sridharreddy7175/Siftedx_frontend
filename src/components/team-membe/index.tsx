import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import FormBuilder from '../form-builder';
import Vector from '../../assets/images/Vector.png'
import { RolesService } from '../../app/service/roles.service';
import NoData from '../no-data';
import { UsersListItem } from '../../app/model/users/users-list';
import { JobsService } from '../../app/service/jobs.service';
import { useLocation } from 'react-router-dom';
import { AppLoader } from '../loader';
import { toast } from 'react-toastify';
import moment from 'moment';
import Select from 'react-select';
import HAMBURGER_ICON from './../../assets/icon_images/hamburger_list_menu.svg';


interface Props {
    membersData: UsersListItem[];
    onActions?: (data: any) => void;
}
const TeamMember: React.FC<Props> = (props: Props) => {
    const [modalShow, setModalShow] = React.useState(false);
    const [removeModalShow, setRemoveModalShow] = React.useState(false);
    const [roles, setRoles] = useState<any[] | []>([]);
    const [selectedRoles, setSelectedRoles] = useState<any>('');
    const [showButtons, setShowButtons] = useState(false);
    const [showLinksDiv, setShowLinkDiv] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isCheckedRow, setIsCheckedRow] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState<UsersListItem[] | []>([]);
    const companyId = sessionStorage.getItem('company_uuid') || '';
    const [jobsList, setjobsList] = useState<any>([]);
    const [selectedJob, setSelectedJob] = useState<any>('');
    const [isPopupType, setIsPopupType] = useState<any>('');
    const location = useLocation().pathname.split('/')[3];
    const [loading, setLoading] = useState(false);
    const [searchStr, setSearchStr] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    

    useEffect(() => {
        RolesService.getRoles().then(res => {
            // const roles = res.records?.filter((role: any) => role.code !== 'Candidate' && role.code !== 'SuperAdmin' && role.code !== 'SME' && role.code !== 'ASSIGN_CANDIDATE');
            setRoles([...res]);
        });
    }, []);

    const onSelectRole = (event: any) => {
        const selectedRole = event.target.value;
        console.log("selectedRole",selectedRole)
        if (selectedRole) {
            setSelectedRoles(selectedRole)
        }
    }

    const handleInput = () => {

    }

    const handleMouseEnter = (e: any, index: number) => {
        setSelectedIndex(index)
        setShowButtons(true);
        setShowLinkDiv(false);
    }

    const handleMouseLeave = (e: any) => {
        setShowButtons(false);
        setSelectedIndex(-1)
    }

    const handleMouseEnterDiv = (e: any, index: number) => {
        setShowLinkDiv(true);
        setSelectedIndex(index)
    }

    const handleMouseLeaveDiv = (e: any) => {
        setShowLinkDiv(true);
    }

    const handleMouseEnterInnerDiv = (e: any, index: number) => {
        setShowLinkDiv(true);
        setShowButtons(true);
        setSelectedIndex(index)
    }

    const handleMouseLeaveInnerDiv = (e: any) => {
        setShowLinkDiv(false);
        setShowButtons(false);
        setSelectedIndex(-1)
    }

    const onSelectRow = (event: any, index: number) => {
        props.membersData[index].checked = event.target.checked;
        isChecked();
    }

    const onSelectAll = (event: any) => {
        props.membersData.map((data: any, index: number) => {
            data.checked = event.target.checked;
        })
        isChecked();
    }

    const onRemoveTeamMember = () => {
        const selectedRole = roles.find((data: any, index: number) => (data.code === 'CompanyAdmin' && isPopupType === 'makeAdmin') || (data.code === 'HR_Admin' && isPopupType === 'makeHrManager'))
        if (props.onActions) {
            props.onActions({ data: selectedMembers, type: isPopupType, role: selectedRole ? selectedRole : '' });
            setRemoveModalShow(false);
            setIsCheckedRow(false);
        }
    }

    const isChecked = () => {
        const selectedData = props.membersData.find((data: UsersListItem) => data.checked);
        if (selectedData) {
            setIsCheckedRow(true);
        } else {
            setIsCheckedRow(false);
        }
    }

    const onShowConformationPopup = (data: UsersListItem, type: string) => {
        setIsPopupType(type);
        setRemoveModalShow(true);
        let members: UsersListItem[] = []
        members.push(data);
        setSelectedMembers(members);
    }

    const onMultiDelete = () => {
        setRemoveModalShow(true);
        const selectedData = props.membersData.filter((data: UsersListItem, index: number) => { return data.checked });
        setSelectedMembers(selectedData);
        setIsPopupType('multidelete')
    }

    const onJDAccess = (data: UsersListItem) => {
        setModalShow(true);
        setSelectedMembers([data]);
        getJobs();
    }

    const getJobs = () => {
        setLoading(true);
        JobsService.getJobs(companyId).then(
            res => {
                if (res?.error) {
                    setLoading(false);
                    toast.error(res?.error?.message);
                } else {
                    setLoading(false);
                    res.forEach((element: any) => {
                        element.label = `${element?.job_title}`
                        element.value = element?.uuid
                    });
                    setjobsList(res);
                }
            }
        )
    }

    const onSelectJob = (selectedList: any) => {
        console.log("slectedList",selectedList)
        // const jobs: any = [];
        // selectedList.map((job: any) => {
        //     jobs.push(job?);
        // })
        setSelectedJob(selectedList)
    }

    const onRemoveJob = (selectedList: any, removedItem: any) => {
        const jobs: any = [];
        selectedList.map((job: any) => {
            jobs.push(job?.uuid);
        })
        setSelectedJob(jobs)
    }

    const onAccessJD = () => {
        setLoading(true);
        const jobs: any[] = []
        selectedJob.forEach((element: any) => {
            jobs.push(element.uuid)
        });
        console.log("Jobs",jobs)
        const data = {
            job_uuids: jobs,
            user_uuid: selectedMembers[0]?.uuid,
            type: Number(selectedRoles)
        }
        console.log("data",data)
        JobsService.JobAccessToUser(data).then(
            res => {
                if (res?.error) {
                    setLoading(false);
                    toast.error(res?.error?.message);
                } else {
                    setLoading(false);
                    setModalShow(false);
                }
            }
        )
    }

    const onSearch = (search: string) => {
        if (props.onActions) {
            setIsFilterOpen(true);
            props.onActions({ data: search, type: 'search', role: '' });
        }
    }

    const onSearchTextEmpty = (event: any) => {
        setSearchStr(event.target.value)
        if (!event.target.value) {
            if (props.onActions) {
                props.onActions({ data: event.target.value, type: 'search', role: '' });
            }
        }
    }

    const onSearchText = (event: any) => {
        if (event.key === 'Enter') {
            setIsFilterOpen(true);
            if (props.onActions) {
                props.onActions({ data: event.target.value, type: 'search', role: '' });
            }
        }
    }

    const clearFilter = (event: any) => {
        setSearchStr('');
        
        setIsFilterOpen(false)
        if (props.onActions) {
            props.onActions({ data: '', type: 'search', role: '' });
        }
    }

    return (
        <>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }
            <div>
                        <div className='col-12'>
                            <div className='bg-white rounded-3'>
                                <div className='px-4 pb-4 pt-3'>
                                    <div className='top_div d-flex justify-content-between'>
                                        <div className='d-flex select_all_left_side mb-sm-0 mb-3'></div>
                                        {/* <div className="form-check mt-md-2 mt-3">
                                            {
                                                props?.membersData.length > 0 &&
                                                <>
                                                    <input className="form-check-input" type="checkbox" id="flexCheckDefault" onChange={(e) => onSelectAll(e)} />
                                            <label className="form-check-label text-black" style={{ fontSize: "13px" }}>
                                           Select All
                                       </label>
                                                </>

                                            }

                                            {isCheckedRow && <i className="bi bi-trash ms-3" style={{
                                                padding: '4px', borderRadius: '5px', border: '2px solid #1D2851'
                                            }} onClick={() => onMultiDelete()}></i>}

                                        </div> */}
                                        
                                        <div className="input-group search_and_filter_right_side candidate_search_bar_border mt-3">
                                            <input type="text" className="form-control form_control_border py-md-2" placeholder="Search Candidate By Name" aria-label="Username" aria-describedby="basic-addon1" value={searchStr} onKeyPress={(e) => onSearchText(e)} onInput={(e) => onSearchTextEmpty(e)} />
                                            <span className="input-group-text input_group_text" id="basic-addon1"><i className="fa fa-search pointer" aria-hidden="true" onClick={() => onSearch(searchStr)}></i></span>
                                        </div>
                                        {
                                    isFilterOpen &&
                                    <button className='large_btn_filter  ms-3 rounded mt-3 w-auto px-2'
                                        onClick={clearFilter}
                                    >Clear&nbsp;Filter</button>
                                }
                               
                                    </div>
                                    {props?.membersData.length > 0 ? <div>
                                        {props?.membersData.map((data: any, index: number) => {
                                            return <div key={index} className={`pb-2 pt-3 pe-3 d-flex justify-content-between ${selectedIndex === index ? '' : 'bg_white'}`} onMouseEnter={(e) => handleMouseEnter(e, index)} onMouseLeave={(e) => handleMouseLeave(e)} style={{
                                                borderBottom: (props?.membersData.length - 1) !== index ? "1px solid #dee2e6"
                                                    : ""
                                            }}>
                                                <div>
                                                    <ul className='list-inline d-flex mb-0'>
                                                        {/* <li className='my-auto' >
                                                        <input className="form-check-input" type="checkbox" id="flexCheckDefault" checked={data?.checked} onChange={(e) => onSelectRow(e, index)} />
                                                    </li> */}
                                                        <li className='my-auto me-md-3 me-3'>
                                                            {/* <div className='img_properties'></div> */}
                                                            {
                                                                data?.user_firstname && data?.user_lastname &&
                                                                <span className='text-uppercase border sx-border-clr size-52px border-radius-50 border_gray text-dark d-flex align-items-center justify-content-center'>{data?.user_firstname[0]}{data?.user_lastname[0]}</span>
                                                            }
                                                        </li>
                                                        <li className='my-auto' style={{ position: "relative", width: "300px" }}>
                                                            <ul className='list-inline'>
                                                                <li className='top_right_styles'>{data?.user_firstname} {data?.user_lastname}</li>
                                                                <li className="all_members_user_email">{data?.user_email}</li>
                                                                <li className="all_members_user_email">{data?.role}</li>
                                                            </ul>
                                                        </li>
                                                        {location === 'invitations' && <div className='my-auto'>
                                                            {moment(data?.created_dt).format('YYYY-MM-DD')}
                                                        </div>}
                                                    </ul>
                                                </div>

                                                {location !== 'invitations' && <div style={{ position: 'relative' }}>
                                                    {/* {showButtons && selectedIndex === index && */}
                                                    <div className='pt-3'>
                                                        {location !== 'deactivated' && <button className='mx-2  rounded px-2 large_btn_apply' type="button" onClick={() => onJDAccess(data)}>JD Access</button>}
                                                        {/* <button className=' rounded px-2 small_btn' onMouseEnter={(e) => handleMouseEnterDiv(e, index)} onMouseLeave={(e) => handleMouseLeaveDiv(e)}><i className="fa fa-ellipsis-h" aria-hidden="true"></i></button> */}
                                                        <span className='ms-2' onMouseEnter={(e) => handleMouseEnterDiv(e, index)} onMouseLeave={(e) => handleMouseLeaveDiv(e)}><img src={HAMBURGER_ICON} alt="menu-icon"/></span>
                                                    </div>
                                                    {/* } */}
                                                    {showLinksDiv && selectedIndex === index &&
                                                        <div className='all_members_links_div ps-3 py-2 me-4 chat_arrow_container ' style={{ width: "207px" }} onMouseEnter={(e) => handleMouseEnterInnerDiv(e, index)} onMouseLeave={(e) => handleMouseLeaveInnerDiv(e)}>
                                                            <div className='chat_arrow me-1'></div>
                                                            <ul className='list-inline top_para_styles mb-0' >
                                                                {location !== 'deactivated' && location !== 'admins' && data?.role!=='CompanyAdmin' && <li className='border-bottom pointer pb-1 ' onClick={() => onShowConformationPopup(data, 'makeAdmin')}>Assign admin role</li>}
                                                                {location !== 'deactivated' && location !== 'hiring-managers' && data?.role!=='HR_Admin' && data?.role!=="Recruiter" && <li className='border-bottom pointer py-1' onClick={() => onShowConformationPopup(data, 'makeHrManager')}>Make as hiring manager</li>}
                                                                <li className='border-bottom pointer py-1' onClick={() => onShowConformationPopup(data, 'delete')}>Remove from the team</li>
                                                                {location !== 'deactivated' && <li className='pt-1 pointer' onClick={() => onShowConformationPopup(data, 'temporarilyDeactivate')}>Delete</li>}
                                                                {location === 'deactivated' && <li className='border-bottom py-1 pointer' onClick={() => onShowConformationPopup(data, 'Aactivate')}>Activate</li>}
                                                            </ul>
                                                        </div>
                                                    }
                                                </div>}
                                            </div>
                                        })}
                                    </div> : <NoData message=""></NoData>}
                                </div>
                            </div>
                        </div>
                   
            </div>

            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                aria-labelledby="contained-modal-title-vcenter"
                className="sx-close w-100"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <div className='invite_team_heading'>{selectedMembers[0]?.user_firstname} {selectedMembers[0]?.user_lastname} JD Access</div>
                        <p className='invite_team_content'>Mange the JDs the can be accessed by this team member</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormBuilder onUpdate={handleInput}>
                        <form>
                            <div className="mb-3">
                                <label className="form-label job_dis_form_label">This member has access to following JDs</label>
                                <Select
                                    isMulti={true}
                                    value={selectedJob}
                                    placeholder="Enter JD name"
                                    onChange={(e) => onSelectJob(e)}
                                    options={jobsList}
                                    className="search_dropdown"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label job_dis_form_label">Role</label>
                                <select className="form-control job_dis_form_control px-3 rounded" name="role" onChange={(event) => onSelectRole(event)}>
                                    <option value="">Select role</option>
                                    <option value="1">Team Member</option>
                                    <option value="2">Hiring Manager</option>
                                    <option value="3">Recruiter</option>
                                </select>
                            </div>

                            {selectedRoles?.description && <div className="mb-3">
                                <p className='f12'> <img src={Vector} alt="" /> {selectedRoles?.description}</p>
                            </div>}
                        </form>
                    </FormBuilder>
                </Modal.Body>
                <Modal.Footer>
                    <div className='d-flex justify-content-between mx-3 mb-3'>
                        <div className='text-start '>
                        <button className='large_btn_filter rounded me-3 ps-2 text-center' onClick={() => setModalShow(false)}>Cancel</button>
                        </div>
                    <div className='text-end '>
                        <button className='large_btn_apply rounded' onClick={onAccessJD}>Save</button>
                    </div>
                    </div>
                </Modal.Footer>
            </Modal>

            <Modal
                show={removeModalShow}
                onHide={() => setRemoveModalShow(false)}
                aria-labelledby="contained-modal-title-vcenter"
                className='sx-close w-100'
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {isPopupType === 'makeAdmin' && <div>
                            <div className='invite_team_heading'>The following users will be admin to the team</div>
                        </div>}
                        {isPopupType === 'makeHrManager' && <div>
                            <div className='invite_team_heading ms-2'>The following users will be hiring manager to the team</div>
                        </div>}
                        {isPopupType === 'delete' && <div>
                            <div className='invite_team_heading'>The following users will be removed from the team</div>
                            <p className='invite_team_content mb-0 ms-1'>Users will not be able to login to the system and all data would be cleared</p>
                        </div>}
                        {isPopupType === 'multidelete' && <div>
                            <div className='invite_team_heading'>The following users will be removed from the team</div>
                            <p className='invite_team_content'>Users will not be able to login to the system and all data would be cleared</p>
                        </div>}
                        {isPopupType === 'temporarilyDeactivate' && <div>
                            <div className='invite_team_heading'>The following users will be temporarily deactivate from team</div>
                        </div>}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className=' rounded-3'>
                        {selectedMembers.map((data: any, index: number) => {
                            return <div key={index} className=' py-3'>
                                <ul className='list-inline d-flex my-auto'>
                                    <li className='my-auto me-3 ms-1 '><div className='text-uppercase border sx-border-clr size-52px border-radius-50 d-flex align-items-center justify-content-center'>{data?.user_firstname[0]}{data?.user_lastname[0]}</div></li>
                                    <li className='my-auto'>
                                        <ul className='list-inline'>
                                            <li className='text-black' style={{ fontSize: "16px" }}>{data?.user_firstname} {data?.user_lastname}</li>
                                            <li style={{ fontSize: "14px" }}>{data?.user_email}</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className='d-flex justify-content-between ms-3 my-3'>
                        <div className='text-start ms-1'>
                        <button className='large_btn_filter rounded me-3 ps-2 text-center' onClick={() => setRemoveModalShow(false)}>Cancel</button>
                    </div>
                    <div className='text-end '>
                        {isPopupType === 'makeAdmin' && <button className='large_btn_apply rounded me-3' onClick={onRemoveTeamMember}>Save</button>}
                        {isPopupType === 'makeHrManager' && <button className='large_btn_apply rounded me-3' onClick={onRemoveTeamMember}>Save</button>}
                        {isPopupType === 'delete' && <button className='large_btn_apply rounded me-3' onClick={onRemoveTeamMember}>Remove User</button>}
                        {isPopupType === 'multidelete' && <button className='large_btn_apply rounded me-3' onClick={onRemoveTeamMember}>Remove Users</button>}
                        {isPopupType === 'temporarilyDeactivate' && <button className='large_btn_apply rounded me-3' onClick={onRemoveTeamMember}>Deactivate Now</button>}
                        {isPopupType === 'Aactivate' && <button className='large_btn rounded' onClick={onRemoveTeamMember}>Activate</button>}
                        {/* <button className='large_btn_filter rounded me-3 ps-2 text-center' onClick={() => setRemoveModalShow(false)}>Cancel</button> */}
                    </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default TeamMember;