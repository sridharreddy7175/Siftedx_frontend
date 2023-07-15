import React, { useEffect, useState } from 'react'
import { Link, NavLink, useHistory, useLocation, useParams } from 'react-router-dom'
import SmeRouts from '../../../routes/sme';

export const SmeInfo = () => {
    const history = useHistory();
    const [companyCode, setCompanyCode] = useState<any>();
    const [userRole, setUserRole] = useState<any>("");

    let { id } = useParams<{ id: string }>();
    const companyId = Number(id);
    const location = useLocation();
    const { pathname } = location;
    const splitLocation = pathname.split("/");

    useEffect(() => {
        const userRole = sessionStorage.getItem("user_role");
        setUserRole(userRole);
    }, []);

    return (
        <div className="row border-top border-primary py-3">
            <div>
                <h3>Sme Info: Uday</h3>
            </div>
            <div>
                <div className="mt-5">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <NavLink className={splitLocation[5] === "userform" ? "nav-link active" : "nav-link"} to={{ pathname: `/dashboard/sme/info/${companyId}/details/${companyCode}`, state: { data: "" } }}>Details</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={splitLocation[5] == "candidateform" ? "nav-link active" : "nav-link"} to={{ pathname: `/dashboard/sme/info/${companyId}/interviews/${companyCode}`, state: { data: "" } }}>Interviews</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={splitLocation[5] == "jobsform" ? "nav-link active" : "nav-link"} to={{ pathname: `/dashboard/sme/info/${companyId}/records/${companyCode}`, state: { data: "" } }}>Records</NavLink>
                        </li>
                    </ul>
                    <div>
                        <SmeRouts />
                    </div>
                </div>
            </div>
        </div>
    )
}

