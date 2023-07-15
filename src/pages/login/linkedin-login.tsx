import React, { useState } from 'react';
import axios from 'axios';
import { linkedInClientId } from '../../config/constant';

export const LinkedinLogin = () => {
    const initialState = {
        user: {},
        loggedIn: false
    };
    const [state, setState] = useState<any>({});

    const showPopup = () => {
        const oauthUrl1 = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedInClientId}&scope=r_liteprofile%20r_emailaddress&state=123456&redirect_uri=http://localhost:3000`;
        const width = 450,
            height = 730,
            left = window.screen.width / 2 - width / 2,
            top = window.screen.height / 2 - height / 2;
        window.open(
            oauthUrl1,
            'Linkedin',
            'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
            width +
            ', height=' +
            height +
            ', top=' +
            top +
            ', left=' +
            left
        );
    };

    const getUserCredentials = (code: any) => {
        axios
            .get(`http://localhost:4000/getUserCredentials?code=AQR95T2xHchIH7Kmn75xXltLmmV04F7uQGdPRLoOfFdhUrlDHhn-B9pvXwTqto69z29q4TuDzljTdwA-0Rdt0k-Gngvi2ENXuWsnRKlW_EB5MXDYCXWSHursV9973GsoNylseTee19QkCfU-zzz-ffh0jh4OwObSbaylj0oqRKNj0YPLYQxACz1XcQFprD9gxXaxD3dt_PMTj_f78LE`)
            .then(res => {
                const user = res.data;
                setState({
                    user,
                    loaded: true
                })
            });
    };

    return (
        <div>
            <button onClick={showPopup}>LinkedIn</button>
        </div>
    )
}
