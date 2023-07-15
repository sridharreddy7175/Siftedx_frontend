import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import CompanyForm from "./form";

interface Props {
    companyId: number;
}

const CompanyFormPage = () => {
    const [companyId, setCompanyId] = useState(0);
    const history = useHistory();

    useEffect(() => {

    }, []);

    const getCompanyId = (data: any) => {
        if (companyId === 0) {
            history.push(`/dashboard/companies/new/${data}`);
        }
        setCompanyId(data);
    }

    return (
        <div className="row">
            <CompanyForm companyId={getCompanyId} />
        </div>
    );
};

export default CompanyFormPage;