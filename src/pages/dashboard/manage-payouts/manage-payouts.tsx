import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { SmeService } from '../../../app/service/sme.service'
import { AppLoader } from '../../../components/loader'
import { InterViewDataTable } from '../../../components/manage-payouts/interview-data-table'
import { PayoutDataTable } from '../../../components/manage-payouts/payout-data-table'
import { PayoutDataGridCols } from './data-grid-cols'
import { InterViewDataGridCols } from './inverview-grid-cols'

export const ManagePayouts = () => {
    const [PayoutDataList, setPayoutDataList] = useState<any>([]);
    const [interViewDataList, setInterViewDataList] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const userId = sessionStorage.getItem('userUuid') || '';
    let userData: any = sessionStorage.getItem('loginData') || '';
    userData = userData ? JSON.parse(userData) : {};
    useEffect(() => {
        SmeService.getSmePayoutHistory().then(res => {
            if (res.error) {
                toast.error(res?.error?.message);
                setLoading(false);
            } else {
                setLoading(false);
                res.forEach((element: any) => {
                    element.item = `Payout for ${moment(element?.date).format('MMM YYYY')}`;
                    element.status = element?.interviews === 1 ? 'Paid to your Paypal' : 'Pending clearance';
                });
                setPayoutDataList([...res])
            }
        })

        SmeService.getSmeInterviews(userId, 'COMPLETED').then(res => {
            if (res.error) {
                toast.error(res?.error?.message);
                setLoading(false);
            } else {
                setLoading(false);
                res.records.forEach((element: any) => {
                    element.candidate_name = `${element?.candidate_firstname} ${element?.candidate_lastname}`
                    element.date = moment(element?.interview_schedule).format('DD MMM YYYY');
                });
                setInterViewDataList([...res.records]);
            }
        })
    }, []);

    return (
        <div>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }
            <div className='manage_payouts ms-lg-4 mt-lg-3 me-lg-4'>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='d-flex justify-content-between mobile_manage mt-4 mt-lg-0 mt-sm-4 ms-4 ms-sm-4 ms-lg-3 ms-xl-0 mt-xl-4 mt-lg-3 me-lg-3 me-xl-0'>
                                <div className='ms-4'>
                                    <h5 className='top_heading_styles'>Manage Payouts</h5>
                                    <p className='top_para_styles'>View and manage the payment</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className='rounded-3 p-2 bg-white mobile_bal ms-4 me-4 ms-lg-0 me-lg-0 ms-sm-4 me-sm-4 ms-lg-3 ms-xl-0 mt-xl-0 mt-lg-3 me-lg-3 me-xl-0'>
                        <div className='row'>
                            <div className='col-md-10 mt-3'>
                                <h5 className='ms-3 top_heading_styles'>Current Balance</h5>
                                <ul className='list-inline ms-3'>
                                    <li><p className='top_para_styles m-0' style={{ paddingTop: "1%" }}>We’re keeping your earnings safe and sound until the end of the month.</p></li>
                                    <li><p className='top_para_styles m-0' style={{ paddingTop: "1%" }}>We’ll transfer your fees to your PayPal email at</p></li>
                                    <li><p className='top_para_styles m-0' style={{ paddingTop: "1%" }}>{userData?.user_email}</p></li>
                                </ul>
                            </div>
                            <div className='col-md-2 ms-2 ms-lg-0 d-flex justify-content-center flex-column align-items-center'>
                                {/* <div className='ms-2 mb-5 mb-sm-5 mb-lg-0 mt-4'> */}
                                    <h5 className='top_heading_styles_pay pt-2'>$0</h5>
                                    <h5 className='top_heading_styles_Bal'>Balance</h5>
                                {/* </div> */}

                            </div>
                        </div>
                    </div>
                    <div className='mobile_bal'>
                        <div className='row'>
                            <div className='col-lg-8 mt-3'>
                                <div className='rounded-3 p-2 bg-white manage_payouts_left_side_second pe-3 ms-4 me-4  ms-sm-4 me-sm-4 ms-lg-3 ms-xl-0 mt-xl-0 mt-lg-3 me-lg-3 me-xl-0 mt-lg-3 '>
                                    <div className='ms-3 mt-4' style={{
                                        height: "181px"
                                    }}>
                                        <h6 className='top_heading_styles'>Payout History</h6>
                                        {PayoutDataList.length > 0 ? <PayoutDataTable TableCols={PayoutDataGridCols} tableData={PayoutDataList}></PayoutDataTable>
                                            : <p className='top_para_styles'>No Payout History</p>}
                                    </div>
                                </div>
                                <div className='rounded-3 p-2 bg-white manage_payouts_left_side_second mt-3 pe-3 ms-4 me-4 ms-lg-0 me-lg-0 ms-sm-4 me-sm-4 ms-sm-4  ms-lg-3 ms-xl-0 mt-xl-3 mt-lg-3 me-lg-3 me-xl-0'>
                                    <div className='ms-3 mt-4'>
                                        <h6 className='top_heading_styles'>Interview History</h6>
                                        {interViewDataList.length > 0 ?
                                            <InterViewDataTable TableCols={InterViewDataGridCols} tableData={interViewDataList}></InterViewDataTable>
                                            : <p className='top_para_styles'>No Interview History</p>}
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-4  mt-3 ps-lg-3'>
                                <div className='rounded-3 p-2 bg-white pb-4 ms-4 me-4 ms-lg-0 me-lg-0 ms-sm-4 me-sm-4 ms-sm-4 me-sm-4  ms-lg-3 ms-xl-0 mt-xl-0 mt-lg-3 me-lg-3 me-xl-0'>
                                    <div className='ms-3 mt-4'>
                                        <div>
                                            <h6 className='top_heading_styles m-0'>How do I get paid?</h6>
                                            <p className='current_balance m-0' style={{ paddingTop: "2%" }}>SiftedX makes payments via PayPal only.</p>
                                            <p className='current_balance m-0' style={{ paddingTop: "2%" }}>You can set your PayPal email address in your profile.</p>
                                        </div>
                                        <div className='my-2'>
                                            <h6 className='top_heading_styles m-0'>How long does it take to get paid?</h6>
                                            <p className='current_balance m-0' style={{ paddingTop: "2%" }}>
                                                We have a monthly payout policy. Your balance will be paid during the first week of subsequent month.
                                            </p>
                                        </div>
                                        <div className='mb-5 mb-sm-5 mb-lg-0'>
                                            <h6 className='top_heading_styles m-0'>Any specific questions?</h6>
                                            <p className='current_balance m-0' style={{ paddingTop: "3%" }}>Write to us at <a href="mailto:support@siftedx.com">support@siftedx.com</a></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className='row'>
                        <div className='col-9 manage_payouts_left_side'>
                            <div className='border_color rounded-3 bg-white manage_payouts_left_side_first'>
                                <h5 className='notifications_left_line'>Current Balance</h5>
                                <ul className='list-inline'>
                                    <li><p className='current_balance fw-bold m-0'>Your current Balance is <span className='text-success'>$0</span></p></li>
                                    <li><p className='current_balance m-0'>We’re keeping your earnings safe and sound until end of the month.</p></li>
                                    <li><p className='current_balance m-0'>We’ll transfer your fees to your PayPal email at</p></li>
                                    <li><p className='current_balance m-0'>{userData?.user_email}</p></li>
                                </ul>
                            </div>
                            <div className='border_color rounded-3 bg-white manage_payouts_left_side_second'>
                                <h6 className='fw-bold current_balance'>Payout History</h6>
                                {PayoutDataList.length > 0 ? <PayoutDataTable TableCols={PayoutDataGridCols} tableData={PayoutDataList}></PayoutDataTable>
                                    : <p>No Payout History</p>}

                            </div>
                            <div className='border_color rounded-3 bg-white manage_payouts_left_side_second'>
                                <h6 className='fw-bold current_balance'>Interview History</h6>
                                {interViewDataList.length > 0 ?
                                    <InterViewDataTable TableCols={InterViewDataGridCols} tableData={interViewDataList}></InterViewDataTable>
                                    : <p>No Interview History</p>}
                                <div>
                                
                                </div>
                            </div>
                        </div>
                        <div className='col-3 manage_payouts_right_side'>
                            <div className='border_color rounded-3 bg-white manage_payouts_right_side_first'>
                                <div>
                                    <h6 className='fw-bold current_balance m-0'>How do I get paid?</h6>
                                    <p className='current_balance m-0'>SiftedX makes payments via PayPal only.</p>
                                    <p className='current_balance m-0'>You can set your PayPal email address in your account settings.</p>
                                </div>
                                <div className='my-3'>
                                    <h6 className='fw-bold current_balance m-0'>How long does it take to get paid?</h6>
                                    <p className='current_balance m-0'>We have a monthy payout and you will be paid balance within first week of each month.</p>
                                </div>
                                <div>
                                    <h6 className='fw-bold current_balance m-0'>Any specific questions?</h6>
                                    <p className='current_balance m-0'>Write to us at help@siftedX.com</p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
