import { useEffect } from "react";
import { fetchEvents } from "../store/adminEvents";
import { useDispatch, useSelector } from "react-redux";

export const formatEvent = (event: any) => ({
    ...event,
    dateTime: new Date(event.datetime),
    isDraft: event.status === 'DRAFT'
});

export default function useFetchAdminEvents(currentEventId: string | null = null): any {

    const dispatch = useDispatch();

    

    const events = useSelector((state: any) => state.adminEvents.events.map(formatEvent));
    const currentEvent = currentEventId ? events.find((e: any) => String(e.id) === currentEventId) : null;

    useEffect(() => {
        dispatch<any>(fetchEvents());
    }, [currentEventId]);

    return { events, currentEvent, formatEvent };

}