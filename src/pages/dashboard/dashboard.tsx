import React, { useEffect, useRef, useState, SyntheticEvent } from 'react'
import { useHistory, useLocation } from 'react-router'
import { NavLink } from 'react-router-dom'
import DashbordRoutes from '../../routes/dashboard';
import { UsersService } from '../../app/service/users.service';
import { ACCOUNT_STATUS, SX_ROLES } from '../../app/utility/app-codes';
import { Modal } from 'react-bootstrap';
import { CLOUDFRONT_URL } from '../../config/constant';
import { connect, useDispatch } from 'react-redux';
import { UserData } from '../../redux/actions';
import LogoImg from "../../assets/images/siftedx_home_logo.png";
import DashboardActive from "../../assets/icon_images/Dashboard_Active.svg";
import Dashboard from "../../assets/icon_images/Dashboard.svg";
import AvailabilityActive from "../../assets/icon_images/Availability_Active.svg";
import Availability from "../../assets/icon_images/Availability.svg";
import InterviewsActive from "../../assets/icon_images/Interviews_Active.svg";
import Interviews from "../../assets/icon_images/Interviews.svg";
import ProfileActive from "../../assets/icon_images/Profile_Active.svg";
import Profile from "../../assets/icon_images/Profile.svg";
import ManagePayoutsActive from "../../assets/icon_images/Manage_payouts_Active.svg";
import ManagePayouts from "../../assets/icon_images/Manage_payouts.svg";
import AccountSettingsActive from "../../assets/icon_images/Account_Settings_Active.svg";
import AccountSettings from "../../assets/icon_images/Account_Settings.svg";
import Team from "../../assets/icon_images/team.svg";
import TeamActive from '../../assets/icon_images/team_active.svg';
import Candidate from '../../assets/icon_images/Layer_26.svg';
import Report from '../../assets/icon_images/WEB_analytics.svg'
import ReportActive from '../../assets/icon_images/WEB_analytics_active.svg'
import CandidateActive from '../../assets/icon_images/Layer_26_active.svg';
import { NotificationsService } from '../../app/service/notifications.service';
import Job from "../../assets/icon_images/Jobs.svg";
import JobActive from "../../assets/icon_images/Jobs_active.svg";
import Help from "../../assets/icon_images/help.svg";
import HelpActive from "../../assets/icon_images/help_active.svg";
import moment from 'moment';
import ICON_LOGOUT from '../../assets/icon_images/Logout Icon.svg'




import { toast } from 'react-toastify';
import { SmeService } from '../../app/service/sme.service';

interface Props {
  UserDataReducer: any;
  location?: any;
  userData?: (data: any) => void;
}

