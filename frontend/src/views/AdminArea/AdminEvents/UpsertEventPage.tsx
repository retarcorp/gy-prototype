import { useParams } from "react-router"
import AdminManageEventPage from "./AdminManageEventPage"
import React, { useEffect } from 'react'
import withAdminWrapper, { withAdminAuthWrapper } from "../AdminWrapper"
import { useDispatch, useSelector } from "react-redux"
import { Event } from "../../../types/Event"
import { createEvent, fetchEvents, updateEvent } from "../../../store/adminEvents"

const wrap = (C: () => JSX.Element) => withAdminAuthWrapper(withAdminWrapper(C))
const cancel = () => { window.location.href = '/admin/events'; }

export const CreateEventPage = wrap(() => {
    const dispatch = useDispatch();

    const save = (event: Omit<Event, 'id'>) => {
        dispatch<any>(createEvent(event)).then(() => {
            window.location.href = '/admin/events';
        });
    }

    return <>
        <AdminManageEventPage 
            onCancel={cancel}
            onSave={save}
        />
    </>
})

export const UpdateEventPage = wrap(() => {

    const eventId = useParams<{ id: string }>().id;
    const currentEvent = useSelector((state: any) => state.adminEvents.events.find((e: Event) => String(e.id) === eventId))
    const formattedEvent = currentEvent ? {
        ...currentEvent,
        dateTime: new Date(currentEvent.datetime),
        isDraft: currentEvent.status === 'DRAFT'
    } : null;

    useEffect(() => {
        dispatch<any>(fetchEvents());
    }, [eventId]);

    const dispatch = useDispatch();
    const save = (rawEvent: Partial<Event> & any) => {
        const event = {
            ...rawEvent,
            id: eventId,
            datetime: rawEvent.datetime,
            status: rawEvent.isDraft ? 'DRAFT' : 'UPCOMING',
            participantLimit: Number(rawEvent.participantLimit)
        }
        dispatch<any>(updateEvent(event)).then(() => {
            window.location.href = '/admin/events';
        });
    }

    return <>
        Editing event {eventId}. 
        {formattedEvent ?  <AdminManageEventPage event={formattedEvent} onSave={save} onCancel={cancel}/> : 'Loading...'}
       
    </>

})