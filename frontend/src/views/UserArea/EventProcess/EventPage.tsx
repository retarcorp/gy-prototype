import React, { useEffect } from "react";
import withUserWrapper from "../withUserWrapper";
import withUserAuthWrapper from "../withUserAuthWrapper";
import { useParams } from "react-router";
import { Event } from "../../../types/Event"
import { useDispatch, useSelector } from "react-redux";
import { loadRegistrations, loadUpcomingEvents } from "../../../store/userEvents";
import EventEnrollment from "./EventEnrollment";

function EventPage() {

    const eventId = useParams().id;
    const dispatch = useDispatch();
    const event = useSelector((state: any & {userEvents: any[]}) => state.userEvents.upcomingEvents).find((e: Event) => String(e.id) === eventId);
    const registration = useSelector((state: any) => state.userEvents.registrations).find((reg: any) => String(reg.event.id) === eventId);

    useEffect(() => {
        dispatch<any>(loadRegistrations())
    }, [])

    return (
        <> 
            {registration ? <EventEnrollment {...registration} /> : null}
        </>
    );
}

export default withUserAuthWrapper(withUserWrapper(EventPage));