const DashboardView = (props: Props) => {
  let url: string | undefined = props.location?.pathname.split('/')[2];
  const [username, setUsername] = useState<any>();
  const [roleName, setRoleName] = useState<any>();
  const [canShowStudentView, setCanShowStudentView] = useState(false);
  const [sidebarMenu, setSidebarMenu] = useState<any[]>([]);
  const [canShowPopup, setCanShowPopup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const loginUserId = sessionStorage.getItem('userUuid') || '';
  const history = useHistory();
  const [userData, setUserData] = useState<any>({});
  const location = useLocation();
  let id = props.location?.pathname.split('/')[4];
  
  const role = sessionStorage.getItem('userRole');
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const dispatch = useDispatch();
  const [onFoucsTabActive, setOnFoucsTabActive] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationref = useRef<any>(null);
  const mobileNavbarToggler = useRef(null);
  const [notificationData, setNotificationData] = useState<any[]>([]);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);


  // const [readNotification, setReadNotification] = useState<any>('');
  // const handleClickOutside = (event: any) => {
  //   if (notificationref.current && !notificationref.current.contains(event.target)) {
  //     setShowNotifications(false);
  //   }
  // };




  useEffect(() => {
    const userName = sessionStorage.getItem("user_name");
    const userRole = sessionStorage.getItem("user_role");
    const roleName = sessionStorage.getItem("role_name");
    setUsername(userName);
    setRoleName(roleName);
    setCanShowStudentView(false);
    getSidebarMenuList(userRole);
    getLoginUserData();
    getNotifications();
    // document.addEventListener('click', handleClickOutside, true);
    // return () => {
    //   document.removeEventListener('click', handleClickOutside, true);
    // };
  }, [])


  const markAsRead = () => {
    
    const uuids: any[] = [];
    notificationData.forEach((element: any) => {
      uuids.push(element.uuid);
    })
    NotificationsService.markAllAsRead(uuids).then((res) => {
      
     
      if (res.error) {
        toast.error(res?.error?.message);
      } else {
        // setReadNotification(res)
        getNotifications();
      }
    })
  }

  const getLoginUserData = () => {
    if (role === SX_ROLES.SME) {
      SmeService.getSmeProfileById(loginUserId).then(res => {
        if (res.error) {
          toast.error(res?.error?.message);
        } else {
          if (props.userData) {
            dispatch(props.userData(res));
          }
          setUserData(res);
        }
        setIsUserDataLoaded(true);
      })
    } else {
      UsersService.getUserByUuid(loginUserId).then(res => {
        if (res.user_image) {
          res.user_image = res.user_image.replace(CLOUDFRONT_URL + '/', '');
        }
        if (props.userData) {
          dispatch(props.userData(res));
        }
        setUserData(res);
        setIsUserDataLoaded(true);
      });
    }
  }
  const onClickHome = () => {
    setShow(true);
    setShowProfile(false)
  }

  const handleSubmit = () => {
    setCanShowPopup(false);
    history.push("/home");
    localStorage.setItem('rememberMeData', '');
    sessionStorage.clear();
  }


  const getSidebarMenuList = (userRole: any) => {

    let list: any = [];
    if (role === SX_ROLES.SuperAdmin) {
      list = [
        {
          name: 'Dashboard',
          route: "/dashboard/home",
        },
        {
          name: 'Companies',
          route: "/dashboard/companies/list",
        },
        {
          name: 'Users',
          route: "/dashboard/users",
        },
        {
          name: 'Sme',
          route: "/dashboard/sme/list",
        },
        {
          name: 'Roles',
          route: "/dashboard/roles",
        },
        {
          name: 'Objects',
          route: "/dashboard/objects",
        },
        {
          name: 'Reports',
          route: "/dashboard/reports/interviewschedule",
        }
      ];
    } else if (role === SX_ROLES.SME) {
      list = [
        {
          name: 'Dashboard',
          route: "/dashboard/home",
          isActive: 'home',
          icon: Dashboard,
          activeIcon: DashboardActive
        },
        {
          name: 'Availability',
          route: "/dashboard/availability",
          isActive: 'availability',
          icon: Availability,
          activeIcon: AvailabilityActive
        },
        {
          name: 'Interviews',
          route: "/dashboard/interviews/opportunities",
          isActive: 'interviews',
          icon: Interviews,
          activeIcon: InterviewsActive
        },
        {
          name: 'Profile',
          route: "/dashboard/sme/profile",
          isActive: 'sme',
          icon: Profile,
          activeIcon: ProfileActive
        },
        {
          name: 'Manage Payouts',
          route: "/dashboard/manage-payouts",
          isActive: 'manage-payouts',
          icon: ManagePayouts,
          activeIcon: ManagePayoutsActive
        },
        {
          name: 'Account Settings',
          route: "/dashboard/account-settings/view",
          isActive: 'account-settings',
          icon: AccountSettings,
          activeIcon: AccountSettingsActive
        },
      ]
    } else if (role === SX_ROLES.CompanyAdmin) {
      list = [
        {
          name: 'Dashboard',
          route: "/dashboard/home",
          isActive: 'home',
          icon: Dashboard,
          activeIcon: DashboardActive
        },
        {
          name: 'Team',
          route: "/dashboard/manager-team/all-members",
          isActive: 'manager-team',
          icon: Team,
          activeIcon: TeamActive
        },
        {
          name: 'Jobs(JD)',
          route: "/dashboard/jobs",
          isActive: 'jobs',
          icon: Job,
          activeIcon: JobActive
        },
        {
          name: 'Candidates',
          route: "/dashboard/candidates/all",
          isActive: 'candidates',
          icon: Candidate,
          activeIcon: CandidateActive
        },
        {
          name: 'Interviews',
          route: "/dashboard/interviews/upcomming",
          isActive: 'interviews',
          icon: Interviews,
          activeIcon: InterviewsActive,
        },
        {
          name: 'Account Settings',
          route: "/dashboard/account-settings/view",
          isActive: 'account-settings',
          icon: AccountSettings,
          activeIcon: AccountSettingsActive
        },
        {
          name: 'License & Billing',
          route: "/dashboard/billing",
          isActive: 'billing',
          icon: ManagePayouts,
          activeIcon: ManagePayoutsActive
        },
        // {
        //   name: 'Help',
        //   route: "/dashboard/help",
        //   isActive: 'help',
        //   icon: Help,
        //   activeIcon: HelpActive
        // }
      ]

    } else if (role === SX_ROLES.Recruiter) {
      list = [
        {
          name: 'Dashboard',
          route: "/dashboard/home",
          isActive: 'home',
          icon: Dashboard,
          activeIcon: DashboardActive
        },
        // {
        //   name: 'Team',
        //   route: "/dashboard/manager-team/all-members",
        //   isActive: 'manager-team',
        //   icon: Team,
        //   activeIcon: TeamActive
        // },
        {
          name: 'Jobs',
          route: "/dashboard/jobs",
          isActive: 'jobs',
          icon: Job,
          activeIcon: JobActive
        },
        {
          name: 'Candidates',
          route: "/dashboard/candidates/all",
          isActive: 'candidates',
          icon: Candidate,
          activeIcon: CandidateActive
        },
        {
          name: 'Interviews',
          route: "/dashboard/interviews",
          isActive: 'interviews',
          icon: Availability,
          activeIcon: AvailabilityActive
        },
        {
          name: 'Reports',
          route: "/dashboard/companyreports",
          isActive: 'companyreports',
          icon: Report,
          activeIcon:ReportActive,
        },
        {
          name: 'Account Settings',
          route: "/dashboard/account-settings/view",
          isActive: 'account-settings',
          icon: AccountSettings,
          activeIcon: AccountSettingsActive
        },
        // {
        //   name: 'Billing',
        //   route: "/dashboard/billing",
        //   isActive: 'billing',
        //   icon: ManagePayouts,
        //   activeIcon: ManagePayoutsActive
        // }
      ]
    } else if (role === SX_ROLES.HR_Admin) {
      list = [
        {
          name: 'Interviews',
          route: "/dashboard/interviews",
          isActive: 'interviews'
        }
      ]
    }

    setSidebarMenu(list);
  }

  const onActive = (link: string) => {
    return location.pathname.includes(link);
  }

  const onShowProfile = () => {
    setShowProfile(true);
    setShowNotifications(false);
  }

  const onFocusTab = (active: any) => {
    setOnFoucsTabActive(active);
  }

  const onProfile = () => {
    history.push('/dashboard/sme/profile');
  }
  const getNotifications = () => {
    NotificationsService.getNotification().then(res => {
      
      if (res?.error) {
        toast.error(res?.error?.message);
      } else {
        setNotificationData([...res])
      }
    });
  }

  const onCloseNotification=()=>{
    setShowNotifications(!showNotifications);
    
  }

  const onShowNotification = (event: SyntheticEvent) => {
    setShowNotifications(true);
    // setShowFilterOptions(!showFilterOptions);
    event.stopPropagation();
    event.preventDefault();
    setShowProfile(false)
  }



  const hideMobileNav = () => {
    if (mobileNavbarToggler.current) {
      (mobileNavbarToggler.current as HTMLButtonElement).click();
    }
  }
  const gotoJobs=(data:any)=>{
    console.log("data",data.message)
    // history.push("/dashboard/interviews/opportunities");
    if(data.message==="New job assigned to you"){
      history.push('/dashboard/interviews/upcomming')
    }
    else if(data.message==="You have a new opportunity"){
      history.push("/dashboard/interviews/opportunities")
    }
  }
  

  return (
    <div>
      <div className='container-fluid'>
        <div className='row sticky-top navbar_main_div' onMouseLeave={() => setShowProfile(false)}>
          <div className='col-12'>
            <header className="navbar navbar-dark flex-md-nowrap px-3 p-lg-0">
              <button ref={mobileNavbarToggler} className="navbar-toggler d-lg-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMen u" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <span className='pointer ms-lg-4 mx-auto mx-lg-none' onClick={() => history.push('/dashboard/home')}><img src={LogoImg} alt="loading-pic" className='ms-5 ps-5 ps-lg-0 ms-lg-3' /></span>
              {/* <div className='d-block d-lg-none'> */}
              <div className='d-flex ms-auto '>
                {/* {role === SX_ROLES.SME && <span className='d-block d-lg-none '>
                  <div className={`text-end sme_status_top mt-1 ${props?.UserDataReducer?.status === ACCOUNT_STATUS.ACTIVE ? 'border_green' : props?.UserDataReducer?.status === ACCOUNT_STATUS.UNDER_VERIFICATION ? 'border_gray' : 'border_dark_gray'}`}>
                    <div className={`sme_status_dot ${props?.UserDataReducer?.status === ACCOUNT_STATUS.ACTIVE ? 'bg_green' : props?.UserDataReducer?.status === ACCOUNT_STATUS.UNDER_VERIFICATION ? 'bg_gray' : 'bg_dark_gray'}`}></div>
                    <div className='notifications_left_line m-0 d-inline-flex pt-0' style={{ color: "white" }}>{props?.UserDataReducer?.status === ACCOUNT_STATUS.ACTIVE && <span className='color_green'>Active</span>} {props?.UserDataReducer?.status === ACCOUNT_STATUS.UNDER_VERIFICATION && <span className='color_dark_gray'>Under Verification</span>}{props?.UserDataReducer?.status === ACCOUNT_STATUS.DISABLED && <span className='color_gray'>Disabled</span>}</div>
                  </div>
                </span>} */}
                <div className='position-relative d-block d-lg-none'>
                  {/* {userData?.user_image ? <img className='profile_round' src={props?.UserDataReducer?.user_image.includes('profile-pics') ? `${CLOUDFRONT_URL}/${props?.UserDataReducer?.user_image}` : props?.UserDataReducer?.user_image} /> : <span className="header_img_properties"></span>}
                  <span className="me-3 ms-2 cursor-pointer sign_out_font" onMouseEnter={onShowProfile}><i className="bi bi-person-circle text-white" style={{fontSize:"24px"}}></i></span>
                  <i className="bi bi-chevron-down me-2 fs-14" onMouseEnter={onShowProfile} style={{ color: "white" }} ></i>
                  {showProfile &&
                    <div className='rounded-3' onMouseEnter={onShowProfile} onMouseLeave={() => setShowProfile(false)} style={{ position: 'absolute', top: '40px', right: '6%', background: "white", paddingBottom: "16px", width: "150px" }}>
                      <ul className="nav flex-column mt-2">
                        {role === SX_ROLES.SME && <li className="nav-item side_bar_menu_font_style pointer">
                          <div className={`nav-link`}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="12" height="12" rx="6" fill="#C4C4C4" />
                            </svg>
                            <span className='ms-2 dashboard_names' onClick={() => { onProfile() }}>Profile</span></div>
                        </li>}
                        <li className="nav-item side_bar_menu_font_style pointer">
                          <div className={`nav-link`}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="12" height="12" rx="6" fill="#C4C4C4" />
                            </svg>
                            <span className='ms-2 dashboard_names' onClick={() => { onClickHome() }}>Logout</span></div>
                        </li>
                      </ul>
                    </div>
                  } */}
                  {/* <i className="bi bi-person-circle text-white mx-2 my-2" style={{fontSize:"24px"}}></i> */}
                </div>

                {/* <div className='position-relative d-block d-lg-none '>
                  <i className="bi bi-bell ms-2 fs_20  pointer mb-3" onClick={() => onShowNotification()} onMouseEnter={onShowNotification} style={{ color: "white" }} ></i>
                  {showNotifications && <div onMouseEnter={onShowNotification} className='rounded-3 notifications_modal px-4 py-3' ref={notificationref} onMouseLeave={() => setShowNotifications(false)}>
                    <div className='row mb-3'>
                      <div className='col-md-6 fw_7 small_font_size'>Notifications</div>
                    </div>

                    <h6 className='small_font_size text-center'>No new notifications</h6>

                  </div>}
                </div> */}
              </div>
              <div className="d-flex align-items-center fs-12" style={{ marginLeft: "auto" }}>
                {role === SX_ROLES.SME && <span className='pe-lg-4 pe-2 d-none d-lg-block'>
                  <div className={`d-flex p-1 align-items-center  border-radius-30 ${props?.UserDataReducer?.status === ACCOUNT_STATUS.ACTIVE ? 'border_green' : props?.UserDataReducer?.status === ACCOUNT_STATUS.UNDER_VERIFICATION ? 'border_gray' : 'border_dark_gray'}`}>
                    <div className={`sme_status_dot me-1 ${props?.UserDataReducer?.status === ACCOUNT_STATUS.ACTIVE ? 'bg_green' : props?.UserDataReducer?.status === ACCOUNT_STATUS.UNDER_VERIFICATION ? 'bg_gray' : 'bg_dark_gray'}`}></div>
                    <div className='notifications_left_line m-0 d-inline-flex pt-0' style={{ color: "white" }}>
                      {props?.UserDataReducer?.status === ACCOUNT_STATUS.ACTIVE && <span className='color_green'>Active</span>} {props?.UserDataReducer?.status === ACCOUNT_STATUS.UNDER_VERIFICATION && <span className='color_dark_gray mx-sm-w70 text-ellipsis'>Under Verification</span>}{props?.UserDataReducer?.status === ACCOUNT_STATUS.DISABLED && <span className='color_gray'>Disabled</span>}
                    </div>
                  </div>
                </span>}
                <div className='position-relative d-flex align-items-center d-block d-lg-none me-2 cursor-pointer' onClick={() => history.push('/dashboard/sme/profile')}>
                  {userData?.user_image !== "" && userData?.user_image !== null ? <img className='profile_round' src={props?.UserDataReducer?.user_image?.includes('http') ? props?.UserDataReducer?.user_image : `${CLOUDFRONT_URL}/${props?.UserDataReducer?.user_image}`} /> : <span className='text-uppercase border-3 sx-border-clr size-sm-30px border-radius-50 border_gray text-white d-flex align-items-center justify-content-center'>{props?.UserDataReducer?.user_firstname[0]}{props?.UserDataReducer?.user_lastname[0]}</span>}

                </div>

                {/* <div className='position-relative d-flex align-items-center d-none d-lg-flex'>
                
                  {userData?.user_image !== "" && userData?.user_image !== null ? <img className='profile_round' src={props?.UserDataReducer?.user_image?.includes('http') ? props?.UserDataReducer?.user_image : `${CLOUDFRONT_URL}/${props?.UserDataReducer?.user_image}`} /> : <b className='text-uppercase border-3 sx-border-clr size-35px border-radius-50 border_gray text-white d-flex align-items-center justify-content-center'>{props?.UserDataReducer?.user_firstname[0]}{props?.UserDataReducer?.user_lastname[0]}</b>}

                  <span className="size-50px me-3 ms-1 cursor-pointer d-none d-lg-block text-white" onMouseEnter={onShowProfile}> {props?.UserDataReducer?.user_firstname} {props?.UserDataReducer?.user_lastname}</span>
                  <i className="bi bi-chevron-down me-2 fs-14" onMouseEnter={onShowProfile} style={{ color: "white" }} ></i>
                  {showProfile &&
                    <div className='fs_14 position-absolute chat_arrow_container bg-white mt-1 end-0 top-100 border rounded' onMouseEnter={onShowProfile} onMouseLeave={() => setShowProfile(false)}>
                      <div className="chat_arrow"></div>
                      <ul className="p-3 m-0 py-0" style={{ listStyle: 'none' }}>
                        {role === SX_ROLES.SME &&
                          <li className="pt-2 pb-2 pointer border-bottom d-flex" onClick={() => { onProfile() }}>
                            {userData?.user_image !== "" && userData?.user_image !== null ? <img className='me-3' style={{
                              width: "25px",
                              height: "25px",
                              borderRadius: "50%",
                              objectFit: "cover"
                            }} src={props?.UserDataReducer?.user_image?.includes('http') ? props?.UserDataReducer?.user_image : `${CLOUDFRONT_URL}/${props?.UserDataReducer?.user_image}`} /> : <span className='text-uppercase border-3 sx-border-clr size-sm-30px p-1 border-radius-50 border_gray text-black d-flex align-items-center justify-content-center me-3'>{props?.UserDataReducer?.user_firstname[0]}{props?.UserDataReducer?.user_lastname[0]}</span>}

                            <span className='mt-2'>Account</span>
                          </li>}

                        <li className="pt-2 pb-2 pointer d-flex ms-2" onClick={() => { onClickHome() }}>
                          <span className="bi-box-arrow-right me-3" style={{
                            fontSize: "25px",
                            position: "relative",
                            bottom: "11px"
                          }}>    </span>
                          Logout

                        </li>
                      </ul>
                    </div>
                  }
                  
                </div> */}


                <div className='position-relative d-flex align-items-center d-none d-lg-flex'>
                  {/* {userData?.user_image ? <img className='profile_round' src={props?.UserDataReducer?.user_image.includes('profile-pics') ? `${CLOUDFRONT_URL}/${props?.UserDataReducer?.user_image}` : props?.UserDataReducer?.user_image} /> : <span className="header_img_properties"></span>} */}
                  {userData?.user_image !== "" && userData?.user_image !== null ? <img className='profile_round' src={props?.UserDataReducer?.user_image?.includes('http') ? props?.UserDataReducer?.user_image : `${CLOUDFRONT_URL}/${props?.UserDataReducer?.user_image}`} /> : <b className='text-uppercase border-3 sx-border-clr size-35px border-radius-50 border_gray text-white d-flex align-items-center justify-content-center'>{props?.UserDataReducer?.user_firstname[0]}{props?.UserDataReducer?.user_lastname[0]}</b>}

                  <span className="size-50px me-3 ms-1 cursor-pointer d-none d-lg-block text-white" onMouseEnter={onShowProfile}> {props?.UserDataReducer?.user_firstname} {props?.UserDataReducer?.user_lastname}</span>
                  <i className="bi bi-chevron-down me-2 fs-14" onMouseEnter={onShowProfile} style={{ color: "white" }} ></i>
                  {showProfile &&
                    <div className='fs_14 position-absolute chat_arrow_container bg-white end-0 top-100 border rounded' onMouseEnter={onShowProfile} onMouseLeave={() => setShowProfile(false)}>
                      <div className="chat_arrow"></div>
                      <ul className="px-2  m-0 py-1" style={{ listStyle: 'none' }}>
                        {role === SX_ROLES.SME &&
                          <li className="p-1 px-2 pe-3 pointer pt-2 pb-2 border-bottom d-flex align-items-center" onClick={() => { onProfile() }}>
                            {userData?.user_image !== "" && userData?.user_image !== null ? <img style={{ height: '24px', width: '24px' }} className='profile_round me-2 h-24 w-24' src={props?.UserDataReducer?.user_image?.includes('http') ? props?.UserDataReducer?.user_image : `${CLOUDFRONT_URL}/${props?.UserDataReducer?.user_image}`} /> : <span className="text-uppercase border-3 sx-border-clr border-radius-50 border_gray text-black d-flex align-items-center justify-content-center me-2 fs_12 lh-0" style={{ height: '24px', width: '24px', fontSize: "12px" }}>{props?.UserDataReducer?.user_firstname[0]}{props?.UserDataReducer?.user_lastname[0]}</span>}

                            <span className='ms-1'>Account</span>
                          </li>}

                        <li className="p-1 px-2 pe-3 pt-2 pb-2 pointer d-flex align-items-center" onClick={() => { onClickHome() }}>
                          <img src={ICON_LOGOUT} alt="" style={{ height: '24px', width: '24px', padding: "3px" }} className='me-2 h-24 w-24' />
                          <span className='ms-1'>Logout</span>
                        </li>
                      </ul>
                      {/* <div className="chat_arrow"></div> */}
                    </div>
                  }
                </div>

                <div className='position-relative ms-lg-2 me-lg-5'>
                  <i className="bi bi-bell  fs_20 pointer lh-0" onClick={() => onCloseNotification()} onMouseEnter={onShowNotification} style={{ color: "white" }} ></i>

                  {showNotifications && <>
                    <div onClick={() => setShowNotifications(false)}></div>

                    <div onMouseEnter={onShowNotification} className='notifications_modal px-4 py-3'
                      style={{
                        border: "1px solid #7070701F", borderRadius: "5px"
                      }} ref={notificationref} onMouseLeave={() => setShowNotifications(false)}>
                      <div className="chat_arrow"></div>
                      <div className='row mb-3'>
                        <div className='col-md-6 col-6 fw_7 small_font_size'>Notifications</div>
                        <div className='col-md-6 col-6 fc_yellow text-end small_font_size pointer'>{
                          notificationData?.length > 0 && <span onClick={markAsRead}>Mark all as read</span>}
                        </div>
                      </div>
                      <ul className={`${notificationData.length > 0 ? 'notification_messages' : ""} small_font_size m-0 ps-4 ps-lg-3`} >


                        {/* className={`table_row ${selectedIndex === i ? 'table_row_bg_gray' : 'table_row_bg_white'} table-data`} */}
                        {
                          notificationData?.length > 0 ?
                            <>
                              {
                                notificationData?.map((data: any, index: number) => {
                                  return (
                                    <li className="notification-item" key={data.job_uuid} 
                                
                                    ><div className='pointer' onClick={()=>gotoJobs(data)}>
                                      <h6 className='top_para_styles m-0'
                                         style={{
                                          color:
                                          data.is_read? "#9C9C9C" : '',
                                        }}
                                      >{data.message}</h6>
                                      <p className='fc_gray pt-1' 
                                         style={{
                                          color:
                                          data.is_read? "#9C9C9C" : '',
                                        }}
                                      >

                                        {moment(data?.created_dt).format('MMMM Do YYYY, h:mm:ss a')}

                                      </p>
                                      </div>
                                      {(notificationData.length - 1) !== index && <hr />}

                                    </li>
                                  )
                                })
                              }
                            </>
                            : (
                              <h6 className='small_font_size text-center'>No new notifications</h6>

                            )
                        }
                      </ul>


                    </div>
                  </>

                  }
                </div>
              </div>
            </header>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-2 d-lg-block'>
            <nav id="sidebarMenu" className={!canShowStudentView ? "d-lg-block bg-light sidebar collapse col-lg-2" : ''} style={{ border: "1px solid #7070701F", borderRadius: "5px" }} >
              <div className="nav-overlay" onClick={hideMobileNav}></div>
              <div className={!canShowStudentView ? "position-sticky pt-3" : ''} >
                {!canShowStudentView && <ul className="nav flex-column mt-2">
                  {sidebarMenu.map((name: any, i: number) => (
                    <li className="nav-item side_bar_menu_font_style ms-3 mb-2 mb-lg-0" key={i} onMouseEnter={() => onFocusTab(name?.isActive)} onMouseLeave={() => onFocusTab('')}>
                      <NavLink onClick={hideMobileNav} className={`nav-link ${onActive(name?.isActive) ? 'active' : ''}`} to={name.route}>
                        {name?.icon ? <img src={onActive(name?.isActive) || onFoucsTabActive === name?.isActive ? name?.activeIcon : name?.icon} alt="" style={{ width: "18px", height: '18px' }} /> :
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="12" height="12" rx="6" fill="#C4C4C4" />
                          </svg>}
                        <span className='ms-2 dashboard_names'>{name.name}</span></NavLink>
                    </li>
                  ))}
                </ul>}
                <ul className="nav flex-column d-lg-none mt-2 mt-lg-0">
                  <li className="nav-item pointer  side_bar_menu_font_style" onClick={() => { onClickHome() }}>
                    <span className='dashboard_names ms-2'><i className="d-lg-none bi bi-box-arrow-right ms-4 ms-lg-0 me-2" style={{
                      fontSize: "18px"
                    }}></i>Logout</span>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <div className='col-lg-10 col-12'>
            <main className={!canShowStudentView ? '' : ''}>
              <div className="content-body background-gray">
                {isUserDataLoaded && <DashbordRoutes />}
              </div>
              <div className="text-center mt-3 mb-2 d-flex justify-content-end px-4">
                <p className="copyright">
                  Copyright © 2022 SiftedX. All Rights Reserved.
                </p>
              </div>
            </main>
          </div>
        </div>
      </div >

      <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter"
        className='sx-close w-100'
        size='sm'

        centered >
        <Modal.Header closeButton>
          <Modal.Title>
            {/* <h5 className='schedule_interview_modal_heading p-0 m-0'>Are you sure you want to logout?</h5> */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          {/* <div className="text-end mt-5 my-3 pe-2">
            <button type="button" className="large_btn_apply rounded text-decoration-none me-3" onClick={handleSubmit}>Yes</button>
            <button type="button" className="btn-signup rounded text-decoration-none" onClick={() => handleClose()}>Cancel</button>
          </div> */}
          <p className='top_para_styles p-0 m-0 text-center mt-3'>Are you sure you want to logout?</p>
          <div className='row'>
            <div className='col-6 px-3 py-3 mt-3'>
              <button type="button" className="rounded text-decoration-none open_cv ps-3 pt-1 pb-1 pe-3 ms-2 ms-lg-0 ms-sm-2 fw-normal bg-transparent" onClick={() => handleClose()}>Cancel</button>

            </div>
            <div className='col-6 text-end px-3 py-3 mt-3'>
              <button type="button" className="rounded text-decoration-none ps-4 pt-1 pb-1 pe-4 fw-normal upload_cv" onClick={handleSubmit}>Yes</button>

            </div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div >
  )
}

const mapStateToProps = (state: any) => {
  return {
    UserDataReducer: state.UserDataReducer,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    userData: (data: any) => dispatch(UserData(data)),
  }
}

const connectedNavBar = connect(mapStateToProps, mapDispatchToProps)(DashboardView);
export { connectedNavBar as DashboardView };