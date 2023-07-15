import React, { useEffect, useState } from 'react'
import crypto from 'crypto';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
import { toast } from 'react-toastify';
import { SmeService } from '../app/service/sme.service';
import { useHistory } from 'react-router-dom';
import { zoomApiKey, zoomApiSecret } from '../config/constant';
import { AppLoader } from './loader';
import CryptoJS from 'crypto-js'
import {Buffer} from 'buffer';

const ZoomClient = ZoomMtgEmbedded.createClient();

interface Props {
    zoomId: string;
    interview: string;
}
export const ZoomInterviewMeeting: React.FC<Props> = (props: Props) => {
    const history = useHistory();
    const [isJoinMeating, setIsJoinMeating] = useState(false);
    const [loading, setLoading] = useState(false);

    const generateSignature = (apiKey: string, apiSecret: string, meetingNumber: string, role: number): Promise<string> => {
        return new Promise((res, err) => {
            // Prevent time sync issue between client signature generation and zoom 
            const timestamp = new Date().getTime() - 30000;
            const msg = Buffer.from(apiKey + meetingNumber + timestamp + 1).toString('base64');
            // const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64');
            const newhash = CryptoJS.HmacSHA256(msg, apiSecret).toString(CryptoJS.enc.Base64);
            const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${newhash}`).toString('base64');
            res(signature);
        });
    }

    // setup your signautre endpoint here: https://github.com/zoom/websdk-sample-signature-node.js
    var apiKey = zoomApiKey;
    const apiSecret = zoomApiSecret;//'xXbuOeMo94TUpOQbSgZXcco4r0GZNarJBddg';
    var role = 1
    var userName = 'testadmin@siftedx.com';

    useEffect(() => {
        intializeEmbedMeeting();
        setTimeout(() => {
            
            joinMeeting();
        }, 5000);
        return () => {

        }
    }, []);

    const intializeEmbedMeeting = async () => {
        let meetingSDKElement = document.getElementById('meetingSDKElement');
        if (meetingSDKElement) {
            ZoomClient.init({
                debug: true,
                zoomAppRoot: meetingSDKElement,
                language: 'en-US',
                customize: {
                    meetingInfo: [
                        'topic',
                        'host',
                        'mn',
                        'pwd',
                        'telPwd',
                        'invite',
                        'participant',
                        'dc',
                        'enctype',
                    ],
                    toolbar: {
                        buttons: [
                            {
                                text: 'Record',
                                className: 'CustomButton',
                                onClick: () => {
                                    ZoomClient.record('start');
                                },
                            },
                        ],
                    },
                    video: {
                        viewSizes: {
                            default: {
                                height: 500,
                                width: 500
                            }
                        }
                    }
                },
            });
            // const zoom_sig = await generateSignature(apiKey, apiSecret, meetingNumber, role);
            // ZoomClient.join({
            //     apiKey: apiKey,
            //     signature: zoom_sig, // role in signature needs to be 1
            //     meetingNumber: `${meetingNumber}`,
            //     password,
            //     userName: userName,
            // })
        }
    }

    const joinMeeting = async () => {
        const meetingNumber = props.zoomId;//meetingId.current?.value;
        // const password = passwordRef.current?.value;
        // return;
        if (meetingNumber) {
            const zoom_sig = await generateSignature(apiKey, apiSecret, meetingNumber, role);
            ZoomClient.join({
                apiKey: apiKey,
                signature: zoom_sig, // role in signature needs to be 1
                meetingNumber,//: `${meetingNumber}`,
                // password,
                userName: userName,
            });
            setIsJoinMeating(true)
        }
    }

    const onEndCall = () => {
        setLoading(true);
        ZoomClient.endMeeting().then(res => {

        });
        SmeService.completeInterview(props?.interview).then(
            res => {
                if (res.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                    // setLoading(false);
                } else {
                    // history.push('/dashboard/interviews/report-needed')
                    history.push(`/dashboard/interviews/evaluation-report/${props?.interview}`);
                    setLoading(false);
                }
            }
        )
    }
    return (
        // <div>ZoomInterviewMeeting</div>
        <>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }
            <div style={{
                position: 'relative'
            }}>
                <div id="meetingSDKElement" style={{ position: 'relative', display: 'block' }}>
                </div>
                {isJoinMeating && <button className='btn btn-danger' onClick={() => onEndCall()}>Complete the Interview</button>}

                {/* <input type="text" ref={meetingId} /> */}
                {/* <input type="text" ref={passwordRef} /> */}
                {/* <button onClick={() => joinMeeting()}>Join</button> */}
            </div>
        </>
    )
}
