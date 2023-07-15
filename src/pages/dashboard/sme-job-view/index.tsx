import React from 'react';
import SmeJobViewRoutes from './routes';

const SmeJobViewsPage = (props: any) => {

    return (
        <div>
            <SmeJobViewRoutes {...props} />
        </div>
    );
};

export default SmeJobViewsPage;