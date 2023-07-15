import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { JobsInfo } from './job-info'

interface Props {
    match?: any;
}

export const JobsRouts = (props: Props) => {
    let url: string | undefined = props.match?.url;
    if (url?.endsWith('/')) {
        url = url.substr(0, url.length - 1);
    }
    return (
        {/* <Switch>
            <Route exact path={''} >
                <JobsInfo></JobsInfo>
            </Route>
        </Switch>*/}
    )
}