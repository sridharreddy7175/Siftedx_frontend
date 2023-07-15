import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CompanyService } from "../../../app/service/company.service";
import { cardExpValidations } from "../../../app/utility/form-validations";
import { DataTable } from "../../../components/billing/data-table";
import { AppLoader } from "../../../components/loader";
import { BillingDataGridCols } from "./data-grid-cols";
import Tabs from "../../../components/tabs";
import { PaymentService } from "../../../app/service/payment.service";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { stripePK } from '../../../config/constant';
import { StripePayment } from './stripe-payment';
import DELETE_ICON from "../../../assets/icon_images/delete.svg";
const stripePromise = loadStripe(stripePK);

export const Billing = () => {
  const [billingDataList, setBillingDataList] = useState<any>([]);
  const companyUuid = sessionStorage.getItem("company_uuid") || "";
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any>([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [accountName, setAccountName] = useState<any>("");
  const [accountNumber, setAccountNumber] = useState<any>("");
  const [expiryMonthYear, setExpiryMonthYear] = useState<any>("");
  const [cardType, setCardType] = useState<any>("");
  const [accountNameError, setAccountNameError] = useState<any>("");
  const [accountNumberError, setAccountNumberError] = useState<any>("");
  const [expiryMonthYearError, setExpiryMonthYearError] = useState<any>("");
  const [accountAccountCardError, setAccountCardError] = useState<any>("");
  const [selectedBillingData, setSelectedBillingData] = useState<any>({});
  const [isAddPayment, setIsAddPayment] = useState<any>(false);
  const [removeModalShow, setRemoveModalShow] = React.useState(false);
  const [activePage, setActivePage] = React.useState(0);
  const [viewShow, setviewShow] = React.useState(false);
  const [addCard, setAddCard] = React.useState(false);
  const [stripeOptions, setStripeOptions] = useState<{ clientSecret: string }>({ clientSecret: '' });
  const [opentStripeAdd, setOpentStripeAdd] = useState(false);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<any>([]);
  const planType = sessionStorage.getItem('companyData') || '';
  const dataPlanType = JSON.parse(planType).plan_type
  const tabs = [
    {
      label: "Plan & payment methods",
      path: 0,
    },
    {
      label: "Payment History",
      path: 1,
    },
  ];

  useEffect(() => {
    getPaymentMethod();
    getPaymentMethods();
  }, []);

  const getPaymentMethod = () => {
    setLoading(true);
    CompanyService.getCompanyPaymentMethod(companyUuid).then((res) => {
      if (res?.error) {
        setLoading(false);
        toast.error(res?.error?.message);
      } else {
        setLoading(false);
        res.forEach((element: any) => {
          element.cardLastFourChar = element?.account_number.substr(
            element?.account_number.length - 4
          );
        });
        setPaymentMethods([...res]);
      }
    });
  };

  const getPaymentMethods = async () => {
    const paymentMethods = await PaymentService.getPaymentMethods();
    setAvailablePaymentMethods(paymentMethods);
    console.log('paymentMethods ', paymentMethods);

  }
  const onSelectPaymentMethod = (data: any) => {
    setIsAddPayment(false);
    setSelectedBillingData(data);
    setAccountNameError("");
    setAccountNumberError("");
    setExpiryMonthYearError("");
    setAccountCardError("");
    setModalShow(true);
  };

  const onAddPayment = () => {
    setIsAddPayment(true);
    setModalShow(true);
  };

  const addNewCard = async () => {
    // setAddCard(true)
    const paymentMethod = await PaymentService.registerPaymentMethod();
    console.log('paymentMethod ', paymentMethod);
    setStripeOptions({ clientSecret: paymentMethod.payment_method_ref });
    setOpentStripeAdd(true);
  }
  const showDeletePopup = (data: any) => {
    setRemoveModalShow(true);
    setSelectedBillingData(data);
  };

  const onDeletePaymentMethod = () => {
    setLoading(true);
    CompanyService.deleteCompanyPaymentMethod(selectedBillingData?.uuid).then(
      (res: any) => {
        if (res?.error) {
          setLoading(false);
          toast.error(res?.error?.message);
        } else {
          toast.success("Deleted succssfully");
          setLoading(false);
          setRemoveModalShow(false);
          getPaymentMethod();
        }
      }
    );
  };

  const onSavePaymentMethod = () => {
    setLoading(true);
    const paymentData: any = {
      company_uuid: companyUuid,
      account_name: accountName
        ? accountName
        : selectedBillingData?.account_name,
      account_number: accountNumber
        ? accountNumber
        : selectedBillingData?.account_number,
      payment_type: "credit_card",
      expiry_month_year: expiryMonthYear
        ? expiryMonthYear
        : selectedBillingData?.expiry_month_year,
      account_type: cardType
        ? Number(cardType)
        : selectedBillingData?.account_type,
    };
    if (
      paymentData?.account_name &&
      paymentData?.account_number &&
      paymentData?.expiry_month_year
    ) {
      if (isAddPayment) {
        CompanyService.creatreCompanyPaymentMethod(paymentData).then(
          (res: any) => {
            if (res?.error) {
              setLoading(false);
              toast.error(res?.error?.message);
            } else {
              toast.success("Saved succssfully");
              setLoading(false);
              setModalShow(false);
              getPaymentMethod();
            }
          }
        );
      } else {
        CompanyService.updateCompanyPaymentMethod(
          selectedBillingData?.uuid,
          paymentData
        ).then((res: any) => {
          if (res?.error) {
            setLoading(false);
            toast.error(res?.error?.message);
          } else {
            toast.success("Saved succssfully");
            setLoading(false);
            setModalShow(false);
            getPaymentMethod();
          }
        });
      }
    } else {
      setLoading(false);
      if (!paymentData?.account_name) {
        setAccountNameError("Please enter card holder name");
      }
      if (!paymentData?.account_number) {
        setAccountNumberError("Please enter card number");
      }
      if (!paymentData?.expiry_month_year) {
        setExpiryMonthYearError("Please select expiry month year");
      }
      // if (!accountCvc) {
      //     setAccountCvcError('Please enter CVC');
      // }
    }
  };

  const onChangeCardName = (e: any) => {
    setAccountName(e.target.value);
  };

  const onChangeCardNumber = (e: any) => {
    setAccountNumber(e.target.value);
  };

  const onChangeCardExpiry = (e: any) => {
    setExpiryMonthYearError(cardExpValidations(e.target.value, "expiry date"));
    setExpiryMonthYear(e.target.value);
  };

  const onChangeCardType = (e: any) => {
    setCardType("");
    if (e.target.value) {
      setCardType(e.target.value);
      const data: any = selectedBillingData;
      data.account_type = e.target.value;
      setSelectedBillingData({ ...data });
    } else {
      setAccountCardError("Please select card type");
    }
  };

  const viewPlansShow = () => {
    setviewShow(true);
  };
  const downGradePlans = () => {
    setLoading(true);
    CompanyService.getPayCheckoutsession().then((res) => {
      if (res.error) {
        setLoading(false);
      } else {
        window.open(res.CheckoutUrl, "_self");
        setLoading(false);
      }
    });
  };

  const handleClick = () => {
    window.open("sridharreddypalle1@gmail.com");
  };
  const onSelectTab = (type: number) => {
    setActivePage(type);
    if (type === 0) {
      //   getInterviews(1, "");
    } else if (type === 1) {
      //   getSmeJobs();
    }
  };
  const handleDelete = async (element:any) => {
    console.log('element ', element);
    try {
      await PaymentService.deletePaymentMethod(element.id);
      getPaymentMethods();
    } catch (error) {
    }
  }

  return (
    <>
      {loading && <AppLoader loading={loading}></AppLoader>}
      {/* <div className='billing_page'> */}

      <div className="container-fluid">
        <div className="row ">
          <div className="col-12">
            <div className="ms-3 mt-5 px-4">
              <h5 className="top_heading_styles">Billing </h5>
              <p className="top_para_styles">
                Manage your subscription plan, payment methods and billing
              </p>
            </div>
          </div>
        </div>
        <div className="ms-4 ps-lg-3 ps-0 mt-2">
          <ul className="nav">
            {tabs.map((data: any, index: number) => {
              return (
                <li
                  key={index}
                  className={`nav-item tab ${data?.path === activePage ? "active" : ""
                    }`}
                  style={{ fontSize: "14px" }}
                >
                  <span
                    className="nav-link text-white all_members_nav_link_font_size nav-hover pointer"
                    onClick={() => onSelectTab(data?.path)}
                  >
                    {data?.label} {data?.count ? data?.count : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="row px-4">
          {activePage === 0 && (
            <div className="col-12">
              <div className="bg-white rounded-3" style={{ minHeight: "500px" }}>
                <div className="px-4 py-4">
                  <div className="row">
                    <div className="col-12 col-lg-5 border-end">
                      <div className="row">
                        <div className="col-12 col-lg-9">
                          <div className="side_heading mt-2" role="alert">
                            Current Plan Details
                          </div>
                          {dataPlanType === 1 &&
                            <div>
                              <div className="mt-4 side_heading ">
                                SiftedX Individual Plan{" "}
                              </div>
                              <p className="top_para_styles mt-3">
                                Click here to upgrade to a corporate plan for
                                a seamless and efficient management of job requisitions within your team and hiring managers
                              </p>
                              <div className="d-flex justify-content-between mt-4">
                                <div
                                  className="side_heading sm-text-start pointer mt-1"
                                  style={{ color: "#F5BE17" }}
                                  onClick={() => viewPlansShow()}
                                >
                                  View Plans
                                </div>
                                <div className="text-end ">
                                  <button
                                    className="large_btn_apply rounded-3 "
                                    onClick={() => downGradePlans()}
                                  >
                                    Upgrade to Corporate Plan
                                  </button>
                                </div>
                              </div>
                            </div>

                          }

                          {dataPlanType !== 1 &&

                            <div>
                              <div className="mt-4 side_heading ">
                                SiftedX Corporate  Plan{" "}
                              </div>
                              <p className="top_para_styles mt-3">
                                Click here to downgrade to an individual plan which does not
                                support team management and hiring managers
                              </p>
                              <div className="d-flex justify-content-between mt-4">
                                <div
                                  className="side_heading sm-text-start pointer mt-1"
                                  style={{ color: "#F5BE17" }}
                                  onClick={() => viewPlansShow()}
                                >
                                  View Plans
                                </div>
                                <div className="text-end ">
                                  <button
                                    className="large_btn_apply rounded-3 "
                                    onClick={() => downGradePlans()}
                                  >
                                    Downgrade to Individual Plan
                                  </button>
                                </div>
                              </div>
                            </div>

                          }






                          <div className="mt-5">
                            <p className="side_heading m-0 p-0">Got questions?</p>
                            <div className="d-flex justify-content-between mt-2">
                              <ul className="list-inline mb-0">
                                <li className="side_heading ">Priority Email Support</li>
                                <li className="top_para_styles mb-0">
                                  Contact us via
                                  <a
                                    href="mailto:support@siftedx.com"
                                    style={{ color: " #F5BE17", cursor: "pointer" }}
                                  >
                                    {" "}
                                    email{" "}
                                  </a>{" "}
                                  and we will respond within 1 working day
                                </li>
                              </ul>
                            </div>
                          </div>



                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-lg-7">
                      <div className="ms-lg-4 ms-1 mt-5 mt-lg-2">
                        <div className="d-flex justify-content-between">
                          <p className="side_heading m-0 p-0">Payment Method</p>
                          <button className="large_btn_apply" onClick={addNewCard}> Add New Card</button>
                        </div>
                      </div>
                      <div>
                        <ul>
                          {
                            availablePaymentMethods.map((el: any) => {
                              return (
                                <li>
                                  {el.id}
                                  <img
                                    src={DELETE_ICON}
                                    alt="Delete"
                                    className="pointer me-1"
                                    onClick={() => handleDelete(el)}
                                  />
                                </li>
                              )
                            })
                          }
                        </ul>
                      </div>
                      {opentStripeAdd && <Elements stripe={stripePromise} options={stripeOptions}>
                        <StripePayment></StripePayment>
                      </Elements>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="row px-4">
          {activePage === 1 && (
            <div className='col-12'>
              <div className='bg-white rounded-3' style={{ minHeight: "500px" }}>
                <div className='px-3 px-lg-4 py-3'>
                  <div className='row'>
                    <div className='col-12'>

                      <div className="mt-3 billing_data_main_div">
                        <DataTable
                          TableCols={BillingDataGridCols}
                          tableData={billingDataList}
                        ></DataTable>
                      </div>
                    </div>


                  </div>

                </div>

              </div>

            </div>


          )}
        </div>


        {/* <div className="row px-4">
          <div className="col-md-4">
            <div className="bg-white rounded-3 p-3">
              <div className="row">
                <div className="side_heading" role="alert">
                  Current Plan Details
                </div>
              </div>
              <div className="row mt-3 me-3">
                <div className="col-md-6 side_heading ">
                  SiftedX Corporate Plan{" "}
                </div>
                <div className="text-end col-md-6 fs_14">$1900/month</div>
              </div>
              <div className="mt-3 fs_14">Your next billing date is</div>
              <div className="top_para_styles  mb-md-0 ">
                Click here to downgrade to an individual plan which does not
                support team management and hiring managers
              </div>
              <div className="d-flex justify-content-between mt-2">
                <div
                  className="side_heading sm-text-start pointer"
                  style={{ color: "#F5BE17" }}
                  onClick={() => viewPlansShow()}
                >
                  View Plans
                </div>
                <div className="text-end ">
                  <button
                    className="large_btn_apply rounded-3 "
                    onClick={() => downGradePlans()}
                  >
                    Downgrade to Individual Plan
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 ">
                <div className="bg-white rounded-3 p-3 mt-3">
                  <div className="row">
                    <p className="side_heading m-0 p-0">Payment Method</p>
                  </div>
                  {paymentMethods.map((data: any, index: number) => (
                    <div className="d-flex justify-content-between mt-2">
                      <ul className="list-inline d-md-flex ending_left_side">
                        <li className="">
                          <ul className="list-inline">
                            <li className="top_para_styles">
                              ending in {data?.cardLastFourChar}
                            </li>
                            <li className="top_para_styles">
                              Your card details are securely saved (without CVV)
                              for future transactions.
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <div className="text-end">
                        <button
                          className="large_btn_apply rounded-3 me-3"
                          onClick={() => onSelectPaymentMethod(data)}
                        >
                          Update Payment Method
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="text-md-end text-sm-start">
                    <button
                      className="large_btn_apply rounded-3 mt-3"
                      onClick={() => onAddPayment()}
                    >
                      Add Payment Method
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="bg-white rounded-3 p-3 my-3 mt-3">
                  <div className="row">
                    <p className="side_heading m-0 p-0">Got questions?</p>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <ul className="list-inline mb-0">
                      <li className="side_heading ">Priority Email Support</li>
                      <li className="top_para_styles mb-0">
                        Contact us via
                        <a
                          href="mailto:support@siftedx.com"
                          style={{ color: " #F5BE17", cursor: "pointer" }}
                        >
                          {" "}
                          email{" "}
                        </a>{" "}
                        and we will respond within 1 working day
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-8 ps-md-2">
            <div className="bg-white rounded-3 ms-md-4 pt-3 pb-4 ps-2 pe-4">
              <div className="ms-1">
                <p className="side_heading m-0 p-0">Billing History</p>
              </div>
              <div className="mt-3 billing_data_main_div">
                <DataTable
                  TableCols={BillingDataGridCols}
                  tableData={billingDataList}
                ></DataTable>
              </div>
            </div>
          </div>
        </div> */}
        {/* <div className="col-12">
                            <div className="your_current_plan_section">
                                <div className='row'>
                                   
                                    <div className="side_heading" role="alert">
                                        Your Current Plan
                                    </div>
                                </div>
                                <h5>
                                    <div className='row mt-2'>
                                        <div className='col-md-6 account-setting_sub_heading_styles'>Individual plan</div>
                                        <div className='text-end col-md-6 account-setting_sub_heading_styles'>USD 99.user/month<sup>*</sup></div>
                                    </div>
                                </h5>
                                <ul>
                                    <li className="top_para_styles">Suitable for recruiters using the platform as individuals, as opposed to company users and team.</li>
                                    <li className="top_para_styles">Simple pay for interview model enables you to start using the platform right away.</li>
                                    <li className="top_para_styles">Platform usage is free of charge. Premium features like not available.</li>
                                    <li className="top_para_styles">Create Job Requisition with skills and experience required</li>
                                    <li className="top_para_styles">Choose from the list of matching  SMEs or let SiftedX auto-match</li>
                                    <li className="top_para_styles">Monitor the progress of interviews being scheduled and conducted</li>
                                    <li className="top_para_styles">Receive deatiled evaluation report and video of the interview along with a 2min audio summary by the SME</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="corporate_plan_section mt-4">
                                <h5>
                                    <div className='row'>
                                        <div className='col-md-6 account-setting_sub_heading_styles'>Corporate plan</div>
                                        <div className='text-end col-md-6 account-setting_sub_heading_styles'>USD 500.user/month<sup>*</sup></div>
                                    </div>
                                </h5>
                                <ul>
                                    <li className="corporate_list_style"></li>
                                    <li className="corporate_list_style"></li>
                                </ul>
                                <ul>
                                    <li className="top_para_styles">Suitable for recruitment teams of all sizes.</li>
                                    <li className="top_para_styles">Below premium features are available on top of everything that individual account providers.</li>
                                    <li className="top_para_styles">Add team members for seamless allocation of jobs</li>
                                    <li className="top_para_styles">Ability to tag hiring managers in the jobs, who can monitor the progress</li>
                                    <li className="top_para_styles">Mark your favourite SMEs for easy selection and share them with your team</li>
                                    <li className="top_para_styles">Company admin user for effective management of roles and access rights</li>
                                    <li className="top_para_styles">Interview videos are available  upto 1year</li>
                                    <li className="top_para_styles">Access the SiftedX APIs to integrate with your existing Application Tracking and other HR systems</li>
                                    <li className="top_para_styles">USD 500/user/month with minimum 3 users</li>
                                </ul>
                                <button className="large_btn_apply rounded-3">Switch to this plan</button>
                            </div>
                        </div>
                    </div>
                    

                    <div className='row'>
                        <div className='col-12'>
                            <div className='current_plan_details_box rounded-3 pb-3' style={{ marginTop: "25px" }}>
                                <div className=''>
                                    <p className='current_plan_details_first_line m-0 p-0'>Payment Method</p>
                                </div>
                                {
                                    paymentMethods.map((data: any, index: number) => (
                                        <div className='d-flex justify-content-between mt-2'>
                                            <ul className='list-inline d-md-flex ending_left_side'>
                                              
                                                <li className=''>
                                                    <ul className='list-inline'>
                                                        <li className='payment_method_second_line'>ending in {data?.cardLastFourChar}</li>
                                                        <li className='payment_method_thired_line'>Your card details are securely saved (without CVV) for future transactions.</li>
                                                    </ul>
                                                </li>
                                            </ul>
                                            <p className='my-auto'>
                                                <button className='large_btn_apply rounded-3 me-3' onClick={() => onSelectPaymentMethod(data)}>Update Payment Method</button>
                                                <i className="bi bi-trash-fill btn btn-danger cursor-pointer py-1" onClick={() => showDeletePopup(data)}></i>
                                            </p>
                                        </div>
                                    ))
                                }
                                <button className='large_btn_apply rounded-3 mb-3 mt-3' onClick={() => onAddPayment()}>Add Payment Method</button>

                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-12'>
                            <div className='current_plan_details_box rounded-3 pb-4' style={{ marginTop: "25px" }}>
                                <div className=''>
                                    <p className='current_plan_details_first_line m-0 p-0'>Billing History</p>
                                </div>
                                <div className='mt-2 billing_data_main_div'>
                                    <DataTable TableCols={BillingDataGridCols} tableData={billingDataList}></DataTable>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-12'>
                            <div className='border_color current_plan_details_box rounded-3' style={{ marginTop: "25px" }}>
                                <div className=''>
                                    <p className='current_plan_details_first_line m-0 p-0'>Got questions?</p>
                                </div>
                                <div className='d-flex justify-content-between mt-2'>
                                    <ul className='list-inline priority_left_side'>
                                        <li className='payment_method_second_line'>Priority Email Support</li>
                                        <li className='payment_method_thired_line'>Contact us via email and we will respond within 1 working day</li>
                                    </ul>
                                    <p className='my-auto'>
                                        <button className='large_btn_apply rounded-3'>Send an email</button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div> */}
      </div>
      {/* </div> */}

      <Modal
        show={addCard}
        onHide={() => setAddCard(false)}
        aria-labelledby="contained-modal-title-vcenter"
        className="sx-close w-100"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <div className="invite_team_heading my-1 ms-2">
              Add Card
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-8 px-2">
              <div className="mb-4">
                <label className="input">
                  <input
                    className="form-control job_dis_form_control rounded manual_profile_padding input__field"
                    placeholder=" "
                    type="text"
                    name="account_number"
                    defaultValue={selectedBillingData?.account_number}
                    onChange={(e) => onChangeCardNumber(e)}
                  />
                  <span className={`input__label`}>Card Number</span>
                </label>
                {accountNameError && (
                  <p className="text-danger job_dis_form_label">
                    {accountNameError}
                  </p>
                )}
              </div>
            </div>
            <div className="col-4 px-2">
              <div className="mb-4">
                <label className="input">
                  <input
                    className="form-control job_dis_form_control rounded manual_profile_padding input__field"
                    placeholder=" "
                    type="text"
                    name="expiry_month_year"
                    defaultValue={selectedBillingData?.expiry_month_year}
                    onChange={(e) => onChangeCardExpiry(e)}
                  />
                  <span className={`input__label`}>Expiry Date</span>
                </label>
                {expiryMonthYearError && (
                  <p className="text-danger job_dis_form_label">
                    {expiryMonthYearError}
                  </p>
                )}
              </div>
            </div>

            <div className="col-8 px-2">
              <div className="mb-3">
                <label className="input">
                  <input
                    className="form-control job_dis_form_control rounded manual_profile_padding input__field"
                    placeholder=" "
                    type="text"
                    name="account_name"
                    defaultValue={selectedBillingData?.account_name}
                    onChange={(e) => onChangeCardName(e)}
                  />
                  <span className={`input__label`}>Card Holder Name</span>
                </label>

                {accountNumberError && (
                  <p className="text-danger job_dis_form_label">
                    {accountNumberError}
                  </p>
                )}
              </div>
            </div>
            {/* <div className="col-md-12 px-2">
              <div className="mb-4">
                <label className="input">
                  <select
                    className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field"
                    value={selectedBillingData?.account_type}
                    onChange={(e) => onChangeCardType(e)}
                  >
                    <option value="" selected>
                      Select Card Type
                    </option>
                    <option value="1">AMERICAN EXPRESS</option>
                    <option value="2">MasterCard</option>
                    <option value="3">VISA</option>
                    <option value="4">VISA Electron</option>
                    <option value="5">Maestro</option>
                    <option value="6">SOLO</option>
                  </select>
                  <span className={`input__label`}>Card Type</span>
                </label>
                {accountAccountCardError && (
                  <p className="text-danger job_dis_form_label">
                    {accountAccountCardError}
                  </p>
                )}
              </div>
            </div> */}

            <div className="col-4 px-2">
              <div className="mb-3">

                <label className="input">
                  <input
                    className="form-control job_dis_form_control rounded manual_profile_padding input__field"
                    placeholder=" "
                    type="text"
                    name="cvc"
                    // defaultValue={selectedBillingData?.account_name}
                    onChange={(e) => onChangeCardName(e)}
                  />
                  <span className={`input__label`}>CVC</span>
                </label>
                {/* <label className="form-label job_dis_form_label mb-0">CVC</label>
                                <input className="form-control job_dis_form_control" placeholder="CVC" type="text" name="cvc"
                                 onChange={(e) => onChangeCardCvc(e)} 
                                 />
                                {accountCvcError && <p className="text-danger job_dis_form_label">{accountCvcError}</p>} */}
              </div>
            </div>
          </div>

          <div className="ps-2 my-1">
            <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
            <label className="form-check-label text-black ps-2" style={{ fontSize: "13px" }}>
              Make Primary
            </label>

          </div>
          <div className="ps-2 mb-4">
            <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
            <label className="form-check-label text-black ps-2" style={{ fontSize: "13px" }}>
              Billing address same as contact address
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="row pb-3 ps-3">
            <div className="col-6 ps-1">
              <button
                className="large_btn_filter px-3 px-lg-2 rounded"
                onClick={() => setAddCard(false)}
              >
                Cancel
              </button>
            </div>
            <div className="col-6 text-end pe-1">
              <button
                className="large_btn_apply rounded me-3"
                onClick={() => onSavePaymentMethod()}
              >
                Confirm
              </button>
            </div>
          </div>
          {/* <div className='text-center pb-3'>
                        <button className='large_btn_apply rounded me-3' onClick={() => onSavePaymentMethod()}>Save</button>
                        <button className='large_btn_filter px-3 rounded' onClick={() => setModalShow(false)}>Close</button>
                    </div> */}
        </Modal.Footer>
      </Modal>











      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        className="sx-close w-100"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <div className="invite_team_heading my-1 ms-2">
              Update Payment Method
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 px-2">
              <div className="mb-4">
                {/* <label className="form-label job_dis_form_label mb-0">Card Holder Name</label>
                                <input className="form-control job_dis_form_control" placeholder="Card Holder Name" type="text" name="account_name" defaultValue={selectedBillingData?.account_name} onChange={(e) => onChangeCardName(e)} /> */}
                <label className="input">
                  <input
                    className="form-control job_dis_form_control rounded manual_profile_padding input__field"
                    placeholder=" "
                    type="text"
                    name="account_name"
                    defaultValue={selectedBillingData?.account_name}
                    onChange={(e) => onChangeCardName(e)}
                  />
                  <span className={`input__label`}>Card Holder Name</span>
                </label>
                {accountNameError && (
                  <p className="text-danger job_dis_form_label">
                    {accountNameError}
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-12 px-2">
              <div className="mb-4">
                {/* <label className="form-label job_dis_form_label mb-0">Card Number</label>
                                <input className="form-control job_dis_form_control" placeholder="Card Number" type="text" name="account_number" defaultValue={selectedBillingData?.account_number} onChange={(e) => onChangeCardNumber(e)} /> */}
                <label className="input">
                  <input
                    className="form-control job_dis_form_control rounded manual_profile_padding input__field"
                    placeholder=" "
                    type="text"
                    name="account_number"
                    defaultValue={selectedBillingData?.account_number}
                    onChange={(e) => onChangeCardNumber(e)}
                  />
                  <span className={`input__label`}>Card Number</span>
                </label>
                {accountNumberError && (
                  <p className="text-danger job_dis_form_label">
                    {accountNumberError}
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-12 px-2">
              <div className="mb-4">
                {/* <label className="form-label job_dis_form_label mb-0">Card Type</label>
                                <select className="form-select job_dis_form_control" value={selectedBillingData?.account_type} onChange={(e) => onChangeCardType(e)}>
                                    <option value="" selected>Select Card Type</option>
                                    <option value="1">AMERICAN EXPRESS</option>
                                    <option value="2">MasterCard</option>
                                    <option value="3">VISA</option>
                                    <option value="4">VISA Electron</option>
                                    <option value="5">Maestro</option>
                                    <option value="6">SOLO</option>
                                </select> */}
                <label className="input">
                  <select
                    className="form-control job_dis_form_control px-3 rounded manual_profile_padding input__field"
                    value={selectedBillingData?.account_type}
                    onChange={(e) => onChangeCardType(e)}
                  >
                    <option value="" selected>
                      Select Card Type
                    </option>
                    <option value="1">AMERICAN EXPRESS</option>
                    <option value="2">MasterCard</option>
                    <option value="3">VISA</option>
                    <option value="4">VISA Electron</option>
                    <option value="5">Maestro</option>
                    <option value="6">SOLO</option>
                  </select>
                  <span className={`input__label`}>Card Type</span>
                </label>
                {accountAccountCardError && (
                  <p className="text-danger job_dis_form_label">
                    {accountAccountCardError}
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-12 px-2">
              <div className="mb-4">
                {/* <label className="form-label job_dis_form_label mb-0">Expiry Date</label>
                                <input className="form-control job_dis_form_control" placeholder="Expiry Date" type="text" name="expiry_month_year" defaultValue={selectedBillingData?.expiry_month_year} onChange={(e) => onChangeCardExpiry(e)} /> */}
                <label className="input">
                  <input
                    className="form-control job_dis_form_control rounded manual_profile_padding input__field"
                    placeholder=" "
                    type="text"
                    name="expiry_month_year"
                    defaultValue={selectedBillingData?.expiry_month_year}
                    onChange={(e) => onChangeCardExpiry(e)}
                  />
                  <span className={`input__label`}>Expiry Date</span>
                </label>
                {expiryMonthYearError && (
                  <p className="text-danger job_dis_form_label">
                    {expiryMonthYearError}
                  </p>
                )}
              </div>
            </div>
            {/* <div className="col-md-6 px-2">
                            <div className="mb-4">
                                <label className="form-label job_dis_form_label mb-0">CVC</label>
                                <input className="form-control job_dis_form_control" placeholder="CVC" type="text" name="cvc" onChange={(e) => onChangeCardCvc(e)} />
                                {accountCvcError && <p className="text-danger job_dis_form_label">{accountCvcError}</p>}
                            </div>
                        </div> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="row pb-3 ps-3">
            <div className="col-6 ps-1">
              <button
                className="large_btn_filter px-3 rounded"
                onClick={() => setModalShow(false)}
              >
                Close
              </button>
            </div>
            <div className="col-6 text-end pe-1">
              <button
                className="large_btn_apply rounded me-3"
                onClick={() => onSavePaymentMethod()}
              >
                Save
              </button>
            </div>
          </div>
          {/* <div className='text-center pb-3'>
                        <button className='large_btn_apply rounded me-3' onClick={() => onSavePaymentMethod()}>Save</button>
                        <button className='large_btn_filter px-3 rounded' onClick={() => setModalShow(false)}>Close</button>
                    </div> */}
        </Modal.Footer>
      </Modal>

      <Modal
        show={removeModalShow}
        onHide={() => setRemoveModalShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <div className="invite_team_heading">
              The following users will be admin to the team
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="border rounded-3">
            <div className="border-bottom py-3">
              <ul className="list-inline d-flex my-auto">
                <li className="my-auto">
                  <ul className="list-inline">
                    <li style={{ fontSize: "14px" }}>
                      ending in {selectedBillingData?.cardLastFourChar}
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-end pb-3">
            <button
              className="large_btn rounded me-3"
              onClick={() => setRemoveModalShow(false)}
            >
              Cancel
            </button>
            <button
              className="large_btn rounded"
              onClick={onDeletePaymentMethod}
            >
              Delete
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={viewShow}
        onHide={() => setviewShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="content-size-xl sx-close"
      >
        <Modal.Header closeButton>
          {/* <Modal.Title id="contained-modal-title-vcenter">
                        <div className='invite_team_heading my-1 ms-2'>Update Payment Method</div>
                    </Modal.Title> */}
        </Modal.Header>

        <Modal.Body>
          <div className="py-4 px-md-5 mx-md-5 mx-sm-3">
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div
                  className="p-4 border me-md-3 me-sm-0 shadow bg-white mb-3 mb-md-0"
                  style={{ borderRadius: "30px" }}
                >
                  <div className="top_heading_styles">Individual Plan</div>
                  <div className="top_heading_styles mb-1">Free</div>
                  <div className="" style={{ fontSize: "15px" }}>
                    <div className="border-bottom  py-2">
                      Suitable for recruiters using the platform as individuals,
                      as opposed to company users and team.
                    </div>
                    <div className="border-bottom   py-2">
                      Simple pay for interview modal enables you to start using
                      the platform right away.
                    </div>
                    <div className="border-bottom   py-2">
                      Platform usage is free of charge. Premium features like
                      not available.
                    </div>
                    <div className="border-bottom   py-2">
                      Create Job Requisition with skills and experience required
                    </div>
                    <div className="border-bottom  py-2">
                      {" "}
                      Choose from the list of matching SMEs or SiftedX
                      auto-match{" "}
                    </div>
                    <div className="border-bottom  py-2">
                      Monitor the progress of interviews being scheduled and
                      conducted
                    </div>
                    <div className=" pb-3 mb-3 pt-2">
                      Receive detailed evaluation report and video of the
                      interview along with a 2min audio summary by the SME
                    </div>
                  </div>
                  {/* <div className="mt-4 pt-4">
                    <button
                      className="large_btn_apply px-3 py-1"
                      style={{ backgroundColor: " #F5BE17", fontSize: "16px" }}
                    >
                      Change Plan
                    </button>
                  </div> */}
                </div>
              </div>
              <div className="col-md-6 col-sm-12 ">
                <div className="p-4 shadow corporate_plan ms-md-3 ms-sm-0">
                  <div className="top_heading_styles">Corporate Plan</div>
                  <div className="top_heading_styles mb-1">
                    $500.user <span className="ms-2 fs_12">Per Month *</span>
                  </div>
                  <div className="" style={{ fontSize: "15px" }}>
                    <div className="corporate_bottom py-2">
                      Suitable for recruiter team of all sizes.Below premium
                      features are available on top of everything that
                      individual account providers.
                    </div>
                    <div className="corporate_bottom py-2">
                      Add team members for seamless allocation of jobs
                    </div>
                    <div className="corporate_bottom py-2">
                      Ability to tag hiring managers in the jobs, who can
                      monitor the progress
                    </div>
                    <div className="corporate_bottom py-2">
                      Mark your favorite SMEs for easy selection and share them
                      with your team
                    </div>
                    <div className="corporate_bottom py-2">
                      Company admin user for effective management of roles and
                      access rights
                    </div>
                    <div className="corporate_bottom  py-2">
                      Interview videos are available up to 1 year Access the
                      SiftedX APIs to integrate with your existing Application
                      Tracking and other HR systems
                    </div>
                    <div className=" py-2">
                      USD 500/user/month with minimum 3 users
                    </div>
                  </div>
                  {/* <div className="mt-3">
                    <button
                      className="px-3 py-1 rounded-3"
                      style={{
                        backgroundColor: " #000000 ",
                        color: "#FFFFFF",
                        fontSize: "16px",
                      }}
                    >
                      Change Plan
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};
