import React, { useEffect } from 'react';
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
import { dropValidation, enrollRegistration, fetchEventDashboard, openEvent, startGame, unEnrollRegistration, validateRegistration } from '../../../store/adminEvents';
import { closeGame, fetchEventGame, nextRound } from '../../../store/adminGame';


function AdminEventDashboardPage() {

    const eventId = useParams().id;
    if (!eventId) {
        window.location.href = '/admin/events';
    }
    const dispatch = useDispatch();
    const { formatEvent } = useFetchAdminEvents();

    const eventDashboard = useSelector((state: any) => state.adminEvents.dashboard);
    const currentEvent = eventDashboard ? formatEvent(eventDashboard) : { currentEvent: null };
    const registrations = eventDashboard?.registrations.map(({ user }: { user: any }) => user);
    const participants = eventDashboard?.participants.map(({ user }: { user: any }) => user);;

    const lastValidation = useSelector((state: any) => state.adminEvents.lastValidation);
    
    useEffect(() => {
        dispatch<any>(fetchEventDashboard(eventId as string))
    }, [eventId, dispatch])

    const openRegistration = () => { dispatch<any>(openEvent(eventId as string)) }

    const enroll = (user: any, pin: string) => {
        dispatch<any>(validateRegistration(eventId as string, user.id, pin))
    }
    useEffect(() => { 
        if (lastValidation) {
            if (lastValidation.isValid) {
                const { eventId, userId, pin } = lastValidation;
                dispatch<any>(enrollRegistration(eventId, userId, pin))
            } 
            if (lastValidation.isValid === false) {
                alert('Entered PIN is not correct!');
                dispatch<any>(dropValidation());
            }
        }
    }, [lastValidation])

    const unEnroll = ({ id }: any & { id: string | number}) => { 
        dispatch<any>(unEnrollRegistration(eventId as string, id));
    }

    const onStartGame = () => {
        dispatch<any>(startGame(eventId as string));
    }
    useEffect(() => {
        if (!eventDashboard) return;
        if (['FINAL', 'RUNNING'].includes(eventDashboard.status)) {
            dispatch<any>(fetchEventGame(eventId as string));
        }
    }, [eventDashboard]);
    const currentGameSetup = useSelector((state: any) => state.adminGame.setup);
    
    const onNextRound = () => {
        dispatch<any>(nextRound(currentGameSetup.id, eventId as string));
    }

    const onCloseGame = () => {
        dispatch<any>(closeGame(currentGameSetup.id, eventId as string));
    }

    if (!currentEvent) {
        return <></>;
    }

    const eventView = () => {

        switch (currentEvent?.status) {
            case 'OPEN':
                return <OpenedEventDashboard
                    event={currentEvent}
                    registrations={registrations}
                    participants={participants}
                    onEnroll={enroll}
                    onUnEnroll={unEnroll}
                    onStartGame={onStartGame}
                />;

            case 'UPCOMING':
                return <UpcomingEventDashboard
                    event={currentEvent}
                    registrations={registrations}
                    onOpenRegistration={openRegistration}
                />;
            case 'RUNNING':
                return currentGameSetup 
                ? <RunningEventDashboard 
                    game={currentGameSetup} 
                    event={currentEvent} 
                    onNextRound={onNextRound}
                /> : 'Loading game...';
            case 'FINAL':
                return currentGameSetup ? 
                    <EventFinalDashboard onClose={onCloseGame} event={currentEvent} game={currentGameSetup}/>
                    : 'Loading game...';
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