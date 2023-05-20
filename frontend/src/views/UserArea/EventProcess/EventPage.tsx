import React, { useEffect, useRef } from "react";
import withUserWrapper from "../withUserWrapper";
import withUserAuthWrapper from "../withUserAuthWrapper";
import { useParams } from "react-router";
import { Event } from "../../../types/Event"
import { useDispatch, useSelector } from "react-redux";
import { fetchParticipation, getParticipatedEvents, loadRegistrations } from "../../../store/userEvents";
import EventEnrollment from "./EventEnrollment";

function EventPage() {

    const eventId = useParams().id;
    const dispatch = useDispatch();
    const event = useSelector((state: any & { userEvents: any[] }) => [...state.userEvents.upcomingEvents, ...state.userEvents.participatedEvents]).find((e: Event) => String(e.id) === eventId);
    const eventStatus = event ? event.status : null;

    const registration = useSelector((state: any) => state.userEvents.registrations).find((reg: any) => String(reg.event.id) === eventId);
    const participation = (p => p ? (p.eventId === event.id ? p : null) : null)(useSelector((state: any) => state.userEvents.participation))
    const participationRef = useRef(participation);
    useEffect(() => { participationRef.current = participation }, [participation])

    useEffect(() => {

        const interval = setInterval(() => {
            dispatch<any>(loadRegistrations())
            dispatch<any>(getParticipatedEvents())
        }, 2000) 

        return () => clearInterval(interval);
        
    }, [])

    useEffect(() => {
        if (event) {
            dispatch<any>(fetchParticipation(event?.id))

            if (!participation) {
                const eventId = event.id;
                const interval = setInterval(() => {
                    dispatch<any>(fetchParticipation(eventId));
                    if (participationRef.current?.eventId === eventId) {
                        clearInterval(interval);
                    }
                }, 2000);

                return () => clearInterval(interval);
            }
        }
    }, [event])

    if (participation && ['RUNNING', 'FINAL'].includes(eventStatus)) {
        window.location.href = '/user/events/' + eventId + '/game';
    }

    return (
        <>
            {registration ? <EventEnrollment {...registration} /> : null}
            {participation 
                ? ['RUNNING', 'FINAL'].includes(eventStatus) ? 'Redirecting to game...' : 'Game has not started yet...'
                : null
            }
        </>
    );
}

export default withUserAuthWrapper(withUserWrapper(EventPage));