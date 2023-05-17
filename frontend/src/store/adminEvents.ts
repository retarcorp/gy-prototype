import { createSlice } from '@reduxjs/toolkit'
import { getAuthHeaders } from './user';
import { HOST } from '../services/api';
import { Event } from '../types/Event';

const adminEventsSlice = createSlice({
    name: 'adminEvents',
    initialState: {
        events: [],
        dashboard: null,
    },
    reducers: {
        setEvents(state, { payload }) {
            state.events = payload || [];
        },
        setDashboard(state, { payload }) {
            state.dashboard = payload;
        }
    },
})

export const fetchEvents = () => (dispatch: Function) => {
    return fetch(`${HOST}/events/editable`, {
        method: 'GET',
        headers: {
            ...getAuthHeaders(),
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json()
        })
        .then(json => {
            dispatch(adminEventsSlice.actions.setEvents(json));
        })
        .catch(err => {
            console.error(err);
        });
}

export const deleteEvent = (id: number) => (dispatch: Function) => {

    return fetch(`${HOST}/events/${id}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeaders(),
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            dispatch(fetchEvents());
        })
        .catch(err => {
            console.error(err);
        });
}

export const createEvent = (event: Omit<Event, 'id'>) => (dispatch: Function) => {
    return fetch(`${HOST}/events`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
        },
        body: new URLSearchParams(event as any),
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            dispatch(fetchEvents());
        })
        .catch(err => {
            console.error(err);
        });
}

export const updateEvent = (event: Event) => (dispatch: Function) => {

    return fetch(`${HOST}/events/${event.id}`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
        },
        body: new URLSearchParams(event as any),
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            dispatch(fetchEvents());
        })
        .catch(err => {
            console.error(err);
        });
}

export const fetchEventDashboard = (id: number | string) => (dispatch: Function) => {
    return fetch(`${HOST}/events/${id}/dashboard`, {
        method: 'GET',
        headers: {
            ...getAuthHeaders(),
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json()
        })
        .then(json => {
            dispatch(adminEventsSlice.actions.setDashboard(json));
        })
        .catch(err => {
            console.error(err);
        });
}

export default adminEventsSlice;