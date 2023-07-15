import React from 'react';
import SmeRoutes from './routes';

const SmePage = (props: any) => {

    return (
        <div>
            <SmeRoutes {...props} />
        </div>
    );
};

export default SmePage;