import React from 'react';
import ManagerTeamRoutes from './routes';

const ManagerTeamPage = (props: any) => {

    return (
        <div>
            <ManagerTeamRoutes {...props} />
        </div>
    );
};

export default ManagerTeamPage;