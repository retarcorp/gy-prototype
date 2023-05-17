import { useParams } from "react-router"
import AdminManageEventPage from "./AdminManageEventPage"
import React from 'react'
import withAdminWrapper, { withAdminAuthWrapper } from "../AdminWrapper"
import { useDispatch } from "react-redux"
import { Event } from "../../../types/Event"
import { createEvent, updateEvent } from "../../../store/adminEvents"
import useFetchAdminEvents from "../../../hooks/useFetchAdminEvents"

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

    const dispatch = useDispatch();
    const eventId = useParams<{ id: string }>().id;
    const { currentEvent } = useFetchAdminEvents(eventId);

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
        {currentEvent ?  <AdminManageEventPage event={currentEvent} onSave={save} onCancel={cancel}/> : 'Loading...'}
       
    </>

})