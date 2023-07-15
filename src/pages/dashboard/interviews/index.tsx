import React from 'react';
import InterviewRoutes from './routes';

const InterviewsPage = (props: any) => {

    return (
        <div>
            <InterviewRoutes {...props} />
        </div>
    );
};

export default InterviewsPage;