import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'

export const ReportsInfo = () => {
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
                <h3>Reports</h3>
            </div>
        </div>
    )
}

