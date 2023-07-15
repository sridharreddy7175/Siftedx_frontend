import React, { useEffect, useRef } from 'react'
import { googleSigningClientId } from '../config/constant';

interface Props {
    onSuccess: (response: any) => void;
    text: 'signin_with' | 'signup_with';
}
export const GoogleSignInBtn: React.FC<Props> = (props: Props) => {
    const googleSignInBtn = useRef(null);
    const renderGoogleSignIn = () => {
        const google = (window as any).google;
        if (google?.accounts) {
            google.accounts.id.initialize({
                client_id: googleSigningClientId,
                ux_mode: 'popup',
                callback: (response: any)=>{
                    props.onSuccess(response);
                }
                
            });
            google.accounts.id.renderButton(googleSignInBtn?.current, {
                theme: 'filled_blue',
                size: 'large',
                type: 'standard',
                // shape: 'pill',
                text: props.text,
                logo_alignment: 'left'
            });
        }
    }

    useEffect(() => {
        renderGoogleSignIn();
    }, []);

    return (
        <div className='d-flex justify-content-center'>
            <div data-client_id={googleSigningClientId} id="g_id_onload"></div>
            <div ref={googleSignInBtn} className="g_id_signin"></div>
        </div>
    )
}
