import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import HAMBURGER_ICON from "./../../assets/icon_images/hamburger_list_menu.svg";
import INFO_ICON from "../../assets/icon_images/info icon.svg";
import STAR_ICON from "../../assets/icon_images/star.svg";
import STAR_ICON_WITH_YELLOW from "../../assets/icon_images/star_yellow.svg";
import PROFILE_ICON from "../../assets/images/profile.png";
import { SmeService } from "../../app/service/sme.service";
// import LOVE_BLACK_ICON from "../../assets/icon_images/candidate_heart_favorite_favorites_icon_black";
import LOVE_BLACK_ICON from "../../assets/icon_images/candidate_heart_favorite_favorites_icon_black.svg";
import LOVE_YELLOW_ICON from "../../assets/icon_images/candidate_heart_favorite_favorites_icon_yellow.svg";
import ReactTooltip from "react-tooltip";
import { toast } from "react-toastify";
import { AppLoader } from "../loader";
import { SliderComponent } from "./slider";

interface Props {
  jobId: string;
  onClose: () => void;
  // onSave: (data: any) => void;
  isbutton: boolean;
  // smeError: string;
}

export const Smes: React.FC<Props> = (props: Props) => {
  const [searchStr, setSearchStr] = useState("");
  const [loading, setLoading] = useState(false);
  const [allSmeList, setAllSmeList] = useState<any[] | []>([]);
  const [searchKey, setSearchkey] = useState("");
  const [canLoadMore, setCanLoadMore] = useState(false);
  const companyId = sessionStorage.getItem("company_uuid") || "";
  const [smeSearchInput, setSmeSearchInput] = useState("");
  const [isCheckedRow, setIsCheckedRow] = useState(false);
  const [smeError, setSmeError] = useState<any>("");
  const history = useHistory();

  const onSearch = (search: string) => { };
  const onClose = () => {
    props.onClose();
  };

  const [showAvailabilityNotifications, setShowAvailabilityNotifications] = useState(false);
  const notificationref = useRef<any>(null);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [allSmeList]);

  useEffect(() => {
    loadRecommendedSMES();
  }, []);

  const addFavorite = (smeUuid: any) => {
    setLoading(true);
    const data = {
      sme_uuid: smeUuid,
      company_uuid: companyId,
    };
    console.log("data", data);
    SmeService.smeBookMark(data).then((res) => {
      if (res.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        setLoading(false);
      }
    });
  };

  const onSearchSmeAll = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setSmeSearchInput(value);
    const smeNames = allSmeList.filter((el: any) => {
      return (
        el.user_firstname.toLowerCase().indexOf(value.toLocaleLowerCase()) > -1
      );
    });
    setAllSmeList(smeNames);
  };

  useEffect(() => {
    setAllSmeList([]);
  }, []);

  const loadRecommendedSMES = () => {
    setLoading(true);
    const data = {
      job_uuid: props.jobId,
      search_key: searchKey,
    };
    SmeService.recommendedSmes(data).then((res) => {
      if (res.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        // res.forEach((element: any) => {
        //   element.label = `${element?.name}`;
        //   element.value = element?.code;
        // });
        if (res?.smes) {
          SmeService.getUserFavSmes().then((favSmes) => {
            if (favSmes.error) {
              setLoading(false);
              toast.error(favSmes?.error?.message);
            } else {
              res?.smes?.forEach((element: any) => {
                const fav: any = favSmes.find(
                  (data: any) => data?.user_uuid === element.uuid
                );
                if (fav) {
                  element.isFav = true;
                } else {
                  element.isFav = false;
                }
              });
              setAllSmeList([...res.smes]);
            }
          });
        }
        setSearchkey(res.search_key);
        setCanLoadMore(res.can_load_more);
        setLoading(false);
      }
    });
  };

  const onSeeUserFav = (event: any) => {
    console.log("evet", event);
    setCanLoadMore(false);
    setLoading(true);
    SmeService.getUserFavSmes().then((res) => {
      if (event.target.checked) {
        if (res.error) {
          setLoading(false);
          toast.error(res?.error?.message);
        } else {
          res?.forEach((element: any) => {
            element.isFav = true;
            setAllSmeList([...res]);
            setLoading(false);
          });
        }
      } else {
        setAllSmeList([]);
        setLoading(false);
        setCanLoadMore(true);
        loadRecommendedSMES();
      }
    });
  };

  const onSearchText = (event: any) => {
    if (event.key === "Enter") {
    }
  };

  const onSearchTextEmpty = (event: any) => {
    setSearchStr(event.target.value);
  };

  const selectSmesList = (e: any, index: any) => {
    allSmeList[index].checked = e.target.checked;
    setAllSmeList([...allSmeList]);
    isChecked(allSmeList);
  };

  const isChecked = (smesListData: any) => {
    console.log("SmeList--------->", smesListData);
    const selectedData = smesListData.find((data: any) => {
      console.log("data", data);
      return !data.checked;
    });

    if (!selectedData) {
      setIsCheckedRow(true);
      // setIsDisabled(true)
    } else {
      setIsCheckedRow(false);
      // setIsDisabled(true)
    }
  };

  const onSelectAll = (event: any) => {
    allSmeList.map((data: any, index: number) => {
      {
        console.log("data", data);
      }
      data.checked = event.target.checked;
    });
    isChecked(allSmeList);
    setAllSmeList([...allSmeList]);
  };

  const submit = () => {
    // setLoading(true);
    const selectedSmes: any = [];
    allSmeList.forEach((element: any) => {
      if (element.checked) {
        selectedSmes.push(element.uuid);
      }
    });
    const data = {
      job_uuid: props.jobId,
      smes: selectedSmes,
    };
    setLoading(true);
    SmeService.scheduleInterviews(data).then((res) => {
      setLoading(false);
      if (!res.length) {
        setSmeError(
          "SME time slot not available"
        );
      } else {
        if (res.error) {
          setLoading(false);
          toast.error(res?.error?.message);
        } else if (res.message === "Server error") {
          setLoading(false);
          setSmeError(
            "SME time slot not available"
          );

        }
        else if (res.message.message === "Candidates not available to schedule interviews") {
          setLoading(false);
          setSmeError(
            "SME time slot not available"
          );

        }
        else if (res.message === "Job id is missing") {
          setLoading(false);
          setSmeError(
            "SME time slot not available"
          );
        } else {
          setLoading(false);
          toast.success("Successfully");
          history.push(
            `/dashboard/companies/info/${companyId}/jobs/info/${props.jobId}/interviews`
          );
        }
      }
    });
    setSmeError("");
  };

  const onShowAvailabilityNotification = () => {
    setShowAvailabilityNotifications(!showAvailabilityNotifications);

  }

  return (
    <>
      {loading && <AppLoader loading={loading}></AppLoader>}
      <ReactTooltip
        place="bottom"
        type="light"
        effect="solid"
        border={true}
        borderColor={"#707070"}
      />
      <div className="row mt-4">
        <div className="col-md-9 col-sm-12 mt-1 mb-2">
          <div className="input-group candidate_search_bar_border ms-3">
            <input
              type="text"
              className="form-control form_control_border py-md-2"
              placeholder="Search SME By Name"
              aria-label="Username"
              aria-describedby="basic-addon1"
              // onKeyPress={(e) => onSearchText(e)}
              // onInput={(e) => onSearchTextEmpty(e)}
              value={smeSearchInput}
              onChange={onSearchSmeAll}
            />
            <span
              className="input-group-text input_group_text"
              id="basic-addon1"
            >
              <i
                className="fa fa-search pointer"
                aria-hidden="true"
                onClick={() => onSearch(searchStr)}
              ></i>
            </span>
          </div>
        </div>
        {/* <div className="col-3 text-end mt-2 mb-2">
          <span className="ms-2">
            <img src={HAMBURGER_ICON} alt="menu-icon" />
          </span>
        </div> */}
      </div>
      <div className="d-flex  my-4">
        {allSmeList.length > 0 && (
          <div className="d-flex mx-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexCheckDefault"
              checked={isCheckedRow}
              onChange={(e) => onSelectAll(e)}
            />
            <label className="form-check-label text-black fs_14 ms-2">
              Select all
            </label>
            <span className="position-relative">
              <img
                src={INFO_ICON}
                alt="info icon"
                className="ms-2 sx-text-primary pointer   mb-1 mobile_info"
                onClick={() => onShowAvailabilityNotification()}
                onMouseLeave={() => setShowAvailabilityNotifications(false)}
                onMouseEnter={onShowAvailabilityNotification}
              />
            </span>
          </div>

        )}

        <div className="d-flex mx-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="flexCheckDefault"
          />
          <label className="form-check-label text-black fs_14 ms-2">
            Available Immediately{" "}
            <img
              src={INFO_ICON}
              alt="info icon"
              className="me-1 ms-1 mobile_info"
              data-tip="This will show only those SMEs who are readily available to interview in the availability slots of the candidates"
            />
          </label>
        </div>
        <div className="d-flex ms-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="flexCheckDefault"
            onClick={(e: any) => onSeeUserFav(e)}
          />
          <label className="form-check-label text-black fs_14 ms-2">
            My Favorities{" "}
            <img
              src={INFO_ICON}
              alt="info icon"
              className="me-1 ms-1 mobile_info"
              data-tip="This will show only the SMEs you have selected as your favourites"
            />
          </label>
        </div>

      </div>
      <div className="position-relative ms-md-5 ms-sm-0   " style={{ width: "70%" }} >
        {showAvailabilityNotifications && (
          <div
            onMouseEnter={() => setShowAvailabilityNotifications(true)}
            className="rounded-3 availability_modal px-3 opacity-none "
            style={{
              zIndex: 999, top: "-22px"
            }}
            ref={notificationref}
            onMouseLeave={() => setShowAvailabilityNotifications(false)}
          >
            <div className="row">
              <div className="col-md-12 fs_14 my-1 py-1   ">
                <p className="fs_14 mb-0">
                  Select All should show a number next to it. E.g. Select All (40). Here 40 is the total SMEs matched. But therre can be only 6 visible on the page. User needs to scroll down to see more and more SMEs being loaded
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mx-3">
        {allSmeList.length < 1 && !canLoadMore && (
          <p className="fs_14">SMEs not found</p>
        )}
      </div>
      <div className="row">
        <div className="col-md-9 col-sm-12">
          <div className="row">
            {allSmeList.map((data: any, index: any) => {
              return (
                <>
                  <div className="col-lg-4">
                    <div
                      className="p-3 ms-3 mb-3 mt-1 rounded-3"
                      style={{
                        // width: "307px",
                        minHeight: "146px",
                        backgroundColor: " #F5F5F5",
                      }}
                    >
                      <div className="row">
                        {/* <div className='text-end pe-3'></div> */}
                        <div className="col-5">
                          <input
                            className="form-check-input m-0"
                            type="checkbox"
                            id="flexCheckDefault"
                            checked={data?.checked}
                            onChange={(e) => selectSmesList(e, index)}
                          />
                          <img
                            className="fs_14  mt-2"
                            style={{
                              height: "82px",
                              width: "82px",
                              borderRadius: "50%",
                            }}
                            src={PROFILE_ICON}
                            alt=" "
                          />
                        </div>
                        <div className="col-7 ">
                          <div className="d-flex justify-content-between">
                            <div className="side_heading ">
                              {data.user_firstname} {data.user_lastname}
                            </div>
                            <div
                              className="position-relative  "
                              style={{ top: "-9px" }}
                            >
                              {data.isFav ? (
                                <img
                                  src={LOVE_YELLOW_ICON}
                                  className="pointer"
                                // onClick={() => addFavorite(data.uuid)}
                                />
                              ) : (
                                <img
                                  src={LOVE_BLACK_ICON}
                                  className="pointer"
                                  onClick={() => addFavorite(data.uuid)}
                                />
                              )}
                              {/* <img
                                src={LOVE_BLACK_ICON}
                                className="pointer"
                                onClick={() => addFavorite(data.uuid)}
                              /> */}
                            </div>
                          </div>
                          <div className="side_heading">
                            {data.sme_fee} Per Interview
                          </div>
                          <div className="me-2" style={{ fontSize: "15px" }}>
                            4.3
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
                              <img src={STAR_ICON_WITH_YELLOW} alt="" />
                            </span>
                            <span>
                              <img src={STAR_ICON} alt="" />
                            </span>
                          </div>
                          <div>
                            {data?.matchedSkills?.length > 0 ? (
                              data?.matchedSkills?.map(
                                (data: any, index: number) => {
                                  return (
                                    <>
                                      {" "}
                                      {index < 2 && (
                                        <span
                                          className="sx-bg-color text-black  py-1 px-2 d-inline-block"
                                          key={index}
                                          style={{
                                            fontSize: "8px",
                                            borderRadius: "10px",
                                          }}
                                        >
                                          {data?.skill}
                                        </span>
                                      )}
                                    </>
                                  );
                                }
                              )
                            ) : (
                              <span
                                className="top_para_styles"
                                style={{ fontSize: "8px" }}
                              >
                                No skills
                              </span>
                            )}
                            {data?.matchedSkills?.length > 2 ? (
                              <span
                                className="ms-2 d-inline-block"
                                style={{ fontSize: "8px" }}
                              >
                                +3 More
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
          <div className="text-center">
        {canLoadMore && (
          <button
            className="large_btn rounded ms-3 my-2"
            onClick={loadRecommendedSMES}
          >
            Load More
          </button>
        )}
      </div>
        </div>
        <div className="col-md-3 col-sm-12">
          <div className="mx-4 mt-4 mt-lg-0">
          <SliderComponent />
          </div>
         
        </div>
      </div>
     
      {props.isbutton === false && (
        <div
          className={`row position-absolute px-3 px-lg-5 bottom-30 bottom-sm-20`}
          style={{ width: "100%", left: 0 }}
        >
          <div className="col-md-6 col-6  mt-5 mt-lg-0 mt-sm-4">
            <button
              className="btn-signup rounded ms-3"
              type="button"
              onClick={onClose}
            >
              Previous
            </button>
          </div>
          <div className="col-md-6 col-6 text-end mt-5 mt-lg-0 mt-sm-4 pe-2">
            <button
              className="large_btn_apply rounded me-4"
              type="button"
              onClick={submit}
            >
              Schedule
            </button>
            {smeError && (
              <p className="text-danger top_para_styles">{smeError}</p>
            )}
          </div>
        </div>
      )}

      {props.isbutton === true && (
        <div className=" col-12 text-end mt-5 mt-lg-0 mt-sm-4 pe-2">
          <button
            className="large_btn_apply rounded me-4"
            type="button"
            onClick={submit}
          >
            Schedule
          </button>
          {smeError && (
            <p className="text-danger top_para_styles">{smeError}</p>
          )}
        </div>
      )}
    </>
  );
};
