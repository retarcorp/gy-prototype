import { useEffect } from "react";
import { fetchEvents } from "../store/adminEvents";
import { useDispatch, useSelector } from "react-redux";

export default function useFetchAdminEvents(currentEventId: string | null = null): any {

    const events = useSelector((state: any) => state.adminEvents.events.map((e: any) => ({
        ...e,
        dateTime: new Date(e.datetime),
        isDraft: e.status === 'DRAFT'
    })));

    const currentEvent = currentEventId ? events.find((e: any) => String(e.id) === currentEventId) : null;


    const dispatch = useDispatch();

    useEffect(() => {
        dispatch<any>(fetchEvents());
    }, [currentEventId]);

    return { events, currentEvent };

}