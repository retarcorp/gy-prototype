import React, { useEffect } from 'react';
import { Event } from '../../../types/Event';
import OpenedEventDashboard from './OpenedEventDashboard';
import UpcomingEventDashboard from './UpcomingEventDashboard';
import { Alert, Button, Typography } from '@mui/material';
import RunningEventDashboard from './RunningEventDashboard';
import EventFinalDashboard from './EventFinalDashboard';
import ClosedEventDashboard from './ClosedEventDashboard';
import withAdminWrapper, { withAdminAuthWrapper } from '../AdminWrapper';
import { useParams } from 'react-router';
import useFetchAdminEvents from '../../../hooks/useFetchAdminEvents';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventDashboard } from '../../../store/adminEvents';


function AdminEventDashboardPage() {

    const eventId = useParams().id;
    if (!eventId) {
        window.location.href = '/admin/events';
    }
    
    const { currentEvent } = useFetchAdminEvents(eventId);
    const dispatch = useDispatch();

    const eventDashboard = useSelector((state: any) => state.adminEvents.dashboard);
    const registrations = eventDashboard?.registrations.map(({user}: {user: any}) => user);
    const participants = eventDashboard?.participants;

    useEffect(() => {
        dispatch<any>(fetchEventDashboard(eventId as string))

    }, [eventId, dispatch])

    if (!currentEvent) {
        return <></>;
    }

    const eventView = () => {

        switch (currentEvent?.status) {
            case 'OPENED':
                return <OpenedEventDashboard event={currentEvent} registrations={registrations} participants={participants}/>;
            case 'UPCOMING':
                return <UpcomingEventDashboard 
                    event={currentEvent} 
                    registrations={registrations} 
                    onOpenRegistration={() => {}}
                />;
            case 'RUNNING':
                return <RunningEventDashboard event={currentEvent} />;
            case 'FINAL':
                return <EventFinalDashboard event={currentEvent} />
            case 'CLOSED':
                return <ClosedEventDashboard event={currentEvent} />
        }
        return <>
            <Alert severity="error">
                <Typography variant="h6">Unknown event status</Typography>
                <Typography variant="body1">Event status: {currentEvent.status}</Typography>
            </Alert>
        </>;

    }

    return <>
        <Button variant="text" color="secondary" href='/admin/events'>Back to events</Button>
        {eventView()}
    </>
}

export default withAdminAuthWrapper(withAdminWrapper(AdminEventDashboardPage));