import React from 'react';
import ReportsRoutes from './routes';

const ReportsPage = (props: any) => {

    return (
        <div>
            <ReportsRoutes {...props} />
        </div>
    );
};

export default ReportsPage;