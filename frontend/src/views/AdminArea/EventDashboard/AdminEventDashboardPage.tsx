import React from 'react';
import { Event } from '../../../types/Event';
import OpenedEventDashboard from './OpenedEventDashboard';
import UpcomingEventDashboard from './UpcomingEventDashboard';
import { Alert, Typography } from '@mui/material';

type AdminEventDashboardPageProps = {
    event: Event
}

export default function AdminEventDashboardPage(props: AdminEventDashboardPageProps) {

    switch (props.event.status) {
        case 'opened':
            return <OpenedEventDashboard event={props.event} />;
        case 'upcoming':
            return <UpcomingEventDashboard event={props.event} />;
    }
    return <>
        <Alert severity="error">
            <Typography variant="h6">Unknown event status</Typography>
            <Typography variant="body1">Event status: {props.event.status}</Typography>
        </Alert>
    </>;
}