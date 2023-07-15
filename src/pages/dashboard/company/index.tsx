import React from 'react';
import CompanyRoutes from './routes';

const CompanyPage = (props: any) => {
    
    return (
        <div>
            <CompanyRoutes {...props} />
        </div>
    );
};

export default CompanyPage;