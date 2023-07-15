import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import SmeForm from "./form";

interface Props {
    companyId: number;
}

const SmeFormPage = () => {
    let { id } = useParams<{ id: string }>();
    const editedCompanyId = id || 0;
    const [activeTab, setActiveTab] = useState(0);
    const [companyId, setCompanyId] = useState(0);
    const history = useHistory();

    useEffect(() => {

    }, []);

    const getCompanyId = (data: any) => {
        if (companyId === 0) {
            history.push(`/dashboard/companies/new/${data}`);
        }
        setCompanyId(data);
        setActiveTab(1);
    }

    return (
        <div className="row py-3">
            <SmeForm companyId={getCompanyId} />
        </div>
    );
};

export default SmeFormPage;